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
        waitingForValidation,
        nftSaleOpen,
        fundRequestOpen,
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
        uint creationTime;
        uint amountAsked;
        uint amountAlreayRaised;  // here we store the amount already raised or asked in request
        string title;
        string description;
        string imageUrl;
        string projectDetailsUri;
        address researcher;       
        FundNFT fundNFT;
        ResearchProjectStatus status;
        uint[] fundRequestListsIds;
        bool isAccepted;
    }

    /****************** VARIABLES *************/ 
    mapping(address => Researcher) researchers;
    //mapping(address => ResearchProject[]) researchProjectByResearcher;
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
        researchProjects[id].status = ResearchProjectStatus.nftSaleOpen;
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
        require(projectId < researchProjects.length, "Id dont exist");
        require(
            researchProjects[projectId].researcher == msg.sender,
            "Project not yours"
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
        require(amountAsked != 0, "Amount not 0");
        require(
            keccak256(abi.encode(projectDetailsUri)) !=
                keccak256(abi.encode("")),
            "Detail is mandatory"
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
        require(id < researchProjects.length, "Id dont exist");
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

    function openFundsRequest(
        uint projectId
    ) external belongToResearcher(projectId) {
        require(projectId < researchProjects.length, "Id dont exist");
        require(
            researchProjects[projectId].status ==
                ResearchProjectStatus.nftSaleOpen,
            "Not ready for funding"
        );
        researchProjects[projectId].status = ResearchProjectStatus.fundRequestOpen;
    }   

    function createFundsRequest(
        uint id,
        uint amount,
        string memory description
    ) external belongToResearcher(id) {
        require(id < researchProjects.length, "Id dont exist");
        require(
            researchProjects[id].status ==
                ResearchProjectStatus.fundRequestOpen,
            "Not ready for funding"
        );
        require(
            keccak256(abi.encode(description)) !=
                keccak256(abi.encode("")),
            "Detail is mandatory"
        );
        require(amount != 0, "Amount not 0");    
        require(
            amount + researchProjects[id].amountAlreayRaised <= researchProjects[id].amountAsked,
            "Amount should be less than amount asked"
        );

        uint requestId = requestIdNumber;
   
        researchProjects[id].fundRequestListsIds.push(
            requestId
        );

        dao.addDao(id, requestId ,amount, description);


        researchProjects[id].amountAlreayRaised += amount;
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
            "Project not yours"
        );
        (uint amount, bool isAccepted) = dao.closeFundRequest(
            requestId
        );

        // if the request is not accepted, the research can re ask for the amount
        if (isAccepted == false){
            researchProjects[projectId].amountAlreayRaised -= amount;
        } 

        emit FundsRequestClosed(
            requestId,
            msg.sender
        );
    }

    function claimFunds(
        uint requestId
    ) external {
        (uint projectId,,,,,) =  dao.getFundRequestDetails(requestId);
        require(
            researchProjects[projectId].researcher == msg.sender,
            "Project not yours"
        );
        uint amount = dao.shouldClaimFunds(requestId);
        require(
            amount <= address(this).balance,
            "Not enough funds"
        );
         (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // get funds request details from funds request id
    function getFundsRequestDetails(
        uint fundRequestId
    ) external view returns (uint, uint256, string memory, uint256, bool, uint) {
        require(fundRequestId < requestIdNumber, "Id dont exist");
        return
            dao.getFundRequestDetails(fundRequestId);
    }
   

    ////////////////////////////////
    // INVESTOR FUNCTIONS
    ////////////////////////////////

    function getNFT_Prices(
        uint id
    ) external view returns (uint, uint, uint, uint) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getPrices();
    }

    function getNumberNFTMinted(
        uint id
    ) external view returns (uint, uint, uint, uint, bool) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getNumberNFTMinted();
    }

    function buyNFT(uint projectId, uint typeNFT) external payable {
        require(
            researchProjects[projectId].status ==
                ResearchProjectStatus.nftSaleOpen,
            "Cannot buy NFT"
        );
        require(typeNFT < 4, "Type dont exist");
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
    ) external view returns (bool, uint, uint, uint) {
        return dao.getVoteResult(requestId);
    }

    receive() external payable {} // to support receiving ETH by default

    fallback() external payable {}
}
