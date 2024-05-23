// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDigitalAsset {
    event Transfer(address indexed owner, address indexed newOwner, uint256 id, string name);
    function totalAsset() external view returns(uint256);
    function balanceOf(address owner) external view returns(uint256);
    function transferOwnership(uint256 id, address newOwner) external; 
}