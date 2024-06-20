import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const FinancialSystemModule = buildModule("FinancialSystemModule", (m) => {
  const userManager = m.contract("UserManager", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);
  const financialContract = m.contract("Financial_Operations");
  const loanSystem = m.contract("LoanSystem");
  return { userManager, financialContract, loanSystem };
});

export default FinancialSystemModule;
