import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AssetModule = buildModule("AssetModule", (m) => {

  const assetDigita = m.contract("AssetDigital", ["ART"]);

  return { assetDigita };
}); 

export default AssetModule;
