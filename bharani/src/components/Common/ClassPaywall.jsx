import React, { useState } from 'react';
import {
    CreditCard,
    Smartphone,
    Banknote,
    Wallet,
    X,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassPaywall = ({ isOpen, onClose, product }) => {
    const [method, setMethod] = useState('card'); // card, upi, banking, wallet
    const [state, setState] = useState('idle'); // idle, processing, success

    const handlePay = () => {
        setState('processing');
        setTimeout(() => {
            setState('success');
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
        >
            <div className="max-w-4xl w-full bg-[#050505] border border-white/10 rounded-[40px] overflow-hidden flex shadow-[0_0_100px_rgba(0,0,0,1)] relative">
                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20">
                    <X size={24} />
                </button>

                {state === 'processing' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6">
                        <Loader2 size={64} className="text-primary animate-spin" />
                        <div className="text-center">
                            <h3 className="text-2xl font-black uppercase text-white mb-2 italic">Securing Pipeline...</h3>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Verifying encrypted credit hash</p>
                        </div>
                    </div>
                )}

                {state === 'success' && (
                    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary mb-8 shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-4xl font-black uppercase text-white mb-4 italic">Payment <span className="gradient-text">Confirmed</span></h3>
                        <p className="text-white/40 max-w-sm mb-12">Transaction ID: <span className="text-primary font-mono lowercase">ac_hash_{Math.random().toString(36).substring(7)}</span>. Premium modules are now unlocked.</p>
                        <button
                            onClick={onClose}
                            className="py-5 px-12 rounded-2xl bg-primary text-black font-black uppercase text-xs tracking-widest hover:brightness-110 shadow-glow"
                        >
                            Return to Protocol
                        </button>
                    </div>
                )}

                {/* Left Side: Order Summary */}
                <div className="w-2/5 p-12 bg-white/[0.02] border-r border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-12">Order Summary</h3>

                    <div className="space-y-8 mb-12">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-white uppercase italic">{product?.name || 'Premium Agent Access'}</span>
                                <span className="text-[10px] text-white/30 font-bold uppercase">Monthly Alpha Subscription</span>
                            </div>
                            <span className="text-lg font-black text-white italic">$249.99</span>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between text-xs font-bold text-white/40">
                                <span>Subtotal</span>
                                <span>$249.99</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-white/40">
                                <span>FHE Tax (2%)</span>
                                <span>$5.00</span>
                            </div>
                            <div className="pt-4 flex justify-between items-end">
                                <span className="text-xs font-black uppercase text-white tracking-widest">Total Price</span>
                                <span className="text-3xl font-black text-white">$254.99</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                        <ShieldCheck className="text-primary" size={24} />
                        <p className="text-[9px] text-primary/60 font-black uppercase leading-relaxed">
                            Payments are processed via a zero-knowledge gateway. No card details are stored locally.
                        </p>
                    </div>
                </div>

                {/* Right Side: Payment Methods */}
                <div className="flex-1 p-12 pb-20 overflow-y-auto">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-12">Select Quantum Channel</h3>

                    <div className="flex gap-4 mb-12">
                        {[
                            { id: 'card', icon: CreditCard, label: 'Card' },
                            { id: 'upi', icon: Smartphone, label: 'UPI' },
                            { id: 'banking', icon: Banknote, label: 'NetBank' },
                            { id: 'wallet', icon: Wallet, label: 'Wallet' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setMethod(t.id)}
                                className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${method === t.id ? 'bg-primary/10 border-primary text-primary shadow-glow' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
                                    }`}
                            >
                                <t.icon size={20} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {method === 'card' && (
                            <motion.div
                                key="card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/40 font-black uppercase pl-2">V-Card Number</label>
                                    <div className="relative">
                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-primary/50" />
                                        <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-black uppercase pl-2">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-black uppercase pl-2">CVV Cluster</label>
                                        <input type="password" placeholder="***" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-primary/50" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {method === 'upi' && (
                            <motion.div
                                key="upi"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {['GPay', 'PhonePe', 'Paytm', 'Amazon Pay'].map(app => (
                                        <button key={app} className="p-4 rounded-xl border border-white/5 bg-white/5 text-xs font-bold text-white/60 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-between">
                                            {app} <ChevronRight size={14} />
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                    <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-[#050505] px-4 text-white/20">or enter ID</span></div>
                                </div>
                                <input type="text" placeholder="yourname@upi" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-primary/50" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handlePay}
                        className="w-full mt-12 py-5 rounded-2xl bg-primary text-black font-black uppercase text-xs tracking-[0.4em] hover:brightness-110 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-3 group"
                    >
                        <Zap size={18} className="fill-current group-hover:rotate-12 transition-transform" />
                        Initiate Settlement
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ClassPaywall;
