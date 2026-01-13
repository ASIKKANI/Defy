import React, { useState, useEffect, useRef } from 'react';
import {
    Activity,
    Search,
    Download,
    Play,
    ShieldCheck,
    Clock,
    ArrowUpRight,
    Cpu,
    X,
    CheckCircle,
    Orbit,
    Terminal,
    MessageSquare,
    Send,
    Sparkles,
    Bot,
    Filter,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLogs, subscribeLogs, clearLogs } from '../../services/log-service';
import { generateGeminiResponse } from '../../services/gemini';
import { Trash2 } from 'lucide-react';

const GeminiChatPanel = ({ log }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: `Security protocol initiated. I've analyzed transaction ${log.id.toString().slice(-4)}. I can explain the smart contract logic or verify the consensus proof. What do you need?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e && e.key !== 'Enter') return;
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const reply = await generateGeminiResponse(userMsg, log);
            setMessages(prev => [...prev, { role: 'bot', content: reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Encryption error: Unable to reach the neural core." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/20 relative">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gemini Forensic Agent</h3>
                        <p className="text-[10px] text-indigo-400 font-mono">Status: ONLINE</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-indigo-500/20 text-indigo-400'
                            }`}>
                            {msg.role === 'user' ? <div className="w-2 h-2 bg-white rounded-full" /> : <Bot size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed ${msg.role === 'user'
                            ? 'bg-white/10 text-white rounded-tr-none'
                            : 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="flex gap-1 items-center h-8 px-4 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleSend}
                        placeholder="Ask about this audit trail..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20"
                    />
                    <button
                        onClick={() => handleSend(null)}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const TransactionAuditModal = ({ log, onClose }) => {
    if (!log) return null;

    // Use real phases if available, otherwise simulate a timeline
    const phases = log.phases || [
        { id: 1, title: 'Transaction Initiated', time: '-2.4s', status: 'completed', icon: Terminal, detail: `Request received from ${log.agent}` },
        { id: 2, title: 'Smart Contract Logic', time: '-1.8s', status: 'completed', icon: Cpu, detail: 'Executing deterministic logic...' },
        { id: 3, title: 'Consensus Verification', time: '-0.5s', status: 'active', icon: Orbit, detail: 'Validating across mesh network' },
        { id: 4, title: 'Finalization', time: 'Now', status: 'completed', icon: CheckCircle, detail: `Action: ${log.action} confirmed.` },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-6xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <div>
                        <div className="flex items-center gap-3 text-primary mb-1">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Audit Channel</span>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Transaction <span className="text-white/40">Analysis</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase tracking-widest text-white/20">Hash ID</span>
                            <span className="text-xs font-mono text-white/60">0x7f...3a9c</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body - Split View */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel: Audit Trail */}
                    <div className="w-1/2 p-8 overflow-y-auto border-r border-white/5 relative">
                        {/* Details Header */}
                        <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Agent</span>
                                    <span className="text-sm font-bold text-white">{log.agent}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Action</span>
                                    <span className="text-sm font-bold text-white">{log.action}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Amount</span>
                                    <span className="text-sm font-mono text-primary">{log.amount}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Time</span>
                                    <span className="text-sm font-mono text-white/60">{log.time}</span>
                                </div>
                            </div>
                        </div>

                        <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                            <Clock size={12} /> Execution Sequence
                        </h4>

                        <div className="relative space-y-8 pl-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[34px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

                            {phases.map((phase, index) => (
                                <motion.div
                                    key={phase.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex items-start gap-6 group"
                                >
                                    {/* Node/Icon */}
                                    <div className={`relative z-10 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 ${index === phases.length - 1 ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'bg-black border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white'
                                        }`}>
                                        <phase.icon size={18} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold uppercase tracking-wider ${index === phases.length - 1 ? 'text-white' : 'text-white/60'}`}>
                                                {phase.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-primary/60">{phase.time}</span>
                                        </div>
                                        <p className="text-xs text-white/30 leading-relaxed font-mono">
                                            {phase.detail}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Gemini Chat */}
                    <div className="w-1/2 h-full">
                        <GeminiChatPanel log={log} />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ActivityView = () => {
    const [search, setSearch] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);
    const [logs, setLogs] = useState(getLogs());

    useEffect(() => {
        return subscribeLogs((newLogs) => {
            setLogs([...newLogs]);
        });
    }, []);

    const filteredLogs = logs.filter(log =>
        log.agent.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-12 max-w-7xl mx-auto h-full overflow-y-auto">
            <header className="mb-16 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <Activity size={24} />
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Interaction History</span>
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none">
                        Model <span className="gradient-text">Activity</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { if (confirm('Erase all session data?')) clearLogs(); }}
                        className="py-4 px-6 rounded-xl border border-red-500/10 bg-red-500/5 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-all flex items-center gap-2 group"
                    >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        Clear Ledger
                    </button>
                    <button className="py-4 px-6 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2 group">
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        Export Protocol JSON
                    </button>
                </div>
            </header>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Search by hash, model or action..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-primary/50 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="px-6 rounded-2xl border border-white/10 bg-white/5 text-white/40 hover:text-white transition-all">
                    <Filter size={18} />
                </button>
            </div>

            <div className="rounded-[32px] border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Model Module</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Executed Action</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Quantum/Amount</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Timestamp</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Audit State</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-white/5 text-primary">
                                            <Cpu size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase">{log.agent}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-xs font-medium text-white/70">{log.action}</span>
                                </td>
                                <td className="p-6 font-mono text-xs text-primary">{log.amount}</td>
                                <td className="p-6 text-xs text-white/40">{log.time}</td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${log.status === 'Success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        log.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse' :
                                            'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-primary transition-all group-hover:scale-110"
                                            title="View Audit Trail"
                                        >
                                            <ShieldCheck size={14} className="fill-current" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-primary transition-all group-hover:scale-110" title="Explorer">
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-20 text-center text-white/20 text-xs font-bold uppercase tracking-widest italic">
                                    No activity detected on local ledger...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">--- EOF_LEDGER ---</p>
            </div>

            <AnimatePresence>
                {selectedLog && (
                    <TransactionAuditModal log={selectedLog} onClose={() => setSelectedLog(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActivityView;
