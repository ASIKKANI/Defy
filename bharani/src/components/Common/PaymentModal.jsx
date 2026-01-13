import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CreditCard,
    Smartphone,
    ShieldCheck,
    ChevronRight,
    Lock,
    CheckCircle2
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, planName = "Premium Model Access", amount = "249.99" }) => {
    const [method, setMethod] = useState('card'); // card, upi
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handlePay = () => {
        setIsProcessing(true);
        // Simulate payment gateway
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        }, 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="max-w-xl w-full bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden relative"
                >
                    {/* Progress Bar for processing */}
                    {isProcessing && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-1/2 h-full bg-primary shadow-[0_0_10px_#00FF41]"
                            />
                        </div>
                    )}

                    {isSuccess ? (
                        <div className="p-20 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary mb-8 animate-bounce">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Payment Secured</h2>
                            <p className="text-white/40 font-medium italic">Model access has been granted to your vault.</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-10 pb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2">Secure Checkout</h2>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">FinTech Node <span className="text-white/20">V.1</span></h3>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-10 pb-10">
                                {/* Left Side: Plan Summary */}
                                <div className="space-y-8">
                                    <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest block mb-4">Plan Selection</span>
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-lg font-black text-white">{planName}</span>
                                            <span className="text-primary font-mono text-xs">MONTHLY</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white">${amount}</span>
                                            <span className="text-xs text-white/30 font-bold">/ MO</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest block">Security Protocol</span>
                                        <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/5">
                                            <ShieldCheck size={18} className="text-primary" />
                                            <span className="text-[10px] text-white font-bold uppercase">PCI-DSS Level 1 Encrypted</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest px-2">
                                            <Lock size={10} />
                                            SSL SHA-256 PROTECTION ACTIVE
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Payment Methods */}
                                <div className="space-y-8">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setMethod('card')}
                                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${method === 'card' ? 'bg-primary/10 border-primary text-primary shadow-glow' : 'bg-white/5 border-white/5 text-white/40'}`}
                                        >
                                            <CreditCard size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Card</span>
                                        </button>
                                        <button
                                            onClick={() => setMethod('upi')}
                                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${method === 'upi' ? 'bg-primary/10 border-primary text-primary shadow-glow' : 'bg-white/5 border-white/5 text-white/40'}`}
                                        >
                                            <Smartphone size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">UPI / Mobile</span>
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {method === 'card' ? (
                                            <motion.div
                                                key="card"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Card Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Expiry</label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM / YY"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">CVC</label>
                                                        <input
                                                            type="password"
                                                            placeholder="***"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="upi"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">UPI ID</label>
                                                    <input
                                                        type="text"
                                                        placeholder="user@bankname"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center px-2 grayscale opacity-50 contrast-125">
                                                    {['GooglePay', 'PhonePe', 'Paytm', 'AmazonPay'].map(app => (
                                                        <div key={app} className="text-[8px] font-black uppercase tracking-tighter text-white border border-white/20 px-2 py-1 rounded">
                                                            {app}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        onClick={handlePay}
                                        disabled={isProcessing}
                                        className="w-full py-5 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2 group"
                                    >
                                        {isProcessing ? 'Verifying...' : 'Pay Now'}
                                        {!isProcessing && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
