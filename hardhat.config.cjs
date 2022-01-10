require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
console.log(process.env.ALCHEMY_API_URL);
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
    sources: './src/contracts'
  },
  networks: {
    hardhat: {
      chainId: 1337 // To be able to work with metamask
    },
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_RINKEBY_ACCOUNT_KEY]
    }
  }
};
