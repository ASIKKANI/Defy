import React, { useState } from 'react';
import {
    Activity,
    ChevronRight,
    ExternalLink,
    History,
    Search,
    Filter,
    Clock,
    Shield,
    Cpu,
    Database,
    Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_LOGS = [
    {
        id: '0x3a4b...f5e1',
        agent: 'TradeMaster AI',
        action: 'DEX Optimal Swap',
        status: 'Executed',
        time: '2 mins ago',
        details: 'Swapped 5 SHM for 120 SWAP tokens.',
        proof: 'zk-SNARK Verified',
        mcp: 'Shardeum DEX Oracle'
    },
    {
        id: '0x9c2d...a8b2',
        agent: 'NFT Scout',
        action: 'Collection Scan',
        status: 'Completed',
        time: '12 mins ago',
        details: 'Analyzed 450 items in "Shardeum Punks".',
        proof: 'On-Chain Audit',
        mcp: 'NFT Metadata Server'
    },
    {
        id: '0x1e5f...c7d8',
        agent: 'Liquidity Quant',
        action: 'Pool Rebalance',
        status: 'Executed',
        time: '45 mins ago',
        details: 'Moved 12 SHM from Pool A to Pool B.',
        proof: 'Governance Approved',
        mcp: 'Protocol Yield API'
    }
];

const DecisionFeed = () => {
    const [expandedId, setExpandedId] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
        >
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 pb-10 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <History size={24} className="animate-pulse" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">Global Historical Ledger</h4>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Decision <span className="gradient-text">Stream</span></h2>
                    <p className="text-xl text-text-muted font-medium max-w-2xl leading-relaxed">Real-time cryptographic transparency of every autonomous action orchestrated by the Defy OS ecosystem.</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Filter by Hash or Agent..."
                            className="bg-black/40 border border-white/10 rounded-[20px] pl-14 pr-8 py-5 text-base font-bold focus:border-primary/50 transition-all w-80 outline-none shadow-2xl"
                        />
                    </div>
                    <button className="bg-white/5 border border-white/10 p-5 rounded-[20px] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 group">
                        <Filter size={24} className="text-text-muted group-hover:text-white transition-colors" />
                    </button>
                    <button className="btn-primary py-5 px-8 rounded-[20px] text-xs font-black uppercase tracking-widest shadow-glow">
                        Export Audit
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                {MOCK_LOGS.map((log) => (
                    <motion.div
                        key={log.id}
                        variants={itemVariants}
                        className={`glass-panel border-white/[0.05] transition-all relative overflow-hidden group ${expandedId === log.id ? 'border-primary/40 ring-4 ring-primary/5 bg-white/[0.03]' : 'hover:border-white/20 hover:bg-white/[0.02]'}`}
                    >
                        <div
                            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                            className="p-8 cursor-pointer flex flex-wrap items-center justify-between gap-10"
                        >
                            <div className="flex items-center gap-8 flex-1 min-w-[300px]">
                                <div className="w-20 h-20 rounded-[28px] bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-4xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 shadow-inner group-hover:bg-white/10">
                                    {log.agent === 'TradeMaster AI' ? '📈' : log.agent === 'NFT Scout' ? '🖼️' : '⚖️'}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black text-2xl group-hover:text-primary transition-colors tracking-tight">{log.action}</h4>
                                    <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Activity size={12} className="text-secondary" /> {log.agent}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right hidden xl:block space-y-1">
                                    <p className="text-sm font-mono text-text-muted/60 tracking-tighter">{log.id}</p>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1 flex items-center justify-end gap-2">
                                        <Clock size={12} /> {log.time}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <span className="px-5 py-2 rounded-full bg-success/10 text-success text-[10px] font-black uppercase tracking-[0.3em] border border-success/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                                        {log.status}
                                    </span>
                                    <div className={`p-2 rounded-full bg-white/5 transition-all duration-500 ${expandedId === log.id ? 'rotate-90 bg-primary/20 text-primary' : 'text-text-muted'}`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedId === log.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className="overflow-hidden bg-black/20 border-t border-white/5"
                                >
                                    <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        <div className="space-y-6">
                                            <h5 className="section-label">
                                                <Database size={16} className="text-primary" /> Execution Logic
                                            </h5>
                                            <p className="text-lg font-bold italic border-l-4 border-primary/40 pl-8 bg-primary/5 py-8 rounded-r-[32px] leading-relaxed tracking-tight shadow-inner">
                                                "{log.details}"
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <h5 className="section-label">
                                                <Shield size={16} className="text-primary" /> Cryptographic Proof
                                            </h5>
                                            <div className="p-8 rounded-[32px] bg-black/40 border border-white/5 space-y-5 shadow-2xl">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">Verification</span>
                                                    <span className="text-sm font-bold text-white">{log.proof}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">Oracle Source</span>
                                                    <span className="text-sm font-black text-primary uppercase">{log.mcp}</span>
                                                </div>
                                                <div className="pt-2 border-t border-white/5 mt-2">
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-accent bg-accent/10 w-fit px-4 py-2 rounded-full border border-accent/20">
                                                        <Shield size={12} /> FHE PROTECTED TRACE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center gap-5">
                                            <button className="btn-primary py-5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-glow group">
                                                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                <span>Explorer View</span>
                                            </button>
                                            <button className="bg-white/5 border border-white/10 py-5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-text-muted hover:text-white">
                                                <Code size={18} />
                                                <span>Raw JSON Data</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Side Accent */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-accent to-secondary transition-opacity duration-700 ${expandedId === log.id ? 'opacity-100' : 'opacity-0'}`}></div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center py-20 opacity-20 select-none">
                <p className="text-[11px] font-black uppercase tracking-[0.8em]">--- END OF HISTORICAL SEQUENCE ---</p>
            </div>
        </motion.div>
    );
};

export default DecisionFeed;
