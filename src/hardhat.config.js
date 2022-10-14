require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "ganache",
  networks: {
    hardhat: {
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["500c65945d3030dcd62c541b7f50351694c8e008acf6c71cb471f8ef305b6341"]
    }
  },
  solidity: "0.8.17",

};
