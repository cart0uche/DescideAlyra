require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: {
      version: "0.8.17",
      defaultNetwork: "localhost",
      settings: {
         optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
         },
      },
   },
   defaultNetwork: "localhost",

   networks: {
      sepolia: {
         url: "https://sepolia.infura.io/v3/" + process.env.INFURA_KEY,
         accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      },
   },
   etherscan: {
      apiKey: {
         sepolia: process.env.ETHERSCAN_API_KEY,
      },
   },
};
