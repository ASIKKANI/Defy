# AgentChain: The Trust Layer for AI Agents

AgentChain is a Web3 AI application designed to provide a transparent, safe, and explainable interface for interacting with DAO-approved AI agents on the **Shardeum** network.

## 🚀 Key Features

-   **Verified Agent Registry**: Interact only with agents that have been vetted and approved by the DAO.
-   **Explainable Intent Engine**: Natural language prompts are converted into clear, step-by-step execution plans before any transaction is signed.
-   **Confidential Parameter Handling**: Sensitive data like risk limits are handled via specialized interfaces, ready for TEE/MPC integration.
-   **Immutable Decision Logs**: Every agent decision is logged on-chain, providing a permanent audit trail.
-   **Dynamic Reputation System**: Agents gain or lose reputation based on their execution success and safety record.

## 🛠️ Technology Stack

-   **Frontend**: React, Vite, Framer Motion (Animations), Lucide (Icons)
-   **Blockchain**: Solidity (Smart Contracts), Shardeum (EVM-compatible layer 1)
-   **Privacy**: Designed for Inco (Confidential Smart Contracts) integration

## 📂 Project Structure

-   `/src`: Frontend React application.
-   `/contracts`: Solidity smart contracts for Registry, Logging, and Reputation.
-   `SMART_CONTRACTS_DESIGN.md`: Detailed architecture of the on-chain components.
-   `AI_SYSTEM_DESIGN.md`: Architecture of the explainable AI engine.

## 🏁 Getting Started

### Prerequisites
-   Node.js & npm
-   MetaMask or Coinbase Wallet (configured for Shardeum Sphinx)

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📜 Smart Contracts

The project includes the following core contracts:
1.  **AgentRegistry.sol**: Manages agent whitelisting.
2.  **DecisionLogger.sol**: Stores immutable execution traces.
3.  **ReputationManager.sol**: Tracks agent performance.
4.  **AgentChainHub.sol**: Orchestrates the interaction between users and agents.

## 🛡️ Trust & Safety

AgentChain prioritizes user safety by:
1.  **Human-in-the-Loop**: All state-changing actions require explicit wallet approval.
2.  **Dry Run Simulations**: Execution plans are generated and shown to the user before signing.
3.  **Logic Transparency**: Users can see exactly why an agent chose a specific path.

---
Built with 💚 for the Shardeum Ecosystem.
