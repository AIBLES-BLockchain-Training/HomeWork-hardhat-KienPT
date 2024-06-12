import { ethers, run, upgrades } from "hardhat";

async function main() {
  //Compile Contract
  run("compile");
  console.log("Complie Contract...");

  //proxy contract
  const proxyAddr = "0xBE577Af24495fFA2A96105045e2a318776CD9b60";

  //Upgrades Contract
  console.log("Upgrading to LogicContractV2...");
  const LogicContractV2 = await ethers.getContractFactory("LogicContractV2");
  const logicContractV2 = await upgrades.upgradeProxy(
    proxyAddr,
    LogicContractV2
  );
  await logicContractV2.waitForDeployment();

  //Address new LogicContract
  const logicAddrV2 = await upgrades.erc1967.getImplementationAddress(
    proxyAddr
  );
  console.log("New address of contract logicV2: ", logicAddrV2);

  // Time await
  await new Promise((solve) => {
    setTimeout(solve, 60 * 1000);
  });

  //Verify contract LogicV2
  console.log("Verify contract...");
  run("verify:verify", {
    address: proxyAddr,
    contructorArgs: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
