// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FundNFT.sol";

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

    // ENUMS
    enum ResearchProjectStatus {
        created,
        validated,
        readyForFunding,
        ended
    }

    // ENUMS
    enum FundStatus {
        created,
        ended
    }

    // STRUCTS
    struct Researcher {
        string lastname;
        string forname;
        string company;
        address addr;
        bool exist;
        bool isValidated;
        uint[] projectListIds;
    }

    struct ResearchProject {
        uint id;
        string name;
        uint creationTime;
        bool isAccepted;
        address researcher;
        uint amountAsked;
        string projectDetailsUri;
        FundNFT fundNFT;
        ResearchProjectStatus status;
        uint[] fundRequestListIds;
    }

    struct FundRequest {
        uint id;
        uint creationTime;
        uint amountAsked;
        bool isAccepted;
        string requestDetailsUri;
        FundStatus status;
        uint projectId;
    }

    // VARIABLES
    mapping(address => Researcher) researchers;
    mapping(address => ResearchProject[]) researchProjectByResearcher;
    mapping(address => uint) investors;
    ResearchProject[] researchProjects;

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
        project.creationTime = block.timestamp;
        project.researcher = msg.sender;
        project.amountAsked = amountAsked;
        project.projectDetailsUri = projectDetailsUri;
        researchProjects.push(project);

        researchers[msg.sender].projectListIds.push(
            researchProjects.length - 1
        );

        emit ResearchProjectCreated(researchProjects.length - 1, msg.sender);
    }

    function getResearchProject(
        uint id
    ) external view returns (ResearchProject memory) {
        require(id < researchProjects.length, "Project id dont exist");
        return researchProjects[id];
    }

    function removeResearchProject(uint id) external belongToResearcher(id) {}

    function askFundsRequest(
        uint id,
        uint amount
    ) external belongToResearcher(id) {}

    function getFunds(uint id) external onlyResearcher {}

    function addNFT(
        uint id,
        string memory tokenName,
        string memory symbol,
        string memory uri
    ) external belongToResearcher(id) {
        require(
            researchProjects[id].status == ResearchProjectStatus.validated,
            "Project not validated"
        );
        FundNFT nft = new FundNFT(
            tokenName,
            symbol,
            uri,
            researchProjects[id].amountAsked
        );
        researchProjects[id].fundNFT = nft;
        researchProjects[id].status = ResearchProjectStatus.readyForFunding;
    }

    ////////////////////////////////
    // INVESTOR FUNCTIONS
    ////////////////////////////////
    modifier readyToFund(uint id) {
        require(
            researchProjects[id].status ==
                ResearchProjectStatus.readyForFunding,
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

    function buyNFT_Classic(uint id) external payable readyToFund(id) {
        investors[msg.sender] += msg.value;
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        nft.safeMintClassic(msg.sender, msg.value);
    }

    function buyNFT_Plus(uint id) external payable readyToFund(id) {
        investors[msg.sender] += msg.value;
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        nft.safeMintPlus(msg.sender, msg.value);
    }

    function buyNFT_Premium(uint id) external payable readyToFund(id) {
        investors[msg.sender] += msg.value;
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        nft.safeMintPremium(msg.sender, msg.value);
    }

    function buyNFT_VIP(uint id) external payable readyToFund(id) {
        investors[msg.sender] += msg.value;
        FundNFT nft = FundNFT(researchProjects[id].fundNFT);
        nft.safeMintVIP(msg.sender, msg.value);
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

    // votes, see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol

    receive() external payable {} // to support receiving ETH by default

    fallback() external payable {}
}
