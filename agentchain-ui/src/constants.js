export const AGENT_CHAIN_ADDRESS = "0x04AbE123D31971575Cd94850752f2C59faf92a26";

export const AGENT_CHAIN_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "AgentApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            }
        ],
        "name": "AgentProposed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "agentId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "resultHash",
                "type": "string"
            }
        ],
        "name": "DecisionLogged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "approveAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getAgent",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "capabilities",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reputation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "proposer",
                        "type": "address"
                    }
                ],
                "internalType": "struct AgentChain.Agent",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_agentId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_promptSummary",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_resultHash",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "_isSuccess",
                "type": "bool"
            }
        ],
        "name": "logExecution",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_capabilities",
                "type": "string"
            }
        ],
        "name": "proposeAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "agentCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "logs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "agentId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "promptSummary",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "resultHash",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isSuccess",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLogsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
export const DEX_ROUTER_ADDRESS = "0x8fe9f0414FD1BF8eB3d85168d20182C8660291fF";
export const WSHM_ADDRESS = "0x02244BADFdCF03d8Ed9d7613AeEC311Ca290E423";
export const STUB_TOKEN_ADDRESS = "0x4feB6db1210673D84cd3726d2eAF0Bd59A36330e";

export const UNISWAP_ROUTER_ABI = [
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];
