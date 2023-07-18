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
         // If not set, it uses the hardhat account 0 private key.
         accounts: [
            process.env.PRIVATE_KEY ??
               "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
         ],
      },
   },
   etherscan: {
      apiKey: {
         sepolia: process.env.ETHERSCAN_API_KEY,
      },
   },
};
