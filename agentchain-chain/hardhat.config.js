require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.19",
    networks: {
        shardeum: {
            url: "https://api-mezame.shardeum.org",
            chainId: 8119,
            accounts: ["0xc628417786eaaa2bbab566904e4c668079c5894dda76f79fd4c5d97d583c9dc8"]
        }
    }
};
