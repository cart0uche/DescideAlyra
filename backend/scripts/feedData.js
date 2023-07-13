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
   await fundsFactory.addResearchProject(
      "Building a low-cost DIY bioreactor system for sustainable microbial cultivation",
      "Our project aims to develop a food-grade, low-cost, bubble column bioreactor system for easy and sustainable cultivation of filamentous fungi, yeast, bacteria, and algae. The bioreactor system will be designed to cost less than $300, becoming accessible to anyone interested in sustainable agriculture, food security, and biotech. By sharing our project outcomes and resources, we aim to inspire others to build their own bioreactors and explore the potential of microbial cultivation.",
      "bafkreiffgpijj4jqed7xjlkd5mamyuttpkm42nh6v6ef2ncd5qzq6jfk7u",
      10,
      "bafybeig3byiidfkljdaw2uwj6wq2nn36ejibffzvifxp2aucbyonw7igsa"
   );
   await fundsFactory.addResearchProject(
      "Creating a field dissection microscope that can be built in the field",
      "Microscopes are one of the most important scientific tools. There are no shortage of low-cost microscope designs. However, different experiments need different types of microscope. Field microscopes must be robust enough for tough conditions, ideally they should be repairable in the field.",
      "bafkreig5sjnpv7p43awxng4ytane7czikkozlamqr5uzfh3ivos36k7dby",
      10,
      "bafybeig3byiidfkljdaw2uwj6wq2nn36ejibffzvifxp2aucbyonw7igsa"
   );
   await fundsFactory.addResearchProject(
      "Developing a low-cost, high-sensitivity solution for phage concentration detection",
      "Phages are hard-to-detect bacteria viruses, crucial for understanding microbial ecosystems. We aim to characterise phage presence and abundance by developing a portable, low-cost, open-source instrument for microfluidic droplet ddPCR based on a UC2 light sheet microscope. This tool will democratise access to phage quantification, advancing research in diagnostics, ecology, and phage therapy, transforming our understanding of viral infections. ",
      "bafkreig2v2q7qg7iilltnpu33577dwbb6ouefarvz2bd7xvvw4q2udyoi4",
      10,
      "bafybeig3byiidfkljdaw2uwj6wq2nn36ejibffzvifxp2aucbyonw7igsa"
   );

   // Valid first project
   await fundsFactory.validResearchProject(0);
   await fundsFactory.validResearchProject(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});
