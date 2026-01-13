import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Terminal,
    Zap,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Activity,
    Cpu,
    EyeOff,
    BrainCircuit,
    ArrowRight,
    CheckCircle2,
    Lock,
    Unlock,
    ExternalLink,
    Mic,
    MicOff
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { motion, AnimatePresence } from 'framer-motion';

const InteractionPane = ({ agent, onBack, useAgent, provider, signer }) => {
    const [step, setStep] = useState('input'); // input, consensus, plan, success
    const [prompt, setPrompt] = useState('');
    const [simulationMode, setSimulationMode] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentDecision, setCurrentDecision] = useState(null);

    const { processPrompt, executeTool, isThinking } = useAgent(provider, signer);
    const { isListening, transcript, startListening, stopListening, speak, isSupported } = useVoice();

    useEffect(() => {
        if (transcript) {
            setPrompt(transcript);
        }
    }, [transcript]);

    const handleRun = async (forceConsensus = false) => {
        if (!prompt.trim() || isThinking) return;

        const response = await processPrompt(prompt);
        setCurrentDecision(response);

        if (forceConsensus === true || prompt.toLowerCase().includes('consensus') || prompt.toLowerCase().includes('strategy')) {
            setStep('consensus');
            speak("I've generated a multi-model consensus for this strategy. Please select a path.");
        } else {
            setStep('plan');
            speak(response.explanation || "I've drafted an execution plan. Please review the cognitive steps.");
        }
    };

    const handleExecute = async () => {
        try {
            setStep('executing');
            const result = await executeTool(currentDecision.tool, currentDecision.params, provider, signer, simulationMode, agent.name);
            setMessages(prev => [...prev, { role: 'assistant', text: result }]);
            setStep('success');
            speak("Execution complete. The transaction has been settled on the Shardeum ledger.");
        } catch (err) {
            console.error(err);
            setStep('plan'); // Fallback to plan on error
        }
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <header className="p-8 border-b border-green-900/10 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 rounded-lg border border-white/5 hover:border-primary/40 hover:text-primary transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-primary">
                            <agent.icon size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white leading-none mb-1">{agent.name}</h2>
                            <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{agent.purpose}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-950/20 border border-green-900/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#00FF41]" />
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest">Active Link</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-12 relative h-full flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-3xl space-y-12 py-20"
                        >
                            <div className="space-y-4 text-center">
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Issue Model <span className="gradient-text">Command</span></h3>
                                <p className="text-lg text-white/40 font-medium">Define your intent in natural language. Our FHE layer handles the encryption.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="relative group">
                                    <div className="absolute top-6 left-6 text-primary/40 group-focus-within:text-primary transition-colors">
                                        <Terminal size={24} />
                                    </div>
                                    <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                                        {isSupported && (
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`p-3 rounded-2xl border transition-all ${isListening ? 'mic-active' : 'bg-white/5 border-white/10 text-white/40 hover:text-primary hover:border-primary/40'}`}
                                                title={isListening ? 'Stop Listening' : 'Voice Command'}
                                            >
                                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        className="w-full h-48 bg-white/5 border border-white/10 rounded-[32px] p-8 pl-16 pr-16 text-xl text-white outline-none focus:border-primary/40 focus:shadow-[0_0_30px_rgba(0,255,65,0.05)] transition-all placeholder:text-white/10"
                                        placeholder={isListening ? "Listening for command..." : "e.g. Maximize my yield across Shardeum pools with low risk limit..."}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {['Maximize Yield', 'Balance Portfolio', 'Private Swap', 'Gas Audit'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setPrompt(`Protocol: ${tag}. Action: Enforce strategy.`)}
                                        className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/40 transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8 rounded-[32px] border border-green-900/10 bg-green-900/5 grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Execution Mode</span>
                                        <span className={simulationMode ? 'text-yellow-500 text-[9px] font-bold' : 'text-primary text-[9px] font-bold'}>
                                            {simulationMode ? 'SIMULATE' : 'LIVE'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSimulationMode(!simulationMode)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {simulationMode ? <Activity size={16} className="text-yellow-500" /> : <ShieldCheck size={16} className="text-primary" />}
                                            <span className="text-[10px] font-bold text-white/60">Toggle Mode</span>
                                        </div>
                                        <div className={`w-8 h-4 rounded-full p-1 transition-colors ${simulationMode ? 'bg-yellow-500/20' : 'bg-primary/20'}`}>
                                            <div className={`w-2 h-2 rounded-full transition-transform ${simulationMode ? 'translate-x-4 bg-yellow-500' : 'bg-primary'}`} />
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Confidential Params</span>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="Risk Tolerance (Masked)"
                                            className="w-full bg-black/40 border border-white/5 p-3 pr-10 rounded-xl text-xs text-white outline-none focus:border-primary/40"
                                        />
                                        <EyeOff size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button
                                    onClick={() => handleRun(true)}
                                    className="py-5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black tracking-[0.3em] uppercase text-white/40 hover:text-white transition-all flex items-center justify-center gap-3 group"
                                >
                                    <BrainCircuit size={18} className="group-hover:rotate-12 transition-transform" />
                                    Consensus
                                </button>
                                <button
                                    onClick={handleRun}
                                    disabled={isThinking}
                                    className="py-5 rounded-2xl bg-primary text-black text-[11px] font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-glow"
                                >
                                    {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="fill-current" />}
                                    Run Model
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'consensus' && (
                        <motion.div
                            key="consensus"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-5xl py-20 px-6"
                        >
                            <div className="text-center mb-16">
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">Model Roundtable <span className="gradient-text">Consensus</span></h3>
                                <p className="text-white/40 font-medium">Three distinct AgentChain models have analyzed your intent. Select a strategy.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                {[
                                    {
                                        name: 'Yield Sentinel',
                                        risk: 'Low',
                                        confidence: 99,
                                        recommendation: 'Auto-compound rewards in liquidity pools while maintaining 100% collateral safety.',
                                        color: 'var(--primary)',
                                        icon: ShieldCheck
                                    },
                                    {
                                        name: 'Stealth Arbitrator',
                                        risk: 'Medium',
                                        confidence: 88,
                                        recommendation: 'Execute FHE-shielded arbitrage across high-depth pools on Shardeum to capture yield.',
                                        color: '#a78bfa',
                                        icon: Zap
                                    },
                                    {
                                        name: 'Neural Quant',
                                        risk: 'High',
                                        confidence: 72,
                                        recommendation: 'Predictive swap based on on-chain momentum signals and current sentiment analysis.',
                                        color: '#ec4899',
                                        icon: Activity
                                    }
                                ].map((mod, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setStep('plan')}
                                        className="p-8 rounded-[40px] border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left flex flex-col group relative overflow-hidden h-full"
                                    >
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 rounded-2xl border transition-all"
                                                style={{ borderColor: mod.color + '33', background: mod.color + '11', color: mod.color }}>
                                                <mod.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase italic leading-none mb-1">{mod.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${mod.risk === 'Low' ? 'bg-primary/20 text-primary' : mod.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                                                        {mod.risk} RISK
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Recommendation</span>
                                            <p className="text-xs text-white/60 leading-relaxed font-medium italic">
                                                "{mod.recommendation}"
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-white/30 truncate">Model Confidence</span>
                                                <span className="text-primary">{mod.confidence}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${mod.confidence}%` }} />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white group-hover:text-primary transition-all">
                                                Select Model <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 'plan' && (
                        <motion.div
                            key="plan"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl py-20"
                        >
                            <div className="p-10 rounded-[48px] border border-primary/20 bg-primary/5 space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <BrainCircuit size={20} className="text-primary" />
                                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Interpreted Intent</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-white italic leading-relaxed">
                                        "{currentDecision?.explanation || 'Deploying automated transaction logic based on user prompt.'}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Activity size={20} className="text-primary" />
                                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Cognitive View</h4>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-black/60 border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] text-white/30 font-bold uppercase">Reasoning Engine</span>
                                            <span className="text-primary text-[10px] font-black uppercase animate-pulse">Running Llama3.1</span>
                                        </div>
                                        <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                                            {currentDecision?.thought || 'Analyzing market depth and gas overhead... Strategy optimized for high-throughput settlement.'}
                                        </p>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] text-white/30 uppercase">Confidence Meter</span>
                                            <span className="text-primary font-black uppercase text-xl italic">92%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-40">Execution Steps</h4>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'Read Price Matrix', type: 'READ', fee: 'FREE' },
                                            { action: 'Encrypt Reasoning Hash', type: 'WRITE', fee: 'GAS' },
                                            { action: 'Finalize On-Chain Proof', type: 'WRITE', fee: 'GAS' }
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-xs font-bold text-white/80">{s.action}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-black text-white/30">{s.type}</span>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${s.fee === 'FREE' ? 'bg-primary/20 text-primary' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                        {s.fee}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 rounded-[32px] bg-black/80 border border-primary/20 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Security Verified</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] text-white/30 uppercase font-bold">Est. Gas Overhead</span>
                                            <span className="text-sm font-black text-white">0.0042 SHM</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExecute}
                                        className="w-full py-5 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow"
                                    >
                                        Approve & Execute
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-lg py-20 flex flex-col items-center text-center"
                        >
                            <div className="w-32 h-32 rounded-[40px] bg-primary/10 border-2 border-primary flex items-center justify-center text-primary mb-12 shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                                <CheckCircle2 size={64} />
                            </div>
                            <h3 className="text-5xl font-black uppercase tracking-tighter text-white mb-6">Execution <span className="gradient-text">Complete</span></h3>
                            <p className="text-white/40 font-medium mb-12">
                                Alpha instructions have been scrambled and settled on the Shardeum Ledger.
                            </p>

                            <div className="w-full space-y-4 mb-12">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                                    <span className="text-white/30 font-bold uppercase">Tx Hash</span>
                                    <span className="text-primary font-mono select-all">0x742...f44e</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                                    <span className="text-white/30 font-bold uppercase">Privacy Proof</span>
                                    <span className="text-primary font-bold">FHE_ENCRYPTED</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button className="py-4 rounded-xl border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                                    <ExternalLink size={14} /> Explorer
                                </button>
                                <button
                                    onClick={() => { setStep('input'); setPrompt(''); }}
                                    className="py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={18} className="fill-current" />
                                    Run Model
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'executing' && (
                        <motion.div
                            key="executing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-8 py-40"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-primary">
                                    <ShieldCheck size={32} className="animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Encrypting Strategy...</h4>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Preparing Inco FHE Payload</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Infrastructure Footer Metrics */}
            <footer className="p-8 border-t border-green-900/10 flex justify-between items-center bg-black/40 backdrop-blur-sm relative z-10">
                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Latency</span>
                        <span className="text-xs font-bold text-primary">14ms</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Security Node</span>
                        <span className="text-xs font-bold text-primary italic">SHARD_01_PROX</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Lock size={12} className="text-primary/40" />
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">FHE Protection: ON</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="text-[10px] font-black text-white italic">SESSION: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                </div>
            </footer>
        </div >
    );
};

export default InteractionPane;
