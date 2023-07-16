const hre = require("hardhat");

async function main() {
   const dao = await hre.ethers.deployContract("DAO");
   await dao.waitForDeployment();
   console.log(`DAO deployed to ${dao.target}`);

   const researcherResitry = await hre.ethers.deployContract(
      "ResearcherRegistry"
   );
   await researcherResitry.waitForDeployment();
   console.log(`ResearcherRegistry deployed to ${researcherResitry.target}`);

   const fundsFactory = await hre.ethers.deployContract("FundsFactory", [
      dao.target,
      researcherResitry.target,
   ]);
   await fundsFactory.waitForDeployment();

   daoContract = await hre.ethers.getContractAt("DAO", dao.target);
   await daoContract.setFactoryAddress(fundsFactory.target);

   regsiterContract = await hre.ethers.getContractAt(
      "ResearcherRegistry",
      researcherResitry.target
   );
   await regsiterContract.setFactoryAddress(fundsFactory.target);

   console.log(`FundsFactory deployed to ${fundsFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});
