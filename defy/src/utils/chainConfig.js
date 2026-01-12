export const SHARDEUM_CONFIG = {
    chainId: "0x1f92", // 8082 in hex (Sphinx 1.X)
    chainName: "Shardeum Sphinx 1.X",
    rpcUrls: ["https://sphinx.shardeum.org/"],
    blockExplorerUrls: ["https://explorer-sphinx.shardeum.org/"],
    nativeCurrency: {
        name: "SHM",
        symbol: "SHM",
        decimals: 18,
    },
};

export const SHARDEUM_EVM_CONFIG = {
    chainId: "0x1fb7", // 8119
    chainName: "Shardeum EVM Testnet",
    rpcUrls: ["https://lb.shardeum.org/"], // Using the LB as per user CLI
    blockExplorerUrls: ["https://explorer-evm.shardeum.org/"],
    nativeCurrency: {
        name: "SHM",
        symbol: "SHM",
        decimals: 18,
    },
};

// Defaulting to the one used in the user's existing code (8119) for consistency
export const ACTIVE_CHAIN = SHARDEUM_EVM_CONFIG;
