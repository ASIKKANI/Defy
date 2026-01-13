import React from 'react';
import {
    Globe,
    Users,
    CheckCircle2,
    ShieldAlert,
    TrendingUp,
    Clock,
    ChevronRight,
    Vote,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_PROPOSALS = [
    {
        id: 1,
        status: 'Active',
        title: 'Increase Stealth-Node Throughput',
        description: 'Proposal to allocate 50,000 SHM for upgrading the FHE-processing nodes to reduce strategy latency by 15%.',
        votesFor: 85,
        isSlashing: false
    },
    {
        id: 2,
        status: 'Passed',
        title: 'Onboard Llama-3.1 Orchestrator',
        description: 'Transition the primary reasoning engine to Llama-3.1 for enhanced tool selection accuracy.',
        votesFor: 98,
        isSlashing: false
    },
    {
        id: 3,
        status: 'Active',
        title: 'Slash Malicious Agent #3011',
        description: 'Internal audit detected non-deterministic execution in "Yield Master" logic. Proposing 50% stake slashing.',
        votesFor: 42,
        isSlashing: true
    }
];

const ProposalCard = ({ proposal }) => {
    return (
        <div className={`p-8 rounded-[32px] border ${proposal.isSlashing ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/5'} hover:border-primary/20 transition-all group`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <span className={`badge ${proposal.status === 'Active' ? 'badge-active' : 'bg-white/10 text-white/40'}`}>
                        {proposal.status}
                    </span>
                    {proposal.isSlashing && (
                        <span className="badge bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                            <ShieldAlert size={10} /> SLASHING
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> 2 days remaining
                </span>
            </div>

            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">{proposal.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-8">{proposal.description}</p>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                    <span>Consensus Progress</span>
                    <span>{proposal.votesFor}%</span>
                </div>
                <div className="progress-bar-bg h-2">
                    <div className="progress-bar-fill shadow-[0_0_8px_#00FF41]" style={{ width: `${proposal.votesFor}%` }} />
                </div>
            </div>

            <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${proposal.isSlashing
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black hover:border-red-500'
                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black hover:border-primary'
                }`}>
                <Vote size={14} />
                Cast Vote Power
            </button>
        </div>
    );
};

const GovernanceView = () => {
    return (
        <div className="p-12 max-w-7xl mx-auto h-full overflow-y-auto">
            <header className="mb-16">
                <div className="flex items-center gap-3 text-primary mb-4">
                    <Globe className="animate-spin-slow" size={24} />
                    <span className="text-xs font-black uppercase tracking-[0.5em]">Protocol Governance</span>
                </div>
                <h1 className="text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
                    DAO <span className="gradient-text">Management</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="p-8 rounded-[40px] border border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Active Voters</span>
                        <span className="text-4xl font-black text-white">12,482</span>
                    </div>
                    <Users size={48} className="text-primary/20" />
                </div>
                <div className="p-8 rounded-[40px] border border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Proposals Passed</span>
                        <span className="text-4xl font-black text-white">156</span>
                    </div>
                    <CheckCircle2 size={48} className="text-primary/20" />
                </div>
            </div>

            <div className="space-y-8 pb-20">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Active Proposals</h2>
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase hover:underline">
                        Create Proposal <FileText size={12} />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {MOCK_PROPOSALS.map(prop => (
                        <ProposalCard key={prop.id} proposal={prop} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GovernanceView;
