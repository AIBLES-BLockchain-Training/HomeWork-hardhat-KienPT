import { ethers, upgrades, run } from "hardhat";

async function main() {
  //Compile
  run("compile");
  console.log("Compile contract...");

  //Deploy
  console.log("Deploy demoUUPS...");

  const constructorArgs: [string, bigint] = [
    "0xe0c4781f9686e1365a077E826BCbB073E294f0e3",
    100n,
  ];

  const DemoUUPS = await ethers.getContractFactory("demoUUPS");

  const demoUUPS = await upgrades.deployProxy(DemoUUPS, constructorArgs, {
    kind: "uups",
    initializer: "initialize",
  });

  await demoUUPS.waitForDeployment();

  const proxyAddr = await demoUUPS.getAddress();
  console.log("DemoUUPS deployed at: ", proxyAddr);

  console.log("Wait to verify contract");

  await new Promise((resolve) => {
    setTimeout(resolve, 60 * 1000);
    });
    
  const implAddr = await upgrades.erc1967.getImplementationAddress(proxyAddr);

  await run("verify:verify", {
    address: implAddr,
    constructorArgs: [],
  })

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
