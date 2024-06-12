// Sources flattened with hardhat v2.22.4 https://hardhat.org

// SPDX-License-Identifier: MIT AND UNLICENSED

// File contracts/LogicContractV2.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.24;

contract LogicContractV2 {
    uint256 public value;

    function setValueV2(uint256 _value) public {
        value = _value;
    }

    function incValue() public {
        value += 1;
    }
}
