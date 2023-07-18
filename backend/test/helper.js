const { ethers } = require("hardhat");

async function deployProject() {
   let DAO = await ethers.getContractFactory("DAO");
   let dao = await DAO.deploy();

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

   return [fundsFactory, researcherRegistry];
}

async function addResearcher(researcherRegistry, researcher) {
   await researcherRegistry.addResearcher(
      researcher.address,
      "dupont",
      "david",
      "archeon"
   );
   await researcherRegistry.changeResearcherStatus(researcher.address, true);
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
      value: ethers.parseEther(value),
   });
}

module.exports = {
   deployProject,
   addResearcher,
   addResearchProject,
   addRequest,
   buyNFT,
};
