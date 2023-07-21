const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const BN = require("bn.js");
const {
   deployProject,
   addResearcher,
   addResearchProject,
} = require("./helper");

const CLASSIC = 0;
const PLUS = 1;
const PREMIUM = 2;
const VIP = 3;

const FUNDS_STATE_IN_PROGRESS = 0;
const FUNDS_STATE_ENDED = 1;

describe("FundsFactory Contract", function () {
   let fundsFactory;
   let researcherRegistry;

   describe("Anyone functions", function () {
      describe("Adding researchers", function () {
         beforeEach(async function () {
            [admin, researcher1] = await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
         });

         it("add a researcher", async function () {
            await researcherRegistry
               .connect(researcher1)
               .addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               );
            const r = await researcherRegistry.getResearcher(
               researcher1.address
            );
            expect(r.lastname).to.be.equal("dupont");
            expect(r.forname).to.be.equal("david");
            expect(r.company).to.be.equal("archeon");
            expect(r.exist).to.be.true;
         });

         it("should revert is a research is added twice", async function () {
            await researcherRegistry
               .connect(researcher1)
               .addResearcher(
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
      describe("Researchers valid", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2] = await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
         });

         it("returns true if valid", async function () {
            expect(await researcherRegistry.isValid(researcher1)).to.be.true;
         });

         it("returns false if notvalid", async function () {
            expect(await researcherRegistry.isValid(researcher2)).to.be.false;
         });
      });
   });
});
