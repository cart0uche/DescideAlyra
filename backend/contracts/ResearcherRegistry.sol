// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ResearcherRegistry is Ownable {
    struct Researcher {
        string lastname;
        string forname;
        string company;
        address addr;
        bool exist;
        bool isValidated;
        uint[] projectListIds;
    }

    mapping(address => Researcher) public researchers;

    event ResearcherAdded(
        address addr,
        string lastname,
        string forname,
        string company
    );

    address private factoryAddress;

    modifier onlyFactory() {
        require(
            msg.sender ==
                factoryAddress,
            "Caller is not factory"
        );
        _;
    }

    function setFactoryAddress(address _factoryAddress) external {
        factoryAddress = _factoryAddress;
    }

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

    function changeResearcherStatus(
        address addr,
        bool status
    ) external onlyOwner {
        researchers[addr].isValidated = status;
    }

    function isValid(address addr) external view returns (bool) {
        return researchers[addr].isValidated;
    }   

    function addProjectToResearcher(address addr, uint projectId) external onlyFactory() {
        require(researchers[addr].isValidated, "Researcher does not exist");
        researchers[addr].projectListIds.push(projectId);
    }

    function getResearcher(address addr) external view returns (Researcher memory) {
        return (researchers[addr]);
    }
}
