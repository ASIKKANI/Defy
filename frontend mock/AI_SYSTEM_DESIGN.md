# AgentChain AI System Design: Transparent Intent Engine

**Objective**: Build a deterministic, explainable AI system that bridges natural language and on-chain execution using the Model Context Protocol (MCP).

---

## 1. System Architecture

The AgentChain AI system is organized as a **"Chain of Reasoning"** where each stage is isolated for auditability.

### Core Modules
1. **The Intent Interpreter**: Classifies the prompt (Transaction vs. Info) and extracts parameters.
2. **MCP Orchestrator**: Manages connections to external data sources (Etherscan, CoinGecko, DeFiLlama).
3. **The Strategy Planner**: Generates a step-by-step execution roadmap based on MCP data.
4. **Explainability Engine**: Translates raw data and strategies into human-justified reasoning.
5. **Payload Builder**: Formats the final output for the `AgentChainHub` smart contract.

---

## 2. Prompt-to-Execution Pipeline

### Step 1: Intent Interpretation
**Input**: `"Compound my staking rewards if rewards > 10 SHM"`
**Logic**: 
- **Entity Extraction**: Action=`Compound`, Token=`SHM`, Threshold=`10`.
- **Classification**: `STATE_CHANGING` (Write).
- **Required Data**: `current_rewards`, `gas_cost`.

### Step 2: MCP Data Fetching
The Orchestrator calls specific MCP tools:
- `mcp-shardeum-rpc:get_rewards(wallet_addr)`
- `mcp-price-oracle:get_asset_price("SHM")`

### Step 3: Execution Plan Generation
**Structure**:
1. **READ**: Check current pending rewards on Shardeum.
2. **CALCULATE**: Check if `rewards > threshold`.
3. **ESTIMATE**: Get current gas fee for `claimRewards` + `stakeRewards`.
4. **EXECUTE**: Call `agent-hub:executeAction` with encoded function calls.

---

## 4. MCP Tool Interface Definitions

To maintain determinism, agents use standard interfaces:

```typescript
interface MCPTools {
  // Financial Data
  get_token_price(symbol: string): Promise<number>;
  get_pool_liquidity(pool_id: string): Promise<LiquidityData>;
  
  // Wallet/Chain Data
  get_balance(address: string, token: string): Promise<bigint>;
  get_gas_estimate(call_data: string): Promise<number>;
  
  // Interaction
  simulate_transaction(call_data: string): Promise<SimulationResult>;
}
```

---

## 5. Explainability Output Format

The `Explainability Engine` must produce a structured JSON that corresponds to what the user sees in the **Execution Plan Preview** UI.

```json
{
  "summary": "Reinvesting current rewards to maximize compounding interest.",
  "reasoning": [
    {
      "step": "Yield Verification",
      "logic": "Target APR of 12% is currently higher than the base rate of 8%.",
      "data_source": "mcp-shardeum-staking-oracle"
    },
    {
      "step": "Profitability Check",
      "logic": "Rewards (12.5 SHM) exceed transaction cost (0.005 SHM) by 2500x.",
      "evidence": " rewards_val > (gas_val * 20)"
    }
  ],
  "safety_signals": {
    "is_cost_bearing": true,
    "risk_score": "low",
    "confidential_params_used": ["max_slippage"]
  }
}
```

---

## 6. Safety & Guardrails

### Execution Limits
- **Slippage Guard**: Automatically injects a maximum slippage parameter (e.g., 0.5%) into every plan.
- **Gas ceiling**: Rejects any plan where gas > 1% of the transaction value.

### Ambiguity Handling
If the prompt is vague (e.g., "Do something with my SHM"), the agent returns a `CLARIFICATION_REQUIRED` status instead of a plan.

---

## 7. Blockchain Integration

The AI system produces two primary outputs for the Smart Contract Layer:

1. **`planHash`**: `keccak256(JSON.stringify(full_execution_plan))`
   - Proves the on-chain action exactly matches what the AI proposed.
2. **`promptHash`**: `keccak256(user_prompt)`
   - Anchors the original intent without exposing the text publically on-chain (GDPR/Privacy).

---

## 8. Hackathon Demo Strategy (Mock vs. Real)

| Component | Strategy | Implementation |
| :--- | :--- | :--- |
| **Intent Parsing** | **Mixed** | Use a simple regex-based parser for "Supported Keywords" to ensure 100% demo reliability. |
| **MCP Integration** | **Mocked** | Return static JSON values for Price/Liquidity but use real Shardeum RPC for Wallet Balance. |
| **Logic Reasoning** | **Real** | Dynamically generate human-readable strings based on the input parameters. |
| **Payload Generation** | **Real** | Produce the actual `bytes32` hashes used by the `DecisionLogger` contract. |

---

### Pro-Tip for the Build:
*Focus on the **"AI interpreting intent..."** animation in the UI. During this phase, log the "Thinking Steps" (e.g., `Querying CoinGecko...`, `Simulating Swap...`) to the console box to build trust with the judges.*
