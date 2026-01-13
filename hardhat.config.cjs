require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        shardeum_sphinx: {
            url: "https://sphinx.shardeum.org/",
            chainId: 8082,
            accounts: [process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"]
        },
        shardeum_evm: {
            url: "https://lb.shardeum.org/",
            chainId: 8119,
            accounts: [process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"]
        }
    },
};
