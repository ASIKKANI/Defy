# AgentChain Prototype: Detailed Implementation Spec

**Purpose:** This document serves as a comprehensive technical handover for the frontend developer. It details every component, state logic, mock data structure, and styling decision made in the prototype so it can be accurately reconstructed or integrated into the production build.

---

## 1. Project Structure & Key Files

```text
src/
├── App.jsx                 # Main layout controller (Sidebar + Content View). Manages global tab state.
├── App.css                 # Base styles, variables, and animations.
├── Advanced.css            # Styles for new features: Consensus Grid, Subscription Modal, Toggles.
├── main.jsx                # Entry point.
├── components/
│   ├── Sidebar.jsx         # Left navigation. Handles tab switching.
│   ├── AgentDashboard.jsx  # Card grid of agents. Handles "Select" and "Subscribe".
│   ├── InteractionPane.jsx # The core AI chat interface. Handles Simulation, Consensus, & Execution.
│   ├── ActivityView.jsx    # Audit logs. Handles JSON Export & Replay.
│   ├── GovernanceView.jsx  # DAO Voting. Handles Slashing proposals.
│   └── SettingsView.jsx    # Config screen (Mock).
```

---

## 2. Component Deep Dives

### A. `App.jsx` (The Controller)
*   **State:**
    *   `activeTab` (string): 'dashboard' | 'governance' | 'activity' | 'settings'.
    *   `selectedAgent` (null | object): When set, overlays `InteractionPane` on top of the dashboard.
    *   `walletConnected` (bool): Toggles the connect button state.
*   **Logic:**
    *   `renderContent()`: Switch statement that conditionally renders the active view.
    *   **Crucial:** Passing `setSelectedAgent` to `AgentDashboard` is how the user enters the chat flow.

### B. `AgentDashboard.jsx` (The Marketplace)
*   **Data Model (`MOCK_AGENTS`):**
    *   `stake` (string): e.g., "50,000 SHM". Displayed in the `stake-badge`.
    *   `isPremium` (bool): If true, renders Gold styles & Lock icon.
    *   `price` (string): e.g., "100 SHM/mo". Used in modal.
*   **State:**
    *   `subscribingTo` (null | agentObject): Controls the visibility of the **Subscription Modal**.
*   **Modal Logic:**
    *   The modal uses `AnimatePresence` for smooth entry/exit.
    *   Clicking "Pay & Unlock" calls `onSelectAgent` to simulate a successful purchase.

### C. `InteractionPane.jsx` (The AI Core)
This is the most complex component. It manages the multi-step AI workflow.

*   **State Machine (`step`):**
    1.  `'input'`: Initial prompt entry.
    2.  `'interpreting'`: Shows "Thinking Console" animation (2s delay).
    3.  `'consensus_loading'`: Shows "Convening Roundtable" animation (2.5s delay).
    4.  `'consensus_result'`: Shows the 3-card comparison grid.
    5.  `'plan'`: Shows the structured Steps + Gas estimation.
    6.  `'simulation_result'`: Shows Risk Score/PnL (if Simulation toggled).
    7.  `'execution'`: Shows "Transaction Successful" hash.

*   **Key Features:**
    *   **Interpreter (`interpretPrompt`)**:
        *   Simple keyword matching (`lower.includes('yield')`) maps to pre-defined JSON objects (`intent`, `summary`, `steps`, `gas`).
        *   **For Main Frontend:** Replace this mock function with a real API call to your Python/LangChain backend.
    *   **Simulation Toggle (`isSimulation`)**:
        *   Boolean state. If `true`, the "Approve" button turns Blue and routes to `simulation_result`. If `false`, it stays Green/White and routes to `execution`.
    *   **Consensus Flow**:
        *   Triggered by the secondary button with `Users` icon.
        *   Hydrates `interpreterOutput` with hardcoded strategies ("Conservative", "Balanced", "Aggressive") when a card is selected.

### D. `ActivityView.jsx` (The Auditor)
*   **JSON Export (`handleExport`)**:
    *   Constructs a `report` object on the fly using `JSON.stringify`.
    *   Uses a hidden `<a>` tag with `data:text/json` href to force a browser download.
    *   **Important:** The exported JSON includes a mocked `reasoning` field to simulate the "Glass Box" audit.
*   **Forensic Replay (`handleReplay`)**:
    *   Triggered only for transactions with `status: "Failed"`.
    *   Currently uses `window.confirm` and `alert` for the demo.
    *   **For Main Frontend:** This should route to a special version of `InteractionPane` populated with historical block data.

### E. `GovernanceView.jsx` (The DAO)
*   **Slashing Logic**:
    *   Checks `proposal.isSlashing` (boolean).
    *   If true, applies Red border (`borderColor: '#FF3B3B'`) and Red text to the card to highlight the severity.

---

## 3. Styling & CSS Architecture

### Global (`App.css`)
*   **Glassmorphism**: We rely heavily on `var(--glass-bg)` (rgba 255,255,255,0.05) and `backdrop-filter: blur(12px)`.
*   **Text Gradients**: `.text-gradient` uses `-webkit-background-clip: text`.
*   **Lucide Icons**: Used extensively (ShieldCheck, Terminal, Activity) for consistency.

### Advanced Features (`Advanced.css`)
*   **`consensus-grid`**: Flexbox layout for the 3-card view.
*   **`.consensus-card.featured`**: Uses `transform: scale(1.05)` and `z-index: 2` to pop out the center card.
*   **`subscription-modal`**: Fixed positioning with specific `z-index: 1000` to overlay everything.

---

## 4. Integration Guide for "Main" Frontend

To migrate these features to your friend's codebase:

1.  **Copy the CSS**: Merge `Advanced.css` into their global stylesheet.
2.  **Migrate the State Machine**: The `step` logic in `InteractionPane` is critical. Ensure their state manager (Redux/Zustand/Context) can handle these 7 distinct phases.
3.  **Data mapping**:
    *   Ensure their Agent API response includes `isPremium`, `stake`, and `risk` fields.
    *   Ensure their History API response includes `status` and `reasoning` (for the export).
4.  **Mock Replacement**:
    *   `interpretPrompt` -> `POST /api/v1/agent/plan`
    *   `handleConsensus` -> `POST /api/v1/agent/consensus`
    *   `handleApprove` (Simulation) -> `POST /api/v1/shardeum/simulate`
    *   `handleApprove` (Execution) -> `wagmi.writeContract(...)` (Real Wallet)
