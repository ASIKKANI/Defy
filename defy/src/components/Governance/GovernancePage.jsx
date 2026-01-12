import React, { useState } from 'react';
import {
    Users,
    Vote,
    PlusCircle,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Activity,
    Zap,
    Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GovernancePage = () => {
    const [filter, setFilter] = useState('active');

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
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const proposals = [
        {
            id: 'PROP-042',
            title: 'On-chain FHE Integration for TradeMaster v2',
            description: 'Implement Inco Lightning libraries for private trade parameters to prevent front-running on Shardeum.',
            proposer: '0x3a4b...f5e1',
            status: 'active',
            timeLeft: '2 days',
            forVotes: '1.2M',
            againstVotes: '150k',
            category: 'Security'
        },
        {
            id: 'PROP-041',
            title: 'Deploy Liquidity Quant Agent to Shardeum Mainnet',
            description: 'Final audit complete. Deploy the automated yield optimizer node with initial $100k TVL cap.',
            proposer: '0x9c2d...a8b2',
            status: 'passed',
            timeLeft: 'Ended',
            forVotes: '3.4M',
            againstVotes: '20k',
            category: 'deployment'
        },
        {
            id: 'PROP-040',
            title: 'DAO Treasury: Allocation for AI Model Training',
            description: 'Allocate 50,000 SHM for fine-tuning the NFT Scout logic on newer collection formats.',
            proposer: '0x1e5f...c7d8',
            status: 'failed',
            timeLeft: 'Ended',
            forVotes: '400k',
            againstVotes: '1.2M',
            category: 'Treasury'
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
        >
            <motion.header variants={itemVariants} className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 pb-10 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <Users size={24} className="animate-pulse" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">Decentralized Autonomy Protocol</h4>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Agent <span className="gradient-text">Governance</span></h2>
                    <p className="text-xl text-text-muted font-medium max-w-2xl leading-relaxed">Collective neural consensus for the evolution of the Defy OS ecosystem through cryptographic voting.</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex bg-black/40 border border-white/10 rounded-[20px] p-2 gap-2 shadow-2xl backdrop-blur-3xl">
                        {['active', 'passed', 'all'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${filter === tab ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-text hover:bg-white/5'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button className="btn-primary px-10 py-5 rounded-[20px] flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-glow active:scale-95 transition-transform">
                        <PlusCircle size={18} /> New Proposal
                    </button>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
                {/* Dao Stats Overview */}
                <motion.div variants={itemVariants} className="xl:col-span-1 space-y-10">
                    <div className="glass-panel p-10 border-white/[0.05] bg-white/[0.01] shadow-2xl">
                        <h4 className="section-label mb-12">
                            <Activity size={16} className="text-primary" /> DAO Metric Suite
                        </h4>
                        <div className="space-y-12">
                            <div className="group">
                                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 group-hover:text-primary transition-colors">Total Staked SHM</p>
                                <div className="flex items-end gap-3 px-6 py-8 rounded-[32px] bg-white/[0.02] border border-white/5 shadow-inner">
                                    <h3 className="text-5xl font-black tracking-tighter">8.4M</h3>
                                    <span className="text-sm text-success font-black mb-2 flex items-center gap-1">
                                        <TrendingUp size={14} /> +5.2%
                                    </span>
                                </div>
                            </div>
                            <div className="group">
                                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 group-hover:text-secondary transition-colors">Active Node Voters</p>
                                <div className="flex items-end gap-3 px-6 py-8 rounded-[32px] bg-white/[0.02] border border-white/5 shadow-inner">
                                    <h3 className="text-5xl font-black tracking-tighter">1,240</h3>
                                    <span className="text-xs text-primary font-black mb-2 uppercase tracking-widest">High συμμετοχή</span>
                                </div>
                            </div>
                            <div className="pt-10 border-t border-white/5">
                                <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                                    <p className="text-sm text-text-muted font-medium italic leading-relaxed relative z-10">
                                        "The DAO is currently in <span className="text-success font-black uppercase animate-pulse">Expansion Mode</span>. New agent profiles require 66% consensus for L1 deployment."
                                    </p>
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-success/10 rounded-bl-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 py-4">
                            <h5 className="font-black text-2xl mb-4 flex items-center gap-4">
                                <Zap size={24} className="text-primary animate-pulse" /> Multi-Chain Sync
                            </h5>
                            <p className="text-sm text-text-muted leading-relaxed font-bold italic opacity-80">
                                Voting results on Shardeum L1 auto-trigger smart contract upgrades for private FHE state layers on Inco Lightning.
                            </p>
                        </div>
                        <Cpu className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 text-primary" size={240} />
                    </div>
                </motion.div>

                {/* Proposals Feed */}
                <div className="xl:col-span-2 space-y-8">
                    {proposals.filter(p => filter === 'all' || p.status === filter).map((prop) => (
                        <motion.div
                            key={prop.id}
                            variants={itemVariants}
                            className={`glass-panel p-12 border-white/[0.05] hover:bg-white/[0.02] hover:border-white/20 transition-all duration-700 relative overflow-hidden group shadow-2xl ${prop.status === 'active' ? 'border-l-[12px] border-l-primary' : ''}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">{prop.id}</span>
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{prop.category}</span>
                                    </div>
                                    <h4 className="text-3xl font-black tracking-tight group-hover:text-white transition-colors leading-tight">{prop.title}</h4>
                                </div>
                                <div className={`flex items-center gap-3 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-2xl ${prop.status === 'active' ? 'bg-primary/10 border-primary/30 text-primary animate-pulse' :
                                    prop.status === 'passed' ? 'bg-success/10 border-success/30 text-success' :
                                        'bg-white/5 border-white/10 text-text-muted'
                                    }`}>
                                    {prop.status === 'active' && <Clock size={14} />}
                                    {prop.status === 'passed' && <CheckCircle2 size={14} />}
                                    {prop.status === 'failed' && <XCircle size={14} />}
                                    {prop.status}
                                </div>
                            </div>

                            <p className="text-xl text-text-muted font-medium mb-12 leading-relaxed max-w-2xl group-hover:text-text transition-colors">
                                {prop.description}
                            </p>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em]">
                                        <span className="text-success flex items-center gap-3"><TrendingUp size={14} /> FOR: {prop.forVotes}</span>
                                        <span className="text-text-muted">AGAINST: {prop.againstVotes}</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5 px-0.5 items-center">
                                        <div className="h-1.5 bg-success shadow-[0_0_20px_rgba(34,197,94,0.5)] rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                                        <div className="h-1.5 bg-white/10 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-mono text-xs text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 shadow-inner">
                                            0x
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Authored by</p>
                                            <p className="text-sm font-mono tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">{prop.proposer}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none bg-success/10 border border-success/30 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-success hover:bg-success hover:text-white transition-all duration-500 shadow-glow active:scale-95">Support</button>
                                        <button className="flex-1 sm:flex-none bg-white/5 border border-white/10 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:bg-white/10 hover:text-white transition-all active:scale-95">Oppose</button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Icon */}
                            <Vote className="absolute -right-16 -bottom-16 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-[2000ms] text-primary" size={320} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GovernancePage;
