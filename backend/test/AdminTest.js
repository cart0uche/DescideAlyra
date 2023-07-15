const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundsFactory Contract", function () {
   let fundsFactory;

   describe("Admin functions", function () {
      describe("Valid researcher", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            let DAO = await ethers.getContractFactory("DAO");
            let dao = await DAO.deploy();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy(dao.target);
            await fundsFactory.addResearcher(
               researcher1.address,
               "dupont",
               "david",
               "archeon"
            );
         });

         it("change researcher status", async function () {
            let researcher = await fundsFactory.getResearcher(
               researcher1.address
            );
            expect(researcher.isValidated).to.be.false;
            await fundsFactory.changeResearcherStatus(
               researcher1.address,
               true
            );
            researcher = await fundsFactory.getResearcher(researcher1.address);
            expect(researcher.isValidated).to.be.true;
         });

         it("should revert if not called by owner", async function () {
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .changeResearcherStatus(researcher1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
         });
      });

      describe("Valid project", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            let DAO = await ethers.getContractFactory("DAO");
            let dao = await DAO.deploy();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy(dao.target);
            await fundsFactory.addResearcher(
               researcher1.address,
               "dupont",
               "david",
               "archeon"
            );
            await fundsFactory.changeResearcherStatus(
               researcher1.address,
               true
            );
            await fundsFactory
               .connect(researcher1)
               .addResearchProject(
                  "projet1",
                  "description1",
                  "image1",
                  100,
                  "uri1"
               );
         });

         it("emit an event when validate a project", async function () {
            await await expect(fundsFactory.validResearchProject(0))
               .to.emit(fundsFactory, "ResearchProjectValidated")
               .withArgs(0);
         });

         it("should revert if not called by owner", async function () {
            await expect(
               fundsFactory.connect(researcher1).validResearchProject(0)
            ).to.be.revertedWith("Ownable: caller is not the owner");
         });
      });
   });
});
