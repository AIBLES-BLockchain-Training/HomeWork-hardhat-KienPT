import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';


describe("AssetDigital Contract", () => {
    async function deployAssetContract() {
        const [deployer, acc2] = await ethers.getSigners();
        const assetDigital = await ethers.deployContract("AssetDigital", ["ART"]);

        return {assetDigital, deployer, acc2};
    }

    describe("Deploy contract test", () => {
        it("should test catagory and admin of contract", async () => {
            const {assetDigital, deployer} = await loadFixture(deployAssetContract);

            const catagory = await assetDigital.catagory();
            const adAddress =  await assetDigital.getAdmin();

            expect(catagory).to.equal("ART");
            expect(adAddress).to.equal(deployer.address);
        });
    });

    describe("Mint asset", () => {
        it("should mint asset and emit event Mint", async () => {
            const {assetDigital, deployer, acc2} = await loadFixture(deployAssetContract);
            
            const name = "Art1";
            const uri = "www.kienpt.com";

            await assetDigital._mint(name, uri); //mint 1 for acc1

            const totalAsset = await assetDigital.totalAsset(); //total asset
            const balance = await assetDigital.balanceOf(deployer.address); //balance of acc1

            //test balanceOf and totalAsset
            expect(totalAsset).to.equal(1); //total = 1
            expect(balance).to.equal(1); //balance of acc1

            const asset1 = await assetDigital.getDetail(0);

            // test getDetails
            expect(asset1.name).to.equal(name);
            expect(asset1.owner).to.equal(deployer.address);
            expect(asset1.url).to.equal(uri);
        });

        it("should revert if sender is not admin", async () => {
            const {assetDigital, deployer, acc2} = await loadFixture(deployAssetContract);

            const name = "Art1";
            const uri = "www.kienpt.com";

            expect(
                assetDigital
                .connect(acc2)
                ._mint(name, uri)
            ).to.be.revertedWith("You are not the admin");
        });
    });

    describe("Transfer admin for contract", () => {
        it("should transfer admin for acc2", async () => {
            const {assetDigital, acc2} = await loadFixture(deployAssetContract);
            // admin == deployer
            await assetDigital.transferAdmin(acc2.address);
            const admin = await assetDigital.getAdmin();
            expect(admin).to.equal(acc2.address);
        });

        it("should revert if sender isn't admin", async () => {
            const {assetDigital, acc2} = await loadFixture(deployAssetContract);
            // admin == deployer
            expect (
                assetDigital
                .connect(acc2) //connect acc2
                .transferAdmin(acc2.address)
            ).to.be.revertedWith("You are not the admin");
        })
    });

    describe("transferOwnerShip", () => {
        it("Should transfer owner asset for other accounts", async () => {
            const {assetDigital, deployer, acc2} = await loadFixture(deployAssetContract);

            //mint for acc1
            const name = "Art1";
            const uri = "www.kienpt.com";

            await assetDigital._mint(name, uri); //owner = acc1
            
        })
    });
});