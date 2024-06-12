// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract demoUUPS is UUPSUpgradeable {
    address public owner;
    uint256 public value;

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not owner");
        _;
    }

    function _authorizeUpgrade(
        address newImplement
    ) internal override onlyOwner {}

    function initialize(address _owner, uint256 _value) public {
        owner = _owner;
        value = _value;
    } 

    function incV2() public {
        value += 2;
    }

    function decV2() public {
        value -= 2;
    }
}
