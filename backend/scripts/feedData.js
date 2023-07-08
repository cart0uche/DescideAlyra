const hre = require("hardhat");

async function main() {
   const fundsFactory = await ethers.getContractAt(
      "FundsFactory",
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
   );

   await fundsFactory.addResearcher(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "David",
      "Klein",
      "Sopra"
   );
   await fundsFactory.addResearcher(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "Kevin",
      "Brun",
      "Altor"
   );
   await fundsFactory.addResearcher(
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "Julie",
      "Erié",
      "Suram"
   );
   await fundsFactory.addResearcher(
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      "Claude",
      "Rian",
      "SMB"
   );
   await fundsFactory.addResearcher(
      "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "Fabien",
      "Laurent",
      "PSA"
   );
   await fundsFactory.addResearcher(
      "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "Pierre",
      "Roma",
      "Gamma"
   );

   // Valid first researcher
   const transaction = await fundsFactory.changeResearcherStatus(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      true
   );

   await transaction.wait();

   // Create projects
   await fundsFactory.addResearchProject(1000, "URI");
   await fundsFactory.addResearchProject(10000, "URI2");
   await fundsFactory.addResearchProject(100000, "URI3");

   // Valid first project
   await fundsFactory.validResearchProject(0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});
