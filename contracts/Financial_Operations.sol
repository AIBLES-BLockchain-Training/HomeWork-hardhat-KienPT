// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Financial_Operations {
    mapping(address => uint256) balances;
    event Deposit(address indexed sender, uint256 indexed val);
    event Withdraw(uint256 indexed _amount, address indexed recieve);
    // Hàm gửi tiền
    function deposit() external payable  {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    // Hàm nhận tiền
    function withdraw(uint256 _amount) external {
        require(_amount <= balances[msg.sender], "Amount than deposit!");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(_amount, msg.sender);
    }
    //số dư còn lại chưa rút
    function getBalanceDeposist(address owner) public view returns(uint256) {
        return balances[owner];
    }
    // Số tiền của contract
    function getBalances() external view returns (uint256) {
        return address(this).balance;
    }
}