# AgentChain: Advanced System Architecture & Roadmap

This document outlines the Phase 2 architecture for AgentChain, extending the core execution layer with enterprise-grade safety, governance, and monetization features.

## 1. High-Level System Architecture

The advanced system introduces a **"Safety Sandwich"** architecture:
1.  **Pre-Execution Layer (Shadow Mode & Consensus)**: No transaction is formed until safety is proven.
2.  **Execution Layer (The Core)**: The existing verified prompt-to-chain pipeline.
3.  **Post-Execution Layer (Audit & Replay)**: Immutable logging and failure analysis.

---

## 2. Feature Implementation Breakdown

### A. Simulation Mode (Shadow Mode)
*Use Case:* User wants to test a strategy without spending gas or risking funds.

*   **Frontend**: Toggle switch "Simulate Only" in `InteractionPane`.
*   **AI Logic**: 
    1.  Fetch real Read-Only data (Price, APY).
    2.  Simulate Write actions using `eth_call` (or local fork) instead of `eth_sendTransaction`.
    3.  Calculate expected PnL and Max Drawdown.
*   **Output**: A "Hypothetical Receipt" showing what *would* have happened.

### B. Multi-Agent Consensus (The "Roundtable")
*Use Case:* High-value transactions (>1000 SHM) require agreement from disparate AI models to prevent hallucinations.

*   **Frontend**: Split-screen view in `InteractionPane` showing 3 Agent Cards.
*   **Logic**:
    *   Agent A (Conservative): "Allocate 50% to Aave."
    *   Agent B (Aggressive): "Allocate 80% to Aave."
    *   Agent C (Auditor): "Risk allows max 60%."
*   **Consensus Engine**: Aggregates plans. If deviation > 5%, pause for manual user selection.

### C. Agent Staking & Slashing (Economic Security)
*Use Case:* Prevent spam agents and punish malicious behavior.

*   **Smart Contract (`AgentRegistry.sol` Update)**:
    *   `registerAgent` requires `msg.value >= MIN_STAKE` (e.g., 1000 SHM).
    *   `slashStake(agentId)`: Callable by Governance DAO to burn/seize tokens.
    *   `unstake()`: Subject to a 7-day unbonding period.

### D. Prompt Template Library
*Use Case:* Reduce "Prompt Engineering" friction for retail users.

*   **Structure**: On-chain or IPFS-stored JSON schema.
    ```json
    {
      "id": "yield-farm-protection",
      "name": "Yield Farm with Stop Loss",
      "template": "Farm {{token}} on {{protocol}} but withdraw if price drops below {{price}}",
      "params": ["token", "protocol", "price"]
    }
    ```
*   **UI**: "One-Click Strategies" carousel on the Dashboard.

### E. Exportable Audit Reports
*Use Case:* Institutional users need proof of diligence.

*   **Data Generation**: Aggregates `DecisionLogger` events + Off-chain AI reasoning logs.
*   **Format**: PDF generation client-side (`jspdf`).
*   **Content**:
    *   Timestamp & Hash
    *   Natural Language Prompt
    *   Interpreted Plan
    *   MCP Data Snapshot (Prices at the exact second of execution)

### F. Failure Replay Mode
*Use Case:* Debugging why an agent failed or made a suboptimal trade.

*   **Logic**:
    1.  User clicks "Replay" on a Failed Activity log.
    2.  App hydrates `InteractionPane` with the historical *Inputs* (Prompt + Params).
    3.  App mocks the MCP tools to return the *Historical Data* (not current data).
    4.  User sees the exact reasoning path the AI took.

---

## 3. Data Flow Diagrams

### Simulation vs. Execution
```
User Prompt -> [Intent Classifier]
      |
      +--> IF [Simulation Mode]:
      |       -> fetch_mcp_data(readonly)
      |       -> simulate_tx(local_fork)
      |       -> Return "Hypothetical Result" (Green UI)
      |
      +--> IF [Live Mode]:
              -> fetch_mcp_data(readonly)
              -> Generate Calldata
              -> [User Wallet Sign]
              -> Smart Contract Execution (Red UI)
```

### Consensus Flow
```
User Prompt -> [Consensus Orchestrator]
      |
      +-> [Agent A] -> Plan A (Risk Score: 10)
      +-> [Agent B] -> Plan B (Risk Score: 15)
      +-> [Agent C] -> Plan C (Risk Score: 12)
      |
      V
[Consensus Engine] -> Compare Plans
      |
      +--> IF Match > 90%: Auto-merge & Present
      +--> IF Mismatch: Show "Conflict" UI -> User decides
```

---

## 4. Smart Contract Responsibilities (Advanced)

| Contract | New Responsibility | Storage Impact |
| :--- | :--- | :--- |
| **AgentRegistry** | Staking, Subscription Pricing | `mapping(uint => uint) stakes;` `mapping(uint => uint) prices;` |
| **AgentGovernance** | Slashing Proposals, Registry Upgrades | `SlashProposal struct` |
| **SubscriptionManager** | Manage user access to premium agents | `mapping(user => mapping(agent => expiry))` |
| **AuditOracle** | (Optional) Store hashes of PDF reports | `mapping(txHash => reportHash)` |

---

## 5. Hackathon & Demo Strategy

To showcase these advanced features within the hackathon limits:

### What to Build (Real)
1.  **Simulation Mode UI**: It's a low-hanging fruit. Just add the toggle and change the button color/label.
2.  **Audit Report Button**: A simple JSON export of the decision log is sufficient to prove the concept.
3.  **Template Library**: Hardcode 3-4 templates in the Frontend.

### What to Mock (Smoke & Mirrors)
1.  **Multi-Agent Consensus**: Don't run 3 LLMs. Just hardcode 3 varying JSON responses for a specific demo prompt (e.g., "Analyze Risk").
2.  **Staking/Slashing**: Use the `ReputationManager` as a proxy. If Reputation drops < 10, treat it as "Slashed".
3.  **Subscription Payments**: Mock the unlock flow. Clicking "Subscribe" just flips a local state booelean.

### Demo Flow Update
1.  **Start in Simulation Mode**: Show a "Dry Run" of a risky trade. See the "Hypothetical Success".
2.  **Switch to Live**: Toggle the switch.
3.  **Use a Template**: Click "Liquid Staking Safety" template instead of typing.
4.  **Execute**: Standard flow.
5.  **Audit**: Go to Activity, click "Export Proof" on the transaction.

---

**Architecture Status**: Defined.
**Next Steps**: Implementation of Phase 2 Frontend components (Template Library, Simulation Toggle, Audit Export).
