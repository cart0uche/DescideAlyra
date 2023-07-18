const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
   deployProject,
   addResearcher,
   addResearchProject,
} = require("./helper");

let nftContract;
let researcherRegistry;

describe.only("FundNFT Contract", function () {
   beforeEach(async function () {
      let fundsFactory;
      [admin, researcher1] = await ethers.getSigners();
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
});
