import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Hash, Layers, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RightSidebar = ({ provider, address }) => {
    const [prices, setPrices] = useState({
        SHM: { price: '0.00', change: '+0.00%' },
        ETH: { price: '0.00', change: '+0.00%' },
        BTC: { price: '0.00', change: '+0.00%' }
    });

    const [history, setHistory] = useState([
        { id: 1, type: 'CONFIDENTIAL', status: 'SETTLED', meta: 'STRATEGY_LOCKED' },
        { id: 2, type: 'PUBLIC', status: 'SETTLED', meta: 'SHM_TRANSFER' },
    ]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const symbols = ['SHM', 'ETH', 'BTC'];
                const newPrices = { ...prices };

                for (const s of symbols) {
                    if (s === 'SHM') {
                        newPrices[s] = { price: '0.05', change: '+2.45%' };
                        continue;
                    }
                    try {
                        const res = await fetch(`https://api.coinbase.com/v2/prices/${s}-USD/spot`);
                        if (res.ok) {
                            const data = await res.json();
                            newPrices[s] = { price: data.data.amount, change: '+1.24%' };
                        }
                    } catch (err) {
                        console.warn(`Could not fetch price for ${s}`);
                    }
                }
                setPrices(newPrices);
            } catch (e) {
                console.error("Price fetch error:", e);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-80 border-l border-green-900/30 bg-black flex flex-col h-full">
            {/* Market Watch */}
            <div className="p-6 border-b border-green-900/30">
                <h3 className="text-[10px] text-primary/50 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-primary" />
                    Market_Observatory
                </h3>

                <div className="space-y-4">
                    {Object.entries(prices).map(([symbol, data]) => (
                        <div key={symbol} className="p-3 rounded border border-green-950/30 bg-green-950/5 group hover:border-primary/30 transition-all cursor-default">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{symbol}_INDEX</span>
                                <span className="text-[10px] text-green-400">{data.change}</span>
                            </div>
                            <div className="text-lg font-mono text-white/90">${parseFloat(data.price).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History / Secure Logs */}
            <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-[10px] text-primary/50 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Hash size={14} className="text-primary" />
                    Settlement_Ledger
                </h3>

                <div className="space-y-3">
                    {history.map((tx) => (
                        <div key={tx.id} className="p-3 border-l-2 border-primary/20 bg-primary/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                {tx.type === 'CONFIDENTIAL' ? <ShieldCheck size={12} className="text-primary" /> : <Zap size={12} className="text-yellow-500" />}
                            </div>
                            <div className="text-[9px] text-primary/70 mb-1">{tx.type}</div>
                            <div className="text-[10px] text-white/80 font-mono mb-2">{tx.meta}</div>
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] bg-green-500/10 text-green-500 px-1 rounded border border-green-500/20">{tx.status}</span>
                                <span className="text-[8px] text-white/20">#0x{Math.floor(Math.random() * 9999).toString(16)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Infrastructure Node Info */}
            <div className="p-6 bg-green-950/10 border-t border-green-900/30">
                <div className="flex items-center gap-3 mb-4">
                    <Layers className="text-primary/70" size={16} />
                    <span className="text-[10px] font-bold text-white tracking-widest">NETWORK_METRICS</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[9px]">
                        <span className="text-white/40">LATENCY</span>
                        <span className="text-primary">12ms</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                        <span className="text-white/40">THROUGHPUT</span>
                        <span className="text-primary">4.2k TPS</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                        <span className="text-white/40">SHARDEUM_CONSENSUS</span>
                        <span className="text-primary">VERIFIED</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
