import React from 'react';
import { motion } from 'framer-motion';
import { useAccess, ACCESS_LEVELS } from '../../context/AccessContext';
import { ShieldCheck, Activity, Lock, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const AccessTierCard = () => {
    const { tier, upgradeToPro } = useAccess();
    const isPro = tier === ACCESS_LEVELS.PRO;

    const freeFeatures = [
        "Default Trading Agent Access",
        "Prompt → Decision Transparency",
        "Single Wallet Connection",
        "Basic BUY / SELL / HOLD Signals",
        "Human Approval Before Any Action",
        "Readable Agent Reasoning Output",
        "Limited Historical Decisions View",
        "Standard Thinking State Visualization"
    ];

    const proFeatures = [
        "Unlimited Token Usage (All Agents & Models)",
        "Multi-Wallet Management & Switching",
        "Agent Consensus Validation (Multi-Agent Debate)",
        "Simulation Mode (Pre-Execution Dry Runs)",
        "Confidential Parameters (Hidden Strategy Inputs)",
        "External Model Support (Custom LLM Routing)",
        "Advanced Risk Controls & Limits",
        "Full Historical & Forensic Replay",
        "Governance Participation Visibility",
        "Priority Execution & Reduced Latency"
    ];

    return (
        <div className="space-y-8 font-mono">
            <div className="p-8 rounded-[40px] border border-white/10 bg-black relative overflow-hidden group">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${isPro ? 'bg-purple-500 shadow-purple-500' : 'bg-primary shadow-primary'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Access Control System</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            TIER: <span className={isPro ? 'text-purple-400' : 'text-primary'}>{tier} USER</span>
                        </h2>
                    </div>
                    {isPro ? (
                        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest italic">
                            INSTITUTIONAL_GRADE
                        </div>
                    ) : (
                        <button
                            onClick={upgradeToPro}
                            className="px-6 py-3 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-glow"
                        >
                            Request Upgrade
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-white/5 py-12">
                    {/* Free Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">Baseline Logic</span>
                        </div>
                        <div className="space-y-3">
                            {freeFeatures.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 group/item">
                                    <CheckCircle2 size={12} className="text-primary mt-0.5" />
                                    <span className="text-[10px] text-white/60 font-medium group-hover/item:text-white transition-colors">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Lock size={16} className={isPro ? 'text-purple-400' : 'text-white/20'} />
                            <span className={`text-xs font-black uppercase tracking-widest ${isPro ? 'text-purple-400' : 'text-white/20'}`}>Advanced Protocols</span>
                        </div>
                        <div className="space-y-3">
                            {proFeatures.map((f, i) => (
                                <div key={i} className={`flex items-start gap-3 group/item ${!isPro ? 'opacity-30' : ''}`}>
                                    {isPro ? (
                                        <CheckCircle2 size={12} className="text-purple-400 mt-0.5" />
                                    ) : (
                                        <XCircle size={12} className="text-white/20 mt-0.5" />
                                    )}
                                    <span className="text-[10px] font-medium leading-tight group-hover/item:text-white transition-colors">
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Guarantees */}
                <div className="pt-8 flex flex-wrap gap-8">
                    {[
                        { label: 'STATUS', val: 'USER REMAINS IN FULL CONTROL' },
                        { label: 'SECURITY', val: 'NO ON-CHAIN ACTION WITHOUT APPROVAL' },
                        { label: 'TRANSPARENCY', val: 'ALL DECISIONS ARE EXPLAINED' }
                    ].map((g, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-white/20">[{g.label}]</span>
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">:: {g.val}</span>
                        </div>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[120px] pointer-events-none" />
            </div>

            {!isPro && (
                <div className="p-6 rounded-[32px] border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Unlock Multi-Agent Consensus</h4>
                            <p className="text-[10px] text-white/30 font-medium">Elevate your strategy with round-table validation from 3+ high-confidence models.</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
            )}
        </div>
    );
};

export default AccessTierCard;
