// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './IAsset.sol'; 

abstract contract AbstractAsset is IDigitalAsset {
    uint256 private _totalAsset;
    string private _category;
    address private admin;
    constructor(string memory category_) {
        _category = category_; 
        admin = msg.sender;
    }
    //detail asset
    struct Asset {
        string name;
        address owner;
        string url;
    }

    modifier onlyOwner {
        require(msg.sender==admin, "You are not the admin");
        _;
    }

    mapping(uint256 => Asset) private assets;
    mapping(address => uint256) private balances; //

    function totalAsset() external virtual view returns(uint256) {
        return _totalAsset;
    }

    function catagory() external virtual view returns(string memory) {
        return _category;
    }

    function getAdmin() external virtual view returns(address) {
        return admin;
    } 

    function balanceOf(address owner) external virtual view returns(uint256) {
        return balances[owner];
    } 

    function getDetail(uint id) external virtual view returns(Asset memory) {
        return assets[id];
    }

    function mint(address owner, string memory name, string memory url) internal virtual {
        assets[_totalAsset] = Asset({
            name: name,
            owner: owner, 
            url: url  
        });
        balances[owner]++;
        _totalAsset++;
    }

    function _transferAdmin(address newAdmin) internal onlyOwner {
        admin = newAdmin;
    }

    function transferOwnership(uint256 id, address newOwner) virtual public {
        address owner = msg.sender;
        Asset storage asset = assets[id];

        // require(asset.name != "", "You do not have asset");
        require(asset.owner == owner, "You are not the owner");
        require(newOwner != address(0), "Invalid address");
        
        asset.owner = newOwner;
        assets[id] = asset; //update owner

        balances[owner]--;
        balances[newOwner]++;

        emit Transfer(owner, newOwner, id, asset.name);
    }
}
