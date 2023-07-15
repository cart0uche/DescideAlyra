require("@nomicfoundation/hardhat-toolbox");

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
   namedAccounts: {
      deployer: {
         // By default, it will take the first Hardhat account as the deployer
         default: 0,
      },
   },
   etherscan: {
      apiKey: {
         sepolia: process.env.ETHERSCAN_API_KEY,
      },
   },
};
