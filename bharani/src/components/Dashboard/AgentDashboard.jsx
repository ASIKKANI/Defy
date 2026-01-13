import React, { useState } from 'react';
import {
    Shield,
    Lock,
    Star,
    TrendingUp,
    Cpu,
    Zap,
    Info,
    ChevronRight,
    Search,
    CheckCircle2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_AGENTS = [
    {
        id: 'sentinel',
        name: 'Yield Sentinel',
        purpose: 'Autonomous LP balancing and reward harvesting across Shardeum pools.',
        status: 'Active',
        stake: '5,000 SHM',
        risk: 'Low',
        reputation: 98,
        isPremium: false,
        icon: Shield,
        color: 'var(--primary)'
    },
    {
        id: 'arbitrator',
        name: 'Stealth Arbitrator',
        purpose: 'Deep-liquidity arbitrage using FHE for complete strategy obfuscation.',
        status: 'Premium',
        stake: '25,000 SHM',
        risk: 'Medium',
        reputation: 85,
        isPremium: true,
        icon: Lock,
        color: '#a78bfa'
    },
    {
        id: 'guardian',
        name: 'Shard Guardian',
        purpose: 'Risk management engine that protects portfolios from sudden volatility.',
        status: 'Active',
        stake: '1,200 SHM',
        risk: 'Low',
        reputation: 99,
        isPremium: false,
        icon: Cpu,
        color: 'var(--primary)'
    },
    {
        id: 'quant',
        name: 'Neural Quant',
        purpose: 'Predictive modeling based on on-chain sentiment and social signals.',
        status: 'Premium',
        stake: '50,000 SHM',
        risk: 'High',
        reputation: 72,
        isPremium: true,
        icon: Zap,
        color: '#a78bfa'
    }
];

const PremiumModal = ({ isOpen, onClose, agent }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full glass-modal p-8 rounded-3xl relative"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Unlock Premium Agent</h2>
                    <p className="text-sm text-white/50 leading-relaxed">
                        Gain access to the <span className="text-purple-400 font-bold">{agent?.name}</span>'s advanced FHE-shielded algorithms and high-throughput execution engines.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {[
                        'Zero-Knowledge Intent Protection',
                        'Priority Mempool Access',
                        'Multi-Agent Consensus Layer',
                        'Institutional-Grade Security Audit'
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-white/80">
                            <CheckCircle2 size={16} className="text-purple-400" />
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 mb-8 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest leading-none mb-1">Access Fee</span>
                        <span className="text-2xl font-black text-white">$249.99 <span className="text-xs text-white/30">/ Month</span></span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase italic border border-purple-500/30">
                        Save 20%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onClose} className="py-4 rounded-xl border border-white/10 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                    <button className="py-4 rounded-xl bg-purple-500 text-black text-xs font-black uppercase tracking-widest hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]">Pay & Unlock</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AgentCard = ({ agent, onInteract }) => {
    const Icon = agent.icon;

    return (
        <div className="p-6 rounded-3xl border border-green-950/20 bg-green-950/5 card-hover flex flex-col group h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ borderColor: agent.color + '33', background: agent.color + '11', color: agent.color }}>
                    <Icon size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${agent.isPremium ? 'badge-premium' : 'badge-active'}`}>
                        {agent.status}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        Stake: {agent.stake}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                {agent.name}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed mb-8 flex-1">
                {agent.purpose}
            </p>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/30">Reputation Score</span>
                    <span className="text-primary">{agent.reputation}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${agent.reputation}%` }} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 font-bold uppercase">Risk Level</span>
                        <span className={`text-[10px] font-black uppercase ${agent.risk === 'Low' ? 'text-primary' : agent.risk === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                            }`}>{agent.risk}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onInteract(agent)}
                className="w-full py-4 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2"
            >
                {agent.isPremium ? 'Premium Access' : 'Interact Now'}
                <ChevronRight size={14} />
            </button>
        </div>
    );
};

const AgentDashboard = ({ onSelectAgent }) => {
    const [search, setSearch] = useState('');
    const [selectedPremium, setSelectedPremium] = useState(null);

    const handleInteract = (agent) => {
        if (agent.isPremium) {
            setSelectedPremium(agent);
        } else {
            onSelectAgent(agent);
        }
    };

    return (
        <div className="p-12 max-w-7xl mx-auto h-full overflow-y-auto">
            <header className="mb-16">
                <h1 className="text-6xl font-black uppercase tracking-tighter text-white mb-4 leading-none">
                    Verified AI <span className="gradient-text">Agents</span>
                </h1>
                <p className="text-xl text-white/40 max-w-2xl font-medium">
                    Deploy autonomous intelligence modules secured by Fully Homomorphic Encryption.
                </p>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-8 mb-12">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by capability or agent name..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-primary/50 outline-none transition-all focus:shadow-[0_0_20px_rgba(0,255,65,0.05)]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">All Protocols</button>
                    <button className="px-6 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">Trending</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                {MOCK_AGENTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map(agent => (
                    <AgentCard key={agent.id} agent={agent} onInteract={handleInteract} />
                ))}
            </div>

            <PremiumModal
                isOpen={!!selectedPremium}
                onClose={() => setSelectedPremium(null)}
                agent={selectedPremium}
            />
        </div>
    );
};

export default AgentDashboard;
