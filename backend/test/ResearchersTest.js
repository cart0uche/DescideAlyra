const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const BN = require("bn.js");
const {
   deployProject,
   addResearcher,
   addResearchProject,
   addRequest,
   buyNFT,
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

   describe("Researcher functions", function () {
      describe("Adding a project", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearcher(researcherRegistry, researcher2);
         });

         it("emit an event when adding a project", async function () {
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .addResearchProject(
                     "projet1",
                     "description1",
                     "image1",
                     100,
                     "uri1"
                  )
            )
               .to.emit(fundsFactory, "ResearchProjectCreated")
               .withArgs(0, researcher1.address);
         });

         it("get project info from researcher", async function () {
            await fundsFactory
               .connect(researcher1)
               .addResearchProject(
                  "projet1",
                  "description1",
                  "image1",
                  100,
                  "uri1"
               );
            const project1 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(0);
            expect(project1.title).to.be.equal("projet1");
            expect(project1.description).to.be.equal("description1");
            expect(project1.researcher).to.be.equal(researcher1.address);
            expect(project1.amountAsked).to.be.equal(new BN(100));
            expect(project1.projectDetailsUri).to.be.equal("uri1");

            await fundsFactory
               .connect(researcher2)
               .addResearchProject(
                  "projet2",
                  "description2",
                  "image1",
                  200,
                  "uri2"
               );
            const project2 = await fundsFactory
               .connect(researcher2)
               .getResearchProject(1);
            expect(project2.title).to.be.equal("projet2");
            expect(project2.description).to.be.equal("description2");
            expect(project2.researcher).to.be.equal(researcher2.address);
            expect(project2.amountAsked).to.be.equal(new BN(200));
            expect(project2.projectDetailsUri).to.be.equal("uri2");

            await fundsFactory
               .connect(researcher1)
               .addResearchProject(
                  "projet3",
                  "description3",
                  "image1",
                  300,
                  "uri3"
               );
            const project3 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(2);
            expect(project3.title).to.be.equal("projet3");
            expect(project3.description).to.be.equal("description3");
            expect(project3.researcher).to.be.equal(researcher1.address);
            expect(project3.amountAsked).to.be.equal(new BN(300));
            expect(project3.projectDetailsUri).to.be.equal("uri3");

            const r1 = await researcherRegistry.getResearcher(
               researcher1.address
            );
            expect(r1.projectListIds[0]).to.be.equal(0);
            expect(r1.projectListIds[1]).to.be.equal(2);

            const r2 = await researcherRegistry.getResearcher(
               researcher2.address
            );
            expect(r2.projectListIds[0]).to.be.equal(1);
         });

         it("should fail if amount is 0", async function () {
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .addResearchProject(
                     "projet1",
                     "description1",
                     "image1",
                     0,
                     "uri1"
                  )
            ).to.be.revertedWith("Amount not 0");
         });

         it("should fail if details is empty", async function () {
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .addResearchProject(
                     "projet1",
                     "description1",
                     "image1",
                     100,
                     ""
                  )
            ).to.be.revertedWith("Detail is mandatory");
         });

         it("should fail if get unknown project", async function () {
            await fundsFactory
               .connect(researcher1)
               .addResearchProject(
                  "projet1",
                  "description1",
                  "image1",
                  100,
                  "uri1"
               );
            await expect(
               fundsFactory.connect(researcher1).getResearchProject(1)
            ).to.be.revertedWith("Id dont exist");
         });
      });
      describe("Create NFT", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
         });

         it("deploy NFT", async function () {
            const project1 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(0);
            const nftAddress = project1.fundNFT;
            const nftContract = await ethers.getContractAt(
               "FundNFT",
               nftAddress
            );
            expect(await nftContract.name()).to.equal("DESCIDE0");
            expect(await nftContract.symbol()).to.equal("DSC0");
         });
      });

      describe("Create funds request", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3, investor1] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
            await addResearchProject(fundsFactory, researcher1, 1, "200");
            await fundsFactory
               .connect(researcher1)
               .addResearchProject(
                  "projet3",
                  "description3",
                  "image3",
                  ethers.parseEther("300"),
                  "uri3"
               );
            await fundsFactory.validResearchProject(0);
            await fundsFactory.validResearchProject(1);

            await buyNFT(fundsFactory, investor1, 0, VIP, "10");

            await buyNFT(fundsFactory, investor1, 1, VIP, "20");

            await fundsFactory.connect(researcher1).openFundsRequest(0);
            await fundsFactory.connect(researcher1).openFundsRequest(1);
         });

         it("emit an event when creating a funds request", async function () {
            const project0 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(0);
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(
                     project0.id,
                     ethers.parseEther("5"),
                     "description1"
                  )
            )
               .to.emit(fundsFactory, "FundsRequestCreated")
               .withArgs(0, 0, researcher1.address);

            const project1 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(1);
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(
                     project1.id,
                     ethers.parseEther("20"),
                     "description2"
                  )
            )
               .to.emit(fundsFactory, "FundsRequestCreated")
               .withArgs(1, 1, researcher1.address);
         });

         it("should fail if amount is 0", async function () {
            const project1 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(0);
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(project1.id, 0, "description1")
            ).to.be.revertedWith("Amount not 0");
         });

         it("should fail if description is empty", async function () {
            const project1 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(0);
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(project1.id, 10, "")
            ).to.be.revertedWith("Detail is mandatory");
         });

         it("should fail if get unknown project", async function () {
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(4, 10, "description1")
            ).to.be.revertedWith("Id dont exist");
         });

         // test it should failes if the project is not validated
         it("should fail if the project is not validated", async function () {
            const project3 = await fundsFactory
               .connect(researcher1)
               .getResearchProject(2);
            await expect(
               fundsFactory
                  .connect(researcher1)
                  .createFundsRequest(project3.id, 10, "description3")
            ).to.be.revertedWith("Not ready for funding");
         });

         //it();
      });

      describe("Close funds request", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3, investor1] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
            await addResearchProject(fundsFactory, researcher1, 1, "200");

            await buyNFT(fundsFactory, investor1, 0, VIP, "10");
            await buyNFT(fundsFactory, investor1, 1, VIP, "20");

            await fundsFactory.connect(researcher1).openFundsRequest(0);
            await fundsFactory.connect(researcher1).openFundsRequest(1);

            await addRequest(fundsFactory, researcher1, 0, "5");
            await addRequest(fundsFactory, researcher1, 0, "5");
            await addRequest(fundsFactory, researcher1, 1, "10");
         });

         it("emit an event when closing a funds request", async function () {
            await expect(fundsFactory.connect(researcher1).closeFundRequest(0))
               .to.emit(fundsFactory, "FundsRequestClosed")
               .withArgs(0, researcher1.address);
         });

         it("should fail if request id dont exist", async function () {
            await expect(
               fundsFactory.connect(researcher1).closeFundRequest(5)
            ).to.be.revertedWith("Id dont exist");
         });

         it("should fail if request is already closed", async function () {
            await fundsFactory.connect(researcher1).closeFundRequest(0);
            await expect(
               fundsFactory.connect(researcher1).closeFundRequest(0)
            ).to.be.revertedWith("Fund request is not in progress");
         });

         it("should fail if another researcher try to close the request", async function () {
            await expect(
               fundsFactory.connect(researcher2).closeFundRequest(0)
            ).to.be.revertedWith("Project not yours");
         });

         // TODO
         it("should fail if the request is already accepted", async function () {});
      });

      describe("Get funds request details", function () {
         let timestamp1, timestamp2, timestamp3;
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3, investor1] =
               await ethers.getSigners();

            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
            await addResearchProject(fundsFactory, researcher1, 1, "200");

            await buyNFT(fundsFactory, investor1, 0, VIP, "10");
            await buyNFT(fundsFactory, investor1, 1, VIP, "20");

            await fundsFactory.connect(researcher1).openFundsRequest(0);
            await fundsFactory.connect(researcher1).openFundsRequest(1);

            await addRequest(fundsFactory, researcher1, 0, "7");
            timestamp1 = await time.latest();
            await addRequest(fundsFactory, researcher1, 0, "3");
            timestamp2 = await time.latest();
            await addRequest(fundsFactory, researcher1, 1, "20");
            timestamp3 = await time.latest();
         });

         it("get funds request details", async function () {
            let [
               projectId,
               amountAsked,
               description,
               creationTime,
               isAccepted,
               status,
            ] = await fundsFactory
               .connect(researcher1)
               .getFundsRequestDetails(0);

            expect(projectId).to.be.equal(0);
            expect(amountAsked).to.be.equal(ethers.parseEther("7"));
            expect(description).to.be.equal("description");
            expect(creationTime).to.be.equal(timestamp1);
            expect(isAccepted).to.be.false;
            expect(status).to.be.equal(FUNDS_STATE_IN_PROGRESS);

            [
               projectId,
               amountAsked,
               description,
               creationTime,
               isAccepted,
               status,
            ] = await fundsFactory
               .connect(researcher1)
               .getFundsRequestDetails(1);

            expect(projectId).to.be.equal(0);
            expect(amountAsked).to.be.equal(ethers.parseEther("3"));
            expect(description).to.be.equal("description");
            expect(creationTime).to.be.equal(timestamp2);
            expect(isAccepted).to.be.false;
            expect(status).to.be.equal(FUNDS_STATE_IN_PROGRESS);

            [
               projectId,
               amountAsked,
               description,
               creationTime,
               isAccepted,
               status,
            ] = await fundsFactory
               .connect(researcher1)
               .getFundsRequestDetails(2);

            expect(projectId).to.be.equal(1);
            expect(amountAsked).to.be.equal(ethers.parseEther("20"));
            expect(description).to.be.equal("description");
            expect(creationTime).to.be.equal(timestamp3);
            expect(isAccepted).to.be.false;
            expect(status).to.be.equal(FUNDS_STATE_IN_PROGRESS);
         });

         it("should fail if request id dont exist", async function () {
            await expect(
               fundsFactory.connect(researcher1).getFundsRequestDetails(5)
            ).to.be.revertedWith("Id dont exist");
         });
      });

      describe("Claim funds request", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1] =
               await ethers.getSigners();
            [fundsFactory, researcherRegistry] = await deployProject();
            await addResearcher(researcherRegistry, researcher1);
            await addResearchProject(fundsFactory, researcher1, 0, "100");
            await buyNFT(fundsFactory, investor1, 0, VIP, "10");
            await fundsFactory.connect(researcher1).openFundsRequest(0);
            await addRequest(fundsFactory, researcher1, 0, "5");
            await fundsFactory.connect(investor1).addVote(0, true);
            await fundsFactory.connect(researcher1).closeFundRequest(0);
         });

         it("increase the balance of the researcher", async function () {
            const balanceBefore = await ethers.provider.getBalance(
               researcher1.address
            );
            const tx = await fundsFactory.connect(researcher1).claimFunds(0);
            const receipt = await tx.wait();
            const balanceAfter = await ethers.provider.getBalance(
               researcher1.address
            );
            expect(Number(balanceAfter - balanceBefore)).to.eq(
               Number(ethers.parseEther("5")) -
                  Number(receipt.gasUsed) * Number(receipt.gasPrice)
            );
         });

         it("should revert if the researcher is not the owner of the project", async function () {
            await expect(
               fundsFactory.connect(researcher2).claimFunds(0)
            ).to.be.revertedWith("Project not yours");
         });

         it("should revert if the request is not ended", async function () {
            await addRequest(fundsFactory, researcher1, 0, "5");
            await fundsFactory.connect(investor1).addVote(1, true);
            //await fundsFactory.connect(researcher1).closeFundRequest(0);
            await expect(
               fundsFactory.connect(researcher1).claimFunds(1)
            ).to.be.revertedWith("Fund request is not closed");
         });

         it("should revert if the request is not accepted", async function () {
            await addRequest(fundsFactory, researcher1, 0, "5");
            await fundsFactory.connect(investor1).addVote(1, false);
            await fundsFactory.connect(researcher1).closeFundRequest(1);
            await expect(
               fundsFactory.connect(researcher1).claimFunds(1)
            ).to.be.revertedWith("Fund request is not accepted");
         });
      });
   });
});
