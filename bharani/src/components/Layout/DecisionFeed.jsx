import React, { useState } from 'react';
import {
    Activity,
    Shield,
    Lock,
    ExternalLink,
    ChevronRight,
    Clock,
    Cpu,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_EVENTS = [
    {
        id: '0x3a...f5e1',
        agent: 'Yield Sentinel',
        action: 'Rebalanced Portfolio',
        time: '2 mins ago',
        summary: 'Optimized SHM/USDT liquidity provision based on volatility spike.',
        isPrivate: false,
    },
    {
        id: '0x9c...a8b2',
        agent: 'Stealth Arbitrage',
        action: 'Confidential Execution',
        time: '12 mins ago',
        summary: 'Executed FHE-shielded cross-dex swap for maximum price protection.',
        isPrivate: true,
    },
    {
        id: '0x1e...c7d8',
        agent: 'Governance Bot',
        action: 'Voted on Prop #42',
        time: '45 mins ago',
        summary: 'Automated consensus alignment for Shardeum throughput upgrade.',
        isPrivate: false,
    },
    {
        id: '0x7b...e9a4',
        agent: 'Risk Manager',
        action: 'Emergency Withdrawal',
        time: '1 hour ago',
        summary: 'Removed liquidity from high-slippage pool detected by AI sensors.',
        isPrivate: true,
    }
];

const EventCard = ({ event }) => (
    <div className="p-4 rounded-xl border border-green-950/30 bg-green-950/5 hover:border-primary/30 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                <span className="text-[10px] text-primary font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <Cpu size={12} />
                    {event.agent}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{event.action}</h4>
            </div>
            <span className="text-[9px] text-white/20 italic">{event.time}</span>
        </div>

        <p className="text-[10px] text-white/50 leading-relaxed mb-4">
            {event.summary}
        </p>

        <div className="flex items-center justify-between">
            {event.isPrivate ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Lock size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Confidential Logic</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary">
                    <Activity size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Public Trace</span>
                </div>
            )}
            <button className="text-white/20 hover:text-primary transition-colors">
                <ExternalLink size={12} />
            </button>
        </div>

        {/* Subtle sweep animation on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
);

const DecisionFeed = () => {
    return (
        <div className="flex flex-col h-full bg-black border-l border-green-900/10">
            {/* Header */}
            <div className="p-6 border-b border-green-900/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Activity size={16} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Live Network Decisions</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">In-Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {MOCK_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}

                {/* Fillers for scrolling visual */}
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 opacity-20 filter blur-[1px]">
                        <div className="w-24 h-2 bg-white/20 rounded mb-2" />
                        <div className="w-full h-10 bg-white/10 rounded" />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-green-900/10">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group">
                    <Hash size={14} className="group-hover:rotate-12 transition-transform" />
                    View Decision Explorer
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default DecisionFeed;
