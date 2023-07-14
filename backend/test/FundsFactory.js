const { expect } = require("chai");
//const ethers = require("hardhat");
const { ethers } = require("hardhat");
const BN = require("bn.js");


const CLASSIC = 0;
const PLUS = 1;
const PREMIUM = 2;
const VIP = 3;

describe("FundsFactory Contract", function () {
   let fundsFactory;

   describe("Admin functions", function () {
      describe("Valid researcher", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, investor1, investor2] =
               await ethers.getSigners();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
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
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
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

   describe("Researcher functions", function () {
      describe("Adding a project", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3] =
               await ethers.getSigners();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
            await fundsFactory.addResearcher(
               researcher1.address,
               "dupont",
               "david",
               "archeon"
            );
            await fundsFactory.addResearcher(
               researcher2.address,
               "dupond",
               "kevin",
               "parkeon"
            );
            await fundsFactory.changeResearcherStatus(
               researcher1.address,
               true
            );
            await fundsFactory.changeResearcherStatus(
               researcher2.address,
               true
            );
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

            const r1 = await fundsFactory.getResearcher(researcher1.address);
            expect(r1.projectListIds[0]).to.be.equal(0);
            expect(r1.projectListIds[1]).to.be.equal(2);

            const r2 = await fundsFactory.getResearcher(researcher2.address);
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
            ).to.be.revertedWith("Amount asked should not be 0");
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
            ).to.be.revertedWith("Project detail is mandatory");
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
            ).to.be.revertedWith("Project id dont exist");
         });
      });
      describe("Create NFT", function () {
         beforeEach(async function () {
            [admin, researcher1, researcher2, researcher3] =
               await ethers.getSigners();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
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
            await fundsFactory.validResearchProject(0);
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
   });

   describe("Investor functions", function () {
      beforeEach(async function () {
         [admin, researcher1, researcher2, investor1, investor2] =
            await ethers.getSigners();
         let FundsFactory = await ethers.getContractFactory("FundsFactory");
         fundsFactory = await FundsFactory.deploy();
         await fundsFactory.addResearcher(
            researcher1.address,
            "dupont",
            "david",
            "archeon"
         );
         await fundsFactory.changeResearcherStatus(researcher1.address, true);
         await fundsFactory
            .connect(researcher1)
            .addResearchProject(
               "projet1",
               "description1",
               "image1",
               ethers.parseEther("10"),
               "uri1"
            );
         await fundsFactory.validResearchProject(0);
      });

      it("get NFT prices", async function () {
         const [classic, plus, premium, vip] = await fundsFactory
            .connect(investor1)
            .getNFT_Prices(0);
         expect(ethers.formatEther(classic) / 100).to.be.equal(1);
         expect(ethers.formatEther(plus) / 100).to.be.equal(2.5);
         expect(ethers.formatEther(premium) / 100).to.be.equal(5);
         expect(ethers.formatEther(vip) / 100).to.be.equal(10);
      });

      it("emit an event of mint NFT when buy classic NFT", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);
         await expect(
            await fundsFactory.connect(investor1).buyNFT(project1.id, CLASSIC, {
               value: ethers.parseEther("0.1"),
            })
         )
            .to.emit(nftContract, "fundNFTMinted")
            .withArgs(investor1.address, 0, CLASSIC);
      });

      it("emit an event of mint NFT when buy plus NFT", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);
         await expect(
            await fundsFactory
               .connect(investor1)
               .buyNFT(0, PLUS, { value: ethers.parseEther("2.5") })
         )
            .to.emit(nftContract, "fundNFTMinted")
            .withArgs(investor1.address, 0, PLUS);
      });

      it("emit an event of mint NFT when buy premium NFT", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);
         await expect(
            await fundsFactory.connect(investor1).buyNFT(0, PREMIUM, {
               value: ethers.parseEther("5"),
            })
         )
            .to.emit(nftContract, "fundNFTMinted")
            .withArgs(investor1.address, 0, PREMIUM);
      });

      it("emit an event of mint NFT when buy vip NFT", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);
         await expect(
            await fundsFactory
               .connect(investor1)
               .buyNFT(0, VIP, { value: ethers.parseEther("10") })
         )
            .to.emit(nftContract, "fundNFTMinted")
            .withArgs(investor1.address, 0, VIP);
      });

      it("increment investor balance", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);

         expect(await nftContract.balanceOf(investor1)).to.be.equal(0);
         await fundsFactory.connect(investor1).buyNFT(project1.id, CLASSIC, {
            value: ethers.parseEther("1"),
         });
         expect(await nftContract.balanceOf(investor1)).to.be.equal(1);
      });

      it("increment minted NFTs", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;

         let [classic, plus, premium, vip] = await fundsFactory
            .connect(investor1)
            .getNumberNFTMinted(0);
         expect(Number(classic)).to.be.equal(0);
         expect(Number(plus)).to.be.equal(0);
         expect(Number(premium)).to.be.equal(0);
         expect(Number(vip)).to.be.equal(0);

         await fundsFactory.connect(investor1).buyNFT(project1.id, CLASSIC, {
            value: ethers.parseEther("1"),
         });

         [classic, plus, premium, vip] = await fundsFactory
            .connect(investor1)
            .getNumberNFTMinted(0);
         expect(Number(classic)).to.be.equal(1);
         expect(Number(plus)).to.be.equal(0);
         expect(Number(premium)).to.be.equal(0);
         expect(Number(vip)).to.be.equal(0);
      });

      it("has attribute Classic", async function () {
         const project1 = await fundsFactory
            .connect(researcher1)
            .getResearchProject(0);
         const nftAddress = project1.fundNFT;

         await fundsFactory.connect(investor1).buyNFT(project1.id, CLASSIC, {
            value: ethers.parseEther("0.1"),
         });

         const uri =
            '{"name": "projet1","image": "ipfs://image1","attributes": [{"type": "CLASSIC"}]}';

         // encode the json with base64
         const uriBase64 =
            "data:application/json;base64," +
            Buffer.from(uri).toString("base64");

         // test the NFT tokenuri is
         const nftContract = await ethers.getContractAt("FundNFT", nftAddress);
         const tokenURI = await nftContract.tokenURI(0);
         expect(tokenURI).to.be.equal(uriBase64);
      });

      it("should revert if not enaugh pay for classic NFT", async function () {
         await expect(
            fundsFactory
               .connect(investor1)
               .buyNFT(0, CLASSIC, { value: ethers.parseEther("0.09") })
         ).to.be.revertedWith("Not enaugh paid");
      });
   });

   describe("Anyone functions", function () {
      describe("Adding researchers", function () {
         beforeEach(async function () {
            [admin, researcher1] = await ethers.getSigners();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
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

      describe("Test if researcher exist", function () {
         beforeEach(async function () {
            [admin, researcher1] = await ethers.getSigners();
            let FundsFactory = await ethers.getContractFactory("FundsFactory");
            fundsFactory = await FundsFactory.deploy();
         });

         it("dont exist before and exist after adding", async function () {
            let result = await fundsFactory
               .connect(researcher1)
               .isRegisterExist(researcher1.address);
            expect(result).to.be.false;
            await fundsFactory
               .connect(researcher1)
               .addResearcher(
                  researcher1.address,
                  "dupont",
                  "david",
                  "archeon"
               );
            result = await fundsFactory
               .connect(researcher1)
               .isRegisterExist(researcher1.address);
            expect(result).to.be.true;
         });
      });
   });
});
