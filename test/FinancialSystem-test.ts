import {expect} from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';

describe("FinancialSystem Contract", () => {

    // deploy for contract Usermanager
    async function deployUserManagerContract() {
        const [acc1, acc2] = await ethers.getSigners();
        
        const userManager =  await ethers.deployContract("UserManager", [acc1.getAddress()]);
        return {userManager, acc1, acc2};
    }

    // deploy for contract Financial
    async function deployFinancialContract() {
        const accounts = await ethers.getSigners();
        const money = ethers.parseEther("10");
        const financial =  await ethers.deployContract("Financial_Operations", []);
        return {financial, accounts, money};
    }

    // deploy for contract LoanSystem
    async function deployLoanSystem() {
        const accounts = await ethers.getSigners();
        const loanSystem = await ethers.deployContract("LoanSystem");
        return {loanSystem, accounts};
    }

    describe("Test contract UserManager", () => {
        it("Should test function addUser and checkRoles", async () => {
            // acc1 is deployer (admin)
            // acc2 is acc to add role
            const {userManager, acc1, acc2} = await loadFixture(deployUserManagerContract);
            // admin add
            await userManager.addUser(acc2.getAddress());
            const roleOfUser = await userManager.checkRoles(acc2.getAddress());
            const roleOfAdmin = await userManager.checkRoles(acc1.getAddress());
           
            //check role (acc1 = admin), (acc2 = user)
            expect(roleOfAdmin, roleOfUser).to.equal("admin", "user");            
        });

        it("should revert if sender is not admin", async () => {
            const {userManager, acc2} = await loadFixture(deployUserManagerContract);

            await expect(
                userManager
                .connect(acc2)
                .addUser(acc2.getAddress())
            ).to.be.revertedWith("You is not admin");
        });

        it("Should test function transferAdmin with admin", async () => {
            /*
                acc1 is admin 
                acc2 is user
                acc1 transfer for acc2
            */
            const {userManager, acc1, acc2} = await loadFixture(deployUserManagerContract);

            await expect(
                userManager
                .transeferAdmin(acc2.getAddress())
            );
  
            const roleAcc1 = await userManager.checkRoles(acc1.getAddress());
            const roleAcc2 = await userManager.checkRoles(acc2.getAddress());
            // console.log("Acc2 is" + roleAcc2, "Acc1 is " + roleAcc1);
            expect(roleAcc2, roleAcc1).to.equals("admin", "user");
        });

        it("should tranfer admin with sender is not admin", async () => {
            const {userManager, acc2} = await loadFixture(deployUserManagerContract);
            // console.log(await userManager.checkRoles(acc1.getAddress()));
            await expect(
                userManager
                .connect(acc2)
                .transeferAdmin(acc2.getAddress())
            ).to.be.revertedWith("You is not admin");
        });
    });

    describe("Test contract Financial Operations", () => {
        it("should test deposit and emit Deposit event", async () => {
            const {financial, accounts, money} = await loadFixture(deployFinancialContract);
            const initialBalance = await financial.getBalances();
            const acc1 = await accounts[0];
        
            const tx = await financial.connect(acc1).deposit({value: money});
            const receipt = await tx.wait();

            // check money deposit == deposit
            const balanceDeposit = await financial.getBalanceDeposist(acc1.getAddress());
            expect(balanceDeposit).to.equal(money);

            //check balance contract increased
            const finalBalance = await financial.getBalances();
            expect(finalBalance).to.be.gt(initialBalance);

            // Filter for Deposit events with specific arguments
            const filters = financial.filters.Deposit(acc1.getAddress(), money);
            // const events = await financial.queryFilter(filters);

            // // Assert that the event was emitted with correct arguments
            // expect(events.length).to.be.equal(1); // One event emitted
            // expect(events[0].args.sender).to.equal(await acc1.getAddress());
            // expect(events[0].args.val).to.equal(money);
            
            expect(filters).to.emit(financial, "Deposit");
        });

        describe("Function withDraw", () => {
            it("Should test withDraw and emit withDraw event", async () => {
                const {financial, accounts, money} = await loadFixture(deployFinancialContract);
                const acc1 = accounts[0];
                
                // deposit money 10ETH
                const tx1 = await financial.deposit({value: money});
                await tx1.wait();

                const initialBalance = await ethers.provider.getBalance(acc1.address);
                // console.log(ethers.formatEther(initialBalance), " ETH");

                // withDraw money 5ETH
                const withDrawAmount = ethers.parseEther("5");
                const tx2 = await financial.withdraw(withDrawAmount);
                await tx2.wait();
                
                const finalBalance = await ethers.provider.getBalance(acc1.address)
                // console.log(ethers.formatEther(finalBalance), " ETH");

                //check user balances increased
                expect(finalBalance).to.be.gt(initialBalance);

                //emit event withdraw
                const filters = financial.filters.Withdraw(withDrawAmount, acc1.address);
                const events = await financial.queryFilter(filters);

                //check emit event
                expect(events.length).to.equal(1);
                expect(events[0].args._amount).to.equal(withDrawAmount);
                expect(events[0].args.recieve).to.equal(acc1.address);
            });

            it("should revert if withdraw amount axceeds deposit", async () => {
                const {financial, money} = await loadFixture(deployFinancialContract);
                //deposit 10ETH
                await financial.deposit({value: money});

                //withdraw 20ETH
                const withDrawAmount = ethers.parseEther("20"); // 20ETH
                const tx2 = financial.withdraw(withDrawAmount);
                expect(tx2).to.be.revertedWith("Amount than deposit!");
            });
        });

        describe("getBalanceDeposit", () => {
            it("should return the correct deposit balance", async () => {
                const {financial, accounts, money} = await loadFixture(deployFinancialContract);
                const acc1 = accounts[0];
                await financial.deposit({value: money}); //deposit 10ETH
                const balance = await financial.getBalanceDeposist(acc1.address);
                
                expect(balance).to.equal(money);
            });
        });

        describe("getBalances", () => {
            it("shoud return the contract's balance", async () => {
               const {financial, accounts, money} = await loadFixture(deployFinancialContract);
               const acc2 = accounts[1];
               await financial.deposit({value: money}); //10ETH
               
               const depositOfAcc2 = ethers.parseEther("5"); //5ETH
               await financial.connect(acc2).deposit({value: depositOfAcc2});
               const balance = await financial.getBalances(); //15ETH

               expect(balance).to.equal(money + depositOfAcc2);
            });
        });

        describe("Test contract LoanSystem", () => {
            describe("Test issueLoan", () => {
                it("Should test loan system and emit Loan", async () => {
                    const {loanSystem, accounts} = await loadFixture(deployLoanSystem);
                    const acc2 = accounts[1];
                    await loanSystem.deposit({value: ethers.parseEther("100")}); // nap cho contract 100ETH
                    
                    const initialBalance = await ethers.provider.getBalance(acc2.address);
                    const amountLoan = ethers.parseEther("20"); // 20ETH
    
                    // acc2 vay 20ETH lãi suất 2 và thời gian 100 ngày
                    await loanSystem.connect(acc2).issueLoan(amountLoan, 100);
                    
                    const finalBalance = await ethers.provider.getBalance(acc2.address);
                    // console.log(finalBalance);
                    // console.log(finalBalance - initialBalance);
                    //Kiểm tra balance của acc2 đã + 20ETH chưa
                    expect(finalBalance).to.be.gt(initialBalance);

                    //emit event LoanIssued
                    const filters = loanSystem.filters.LoanIssued(acc2.address, amountLoan, 100);
                    const events = await loanSystem.queryFilter(filters);

                    expect(events.length).to.equals(1);
                    expect(events[0].args.borrower).to.equal(acc2.address);
                    expect(events[0].args.amount).to.equal(amountLoan);
                    expect(events[0].args.duration).to.equal(100);
                });

                it("should revert issue Loan", async () => {
                    const {loanSystem, accounts} = await loadFixture(deployLoanSystem);
                    const acc2 = accounts[1];
                    await loanSystem.deposit({value: ethers.parseEther("100")}); // nap cho contract 100ETH
                    
                    const amountLoan = ethers.parseEther("20"); // 20ETH
    
                    // acc2 vay 20ETH lãi suất 2 và thời gian 100 ngày
                    await loanSystem.connect(acc2).issueLoan(amountLoan, 100); 
                    // Issued loan
                    expect(
                        loanSystem
                        .connect(acc2)
                        .issueLoan(amountLoan, 200)
                    ).to.be.revertedWith("You have a loan issued");
                    //amount loan = 0
                    expect(
                        loanSystem
                        .connect(acc2)
                        .issueLoan(0, 200)
                    ).to.be.revertedWith("Loan amount must be greater than zero");
                    // duration = 0
                    expect(
                        loanSystem
                        .connect(acc2)
                        .issueLoan(amountLoan, 0)
                    ).to.be.revertedWith("Loan duration must be greater than zero");
                });
            });

            describe("Test repayLoan", () => {
                it("Should repayment loan and emit Loan Repaid", async () => {
                    const {loanSystem, accounts} = await loadFixture(deployLoanSystem);
                    const acc2 = accounts[1];
                    const amountLoan = ethers.parseEther("20"); // 20ETH
                    await loanSystem.deposit({value: ethers.parseEther("100")}); // nap cho contract 100ETH           
    
                    // acc2 vay 20 ETH lãi suất 2 và thời gian 100 ngày
                    await loanSystem.connect(acc2).issueLoan(amountLoan, 100); 
                    
                    //vay 20 ETH trả 30 ETH
                    const amount = ethers.parseEther("30");
                    await loanSystem.connect(acc2).repayLoan({value: amount});

                    const calculateInterest = await loanSystem.calculateInterest(amountLoan, 100); // tính lãi của 20 ETH
                    const totalAmount = calculateInterest + amountLoan; // tổng số tiền phải trả
                    const balance = amount - totalAmount; // số tiền dư sau khi trả xog khoản vay
                    
                    const loans = await loanSystem.loans(acc2.address);
                    const loanAmount = loans.amount;
                    // console.log(loans);
                    // số tiền nợ trả về 0
                    expect(loanAmount).to.equal(0);
                    
                    //Số tiền dư phải được cộng vào ví có thể rút được
                    expect(
                        await loanSystem.getBalanceDeposist(acc2.address)
                    ).to.equal(balance);
                });

                it("should revert insufficient value to repayment loan", async () => {
                    const {loanSystem, accounts} = await loadFixture(deployLoanSystem);
                    const acc2 = accounts[1];
                    const amountLoan = ethers.parseEther("20"); // 20ETH
                    const value = ethers.parseEther("10"); // 10 ETH
                    await loanSystem.deposit({value: ethers.parseEther("100")}); // deposit for contract 100ETH           
    
                    //If No outstanding loan for this address
                    expect(
                        loanSystem
                        .connect(acc2)
                        .repayLoan({value: value})
                    ).to.be.revertedWith("No outstanding loan for this address");

                    // acc2 loan issued 20 ETH 
                    await loanSystem.connect(acc2).issueLoan(amountLoan, 100); 
                    
                    //Loan issued 20ETH and replay 10ETH
                    expect(
                        loanSystem
                        .connect(acc2)
                        .repayLoan({value: value})
                    ).to.be.revertedWith("Insufficient funds to repay loan");
                });
            });
        });
    });
});

