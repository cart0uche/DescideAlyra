const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const BN = require("bn.js");

const CLASSIC = 0;
const PLUS = 1;
const PREMIUM = 2;
const VIP = 3;

const FUNDS_STATE_IN_PROGRESS = 0;
const FUNDS_STATE_ENDED = 1;

describe("FundsFactory Contract", function () {
   let fundsFactory;

   describe("Anyone functions", function () {
      describe("Adding researchers", function () {
         beforeEach(async function () {
            [admin, researcher1] = await ethers.getSigners();
            let DAO = await ethers.getContractFactory("DAO");
            let dao = await DAO.deploy();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy(dao.target);
         });

         it("add a researcher", async function () {
            await fundsFactory
               .connect(researcher1)
               .addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               );
            const r = await fundsFactory.getResearcher(researcher1.address);
            expect(r.lastname).to.be.equal("dupont");
            expect(r.forname).to.be.equal("david");
            expect(r.company).to.be.equal("archeon");
            expect(r.exist).to.be.true;
         });

         it("should fail is a research is added twice", async function () {
            await fundsFactory
               .connect(researcher1)
               .addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               );
            await expect(
               fundsFactory.addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               )
            ).to.be.revertedWith("Researcher already exist");
         });
      });
   });
});
