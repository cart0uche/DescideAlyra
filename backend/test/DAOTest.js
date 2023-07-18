const { expect } = require("chai");
const { ethers } = require("hardhat");

let dao;

describe("DAO Contract", function () {
   beforeEach(async function () {
      [admin, researcher1, researcher2, investor1, investor2] =
         await ethers.getSigners();
         let DAO = await ethers.getContractFactory("DAO");
         dao = await DAO.deploy();

         let ResearcherRegistry = await ethers.getContractFactory(
            "ResearcherRegistry"
         );
         let researcherRegistry = await ResearcherRegistry.deploy();
      
         let FundsFactory = await ethers.getContractFactory("FundsFactory");
         let fundsFactory = await FundsFactory.deploy(
            dao.target,
            researcherRegistry.target
         );
         await dao.setFactoryAddress(fundsFactory.target);
         await researcherRegistry.setFactoryAddress(fundsFactory.target);
   });

   it("should revert addDao not called by fundsFactory", async function () {
      await expect(dao.addDao(0, 0, 10, "description")).to.be.revertedWith(
         "Caller is not factory"
      );
   });

   it("should revert if getting request detail is not called by fundsFactory", async function () {
      await expect(dao.getFundRequestDetails(0)).to.be.revertedWith(
         "Caller is not factory"
      );
   });

   it("should revert if voting for a request detail is not called by fundsFactory", async function () {
      await expect(
         dao.voteForFundRequest(0, 0, true, admin.address)
      ).to.be.revertedWith("Caller is not factory");
   });

   it("should revert if addInvestorVoteWeight is not called by fundsFactory", async function () {
      await expect(
         dao.addInvestorVoteWeight(0, admin.address, 0)
      ).to.be.revertedWith("Caller is not factory");
   });

   it("should revert if closeFundRequest is not called by fundsFactory", async function () {
      await expect(dao.closeFundRequest(0)).to.be.revertedWith(
         "Caller is not factory"
      );
   });

   it("should revert if getVoteResult is not called by fundsFactory", async function () {
      await expect(dao.getVoteResult(0)).to.be.revertedWith(
         "Caller is not factory"
      );
   });

   it("should revert if shouldClaimFunds is not called by fundsFactory", async function () {
      await expect(dao.shouldClaimFunds(0)).to.be.revertedWith(
         "Caller is not factory"
      );
   });
});
