// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./FundNFT.sol";
import "hardhat/console.sol";

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
    event ResearchProjectRemoved(uint projectId, address reasearcher);
    event FundsRequestCreated(uint fundRequestId, address reasearcher);
    event FundsAdded(uint amount, uint projectId);

    /******************ENUMS *************/ 

    enum NftType {
        classic,
        plus,
        premium,
        vip
    }

    enum ResearchProjectStatus {
        created,
        validated,
        ended
    }

    // ENUMS
    enum FundStatus {
        inProgress,
        ended
    }

    /************************************/ 

    
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

    struct FundRequest {
        uint id;
        uint creationTime;
        uint amountAsked;
        bool isAccepted;
        string description;
        FundStatus status;
        uint projectId;
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

    /************************************/ 

    // VARIABLES
    mapping(address => Researcher) researchers;
    mapping(address => ResearchProject[]) researchProjectByResearcher;
    mapping(address => uint) investors;
    ResearchProject[] researchProjects;
    FundRequest[] fundRequestLists;

    constructor() {}

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
        string memory requestDetailsUri
    ) external belongToResearcher(id) {

        console.log("createFundsRequest researchProjects.length:", researchProjects.length);
        require(id < researchProjects.length, "Project id dont exist");
        require(
            researchProjects[id].status ==
                ResearchProjectStatus.validated,
            "Project not ready for funding"
        );
        require(
            keccak256(abi.encode(requestDetailsUri)) !=
                keccak256(abi.encode("")),
            "Request detail is mandatory"
        );
        require(amount != 0, "Amount asked should not be 0");    
        require(
            amount <= researchProjects[id].amountAsked,
            "Amount asked should be less than amount asked"
        );

        FundRequest memory request;
        request.id = researchProjects[id].fundRequestListsIds.length;
        request.creationTime = block.timestamp;
        request.amountAsked = amount;
        request.isAccepted = false;
        request.description = requestDetailsUri;
        request.status = FundStatus.inProgress;
        request.projectId = id;
        researchProjects[id].fundRequestListsIds.push(
            researchProjects[id].fundRequestListsIds.length
        );
        fundRequestLists.push(request);
        emit FundsRequestCreated(
            researchProjects[id].fundRequestListsIds.length - 1,
            msg.sender
        );
    }

    // get funds request details from funds request id
    function getFundsRequestDetails(
        uint fundRequestId
    ) external view returns (FundRequest memory) {
        require(
            fundRequestId < fundRequestLists.length,
            "Fund request id dont exist"
        );
        return
            fundRequestLists[fundRequestId];
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

    function labelTypeNFT(uint typeNFT) internal pure returns (string memory) {
        if (typeNFT == uint(NftType.classic)) {
            return "CLASSIC";
        } else if (typeNFT == uint(NftType.plus)) {
            return "PLUS";
        } else if (typeNFT == uint(NftType.premium)) {
            return "PREMIUM";
        } else if (typeNFT == uint(NftType.vip)) {
            return "VIP";
        } else {
            revert("NFT type not exist");
        }
    }

    function buyNFT(uint id, uint typeNFT) external payable readyToFund(id) {
        investors[msg.sender] += msg.value;
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        bytes memory uri = abi.encodePacked(
            '{',
                '"name": "', researchProjects[id].title, '",',
                '"image": "ipfs://', researchProjects[id].imageUrl, '",', // Ajout d'une virgule manquante
                '"attributes": [',
                    '{',
                        '"type": "', labelTypeNFT(typeNFT), '"', // Correction de l'utilisation de la fonction labelTypeNFT
                    '}', // Ajout d'une virgule manquante
                ']',
            '}'
        );

        console.log("buyNFT uri:", string(uri));

        string memory dataURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(uri)
            )
        );
        

        if (typeNFT == uint(NftType.classic)) {
                nft.safeMintClassic(msg.sender, msg.value, dataURI);
        } else if (typeNFT == uint(NftType.plus)) {
                nft.safeMintPlus(msg.sender, msg.value, dataURI);
        } else if (typeNFT == uint(NftType.premium)) {
                nft.safeMintPremium(msg.sender, msg.value, dataURI);
        } else if (typeNFT == uint(NftType.vip)) {
                nft.safeMintVIP(msg.sender, msg.value, dataURI);
        } else {
            revert("NFT type not exist");
        }
    }

    ////////////////////////////////
    // NO RESTRICTION FUNCTIONS
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

    function isRegisterExist(address addr) external view returns (bool) {
        return researchers[addr].exist;
    }

    receive() external payable {} // to support receiving ETH by default

    fallback() external payable {}
}
