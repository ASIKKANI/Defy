# AgentChain Contracts

This project contains the Solidity smart contracts for **AgentChain**, a platform for on-chain AI agent management and decision logging.

## Contracts

### `AgentChain.sol`

The core contract of the AgentChain ecosystem. It handles:

-   **Agent Registry**: Allows users to propose new AI agents with descriptions and capabilities.
-   **Governance**: Simple owner-based approval system (can be expanded to DAO voting) to authorize agents.
-   **Execution Logging**: Provides an immutable log of AI decision-making. Agents (or their callers) log the "prompt summary", a hash of the result/reasoning, and success status.
-   **Reputation System**: Tracks a basic reputation score for each agent based on execution success.
-   **Financial Execution**: Includes an `executeSwap` function to demonstrate AI-triggered value transfers (currently mocks a SHM to aETH swap).

## Getting Started

### Prerequisites

-   Node.js
-   Hardhat

### Installation

```shell
npm install
```

### Compilation

```shell
npx hardhat compile
```

### Testing

```shell
npx hardhat test
```

### Deployment

To deploy to a network (e.g., Shardeum Sphinx/Mezame):

```shell
npx hardhat run scripts/deploy.js --network shardeum
```
