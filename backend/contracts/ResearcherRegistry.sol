// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author  Hafid Saou
 * @title   ResearcherRegistry contract
 * @notice  This contract is used to manage researchers 
 */
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

    mapping(address => Researcher) private researchers;

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

    /**
     * @notice  Set the factory address 
     * @param   _factoryAddress   The address of the factory
     */
    function setFactoryAddress(address _factoryAddress) external {
        factoryAddress = _factoryAddress;
    }

    /***** FACTORY FUNCTIONS******/

    /**
     * @notice  Add a project to a researcher
     * @param   addr  Address of the researcher.
     * @param   projectId  Project identifier.
     */
    function addProjectToResearcher(address addr, uint projectId) external onlyFactory() {
        researchers[addr].projectListIds.push(projectId);
    }

    /****************************/

    /**
     * @notice  Add a researcher
     * @param   addr  Address of the researcher.
     * @param   lastname  Lastname of the researcher.
     * @param   forname  Forname of the researcher.
     * @param   company  Company of the researcher.
     */
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

    /**
     * @notice  Change the status of a researcher
     * @param   addr  Address of the researcher.
     * @param   status  New status of the researcher.
     */
    function changeResearcherStatus(
        address addr,
        bool status
    ) external onlyOwner {
        researchers[addr].isValidated = status;
    }

    /**
     * @notice  Check if a researcher is validated
     * @param   addr  Address of the researcher.
     * @return  bool  True if the researcher is validated.
     */
    function isValid(address addr) external view returns (bool) {
        return researchers[addr].isValidated;
    }  

    /**
     * @notice  Get a researcher
     * @param   addr  Address of the researcher.
     * @return  Researcher  The researcher details.
     */
    function getResearcher(address addr) external view returns (Researcher memory) {
        return (researchers[addr]);
    }
}
