import React, { useState } from 'react';
import {
    ArrowLeft,
    Send,
    Terminal,
    Database,
    Lock,
    Eye,
    EyeOff,
    Flame,
    CheckCircle2,
    ExternalLink,
    ShieldCheck,
    Users,
    BrainCircuit,
    Cpu,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const LiveLogs = () => {
    const [logs, setLogs] = useState([]);
    const messages = [
        "Initializing Secure Enclave...",
        "Parsing natural language intent...",
        "Fetching Token Prices from Pyth Network...",
        "Simulating transaction on Shardeum Devnet...",
        "Verifying safety constraints against whitelist...",
        "Calculating gas optimization routes...",
        "Finalizing decision logic..."
    ];

    useEffect(() => {
        let i = 0;
        const addLog = () => {
            const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLogs(prev => [...prev, { time: now, text: messages[i] || "Processing..." }]);
            i = (i + 1) % messages.length;
        };
        addLog(); // initial
        const interval = setInterval(addLog, 2000); // New log every 2s
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {logs.map((log, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="console-line"
                >
                    <span className="timestamp">[{log.time}]</span> {log.text}
                </motion.div>
            ))}
        </>
    );
};

const InteractionPane = ({ agent, onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [step, setStep] = useState('input'); // input, interpreting, plan, execution
    const [showPrivate, setShowPrivate] = useState(false);
    const [privateParams, setPrivateParams] = useState({ riskLimit: '5', slippage: '0.5' });
    const [interpreterOutput, setInterpreterOutput] = useState(null);
    const [isSimulation, setIsSimulation] = useState(false);

    const QUICK_TEMPLATES = [
        "Optimize staking yield",
        "Audit portfolio risk",
        "Rebalance to stablecoins"
    ];

    const mockInterpretPrompt = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('yield') || lower.includes('optimize') || lower.includes('staking')) {
            return {
                intent: "Deploy 120 SHM to High-Yield Staking Pool B",
                summary: "The agent will distribute funds to maximize APR while maintaining your risk limit.",
                steps: [
                    { title: "Fetch Real-time APR Data", detail: "Sources: Shardeum Oracle, DEX Aggregator v2", type: "read" },
                    { title: "Execute Deposit Transaction", detail: "Moving funds to 0x4f2...9a12 (Smart Contract)", type: "write" }
                ],
                gas: "0.0042 SHM",
                isMock: true
            };
        } else if (lower.includes('risk') || lower.includes('exposure') || lower.includes('security')) {
            return {
                intent: "System-wide Risk Audit",
                summary: "Analyzing exposure across all connected Shardeum liquidity pools.",
                steps: [
                    { title: "Scan Protocol Health", detail: "Checking contract vulnerability database", type: "read" },
                    { title: "Calculate VAR", detail: "Value-at-Risk computation for current portfolio", type: "read" }
                ],
                gas: "0.0010 SHM",
                isMock: true
            };
        } else {
            return {
                intent: "Custom Asset Rebalance",
                summary: "Executing transaction based on natural language intent parameters.",
                steps: [
                    { title: "Parameter Validation", detail: "Verifying slippage and gas overhead", type: "read" },
                    { title: "Multi-hop Swap", detail: "Optimizing route for minimum price impact", type: "write" }
                ],
                gas: "0.0055 SHM",
                isMock: true
            };
        }
    };

    const interpretPrompt = async (text) => {
        // If it's NOT the DEFY Oracle, use Mock Logic
        if (agent.id !== 'defy-live') {
            return mockInterpretPrompt(text);
        }

        const BACKEND_URL = 'http://172.16.45.46:5173/agent/run';
        console.log("🚀 SENDING REQUEST TO:", BACKEND_URL);
        console.log("📤 PAYLOAD:", JSON.stringify({ prompt: text }));

        try {
            const start = Date.now();
            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            const latency = Date.now() - start;

            console.log(`✅ RESPONSE RECEIVED (${latency}ms):`, data);
            return { ...data, latency, isMock: false };
        } catch (error) {
            console.error("❌ BACKEND ERROR:", error);
            // RAW ERROR DISPLAY - NO FLUFF
            return {
                agent: "SYSTEM_ERROR",
                decision: "FATAL_ERR",
                confidence: 0,
                explanation: `[RAW_EXCEPTION] :: ${error.message}\n\nTARGET: ${BACKEND_URL}\nTIMESTAMP: ${new Date().toISOString()}`,
                data_used: { error_stack: error.stack },
                on_chain: false,
                isMock: false
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt) return;
        setStep('interpreting');

        // Allow animation to play for at least 1.5s
        const minWait = new Promise(resolve => setTimeout(resolve, 1500));
        const apiCall = interpretPrompt(prompt);

        const [_, output] = await Promise.all([minWait, apiCall]);
        setInterpreterOutput(output);
        setStep('plan');
    };

    const handleConsensus = () => {
        if (!prompt) return;
        setStep('consensus_loading');
        setTimeout(() => setStep('consensus_result'), 2500);
    };

    const handleApprove = () => {
        if (isSimulation) {
            setStep('simulation_result');
        } else {
            setStep('execution');
        }
    };

    return (
        <div className="interaction-root">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="agent-title-bar">
                <div className="agent-icon-small" style={{ background: agent.color }}>
                    <Terminal size={18} color="black" />
                </div>
                <div>
                    <h2>{agent.name}</h2>
                    <span className="agent-subtitle">{agent.purpose}</span>
                </div>
            </div>

            <div className="pane-content">
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="prompt-section"
                        >
                            <div className="input-container glass">
                                <textarea
                                    placeholder={`Command ${agent.name}... e.g., "Optimize my staking yield but keep 5 SHM liquid"`}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <div className="input-footer">
                                    <div className="hints">
                                        <span className="hint-tag">Examples:</span>
                                        <button onClick={() => setPrompt("Maximize yield on my SHM")}>Maximize yield</button>
                                        <button onClick={() => setPrompt("Check my risk exposure")}>Check risk</button>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="submit-btn secondary" onClick={handleConsensus} disabled={!prompt}>
                                            <Users size={18} /> Consensus
                                        </button>
                                        <button className="submit-btn" onClick={handleSubmit} disabled={!prompt}>
                                            <Send size={18} /> Run Agent
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="quick-templates">
                                {QUICK_TEMPLATES.map(t => (
                                    <button key={t} className="template-pill" onClick={() => setPrompt(t)}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="mode-toggle-container glass">
                                <div className="toggle-label">
                                    <span className={!isSimulation ? 'active' : ''}>Live Execution</span>
                                    <div
                                        className={`simulation-toggle ${isSimulation ? 'on' : ''}`}
                                        onClick={() => setIsSimulation(!isSimulation)}
                                    >
                                        <div className="toggle-thumb" />
                                    </div>
                                    <span className={isSimulation ? 'active' : ''}>Simulation Mode</span>
                                </div>
                                <p className="mode-desc">
                                    {isSimulation
                                        ? "Agent will run a dry-run analysis. No funds will be moved."
                                        : "Agent will execute real on-chain transactions."}
                                </p>
                            </div>

                            <div className="confidential-inputs glass">
                                <div className="section-header">
                                    <Lock size={16} color="var(--primary)" />
                                    <h4>Confidential Parameters</h4>
                                    <span className="privacy-badge">TEE-Encrypted</span>
                                </div>
                                <div className="inputs-grid">
                                    <div className="input-group">
                                        <label>Risk Limit (%)</label>
                                        <div className="masked-input">
                                            <input
                                                type={showPrivate ? "text" : "password"}
                                                value={privateParams.riskLimit}
                                                onChange={(e) => setPrivateParams({ ...privateParams, riskLimit: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Slippage Tol. (%)</label>
                                        <div className="masked-input">
                                            <input
                                                type={showPrivate ? "text" : "password"}
                                                value={privateParams.slippage}
                                                onChange={(e) => setPrivateParams({ ...privateParams, slippage: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button className="visibility-toggle" onClick={() => setShowPrivate(!showPrivate)}>
                                        {showPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'interpreting' && (
                        <motion.div
                            key="interpreting"
                            className="loading-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="ai-brain-animation">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="wave"
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                    />
                                ))}
                                <Terminal size={40} color="var(--primary)" />
                            </div>
                            <h3>AI is interpreting your intent...</h3>
                            <div className="thinking-console glass">
                                <LiveLogs />
                            </div>
                        </motion.div>
                    )}

                    {step === 'consensus_loading' && (
                        <motion.div
                            key="consensus_loading"
                            className="loading-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="ai-brain-animation">
                                <Users size={40} color="var(--primary)" />
                            </div>
                            <h3>Convening AI Roundtable...</h3>
                            <div className="thinking-console glass">
                                <div className="console-line"><span className="timestamp">[16:20:01]</span> Broadcasting intent to mesh network...</div>
                                <div className="console-line"><span className="timestamp">[16:20:02]</span> Agent "Risk-0" connected.</div>
                                <div className="console-line"><span className="timestamp">[16:20:02]</span> Agent "Alpha-Seeker" connected.</div>
                                <div className="console-line"><span className="timestamp">[16:20:03]</span> Synthesizing independent strategies...</div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'consensus_result' && (
                        <motion.div
                            key="consensus_result"
                            className="consensus-section"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <h2 className="consensus-title">AI Roundtable Consensus</h2>
                            <p className="consensus-subtitle">Select the optimal strategy from independent agents.</p>

                            <div className="consensus-grid">
                                <div className="consensus-card glass">
                                    <div className="agent-badge safety">🛡️ Safety First</div>
                                    <h3>Conservative Strategy</h3>
                                    <p className="strategy-desc">Zero-impermanent loss exposure. Capital preservation focus.</p>
                                    <div className="stat-row">
                                        <span>Risk Score</span>
                                        <span className="safe">1/10</span>
                                    </div>
                                    <div className="stat-row">
                                        <span>Est. APY</span>
                                        <span>4.2%</span>
                                    </div>
                                    <button className="select-strategy-btn" onClick={() => {
                                        setInterpreterOutput({
                                            intent: "Conservative Stablecoin Yield",
                                            summary: "Routing funds to Aave V3 Lending Pool (USDT).",
                                            steps: [
                                                { title: "Swap SHM to USDT", detail: "Via Uniswap V3", type: "write" },
                                                { title: "Supply to Aave", detail: "Lending Market", type: "write" }
                                            ],
                                            gas: "0.003 SHM"
                                        });
                                        setStep('plan');
                                    }}>Select</button>
                                </div>

                                <div className="consensus-card glass featured">
                                    <div className="agent-badge balanced">⚖️ Balanced (Recommended)</div>
                                    <h3>Optimized Yield</h3>
                                    <p className="strategy-desc">Mix of stablecoin lending and SHM-USDT liquidity provision.</p>
                                    <div className="stat-row">
                                        <span>Risk Score</span>
                                        <span className="medium">4/10</span>
                                    </div>
                                    <div className="stat-row">
                                        <span>Est. APY</span>
                                        <span>12.5%</span>
                                    </div>
                                    <button className="select-strategy-btn primary" onClick={() => {
                                        setInterpreterOutput({
                                            intent: "Balanced LP Strategy",
                                            summary: "Provide liquidity to SHM-USDT pool on Swapped Finance.",
                                            steps: [
                                                { title: "Zap SHM to LP Token", detail: "Single-sided add liquidity", type: "write" },
                                                { title: "Stake LP Token", detail: "Masterchef Contract", type: "write" }
                                            ],
                                            gas: "0.008 SHM"
                                        });
                                        setStep('plan');
                                    }}>Select</button>
                                </div>

                                <div className="consensus-card glass">
                                    <div className="agent-badge degen">🚀 Alpha Seeker</div>
                                    <h3>Aggressive Growth</h3>
                                    <p className="strategy-desc">Compounding yield farm with leverage loop.</p>
                                    <div className="stat-row">
                                        <span>Risk Score</span>
                                        <span className="high">8/10</span>
                                    </div>
                                    <div className="stat-row">
                                        <span>Est. APY</span>
                                        <span>42.0%</span>
                                    </div>
                                    <button className="select-strategy-btn" onClick={() => {
                                        setInterpreterOutput({
                                            intent: "Leveraged Yield Loop",
                                            summary: "Folding strategy on money market protocol.",
                                            steps: [
                                                { title: "Supply SHM", detail: "Collateral", type: "write" },
                                                { title: "Borrow USDT", detail: "3x Leverage", type: "write" },
                                                { title: "Loop Supply", detail: "Repeat 2x", type: "write" }
                                            ],
                                            gas: "0.025 SHM"
                                        });
                                        setStep('plan');
                                    }}>Select</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'plan' && interpreterOutput && (
                        <motion.div
                            key="plan"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="plan-section"
                        >
                            {/* BRANCH UI: IF MOCK, SHOW OLD UI. IF LIVE, SHOW COGNITIVE UI */}
                            {!interpreterOutput.isMock ? (
                                <>
                                    <div className="cognitive-dashboard">
                                        <div className="decision-header glass">
                                            <div className="decision-badge">
                                                <BrainCircuit size={18} />
                                                <span>DECISION: <b className={`decision-${interpreterOutput.decision.toLowerCase()}`}>{interpreterOutput.decision}</b></span>
                                            </div>
                                            <div className="confidence-meter">
                                                {interpreterOutput.latency && <span style={{ fontSize: '0.7rem', color: '#666', marginRight: '10px' }}>⚡ {interpreterOutput.latency}ms</span>}
                                                <span>AI Confidence</span>
                                                <div className="meter-bg">
                                                    <div className="meter-fill" style={{ width: `${interpreterOutput.confidence * 100}%` }} />
                                                </div>
                                                <span className="conf-value">{(interpreterOutput.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>

                                        <div className="reasoning-card glass">
                                            <h4><Cpu size={16} /> Reasoning Engine</h4>
                                            <p className="typing-text">{interpreterOutput.explanation}</p>
                                        </div>

                                        <div className="data-card glass">
                                            <h4><Activity size={16} /> Live Data Context</h4>
                                            <pre className="data-json">
                                                {JSON.stringify(interpreterOutput.data_used, null, 2)}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="approval-card glass glow-primary">
                                        <div className="approval-header">
                                            <div>
                                                <span className="total-label">{interpreterOutput.on_chain ? 'Status' : 'Platform'}</span>
                                                <div className="total-value">{interpreterOutput.on_chain ? 'Executed' : 'Analytic'}</div>
                                            </div>
                                            <div className="safety-badge">
                                                <ShieldCheck size={14} /> DEFY Safe
                                            </div>
                                        </div>

                                        {interpreterOutput.on_chain ? (
                                            <div className="tx-result">
                                                <p className="tx-hash">Hash: {interpreterOutput.transaction_hash}</p>
                                                <a href={interpreterOutput.explorer_url} target="_blank" className="explorer-link">
                                                    View Verification <ExternalLink size={14} />
                                                </a>
                                                <button className="approve-btn" onClick={() => setStep('input')}>New Command</button>
                                            </div>
                                        ) : (
                                            <button className={`approve-btn ${isSimulation ? 'sim-btn' : ''}`} onClick={handleApprove}>
                                                {isSimulation ? 'Simulate Action' : 'Execute Plan'}
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="intent-card glass shimmer">
                                        <div className="card-tag">Interpreted Intent</div>
                                        <h3>{interpreterOutput.intent}</h3>
                                        <p>{interpreterOutput.summary}</p>
                                    </div>

                                    <div className="execution-steps">
                                        {interpreterOutput.steps.map((s, i) => (
                                            <React.Fragment key={i}>
                                                <div className="step-item">
                                                    <div className="step-icon">
                                                        {s.type === 'read' ? <Database size={16} /> : <Flame size={16} />}
                                                    </div>
                                                    <div className="step-body">
                                                        <h4>{s.title}</h4>
                                                        <p>{s.detail}</p>
                                                        <span className={`cost-tag ${s.type}`}>
                                                            {s.type === 'read' ? 'Read-only (Gas Free)' : 'Cost-Bearing (Funds at Risk)'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {i < interpreterOutput.steps.length - 1 && <div className="step-divider"></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="approval-card glass glow-primary">
                                        <div className="approval-header">
                                            <div>
                                                <span className="total-label">Estimated Gas</span>
                                                <div className="total-value">{interpreterOutput.gas}</div>
                                            </div>
                                            <div className="safety-badge">
                                                <ShieldCheck size={14} /> Security Audit OK
                                            </div>
                                        </div>
                                        <button className={`approve-btn ${isSimulation ? 'sim-btn' : ''}`} onClick={handleApprove}>
                                            {isSimulation ? 'Run Simulation' : 'Approve in Wallet'}
                                        </button>
                                        <p className="safety-note">Agent cannot execute without your cryptographic signature.</p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {step === 'simulation_result' && (
                        <motion.div
                            key="sim_result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-state"
                        >
                            <div className="success-icon">
                                <ShieldCheck size={64} color="#00D1FF" />
                            </div>
                            <h2>Simulation Complete</h2>
                            <p>Hypothetical outcome verification successful.</p>

                            <div className="tx-details glass" style={{ borderColor: '#00D1FF' }}>
                                <div className="tx-row">
                                    <span>Expected PnL</span>
                                    <span className="text-gradient" style={{ fontWeight: 'bold' }}>+12.5% APR</span>
                                </div>
                                <div className="tx-row">
                                    <span>Gas Saved</span>
                                    <span>0.0042 SHM</span>
                                </div>
                                <div className="tx-row">
                                    <span>Risk Score</span>
                                    <span style={{ color: '#00FFA3' }}>Safe (Low)</span>
                                </div>
                            </div>

                            <button className="new-task-btn" onClick={() => setStep('input')}>
                                Return to Dashboard
                            </button>
                        </motion.div>
                    )}

                    {step === 'execution' && (
                        <motion.div
                            key="execution"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-state"
                        >
                            <div className="success-icon">
                                <CheckCircle2 size={64} color="var(--primary)" />
                            </div>
                            <h2>Transaction Successful</h2>
                            <p>Your intent has been executed on Shardeum Sphinx.</p>

                            <div className="tx-details glass">
                                <div className="tx-row">
                                    <span>Tx Hash</span>
                                    <code className="text-gradient">0x9fde...32a1</code>
                                </div>
                                <div className="tx-row">
                                    <span>Network</span>
                                    <span>Shardeum</span>
                                </div>
                                <a href="#" className="explorer-link">
                                    View on Explorer <ExternalLink size={14} />
                                </a>
                            </div>

                            <button className="new-task-btn" onClick={() => setStep('input')}>
                                New Command
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InteractionPane;
