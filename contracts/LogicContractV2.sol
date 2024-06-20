// SPDX-License-Identifier: MIT
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
