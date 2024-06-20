import { ethers, run, upgrades } from "hardhat";

async function main() {
  // compile contract
  run("compile");
  console.log("Compile contract...");

  //Upgrade V3
  console.log("Upgrading contract...");
  const proxyAddr = "0xBE577Af24495fFA2A96105045e2a318776CD9b60";
  const LogicContractV3 = await ethers.getContractFactory("LogicContractV3");
  const logicContractV3 = await upgrades.upgradeProxy(
    proxyAddr,
    LogicContractV3
  );
  await logicContractV3.waitForDeployment();

  const newLogicAddrV3 = await upgrades.erc1967.getImplementationAddress(
    proxyAddr
  );
  console.log("Address of new logic contract V3: ", newLogicAddrV3);

  //time wait
  await new Promise((solve) => {
    setTimeout(solve, 60 * 1000);
  });

  //Verify contract
  run("verify:verify", {
    address: newLogicAddrV3,
    constructorArgs: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
