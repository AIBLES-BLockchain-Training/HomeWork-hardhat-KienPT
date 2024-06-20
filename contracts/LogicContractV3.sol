  // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicContractV3 {
    uint256 public value;

    function setValueV2(uint256 _value) public {
        value = _value;
    }

    function incValue() public {
        value += 1;
    }

    function decValueV3(uint x) public {
        value -= x;
    } 
}