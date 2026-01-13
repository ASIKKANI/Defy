# AgentChain: Confidential AI Trading Agent
### *The Ultimate Privacy-First DeFi Assistant*

AgentChain is a state-of-the-art web application that combines **Local LLM Intelligence (Ollama)**, **High-Performance Scaling (Shardeum)**, and **Fully Homomorphic Encryption (Inco Lightning)** to create a private, autonomous trading experience.

---

## 🚀 1. Core Features

### AI-Driven Blockchain Interaction
- **Natural Language Execution**: Send funds, check balances, and analyze market sentiment via a chat interface.
- **Model Context Protocol (MCP)**: A modular tool system that allows the AI to fetch real-time data and execute on-chain actions.

### Privacy & Stealth Mode (Powered by Inco)
- **Private Instruction Layer**: Encrypts sensitive agent "thoughts" and "reasoning" so your trading strategy remains hidden from front-runners and bots.
- **On-chain Audit Trail**: Logs encrypted proofs of every AI action to the blockchain. You have a permanent record that only *you* can decrypt.
- **FHE Strategy Hashing**: Automatically converts plain-text AI logic into 256-bit numeric signatures for unbreakable security.

### Intelligent Public Logging
- **Human-Readable Public Metadata**: Unlike standard transactions that show `0x` (empty) in the data field, AgentChain attaches the AI's intent in readable hex, making the Shardeum Explorer useful for auditability.
- **Dual-Execution Paths**: Dynamic switching between **Public Transfers** (transparent) and **Stealth Executions** (encrypted) based on your prompt.

### Real-Time Market Data
- **Coinbase Integration**: Live Spot, Buy, and Sell prices for ETH/BTC/SHM.
- **DexScreener Liquidity**: Real-time pool depth and volume analysis for decentralized assets.

---

## 🛠 2. Tech Stack

- **Frontend**: React.js 18 + Vite (High-performance HMR).
- **Styling**: TailwindCSS (Modern, responsive UI).
- **Blockchain (L1/L2)**:
  - **Shardeum Sphinx/EVM**: For low-fee, high-throughput transactions.
  - **Inco Lightning**: For specialized Fully Homomorphic Encryption (FHE).
- **Encryption Engine**: `@inco/js` SDK (Lightning ROD integration).
- **Smart Contracts**: Solidity (Standard and Confidential logging patterns).
- **Web3 Provider**: Ethers.js v6.
- **AI Engine**: Ollama (Running local Llama models for 100% data sovereignity).

---

## 💻 3. Infrastructure & Terminal Commands

To run the full suite, you need three main components active:

### Terminal 1: Frontend Development Server
Starts the React UI and the Vite dev environment.
```bash
npm run dev -- --force
```

### Terminal 2: AI Gateway (Proxy)
Orchestrates requests between the browser, Ollama, and external APIs.
```bash
node gateway/index.js
```

### Terminal 3: Local Inco Node (Optional but Recommended)
For local encryption/decryption without needing a testnet.
```bash
docker compose up -d
```

### Terminal 4: Ollama LLM Server
Ensure your local AI is ready to process thoughts.
```bash
ollama run llama3
```

---

## 📂 4. Project Structure (Key Files)

- `src/hooks/useAgent.js`: The "Brain". Manages AI prompts, tool selection, and the encryption/blockchain bridge.
- `src/services/inco-service.js`: The "Vault". Handles all FHE encryption, decryption, and SDK initialization.
- `src/services/mcp-tools.js`: The "Hands". Defines all available actions the AI can take.
- `contracts/DecisionLogger.sol`: The "Ledger". A Solidity contract for storing public and private proofs.
- `docker-compose.yml`: Handles the local Inco Lightning node instance.

---

## 🔒 5. Privacy Summary
| Feature | Public Transaction | Private (Inco) Transaction |
| :--- | :--- | :--- |
| **Recipient** | Visible (Explorer) | **Hidden** (Logged to Vault) |
| **Amount** | Visible (Native Balance) | **Hidden** (If using Confidential ERC20) |
| **Strategy ("Why")** | Readable (Hex on Explorer) | **Encrypted** (Unbreakable Ciphertext) |
| **Audit Status** | Public | **Private (Owner Only)** |
