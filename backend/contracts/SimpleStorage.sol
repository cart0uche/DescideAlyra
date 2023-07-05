// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract SimpleStorage {
    uint number;

    function getNumber() external view returns (uint) {
        return number;
    }

    function setNumber(uint _number) external {
        number = _number;
    }
}
