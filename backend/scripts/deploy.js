const hre = require("hardhat");

async function main() {
   const dao = await hre.ethers.deployContract("DAO");
   await dao.waitForDeployment();
   console.log(`DAO deployed to ${dao.target}`);

   const fundsFactory = await hre.ethers.deployContract("FundsFactory", [
      dao.address,
   ]);
   await fundsFactory.waitForDeployment();

   await dao.setFactory(fundsFactory.target);
   console.log(`FundsFactory deployed to ${fundsFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});
