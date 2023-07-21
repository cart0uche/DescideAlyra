const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
   deployProject,
   addResearcher,
   addResearchProject,
   buyNFT,
} = require("./helper");

let nftContract;
let researcherRegistry;
let fundsFactory;

const CLASSIC = 0;

describe("FundNFT Contract", function () {
   beforeEach(async function () {
      [admin, researcher1, investor1] = await ethers.getSigners();
      [fundsFactory, researcherRegistry] = await deployProject();
      await addResearcher(researcherRegistry, researcher1);
      await addResearchProject(fundsFactory, researcher1, 0, "10");
      const project1 = await fundsFactory
         .connect(researcher1)
         .getResearchProject(0);
      let nftAddress = project1.fundNFT;
      nftContract = await ethers.getContractAt("FundNFT", nftAddress);
   });

   it("should revert if safeMint not called by owner", async function () {
      await expect(
         nftContract.safeMint(researcher1.address, 0, "", "", 0)
      ).to.be.revertedWith("Ownable: caller is not the owner");
   });

   it("should revert if getPrices not called by owner", async function () {
      await expect(nftContract.getPrices()).to.be.revertedWith(
         "Ownable: caller is not the owner"
      );
   });

   it("should revert if getNumberNFTMinted not called by owner", async function () {
      await expect(nftContract.getNumberNFTMinted()).to.be.revertedWith(
         "Ownable: caller is not the owner"
      );
   });

   it("should revert if getWeight not called by owner", async function () {
      await expect(nftContract.getWeight(0)).to.be.revertedWith(
         "Ownable: caller is not the owner"
      );
   });

   it("returns the tokenURI", async function () {
      await buyNFT(fundsFactory, investor1, 0, CLASSIC, "0.1");
      const tokenURI = await nftContract.tokenURI(0);

      const uri =
         '{"name": "projet1","image": "ipfs://image1","attributes": [{"trait_type": "type", "value": "CLASSIC"}]}';

      // encode the json with base64
      const uriBase64 =
         "data:application/json;base64," + Buffer.from(uri).toString("base64");
      expect(tokenURI).to.equal(uriBase64);
   });
});
