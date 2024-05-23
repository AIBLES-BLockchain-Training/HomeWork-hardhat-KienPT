// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './AbAsset.sol';

contract AssetDigital is AbstractAsset {
    constructor(string memory catagory) AbstractAsset(catagory) {}
    
    function _mint(string memory name, string memory uri) public onlyOwner {
        mint(msg.sender, name, uri);
    }
    
    function transferAdmin(address newAdmin) public {
        _transferAdmin(newAdmin);
    }
}
