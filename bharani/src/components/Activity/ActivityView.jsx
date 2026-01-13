import React, { useState } from 'react';
import {
    Activity,
    Search,
    Download,
    Play,
    ShieldCheck,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    ExternalLink,
    Cpu
} from 'lucide-react';

const MOCK_ACTIVITY = [
    { id: 1, agent: 'Yield Sentinel', action: 'LP Deposit', amount: '1,200 SHM', time: '10:42 AM', status: 'Success', type: 'PUBLIC' },
    { id: 2, agent: 'Stealth Arbitrator', action: 'Privacy Swap', amount: '4,500 SHM', time: '09:15 AM', status: 'Success', type: 'CONFIDENTIAL' },
    { id: 3, agent: 'Shard Guardian', action: 'Risk Adjustment', amount: 'N/A', time: 'Yesterday', status: 'Success', type: 'PUBLIC' },
    { id: 4, agent: 'Neural Quant', action: 'Strategy Log', amount: '22,000 SHM', time: 'Yesterday', status: 'Reverted', type: 'CONFIDENTIAL' },
    { id: 5, agent: 'Yield Sentinel', action: 'Reward Claim', amount: '45.2 SHM', time: 'Jan 10', status: 'Success', type: 'PUBLIC' },
];

const ActivityView = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="p-12 max-w-7xl mx-auto h-full overflow-y-auto">
            <header className="mb-16 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <Activity size={24} />
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Interaction History</span>
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none">
                        Agent <span className="gradient-text">Activity</span>
                    </h1>
                </div>
                <button className="py-4 px-6 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2 group">
                    <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    Export Protocol JSON
                </button>
            </header>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Search by hash, agent or action..."
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
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Agent Module</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Executed Action</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Quantum/Amount</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Timestamp</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Audit State</th>
                            <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ACTIVITY.map((log) => (
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
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${log.status === 'Success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-primary transition-all group-hover:scale-110" title="Forensic Replay">
                                            <Play size={14} className="fill-current" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-primary transition-all group-hover:scale-110" title="Explorer">
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">--- EOF_LEDGER ---</p>
            </div>
        </div>
    );
};

export default ActivityView;
