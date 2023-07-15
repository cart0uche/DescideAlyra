const { expect } = require("chai");
const { ethers } = require("hardhat");
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

describe("FundsFactory Contract", function () {
   let fundsFactory;

   describe("Investor functions : buy NFT", function () {
      beforeEach(async function () {
         [admin, researcher1, researcher2, investor1, investor2] =
            await ethers.getSigners();
         fundsFactory = await deployProject();
         await addResearcher(fundsFactory, researcher1);
         await addResearchProject(fundsFactory, researcher1, 0, "10");
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

      it("should revert if unknown NFT type", async function () {
         await expect(
            fundsFactory
               .connect(investor1)
               .buyNFT(0, 5, { value: ethers.parseEther("1") })
         ).to.be.revertedWith("NFT type dont exist");
      });
   });

   describe("Investor functions : vote for funds request", function () {
      beforeEach(async function () {
         [admin, researcher1, researcher2, investor1, investor2] =
            await ethers.getSigners();
         fundsFactory = await deployProject();
         await addResearcher(fundsFactory, researcher1);
         await addResearchProject(fundsFactory, researcher1, 0, "10");
         await addRequest(fundsFactory, researcher1, 0, "10");
         await buyNFT(
            fundsFactory,
            investor1,
            0,
            CLASSIC,
            ethers.parseEther("0.1")
         );
      });

      it("emit an event of + vote for funds request", async function () {
         await expect(await fundsFactory.connect(investor1).addVote(0, true))
            .to.emit(fundsFactory, "VoteAdded")
            .withArgs(investor1.address, 0, 0, true);
      });

      it("emit an event of - vote for funds request", async function () {
         await expect(await fundsFactory.connect(investor1).addVote(0, false))
            .to.emit(fundsFactory, "VoteAdded")
            .withArgs(investor1.address, 0, 0, false);
      });

      it("should fail if not buy NFT", async function () {
         await expect(
            fundsFactory.connect(investor2).addVote(0, true)
         ).to.be.revertedWith("You need to buy NFT to vote");
      });

      it("should fail if already vote", async function () {
         await fundsFactory.connect(investor1).addVote(0, true);
         await expect(
            fundsFactory.connect(investor1).addVote(0, true)
         ).to.be.revertedWith("You already vote for this fund request");
      });

      it("should fail if request id dont exist", async function () {
         await expect(
            fundsFactory.connect(investor1).addVote(1, true)
         ).to.be.revertedWith("Fund request id dont exist");
      });

      // TODO
      it("should fail if request is not in progress", async function () {});

      // TODO
      it("should fail if request is already accepted", async function () {});

      it("should fail if request is expired", async function () {
         const oneMonth = 2629743; // seconds in 1 month
         await ethers.provider.send("evm_increaseTime", [oneMonth]);
         await ethers.provider.send("evm_mine");
         await expect(
            fundsFactory.connect(investor1).addVote(0, true)
         ).to.be.revertedWith("Fund request is expired");
      });
   });
});