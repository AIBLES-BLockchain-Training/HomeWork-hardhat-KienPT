import { ethers, upgrades, run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Compile contract
  run("compile");
  console.log("Compile contract...");

  //Upgrade demoUUPS
  console.log("Upgrade demoUUPS...");

  const owner = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY || "",
    ethers.provider
  );

  //proxy contract
  const proxyAddr = "0xc7f95192688bc258c97e4204839926DE7808C627";

  //Upgrade contract
  const DemoUUPS = await ethers.getContractFactory("demoUUPS");

  const demoUUPSV2 = await upgrades.upgradeProxy(
    proxyAddr,
    DemoUUPS.connect(owner)
  );

  await demoUUPSV2.waitForDeployment();

  //implement contract
  const iplmAddr = await upgrades.erc1967.getImplementationAddress(proxyAddr);

  console.log("New Implement contract at: ", iplmAddr);

  //verify contract
  console.log("Verify contract...");

  await new Promise((resolve) => {
    setTimeout(resolve, 60 * 1000);
  });

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

  