// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./FundNFT.sol";
import "./DAO.sol";

contract FundsFactory is Ownable {
    // EVENTS
    event ResearcherAdded(
        address addr,
        string lastname,
        string forname,
        string company
    );
    event ResearchProjectCreated(uint projectId, address reasearcher);
    event ResearchProjectValidated(uint projectId);
    event FundsRequestCreated(uint requestId, address reasearcher);
    event FundsRequestClosed(uint requestId, address reasearcher);
    event VoteAdded(address investor, uint projectId, uint requestId, bool vote);

    /******************ENUMS *************/ 

    enum ResearchProjectStatus {
        created,
        validated,
        ended
    }

    
    /****************** STRUCTS *************/ 
    struct Researcher {
        string lastname;
        string forname;
        string company;
        address addr;
        bool exist;
        bool isValidated;
        uint[] projectListIds;
    }

    struct Investor {
        uint[] fundRequestListsIds;
    }

    struct ResearchProject {
        uint id;
        string title;
        string description;
        string imageUrl;
        uint creationTime;
        bool isAccepted;
        address researcher;
        uint amountAsked;
        string projectDetailsUri;
        FundNFT fundNFT;
        ResearchProjectStatus status;
        uint[] fundRequestListsIds;
    }

    /****************** VARIABLES *************/ 
    mapping(address => Researcher) researchers;
    mapping(address => ResearchProject[]) researchProjectByResearcher;
    ResearchProject[] researchProjects;

    DAO dao;
    uint requestIdNumber;

    constructor(address _dao) {
        dao = DAO(_dao);
    }

    ////////////////////////////////
    // ADMIN FUNCTIONS
    ////////////////////////////////

    function changeResearcherStatus(
        address addr,
        bool status
    ) external onlyOwner {
        researchers[addr].isValidated = status;
    }

    function validResearchProject(uint id) external onlyOwner {
        researchProjects[id].status = ResearchProjectStatus.validated;
        emit ResearchProjectValidated(id);
    }

    ////////////////////////////////
    // RESEARCHER FUNCTIONS
    ////////////////////////////////
    modifier onlyResearcher() {
        require(researchers[msg.sender].isValidated, "You're not register");
        _;
    }

    modifier onlyCurrentResearcherOrAdmin(address addr) {
        require(
            msg.sender == addr || msg.sender == owner(),
            "You're not register"
        );
        _;
    }

    modifier belongToResearcher(uint projectId) {
        require(projectId < researchProjects.length, "Project id dont exist");
        require(
            researchProjects[projectId].researcher == msg.sender,
            "Project is not yours"
        );
        _;
    }

    function getResearcher(
        address addr
    )
        external
        view
        onlyCurrentResearcherOrAdmin(addr)
        returns (Researcher memory)
    {
        return researchers[addr];
    }

    function addResearchProject(
        string memory title,
        string memory description,
        string memory imageUrl,
        uint amountAsked,
        string memory projectDetailsUri
    ) external onlyResearcher {
        require(amountAsked != 0, "Amount asked should not be 0");
        require(
            keccak256(abi.encode(projectDetailsUri)) !=
                keccak256(abi.encode("")),
            "Project detail is mandatory"
        );
        ResearchProject memory project;
        project.id = researchProjects.length;
        project.title = title;
        project.description = description;
        project.imageUrl = imageUrl;
        project.creationTime = block.timestamp;
        project.researcher = msg.sender;
        project.amountAsked = amountAsked;
        project.projectDetailsUri = projectDetailsUri;
        researchProjects.push(project);

        researchers[msg.sender].projectListIds.push(
            researchProjects.length - 1
        );

        string memory idStr =  Strings.toString(researchProjects.length - 1);
        addNFT(researchProjects.length - 1, string.concat("DESCIDE", idStr), string.concat("DSC", idStr));

        emit ResearchProjectCreated(researchProjects.length - 1, msg.sender);
    }

    function getResearchProject(
        uint id
    ) external view returns (ResearchProject memory) {
        require(id < researchProjects.length, "Project id dont exist");
        return researchProjects[id];
    }

    function addNFT(
        uint id,
        string memory tokenName,
        string memory symbol
    ) internal {
        FundNFT nft = new FundNFT(
            tokenName,
            symbol,
            researchProjects[id].amountAsked
        );
        researchProjects[id].fundNFT = nft;
    }

    //  FUNDS REQUEST FUNCTIONS

    function createFundsRequest(
        uint id,
        uint amount,
        string memory description
    ) external belongToResearcher(id) {
        require(id < researchProjects.length, "Project id dont exist");
        require(
            researchProjects[id].status ==
                ResearchProjectStatus.validated,
            "Project not ready for funding"
        );
        require(
            keccak256(abi.encode(description)) !=
                keccak256(abi.encode("")),
            "Request detail is mandatory"
        );
        require(amount != 0, "Amount asked should not be 0");    
        require(
            amount <= researchProjects[id].amountAsked,
            "Amount asked should be less than amount asked"
        );

        uint requestId = requestIdNumber;
   
        researchProjects[id].fundRequestListsIds.push(
            requestId
        );

        dao.addDao(id, requestId ,amount, description);

        requestIdNumber++;

        emit FundsRequestCreated(
            researchProjects[id].fundRequestListsIds.length - 1,
            msg.sender
        );
    }

    function closeFundRequest(
        uint requestId
    ) external  {
        (uint projectId,,,,,) =  dao.getFundRequestDetails(requestId);
        require(
            researchProjects[projectId].researcher == msg.sender,
            "Project is not yours"
        );
        dao.closeFundRequest(
            requestId
        );

        emit FundsRequestClosed(
            requestId,
            msg.sender
        );
    }

    // get funds request details from funds request id
    function getFundsRequestDetails(
        uint fundRequestId
    ) external view returns (uint, uint256, string memory, uint256, bool, uint) {
        require(fundRequestId < requestIdNumber, "Fund request id dont exist");
        return
            dao.getFundRequestDetails(fundRequestId);
    }
   

    ////////////////////////////////
    // INVESTOR FUNCTIONS
    ////////////////////////////////
    modifier readyToFund(uint id) {
        require(
            researchProjects[id].status ==
                ResearchProjectStatus.validated,
            "Project not ready for funding"
        );
        _;
    }

    function getNFT_Prices(
        uint id
    ) external view returns (uint, uint, uint, uint) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getPrices();
    }

    function getNumberNFTMinted(
        uint id
    ) external view returns (uint, uint, uint, uint) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getNumberNFTMinted();
    }

    function buyNFT(uint projectId, uint typeNFT) external payable readyToFund(projectId) {
        require(typeNFT < 4, "NFT type dont exist");
        FundNFT nft = FundNFT(researchProjects[projectId].fundNFT);
        nft.safeMint(msg.sender, msg.value, researchProjects[projectId].title, researchProjects[projectId].imageUrl, typeNFT);
        uint weightVote = nft.getWeight(typeNFT);
        dao.addInvestorVoteWeight(projectId, msg.sender, weightVote);

    }

    function addVote(
        uint requestId,
        bool vote
    ) external {
        (uint projectId,,,,,) =  dao.getFundRequestDetails(requestId);
        require(
            FundNFT(researchProjects[projectId].fundNFT).balanceOf(msg.sender) > 0,
            "You need to buy NFT to vote"
        );

        dao.voteForFundRequest(requestId, projectId, vote, msg.sender);
        emit VoteAdded(msg.sender, projectId, requestId, vote);
    }

    ////////////////////////////////
    // ANYONE FUNCTIONS
    ////////////////////////////////

    function addResearcher(
        address addr,
        string calldata lastname,
        string calldata forname,
        string calldata company
    ) external {
        require(researchers[addr].exist == false, "Researcher already exist");
        Researcher memory r;
        r.lastname = lastname;
        r.forname = forname;
        r.company = company;
        r.addr = addr;
        r.exist = true;
        researchers[addr] = r;
        emit ResearcherAdded(addr, lastname, forname, company);
    }

    // create a function to get the vote result from DAO
    function getVoteResult(
        uint requestId
    ) external view returns (bool, uint, uint) {
        return dao.getVoteResult(requestId);
    }

    receive() external payable {} // to support receiving ETH by default

    fallback() external payable {}
}
