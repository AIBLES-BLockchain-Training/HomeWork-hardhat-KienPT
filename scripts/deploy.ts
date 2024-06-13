import { ethers, run, upgrades } from "hardhat";

async function main() {
  //Complile contract
  run("compile");
  console.log("Compile Contract...");

  //Deploy contract
  console.log("Deploy contract...");
  const LogicContract = await ethers.getContractFactory("LogicContract");
  const logicContract = await upgrades.deployProxy(LogicContract, [], {
    initializer: false,
  });
  await logicContract.waitForDeployment();
  const proxyAddr = await logicContract.getAddress();

  console.log("Contract deployed to: ", proxyAddr);

  //Time wait
  await new Promise((solve) => {
    setTimeout(solve, 60 * 1000);
  });

  //Verify contract iplement
  const iplmAddr = await upgrades.erc1967.getImplementationAddress(proxyAddr);
  //contract proxy
  console.log("Verify contract proxy...");
  await run("verify:verify", {
    address: iplmAddr,
    constructorArgs: [],
  });

  //contract iplement
  console.log("Verify contract logic...");
  await run("verify:verify", {
    address: iplmAddr,
    constructorArgs: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
