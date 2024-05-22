// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UserManager {
    address private admin;
    mapping(address => string) private roles;
    constructor(address deployer) {
        admin = deployer;
        roles[deployer] = "admin";
    }   

    modifier onlyAdmin {
        require(msg.sender == admin, "You is not admin");
        _;
    }
    
    function transeferAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
        roles[msg.sender] = "user";
        roles[newAdmin] = "admin";
    }

    function addUser(address newUser) public onlyAdmin {
        roles[newUser] = "user";
    }

    function checkRoles(address user) public view returns(string memory) {
        return roles[user];
    }
}