// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./FundNFT.sol";
import "./DAO.sol";
import "./ResearcherRegistry.sol"; 


/**
 * @author  Hafid Saou
 * @title   A contract for managing funds for research projects.
 */
contract FundsFactory is Ownable {
    
    /************* EVENT *************/ 
    event ResearcherAdded(
        address addr,
        string lastname,
        string forname,
        string company
    );
    event ResearchProjectCreated(uint projectId, address reasearcher);
    event ResearchProjectValidated(uint projectId);
    event FundsRequestCreated(uint projectId, uint requestId, address researcher);
    event FundsRequestClosed(uint requestId, address reasearcher);
    event VoteAdded(address investor, uint projectId, uint requestId, bool vote);
    event NFTbought(address investor, uint projectId, uint typeNFT, uint timestamp);


    /*************ENUMS *************/ 

    enum ResearchProjectStatus {
        waitingForValidation,
        nftSaleOpen,
        fundRequestOpen,
        ended
    }

    
    /************ STRUCTS *************/ 

    struct Investor {
        uint[] fundRequestListsIds;
    }

    struct ResearchProject {
        uint id;
        uint creationTime;
        uint amountAsked;
        uint amountReceived;
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
    ResearchProject[] private researchProjects;

    DAO private dao;
    ResearcherRegistry private researcherRegistry;
    uint private requestIdNumber;

    constructor(address _dao, address _researcherRegistry) {
        dao = DAO(_dao);
        researcherRegistry = ResearcherRegistry(_researcherRegistry);
    }

    ////////////////////////////////
    // ADMIN FUNCTIONS
    ////////////////////////////////

    
    /**
     * @notice  Allow admin to validate a research project.
     * @param   id  project identifier
     */
    function validResearchProject(uint id) external onlyOwner {
        researchProjects[id].status = ResearchProjectStatus.nftSaleOpen;
        emit ResearchProjectValidated(id);
    }

    ////////////////////////////////
    // RESEARCHER FUNCTIONS
    ////////////////////////////////
    modifier onlyResearcher() {
        require(researcherRegistry.isValid(msg.sender), "You're not registered");
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


    /**
     * @notice  Allow researcher to add a research project, and deplot a NFT contract for this project.
     * @param   title  The title of the research project.
     * @param   description  The description of the research project.
     * @param   imageUrl  The image url of the research project.
     * @param   amountAsked  The amount asked for the research project.
     * @param   projectDetailsUri  The uri of the litepaper
     */
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

        researcherRegistry.addProjectToResearcher(msg.sender, researchProjects.length - 1);

        string memory idStr =  Strings.toString(researchProjects.length - 1);
        addNFT(researchProjects.length - 1, string.concat("DESCIDE", idStr), string.concat("DSC", idStr));

        emit ResearchProjectCreated(researchProjects.length - 1, msg.sender);
    }

    /**
     * @notice  Allow resercher to get a research project details.
     * @param   id  Project identifier.
     * @return  ResearchProject  The research project details.
     */
    function getResearchProject(
        uint id
    ) external view returns (ResearchProject memory) {
        require(id < researchProjects.length, "Id dont exist");
        return researchProjects[id];
    }

    /**
     * @notice  Add a NFT contract to a research project.
     * @param   id  Project identifier.
     * @param   tokenName  The name of the NFT.
     * @param   symbol  The symbol of the NFT.
     */
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


    /**
     * @notice  Allow researcher to open a funds request.
     * @param   projectId  Project identifier.
     */
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

    /**
     * @notice  Allow researcher to create a funds request.
     * @param   id  The id of the research project.
     * @param   amount  The amount asked.
     * @param   description  The description of the funds request.
     */
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
            amount + researchProjects[id].amountAlreayRaised <= researchProjects[id].amountReceived,
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
            id,
            requestId,
            msg.sender
        );
    }

    /**
     * @notice  Allow researcher to close a funds request.
     * @param   requestId  The id of the funds request.
     */
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

    /**
     * @notice  Allow researcher to claim funds.
     * @param   requestId  The id of the funds request.
     */
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
        // we avoid reentrancy attack by setting the request status to "claimed" before sending the funds
        dao.claimFunds(requestId);
         (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // get funds request details from funds request id
    /**
     * @notice  .
     * @dev     .
     * @param   fundRequestId  .
     * @return  uint  .
     * @return  uint256  .
     * @return  string  .
     * @return  uint256  .
     * @return  bool  .
     * @return  uint  .
     */
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

    /**
     * @notice  Allow investor to get NFT prices.
     * @param   id  Project identifier.
     * @return  uint  Price of classic NFT.
     * @return  uint  Price of plus NFT.
     * @return  uint  Price of premium NFT.
     * @return  uint  Price of vip NFT.
     */
    function getNFT_Prices(
        uint id
    ) external view returns (uint, uint, uint, uint) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getPrices();
    }

    /**
     * @notice  Allow investor to get NFT number minted.
     * @param   id  Project identifier.
     * @return  uint  Number of classic NFT minted.
     * @return  uint  Number of plus NFT minted.
     * @return  uint  Number of premium NFT minted.
     * @return  uint  Number of vip NFT minted.
     */
    function getNumberNFTMinted(
        uint id
    ) external view returns (uint, uint, uint, uint) {
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        return nft.getNumberNFTMinted();
    }

    /**
     * @notice  Allow investor to buy NFT.
     * @param   projectId  Project identifier.
     * @param   typeNFT  Type of NFT(0,1,2,3)
     */
    function buyNFT(uint projectId, uint typeNFT) external payable {
        require(
            researchProjects[projectId].status ==
                ResearchProjectStatus.nftSaleOpen,
            "Cannot buy NFT"
        );
        require(typeNFT < 4, "Type dont exist");
        FundNFT nft = FundNFT(researchProjects[projectId].fundNFT);
        nft.safeMint(msg.sender, msg.value, researchProjects[projectId].title, researchProjects[projectId].imageUrl, typeNFT);
        researchProjects[projectId].amountReceived += msg.value;
        uint weightVote = nft.getWeight(typeNFT);
        dao.addInvestorVoteWeight(projectId, msg.sender, weightVote);
        emit NFTbought(msg.sender, projectId, typeNFT, block.timestamp);
    }

    
    /**
     * @notice  Allow investor to add a vote.
     * @param   requestId  Request identifier.
     * @param   vote  Vote (true or false).
     */
    function addVote(
        uint requestId,
        bool vote
    ) external {
        (uint projectId,,,,,) =  dao.getFundRequestDetails(requestId);
        require(
            FundNFT(researchProjects[projectId].fundNFT).balanceOf(msg.sender) > 0,
            "You need to own a NFT to vote"
        );

        dao.voteForFundRequest(requestId, projectId, vote, msg.sender);
        emit VoteAdded(msg.sender, projectId, requestId, vote);
    }

    ////////////////////////////////
    // ANYONE FUNCTIONS
    ////////////////////////////////

    // create a function to get the vote result from DAO
    
    /**
     * @notice  Allow anyone to get the vote result from DAO.   
     * @param   requestId  Request identifier.
     * @return  DAO.Vote  The vote result details.
     */
    function getVoteResult(
        uint requestId
    ) external view returns (DAO.Vote memory) {
        return dao.getVoteResult(requestId);
    }

    receive() external payable {} // to support receiving ETH by default

    fallback() external payable {}
}
