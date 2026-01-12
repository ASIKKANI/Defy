# AgentChain Smart Contract Architecture

**Network:** Shardeum (Base Layer) + Inco (Confidential Computation Layer)
**Standard:** EVM Compatible (Solidty ^0.8.20)

## 1. Architecture Overview

The system consists of a hub-and-spoke model where the **AgentRegistry** functions as the source of truth. The **ExecutionRouter** acts as the user gateway, handling both public transaction data and confidential encrypted parameters (via Inco).

### Core Components
1.  **`AgentRegistry.sol`**: The "License Authority" for agents.
2.  **`AgentGovernance.sol`**: The DAO voting mechanism to whitelist agents.
3.  **`ConfidentialExecutor.sol`**: The Inco-enabled contract for privacy-preserving checks.
4.  **`DecisionLogger.sol`**: The "Black Box" recorder for transparency.
5.  **`ReputationManager.sol`**: Dynamic scoring system.

---

## 2. Contract Specifications

### A. AgentRegistry.sol
**Responsibility:** Maintains the whitelist of approved agents and their metadata pointers.

**Storage Schema:**
```solidity
struct Agent {
    uint256 id;
    address owner;         // Developer wallet
    string metadataCID;    // IPFS hash (Name, Purpose, Icon)
    uint8 riskLevel;       // 1=Low, 2=Med, 3=High
    bool isActive;         // Toggled by Governance
    uint256 registeredAt;
}
mapping(uint256 => Agent) public agents;
```

**Key Functions:**
- `registerAgent(metadataCID, owner)`: Request to list (Allocates ID, sets status to Pending).
- `updateStatus(agentId, bool status)`: Only callable by Governance.
- `getAgent(agentId)`: Returns public info.

**Events:**
- `AgentRegistered(uint256 indexed id, address owner)`
- `AgentStatusUpdate(uint256 indexed id, bool isActive)`

---

### B. AgentGovernance.sol
**Responsibility:** A streamlined governance execution engine optimized for hackathons (Simple Majority).

**Storage Schema:**
```solidity
struct Proposal {
    uint256 id;
    uint256 agentId;
    bool approve;          // True = Whitelist, False = Blacklist
    uint256 votesFor;
    uint256 votesAgainst;
    uint256 deadline;
    bool executed;
}
```

**Hackathon Shortcuts:**
- Use a `mapping(address => bool) isMember` simple allowlist instead of full ERC20 token voting for simpler demo setup.
- `vote(proposalId, bool support)`

---

### C. ConfidentialExecutor.sol (The Privacy Layer)
**Responsibility:** Handles the "Safe Execution" logic. This contract would ideally reside on Inco or use FHE precompiles on a compatible chain.

**Storage Schema:**
```solidity
// Uses FHE libraries (e.g., tfhe-rs solidity bindings)
// mapping(address => euint32) private userRiskLimits;
```

**Execution Flow (Hybrid):**
1.  **User** submits transaction with:
    -   Public Args: `targetContract`, `calldata`
    -   Private Args: `encryptedAmount`, `encryptedSlippage`
2.  **Contract** decrypts/re-encrypts logic (Hypothetical FHE logic):
    ```solidity
    function executeConfidentially(
        bytes calldata payload, 
        bytes calldata encryptedParams
    ) public {
        // 1. Decrypt params homomorphically (verify against limits)
        euint32 amount = TFHE.asEuint32(encryptedParams);
        euint32 limit = userRiskLimits[msg.sender];
        
        // 2. Assert limit > amount (Computed on encrypted data)
        TFHE.req(TFHE.le(amount, limit)); 
        
        // 3. If pass, emit event for Oracle/Relayer to execute actual tx
        emit SecureExecutionRequest(...);
    }
    ```

**Events:**
- `ExecutionRequested(uint256 requestId, address indexed user, uint256 agentId)`
- `PrivacyCheckPassed(uint256 requestId)`

---

### D. DecisionLogger.sol
**Responsibility:** Immutable append-only log of *why* an action was taken.

**Storage Schema:**
```solidity
struct Log {
    uint256 agentId;
    bytes32 promptHash;    // Hash of user prompt (privacy)
    bytes32 planHash;      // Hash of the execution plan displayed in UI
    string mcpSources;     // Delimited string of source IDs (e.g., "coingecko,shardeum-rpc")
    uint256 timestamp;
}
```

**Key Functions:**
- `logDecision(agentId, promptHash, planHash, references)`: Called by Executor.

**Querying:**
- The Decision Feed UI queries `LogAdded` events from this contract to build the timeline.

---

### E. ReputationManager.sol
**Responsibility:** Quantifies trust. Scores update based on "Signals" (Successful txs vs Reverts).

**Storage Schema:**
```solidity
mapping(uint256 => uint256) public scores; // 0-100
mapping(uint256 => uint256) public txCount;
mapping(uint256 => uint256) public failureCount;
```

**Logic:**
- Start at 50.
- `+1` for every 10 successful executions.
- `-5` for every generic failure.
- `-50` (Slashing) for reported malicious behavior (Governance driven).

---

## 3. Execution Flow (The "Happy Path")

1.  **User** types prompt in frontend ("Buy SHM if price < $1.50").
2.  **Frontend** gets Execution Plan from Agent API.
3.  **User** clicks "Approve in Wallet".
4.  **Wallet** sends TX to `ConfidentialExecutor.sol`:
    -   `agentId`: 1
    -   `encryptedLimit`: [CIPHERTEXT]
5.  **Executor Contract**:
    -   Checks `AgentRegistry` -> Is Agent 1 Active? (Revert if No).
    -   Performs FHE check on limits.
    -   Calls `DecisionLogger.logDecision(...)`.
    -   Emits `Execute` event.
6.  **Off-chain Relayer** (or internal logic) performs the swap on Shardeum.
7.  **Callback** updates `ReputationManager` with success/fail.

---

## 4. Hackathon Mocking Strategy

Since deploying a full FHE + Shardeum cross-chain setup is heavy for a hackathon:

1.  **Registry & Logger**: **Deploy Real**. These are cheap EVM contracts. They provide the "Trust Attributes" essential for the UI.
2.  **Encrypted Execution**: **Mock the FHE check**.
    -Instead of real `TFHE.le()`, just pass a standard `bool` flag `_simulateEncryptedCheck = true` in the contract to emit the "Privacy Preserved" event.
    -   *Why?* It demonstrates the architectural intent without debugging obscure FHE compiler errors during a hackathon.
3.  **Governance**: **Authorized Deployer**.
    -   One wallet (you) acts as the DAO. Don't build a voting frontend. Just have a script that "approves" agents.

---

## 5. Security & Trust Signals
-   **Verification**: The `AgentRegistry` ensures no phishing agents can impersonate real ones.
-   **Transparency**: `DecisionLogger` hash-linking ensures the AI can't change its "Reasoning" associated with a transaction later.
