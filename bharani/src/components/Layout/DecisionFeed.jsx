import React, { useState, useEffect } from 'react';
import {
    Activity,
    Lock,
    ExternalLink,
    ChevronRight,
    Cpu,
    Hash
} from 'lucide-react';
import { getLogs, subscribeLogs } from '../../services/log-service';

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
            {event.status === 'Processing' ? 'Executing cognitive plan layer...' :
                `Settled on Shardeum ledger. Status: ${event.status}`}
        </p>

        <div className="flex items-center justify-between">
            {event.type === 'CONFIDENTIAL' ? (
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

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
);

const DecisionFeed = () => {
    const [events, setEvents] = useState(getLogs());

    useEffect(() => {
        return subscribeLogs((newLogs) => {
            setEvents([...newLogs]);
        });
    }, []);

    return (
        <div className="flex flex-col h-full bg-black border-l border-green-900/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-green-900/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Activity size={16} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Live Network Decisions</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#00FF41]" />
                            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">In-Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}

                {events.length === 0 && (
                    <div className="p-8 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                        <Activity size={24} className="mx-auto text-white/10 mb-4" />
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                            No active pulses detected.
                        </p>
                    </div>
                )}

                {[...Array(Math.max(0, 3 - events.length))].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 opacity-10 filter blur-[1px]">
                        <div className="w-24 h-2 bg-white/20 rounded mb-2" />
                        <div className="w-full h-10 bg-white/10 rounded" />
                    </div>
                ))}
            </div>

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
