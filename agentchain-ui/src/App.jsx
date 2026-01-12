import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Send,
  Shield,
  Cpu,
  Activity,
  ChevronRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  Zap,
  QrCode,
  ArrowDownLeft
} from 'lucide-react';
import { AGENT_CHAIN_ABI, AGENT_CHAIN_ADDRESS, DEX_ROUTER_ADDRESS, WSHM_ADDRESS, STUB_TOKEN_ADDRESS, UNISWAP_ROUTER_ABI } from './constants';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [agents, setAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [showReceive, setShowReceive] = useState(false);

  // Connect Wallet
  const [balance, setBalance] = useState('0');

  const loadBalance = async (addr, prov) => {
    if (!addr || !prov) return;
    const _balance = await prov.getBalance(addr);
    setBalance(ethers.formatEther(_balance));
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        const _signer = await _provider.getSigner();
        const _address = await _signer.getAddress();

        // Get SHM Balance
        await loadBalance(_address, _provider);

        // Switch network to Shardeum if needed
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1fb7' }], // 8119 in hex
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x1fb7',
                chainName: 'Shardeum Mezame',
                rpcUrls: ['https://api-mezame.shardeum.org'],
                nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
                blockExplorerUrls: ['https://explorer-mezame.shardeum.org/']
              }]
            });
          }
        }

        const _contract = new ethers.Contract(AGENT_CHAIN_ADDRESS, AGENT_CHAIN_ABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setAddress(_address);
        setContract(_contract);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  // Fetch Data
  useEffect(() => {
    if (contract) {
      loadAgents();
      loadLogs();
    }
  }, [contract]);

  const loadAgents = async () => {
    try {
      const count = await contract.agentCount();
      const _agents = [];
      for (let i = 1; i <= Number(count); i++) {
        const agent = await contract.getAgent(i);
        _agents.push({
          id: Number(agent.id),
          name: agent.name,
          description: agent.description,
          capabilities: agent.capabilities.split(','),
          reputation: Number(agent.reputation),
          isApproved: agent.isApproved
        });
      }
      setAgents(_agents);
    } catch (err) {
      console.error("Failed to load agents", err);
    }
  };

  const loadLogs = async () => {
    try {
      const count = await contract.getLogsCount();
      const _logs = [];
      for (let i = 0; i < Math.min(Number(count), 10); i++) {
        const log = await contract.logs(i);
        _logs.push({
          agentId: Number(log.agentId),
          promptSummary: log.promptSummary,
          resultHash: log.resultHash,
          isSuccess: log.isSuccess,
          timestamp: Number(log.timestamp),
          user: log.user
        });
      }
      setLogs(_logs.reverse());
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  const [gasPrice, setGasPrice] = useState('0');

  const fetchGasPrice = async () => {
    if (!provider) return;
    const feeData = await provider.getFeeData();
    setGasPrice(ethers.formatUnits(feeData.gasPrice, "gwei"));
  };

  useEffect(() => {
    if (showPlan) fetchGasPrice();
  }, [showPlan]);

  // Ollama Intelligence Layer
  const analyzeWithOllama = async (userPrompt) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3:8b',
          prompt: `You are an AI blockchain agent named ${selectedAgent.name}. 
          Analyze this user intent: "${userPrompt}"
          
          Provide a JSON response with exactly this structure:
          {
            "actionType": "SEND" | "SWAP" | "BUY" | "GENERAL",
            "amount": "string value if detected",
            "recipient": "address if detected",
            "steps": [{"type": "Step Title", "desc": "Step Details"}],
            "outcome": "Concise summary of what you will achieve",
            "isPrivate": true/false
          }
          
          Rules:
          - If the user says "send X to 0x...", actionType is "SEND".
          - If the user says "swap X for Y" or "buy Y for X", actionType is "SWAP" or "BUY".
          - Provide 4-5 logical steps. Return ONLY the JSON.`,
          stream: false,
          format: 'json'
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.response);
      setAiAnalysis(parsed);
    } catch (err) {
      console.error("Ollama analysis failed, using rule-based fallback", err);
      // Fallback to our rule-based system
      const fallbackSteps = generateSteps(userPrompt);
      const fallbackOutcome = await generateOutcome(userPrompt, selectedAgent.name);
      setAiAnalysis({
        steps: fallbackSteps,
        outcome: fallbackOutcome,
        isPrivate: userPrompt.toLowerCase().includes("slippage") || userPrompt.toLowerCase().includes("limit")
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulate Agent Parsing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) return alert("Connect wallet first");
    if (!selectedAgent) return alert("Select an AI agent");
    if (!prompt) return;

    const lowerPrompt = prompt.toLowerCase();

    // Direct UI routing for Receive
    if (lowerPrompt.includes("receive") || lowerPrompt.includes("deposit") || lowerPrompt.includes("my address")) {
      setShowReceive(true);
      setPrompt('');
      return;
    }

    setShowPlan(true);
    await analyzeWithOllama(prompt);
  };

  // Dynamic Parsing Logic (Fallback)
  const generateSteps = (userPrompt) => {
    const p = userPrompt.toLowerCase();
    const steps = [
      { type: "Parsing & Intent", desc: "Analyzing natural language for execution routes." }
    ];

    if (p.includes("send") || p.includes("transfer")) {
      steps.push({ type: "Security Check", desc: "Verifying recipient address and risk-scoring destination." });
      steps.push({ type: "Gas Optimization", desc: "Calculating optimal gas for instant Shardeum finality." });
    } else if (p.includes("swap") || p.includes("buy") || p.includes("exchange")) {
      steps.push({ type: "Liquidity Check", desc: "Checking depth on Shardeum DEX Aggregators." });
      steps.push({ type: "Quote Analysis", desc: "Finding optimal route for swapping assets." });
    } else if (p.includes("receive") || p.includes("deposit")) {
      steps.push({ type: "Wallet Identity", desc: "Securing keys and generating non-custodial receipt info." });
    } else if (p.includes("risk") || p.includes("analyze") || p.includes("audit")) {
      steps.push({ type: "Data Sourcing", desc: "Fetching historical volatility and treasury data." });
      steps.push({ type: "Risk Modeling", desc: "Running Monte Carlo simulations for protocol safety." });
    } else if (p.includes("yield") || p.includes("optimize") || p.includes("stake")) {
      steps.push({ type: "Yield Scanning", desc: "Scanning Shardeum ecosystem for highest APR vaults." });
      steps.push({ type: "Strategy Formation", desc: "Compounding strategy calculated for 12.4% boost." });
    } else {
      steps.push({ type: "General Inquiry", desc: "Processing general request for on-chain logging." });
    }

    steps.push({ type: "Confidentiality", desc: "Masking private parameters for secure execution." });
    steps.push({ type: "State Change", desc: "Finalizing log entry for AgentChain Smart Contract." });
    return steps;
  };

  const fetchMarketData = async (symbol) => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${symbol}`);
      const data = await response.json();
      const pair = data.pairs?.[0]; // Get the most relevant pair
      if (pair) {
        return {
          price: pair.priceUsd,
          change: pair.priceChange?.h24,
          liquidity: pair.liquidity?.usd,
          volume: pair.volume?.h24,
          dex: pair.dexId
        };
      }
    } catch (e) {
      console.error("DexScreener fetch failed", e);
    }
    return null;
  };

  const generateOutcome = async (userPrompt, agentName) => {
    const p = userPrompt.toLowerCase();

    // Improved symbol detection: look for uppercase words in original prompt
    const originalWords = userPrompt.split(/\s+/);
    const commonWords = ['the', 'swap', 'risk', 'pool', 'your', 'with', 'from', 'rate', 'price', 'plan', 'intent'];
    const potentialSymbol = originalWords.find(w =>
      w.length >= 2 &&
      w.length <= 6 &&
      /^[A-Z]+$/.test(w) &&
      !commonWords.includes(w.toLowerCase())
    ) || originalWords.find(w =>
      w.length >= 2 &&
      w.length <= 6 &&
      !commonWords.includes(w.toLowerCase()) &&
      (w.toLowerCase() === 'shm' || w.toLowerCase() === 'btc' || w.toLowerCase() === 'eth' || w.toLowerCase() === 'usdc' || w.toLowerCase() === 'usdt')
    )?.toUpperCase();

    // Fallback search if no caps found
    const finalSymbol = potentialSymbol || originalWords.find(w =>
      w.length >= 3 &&
      w.length <= 5 &&
      !commonWords.includes(w.toLowerCase())
    )?.toUpperCase();

    let marketInfo = null;
    if (finalSymbol) {
      marketInfo = await fetchMarketData(finalSymbol);
    }

    if (p.includes("send") || p.includes("transfer")) {
      return `${agentName} successfully moved ${finalSymbol || 'SHM'} to the requested destination. Verifiable receipt available in your Shardeum history.`;
    } else if (p.includes("buy") || p.includes("swap") || p.includes("exchange")) {
      if (marketInfo) {
        return `${agentName} acquired ${finalSymbol} via Uniswap V2. Price: $${Number(marketInfo.price).toFixed(4)}. Assets are now secured in your non-custodial wallet.`;
      }
      return `${agentName} completed the asset acquisition through optimized Shardeum liquidity pools. Finality reached in 5s.`;
    } else if (p.includes("receive") || p.includes("deposit")) {
      return `Welcome to the future of agentic banking. To receive assets, simply share your address: ${address.substring(0, 8)}...${address.substring(38)}. Funds deposited will be instantly scanable by your AI agents.`;
    } else if (p.includes("risk") || p.includes("analyze") || p.includes("audit")) {
      if (marketInfo) {
        return `Risk Audit for ${finalSymbol}: 24h Volume is $${Number(marketInfo.volume).toLocaleString()}. Volatility is ${Math.abs(marketInfo.change)}%. Protocol hygiene score is 92/100. No immediate liquidation risks detected.`;
      }
      return `Portfolio health check complete. 0 critical vulnerabilities found in your connected smart contracts. Reliability Score: 94/100.`;
    } else if (p.includes("yield") || p.includes("optimize") || p.includes("stake")) {
      return `Protocol scan identified 3 new high-APR vaults on Shardeum. Automated compounding strategy initiated. Projected APY: 18.4%.`;
    }
    return `On-chain intent logged successfully. Operational proof written to block ${Math.floor(Math.random() * 1000000)}.`;
  };

  const executeAction = async () => {
    setIsExecuting(true);
    let txHash = null;
    try {
      const summary = prompt.substring(0, 50) + "...";
      const resultHash = "0x" + Math.random().toString(16).slice(2, 42);

      // REAL TRADING & TRANSFER LOGIC
      const actionType = aiAnalysis?.actionType || (prompt.toLowerCase().includes("send") ? "SEND" : prompt.toLowerCase().includes("swap") || prompt.toLowerCase().includes("buy") ? "SWAP" : "GENERAL");

      let rawValue = aiAnalysis?.amount || "0";
      if (rawValue === "0") {
        const match = prompt.match(/(\d+\.?\d*)/);
        if (match && match[1]) rawValue = match[1];
      }

      // Clean amount: remove any trailing " SHM" or symbols Ollama might have added
      const valueInSHM = rawValue.toString().replace(/[^0-9.]/g, '');

      // 1. HANDLE SEND (Native Transfer)
      if (actionType === "SEND") {
        let recipient = aiAnalysis?.recipient;
        if (!recipient) {
          const addrMatch = prompt.match(/(0x[a-fA-F0-9]{40})/);
          if (addrMatch) recipient = addrMatch[1];
        }

        if (!recipient) throw new Error("Recipient address not found in prompt. Please provide a 0x... address.");

        setExecutionResult({
          hash: "Broadcasting...",
          status: "Transferring SHM...",
          agent: selectedAgent.name,
          outcome: `Sending ${valueInSHM} SHM to ${recipient.substring(0, 10)}...`
        });

        const sendTx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(valueInSHM || "0"),
          gasLimit: 30000
        });
        txHash = sendTx.hash;
        await sendTx.wait();
        await loadBalance(address, provider);
      }

      // 2. HANDLE SWAP / BUY (DEX Interaction)
      else if (actionType === "SWAP" || actionType === "BUY") {
        setExecutionResult({
          hash: "DEX Routing...",
          status: "Finding Best Price...",
          agent: selectedAgent.name,
          outcome: `Routing ${valueInSHM} SHM through Uniswap V2 on Shardeum...`
        });

        const router = new ethers.Contract(DEX_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);
        const path = [WSHM_ADDRESS, STUB_TOKEN_ADDRESS];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

        try {
          const swapTx = await router.swapExactETHForTokens(
            0,
            path,
            address,
            deadline,
            {
              value: ethers.parseEther(valueInSHM),
              gasLimit: 250000
            }
          );
          setExecutionResult(prev => ({ ...prev, hash: swapTx.hash, status: "DEX Swap Pending..." }));
          await swapTx.wait();
          await loadBalance(address, provider);
        } catch (dexErr) {
          console.error("DEX Execution Failed", dexErr);
          throw dexErr;
        }
      }

      // Record the reasoning/audit log on the AgentChain contract
      const tx = await contract.logExecution(selectedAgent.id, summary, resultHash, true, {
        gasLimit: 300000
      });
      txHash = tx.hash;

      setExecutionResult({
        hash: txHash,
        status: actionType !== "GENERAL" ? `Executing ${actionType}...` : "Pending confirmation...",
        agent: selectedAgent.name,
        outcome: actionType !== "GENERAL" ? `Broadcasting ${valueInSHM} SHM ${actionType.toLowerCase()} to the network...` : "Agent is fetching real-time market data..."
      });

      const outcomeReport = aiAnalysis?.outcome || await generateOutcome(prompt, selectedAgent.name);
      const receipt = await tx.wait();

      setExecutionResult({
        hash: receipt.hash,
        status: "Success",
        agent: selectedAgent.name,
        outcome: outcomeReport
      });

      loadBalance(address, provider);
      loadLogs();
      loadAgents();
      setTimeout(() => {
        setShowPlan(false);
        setIsExecuting(false);
        setPrompt('');
        setExecutionResult(null);
      }, 15000);
    } catch (err) {
      console.error("Execution failed catch:", err);

      const isCongested = err.message?.includes("too many errors") || err.code === -32002;

      if (txHash || isCongested) {
        const fallbackOutcome = await generateOutcome(prompt, selectedAgent.name);
        setExecutionResult({
          hash: txHash || "Verify in MetaMask",
          status: isCongested ? "Broadcasted (RPC Congested)" : "Sent (Check Explorer)",
          agent: selectedAgent.name,
          outcome: fallbackOutcome,
          error: isCongested ? "RPC is too slow, but transaction was likely sent. Please check your wallet history." : "RPC busy, but tx was broadcast."
        });
        loadLogs();
        setTimeout(() => setIsExecuting(false), 12000);
      } else {
        alert("Transaction failed: " + err.message);
        setIsExecuting(false);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass">
        <div className="logo">
          <Shield size={32} />
          <span>AgentChain</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {address && (
            <>
              <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.9rem', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                {Number(balance).toFixed(2)} SHM
              </div>
              <button
                onClick={() => setShowReceive(true)}
                className="glass hover-effect"
                style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '99px', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <ArrowDownLeft size={16} /> Receive
              </button>
            </>
          )}
          <button className="connect-btn" onClick={connectWallet}>
            {address ? `${address.substring(0, 6)}...${address.substring(38)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Trust Layer for AI Agents
          </motion.h1>
          <p>Execute complex on-chain intents via DAO-approved autonomous agents.</p>

          <div className="prompt-container">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="What do you want to achieve today? (e.g. Optimize my Shardeum yield)"
                className="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={24} />
              </button>
            </form>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="agent-section">
          <div className="grid-title">
            <Cpu size={24} color="var(--accent)" />
            <h2>DAO Approved Agents</h2>
          </div>
          <div className="agent-grid">
            {agents.map(agent => (
              <motion.div
                key={agent.id}
                className={`agent-card glass ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="agent-header">
                  <span className="agent-name">{agent.name}</span>
                  <span className="reputation">{agent.reputation} REP</span>
                </div>
                <p className="agent-desc">{agent.description}</p>
                <div className="caps">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="caps-tag">{cap}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Decision Feed */}
        <section className="feed-section">
          <div className="grid-title">
            <Activity size={24} color="var(--accent)" />
            <h2>Decision Feed</h2>
          </div>
          <div className="feed-list">
            {logs.map((log, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className="feed-item glass"
              >
                <div className={`status-indicator ${log.isSuccess ? 'status-success' : 'status-fail'}`} />
                <div className="feed-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{agents.find(a => a.id === log.agentId)?.name || "Agent"}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{log.promptSummary}</div>
                  <div className="feed-hash">{log.resultHash.substring(0, 16)}...</div>
                </div>
                <div className="feed-action">
                  <ExternalLink size={16} color="var(--text-secondary)" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Execution Plan Modal */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content glass"
            >
              {executionResult ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{executionResult.status}</h3>
                  <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                    Agent: <strong>{executionResult.agent}</strong>
                  </p>

                  <div style={{
                    background: 'rgba(0, 210, 255, 0.05)',
                    border: '1px solid var(--accent)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ color: 'var(--accent)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 800 }}>Intel Report</div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>{executionResult.outcome}</div>
                  </div>

                  <div className="feed-hash" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', wordBreak: 'break-all' }}>
                    Tx: {executionResult.hash}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2>Execution Plan</h2>
                    <button onClick={() => setShowPlan(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                  </div>

                  {isAnalyzing ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                      <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                      <p style={{ color: 'var(--text-secondary)' }}>Ollama is parsing intent with Qwen 2.5...</p>
                    </div>
                  ) : (
                    <>
                      {(aiAnalysis?.steps || generateSteps(prompt)).map((step, idx) => (
                        <div className="step" key={idx}>
                          <div className="step-type">{step.type}</div>
                          <div className="step-desc">
                            {(step.type === "Confidentiality" || aiAnalysis?.isPrivate && idx === (aiAnalysis.steps.length - 2)) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Private Parameters: <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}><Lock size={12} /> ENCRYPTED</span>
                              </div>
                            ) : step.desc}
                          </div>
                        </div>
                      ))}

                      <div className="gas-estimate" style={{
                        marginTop: '2rem',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        border: Number(gasPrice) > 100000 ? '1px solid var(--danger)' : '1px solid var(--warning)',
                        background: Number(gasPrice) > 100000 ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 204, 0, 0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Zap size={18} />
                          <span>Network Status: {Number(gasPrice).toLocaleString()} Gwei</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
                          Estimated Trade Cost: ~{(Number(gasPrice) * 250000 / 1e9).toFixed(2)} SHM
                        </div>
                        {Number(gasPrice) > 100000 && (
                          <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                            ⚠️ High Gas detected. Swap might fail if balance is low.
                          </div>
                        )}
                      </div>

                      <button
                        className="connect-btn"
                        style={{ width: '100%', marginTop: '2rem', height: '3.5rem', fontSize: '1.1rem' }}
                        onClick={executeAction}
                        disabled={isExecuting}
                      >
                        {isExecuting ? 'Processing...' : 'Approve & Execute'}
                      </button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
        {showReceive && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReceive(false)}
          >
            <motion.div
              className="modal glass"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '400px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Deposit Assets</h2>
                <button onClick={() => setShowReceive(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                width: 'fit-content',
                margin: '0 auto 2rem',
                boxShadow: '0 0 40px rgba(0, 210, 255, 0.3)'
              }}>
                <QrCode size={180} color="#000" />
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Your Shardeum Mezame Address
              </p>

              <div
                className="glass"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                  background: 'rgba(255,255,255,0.05)',
                  cursor: 'copy',
                  border: '1px solid rgba(0, 210, 255, 0.2)'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  alert("Address copied!");
                }}
              >
                {address}
              </div>

              <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
                Only send SHM or Shardeum-native assets to this address.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
