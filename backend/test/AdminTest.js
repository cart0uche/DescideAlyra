const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
   deployProject,
   addResearcher,
   addResearchProject,
} = require("./helper");

describe("FundsFactory Contract", function () {
   let fundsFactory;
   let researcherRegistry;

   describe("Admin functions", function () {
      describe("Add a researcher", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
         });

         it("emit an event when a researcher is added", async function () {
            await await expect(
               researcherRegistry.addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               )
            )
               .to.emit(researcherRegistry, "ResearcherAdded")
               .withArgs(researcher1.address, "dupont", "david", "archeon");
         });

         it("should revert if the researcher is already added", async function () {
            await researcherRegistry.addResearcher(
               researcher1.address,
               "dupont",
               "david",
               "archeon"
            );
            await expect(
               researcherRegistry.addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               )
            ).to.be.revertedWith("Researcher already exist");
         });
      });

      describe("Valid researcher", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
         });

         it("change researcher status", async function () {
            await researcherRegistry.addResearcher(
               researcher2.address,
               "dupont",
               "david",
               "archeon"
            );
            let researcher = await researcherRegistry.getResearcher(
               researcher2.address
            );
            expect(researcher.isValidated).to.be.false;
            await researcherRegistry.changeResearcherStatus(
               researcher2.address,
               true
            );
            researcher = await researcherRegistry.getResearcher(
               researcher2.address
            );
            expect(researcher.isValidated).to.be.true;
         });

         it("should revert if not called by owner", async function () {
            await expect(
               researcherRegistry
                  .connect(researcher1)
                  .changeResearcherStatus(researcher1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
         });
      });

      describe("Valid project", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
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
