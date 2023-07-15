const { ethers } = require("hardhat");

async function deployProject() {
   let DAO = await ethers.getContractFactory("DAO");
   let dao = await DAO.deploy();
   let FundsFactory = await ethers.getContractFactory("FundsFactory");
   let fundsFactory = await FundsFactory.deploy(dao.target);
   return fundsFactory;
}

async function addResearcher(fundsFactory, researcher) {
   await fundsFactory.addResearcher(
      researcher.address,
      "dupont",
      "david",
      "archeon"
   );
   await fundsFactory.changeResearcherStatus(researcher.address, true);
   await fundsFactory.changeResearcherStatus(researcher.address, true);
}

async function addResearchProject(fundsFactory, researcher, index, amount) {
   await fundsFactory
      .connect(researcher)
      .addResearchProject(
         "projet" + (index + 1),
         "description" + (index + 1),
         "image" + (index + 1),
         ethers.parseEther(amount),
         "uri" + (index + 1)
      );
   await fundsFactory.validResearchProject(index);
}

async function addRequest(fundsFactory, researcher, index, amount) {
   await fundsFactory
      .connect(researcher)
      .createFundsRequest(index, ethers.parseEther(amount), "description");
}

async function buyNFT(fundsFactory, investor, projectIndex, nftType, value) {
   await fundsFactory.connect(investor).buyNFT(projectIndex, nftType, {
      value: value,
   });
}

module.exports = {
   deployProject,
   addResearcher,
   addResearchProject,
   addRequest,
   buyNFT,
};
