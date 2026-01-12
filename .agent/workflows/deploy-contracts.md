---
description: How to deploy AgentChain smart contracts to Shardeum
---

Follow these steps to deploy the AgentChain ecosystem to the Shardeum Sphinx testnet:

1. **Open Remix IDE**: Go to [remix.ethereum.org](https://remix.ethereum.org).
2. **Upload Contracts**: Upload all files from the `contracts/` directory.
3. **Compile**:
   - Start with `AgentRegistry.sol`.
   - Compile `DecisionLogger.sol`.
   - Compile `ReputationManager.sol`.
   - Finally, compile `AgentChainHub.sol`.
4. **Deploy**:
   - Use the "Injected Provider" (MetaMask) set to Shardeum Sphinx.
   - Deploy `AgentRegistry`.
   - Deploy `DecisionLogger`.
   - Deploy `ReputationManager`.
   - Deploy `AgentChainHub`, passing the addresses of the three previous contracts as constructor arguments.
5. **Post-Deployment**:
   - Call `ReputationManager.setUpdater()` with the address of the `AgentChainHub`.
   - Register your first agent using `AgentRegistry.registerAgent()`.
6. **Update Frontend**: Update the contract addresses in your frontend configuration.
