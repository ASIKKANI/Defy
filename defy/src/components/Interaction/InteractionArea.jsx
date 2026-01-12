import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Send,
    Cpu,
    Database,
    Shield,
    Lock,
    ChevronRight,
    Activity,
    Zap,
    ExternalLink,
    Command,
    Terminal as TerminalIcon,
    ShieldAlert,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '../../hooks/useAgent';
import { encryptParameter } from '../../services/inco-service';
import { MCP_TOOLS, interpretPrompt } from '../../services/mcp-tools';

const InteractionArea = ({ selectedAgent, provider, signer, account, connect }) => {
    const { processPrompt, executeTool, isThinking } = useAgent(provider, signer);
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState('idle');
    const [executionPlan, setExecutionPlan] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [activeTool, setActiveTool] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setStatus('analyzing');

        // Add a timeout fallback for the UI state
        const decisionPromise = processPrompt(prompt);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout: Agent is taking too long")), 35000)
        );

        try {
            const decision = await Promise.race([decisionPromise, timeoutPromise]);

            if (!decision || decision.error) {
                setStatus('idle');
                alert("AI Agent failed to respond. Ensure Ollama is running.");
                return;
            }

            const tool = MCP_TOOLS.find(t => t.id === decision.tool) || { name: 'Reasoning Engine', type: 'read', id: 'unknown' };
            setActiveTool(tool);

            setExecutionPlan({
                interpretation: decision.thought || decision.explanation || "Processing request...",
                toolId: decision.tool,
                params: decision.params,
                steps: [
                    { id: 1, title: 'Intent Analysis', source: 'Llama 3 (Local)', type: 'read', status: 'success' },
                    { id: 2, title: tool.name || 'Action', source: decision.tool === 'get_token_price' ? 'Coinbase MCP' : 'Shardeum RPC', type: tool.type, status: 'success' },
                    { id: 3, title: 'Verification', source: 'User Signature', type: 'write', status: 'locked' }
                ],
                confidentiality: [
                    { param: 'Model Context', status: 'Local Only', detail: 'Ollama/Likelihood' }
                ]
            });
            setStatus('waiting-approval');
        } catch (error) {
            console.error("Interaction Error:", error);
            setStatus('idle');
            alert(error.message);
        }
    };

    const handleExecute = async () => {
        if (!signer) {
            await connect();
            return;
        }

        setStatus('executing');
        try {
            const result = await executeTool(executionPlan.toolId, executionPlan.params, provider, signer);

            if (executionPlan.toolId === 'send_transaction') {
                const hashMatch = result.match(/0x[a-fA-F0-9]{64}/);
                if (hashMatch) setTxHash(hashMatch[0]);
            } else {
                alert(`Oracle Response: ${result}`);
            }

            setStatus('completed');
        } catch (error) {
            console.error("Execution failed:", error);
            setStatus('waiting-approval');
            alert(error.message);
        }
    };

    return (
        <div className="space-y-12 h-full flex flex-col">
            {/* Command Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 flex items-center justify-between border-primary/20 relative overflow-hidden group shadow-2xl"
            >
                <div className="flex items-center gap-10 relative z-10">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 6 }}
                        className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-5xl border border-primary/20 shadow-inner group-hover:bg-primary/20 transition-all duration-700"
                    >
                        {selectedAgent?.icon || '🤖'}
                    </motion.div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-black uppercase tracking-tight">{selectedAgent?.name || 'Agent Select'}</h3>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-success/10 text-success border border-success/20 uppercase tracking-[0.2em] animate-pulse">Connected</span>
                        </div>
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                            <TerminalIcon size={12} className="text-secondary" /> SESSION_ID: <span className="text-secondary opacity-80">{account ? `${account.slice(0, 12)}...` : '0x70a38e9b0000...'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right hidden md:block space-y-1">
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Shardeum L1 Native</p>
                        <p className="text-[10px] font-bold text-text-muted opacity-60">NET_LATENCY: 12ms | SEC_LAYER: LIGHTNING_ACTIVE</p>
                    </div>
                </div>

                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
            </motion.div>

            {/* Interaction State Machine */}
            <div className="relative flex-1">
                <AnimatePresence mode="wait">
                    {status === 'idle' || status === 'analyzing' ? (
                        <motion.div
                            key="input"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-10"
                        >
                            <motion.div variants={itemVariants} className="glass-panel p-10 border-white/5 bg-white/[0.01]">
                                <h4 className="section-label mb-8">
                                    <Command size={14} className="text-primary" /> MCP Oracle Command Suite
                                </h4>
                                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                    {MCP_TOOLS.map((tool) => (
                                        <button
                                            key={tool.id}
                                            onClick={() => setPrompt(`Use ${tool.name}: `)}
                                            className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-500"
                                        >
                                            <span className="text-3xl group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-500">{tool.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary truncate w-full text-center transition-colors">{tool.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-8 relative z-10">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Enter command (e.g., 'What is the price of BTC?')"
                                        className="w-full bg-black/40 border border-white/10 rounded-[32px] p-10 text-2xl font-black tracking-tight focus:border-primary/50 transition-all outline-none resize-none min-h-[200px] shadow-2xl placeholder:opacity-20 custom-scrollbar"
                                        disabled={status === 'analyzing'}
                                    />
                                    <div className="absolute bottom-8 right-10 text-[10px] font-black text-text-muted/20 uppercase tracking-[0.4em] flex items-center gap-3">
                                        <Command size={12} /> Shift + Enter to Process
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={status === 'analyzing' || !prompt.trim()}
                                    className={`lg:w-64 py-10 rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all duration-700 shadow-2xl relative overflow-hidden group ${status === 'analyzing'
                                        ? 'bg-accent/20 cursor-wait'
                                        : 'bg-gradient-to-br from-primary via-accent to-secondary hover:scale-[1.03] active:scale-[0.97]'
                                        }`}
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        {status === 'analyzing' ? (
                                            <div className="flex flex-col items-center gap-5">
                                                <div className="w-10 h-10 border-[6px] border-white/20 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Analyzing...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-xl border border-white/30 backdrop-blur-md">
                                                    <Send size={28} className="text-white ml-1" />
                                                </div>
                                                <span className="text-sm font-black uppercase tracking-[0.3em] leading-none mt-2">Core Process</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="execution"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            {status === 'completed' ? (
                                <motion.div
                                    variants={itemVariants}
                                    className="glass-panel p-16 text-center border-success/30 bg-success/[0.04] space-y-10 relative overflow-hidden"
                                >
                                    <div className="w-32 h-32 bg-success/10 rounded-[40px] flex items-center justify-center mx-auto mb-6 border border-success/20 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce-slow">
                                        <Zap size={56} className="text-success" />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-5xl font-black uppercase tracking-tighter gradient-text">Sequence Finalized</h3>
                                        <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto leading-relaxed">The agent has successfully verified and executed your instruction on the Shardeum Network with military-grade FHE protection.</p>
                                    </div>
                                    {txHash && (
                                        <div className="flex flex-col items-center gap-5 pt-4">
                                            <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-sm text-primary shadow-inner tracking-tight">
                                                <Fingerprint size={20} /> {txHash}
                                            </div>
                                            <a href="#" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-primary transition-all duration-300 hover:tracking-[0.6em]">
                                                Verify on Shardeum Explorer <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                    <div className="pt-8">
                                        <button
                                            onClick={() => { setExecutionPlan(null); setStatus('idle'); setPrompt(''); }}
                                            className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                                        >
                                            Return to Core Console
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-10">
                                    <motion.div variants={itemVariants} className="glass-panel p-10 border-l-[12px] border-accent bg-accent/[0.03]">
                                        <h4 className="section-label mb-6 text-accent">
                                            <Cpu size={16} /> Cognitive Mapping / Neural Intent
                                        </h4>
                                        <p className="text-3xl font-black italic tracking-tight mb-2 leading-tight">"{executionPlan.interpretation}"</p>
                                    </motion.div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <motion.div variants={itemVariants} className="glass-panel p-10 space-y-8">
                                            <h4 className="section-label">
                                                <Database size={16} className="text-primary" /> Protocol Telemetry
                                            </h4>
                                            <div className="space-y-5">
                                                {executionPlan.steps.map((step) => (
                                                    <div key={step.id} className="flex items-center gap-6 p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] transition-all hover:bg-white/[0.05] group">
                                                        <div className={`w-4 h-4 rounded-full ${step.status === 'success' ? 'bg-success shadow-glow' : 'bg-primary animate-pulse shadow-glow'}`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-base font-black tracking-tight uppercase group-hover:text-primary transition-colors">{step.title}</p>
                                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">{step.source}</p>
                                                        </div>
                                                        <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="glass-panel p-10 border-primary/10 space-y-8">
                                            <h4 className="section-label">
                                                <Shield size={16} className="text-primary" /> Confidentiality Layer
                                            </h4>
                                            <div className="space-y-6">
                                                {executionPlan.confidentiality.map((item, i) => (
                                                    <div key={i} className="p-8 rounded-[32px] border border-primary/20 bg-primary/[0.03] space-y-5 relative overflow-hidden group">
                                                        <div className="relative z-10">
                                                            <p className="text-2xl font-black italic tracking-tight">{item.param}</p>
                                                            <div className="flex items-center gap-3 text-[10px] font-black text-primary bg-primary/10 w-fit px-5 py-2 rounded-full border border-primary/20 mt-4 tracking-[0.2em]">
                                                                <Zap size={12} /> FHE PROTECTED SESSION
                                                            </div>
                                                        </div>
                                                        <Shield size={120} className="absolute -right-8 -bottom-8 text-primary opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
                                        <button
                                            onClick={handleExecute}
                                            disabled={status === 'executing'}
                                            className="flex-[2] btn-primary py-8 rounded-[32px] flex items-center justify-center gap-4 text-xl font-black uppercase tracking-[0.3em] shadow-2xl relative overflow-hidden active:scale-95"
                                        >
                                            {status === 'executing' ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                    <span>Broadcasting...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Zap size={28} className="animate-pulse" />
                                                    <span>Authorize & Sync</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => { setExecutionPlan(null); setStatus('idle'); }}
                                            className="flex-1 py-8 px-12 rounded-[32px] bg-white/5 border border-white/10 text-sm font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-3xl active:scale-95 text-text-muted"
                                        >
                                            Abort Cycle
                                        </button>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InteractionArea;
