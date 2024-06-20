// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicContract {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
}
