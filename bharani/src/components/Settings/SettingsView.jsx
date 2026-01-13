import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Lock,
    Zap,
    Server,
    Bell,
    Eye,
    Database,
    Terminal,
    Save,
    Trash2
} from 'lucide-react';

const SettingsView = () => {
    const [rpc, setRpc] = useState('https://sphinx.shardeum.org');

    return (
        <div className="p-12 max-w-4xl mx-auto h-full overflow-y-auto">
            <header className="mb-16">
                <div className="flex items-center gap-3 text-primary mb-4">
                    <Settings size={24} />
                    <span className="text-xs font-black uppercase tracking-[0.5em]">System Core</span>
                </div>
                <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none">
                    System <span className="gradient-text">Prefs</span>
                </h1>
            </header>

            <div className="space-y-12 pb-20">
                {/* Risk Safety Limits */}
                <section className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                        <Shield size={16} className="text-primary" /> Risk Safety Limits
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] text-white/30 font-black uppercase tracking-widest pl-2">Global Max Transaction</label>
                            <div className="relative">
                                <input type="text" defaultValue="50000" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary/50" />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary">SHM</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-white/30 font-black uppercase tracking-widest pl-2">Slippage Ceiling</label>
                            <div className="relative">
                                <input type="text" defaultValue="0.5" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary/50" />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary">%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy Engine */}
                <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                        <Lock size={16} className="text-primary" /> Privacy Engine
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Hide Prompt Metadata', desc: 'Prevents the LLM from logging the original user prompt in plain text on-chain.', enabled: true },
                            { label: 'Shielded Parameter Mode', desc: 'Encrypts individual tool parameters using Inco FHE before gateway transmission.', enabled: true },
                            { label: 'Forensic Audit Logs', desc: 'Stores a local, encrypted database of all AI reasoning steps for forensic replay.', enabled: false }
                        ].map((opt, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group">
                                <div className="space-y-1">
                                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{opt.label}</span>
                                    <p className="text-[10px] text-white/30 font-medium leading-relaxed">{opt.desc}</p>
                                </div>
                                <button className={`w-12 h-6 rounded-full p-1 transition-colors ${opt.enabled ? 'bg-primary/20' : 'bg-white/10'}`}>
                                    <div className={`w-4 h-4 rounded-full transition-transform ${opt.enabled ? 'translate-x-6 bg-primary' : 'bg-white/20'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Network Configuration */}
                <section className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                        <Server size={16} className="text-primary" /> Network Configuration
                    </h3>
                    <div className="space-y-3">
                        <label className="text-[10px] text-white/30 font-black uppercase tracking-widest pl-2">RPC Endpoint (Shardeum)</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={rpc}
                                onChange={(e) => setRpc(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary/50 font-mono"
                            />
                            <button className="px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                Check
                            </button>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-white/5 flex gap-4">
                    <button className="flex-1 py-4 rounded-2xl bg-primary text-black font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        <Save size={16} /> Save Configuration
                    </button>
                    <button className="px-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-black transition-all flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
