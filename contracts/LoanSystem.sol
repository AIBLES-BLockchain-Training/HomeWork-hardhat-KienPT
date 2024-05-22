// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Financial_Operations.sol"; 

contract LoanSystem is Financial_Operations {
    // lưu thông tin khoản vay của mỗi địa chỉ
    mapping(address => Loan) public loans;

    // thông tin chi tiết của khoản vay
    struct Loan {
        uint256 amount;
        uint256 startTime; 
        uint256 duration; // Duration of the loan in days
    }
    uint256 public interestRate = 2; 

    // Event to notify about successful loan issuance
    event LoanIssued(address indexed borrower, uint256 indexed amount, uint256 indexed duration);

    // Event to notify about loan repayment
    event LoanRepaid(address indexed borrower, uint256 indexed amount);

    // Function to issue a loan to a borrower
    function issueLoan(uint256 amount, uint256 duration) external {
        address borrower = msg.sender;
        Loan storage loan = loans[borrower];
        // chưa có khoản vay nào thì mới vay được tiếp
        require(loan.amount == 0, "You have a loan issued");

        require(amount > 0, "Loan amount must be greater than zero");
        require(duration > 0, "Loan duration must be greater than zero");

        // Transfer loan amount to borrower
        payable(borrower).transfer(amount);

        // Update loan details for borrower
        loans[borrower] = Loan(amount, block.timestamp, duration);

        emit LoanIssued(borrower, amount, duration);
    }

    // Function to calculate loan interest
    function calculateInterest(uint256 amount, uint256 duration) public view returns (uint256) {
        return amount * interestRate * duration / (365 days * 1 ether); 
    }

    // Function to repay a loan (borrower sends back principal + interest)
    function repayLoan() external payable {
        address borrower = msg.sender;
        Loan storage loan = loans[borrower];

        require(loan.amount > 0, "No outstanding loan for this address"); 

        uint256 totalAmount = loan.amount + calculateInterest(loan.amount, block.timestamp - loan.startTime);
        require(msg.value >= totalAmount, "Insufficient funds to repay loan");

        balances[address(this)] += totalAmount;
        balances[borrower] += msg.value - totalAmount; 

        delete loans[borrower];

        emit LoanRepaid(borrower, totalAmount);
    }
}