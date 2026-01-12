import React from 'react';
import {
    ShieldCheck,
    Award,
    TrendingUp,
    AlertCircle,
    Star,
    CheckCircle2,
    Shield,
    Lock,
    Zap,
    Activity,
    UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReputationPage = () => {
    const stats = [
        { label: 'Trust Score', value: '98.4', trend: '+1.2%', icon: UserCheck, color: 'text-success' },
        { label: 'Decisions Validated', value: '1,240', trend: '100% Accuracy', icon: CheckCircle2, color: 'text-primary' },
        { label: 'Governance Power', value: '2.5k', trend: 'DAO Level 4', icon: Award, color: 'text-accent' },
    ];

    const badges = [
        { name: 'Early Adopter', date: 'Dec 2025', icon: Star, description: 'One of the first 1000 nodes on Shardeum.' },
        { name: 'FHE Guardian', date: 'Jan 2026', icon: Lock, description: 'Processed 500+ private transactions on Inco Lightning.' },
        { name: 'DAO Architect', date: 'Jan 2026', icon: Shield, description: 'Proposed 5 successful agent profiles.' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
        >
            <motion.header variants={itemVariants} className="space-y-4 pb-10 border-b border-white/5">
                <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck size={24} className="animate-pulse" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">On-Chain Cryptographic Identity</h4>
                </div>
                <h2 className="text-5xl font-black tracking-tighter uppercase">Agent <span className="gradient-text">Reputation</span></h2>
                <p className="text-xl text-text-muted font-medium max-w-2xl leading-relaxed">Your neural trust index is synthesized from verified MPC interactions, FHE-shielded operations, and active DAO contributions.</p>
            </motion.header>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="glass-panel p-10 holographic-card border-white/[0.05] bg-white/[0.02] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-700 flex items-center justify-center shadow-inner">
                                <stat.icon className={stat.color} size={32} />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[10px] font-black text-text-muted border border-white/5">
                                <TrendingUp size={12} className="text-success" /> {stat.trend}
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 relative z-10">{stat.label}</p>
                        <h3 className="text-5xl font-black tracking-tighter relative z-10">{stat.value}</h3>

                        {/* Background Decor */}
                        <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110">
                            <stat.icon size={150} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Badges Section */}
                <motion.div variants={itemVariants} className="glass-panel p-12 border-white/[0.05] bg-white/[0.01]">
                    <h4 className="section-label mb-12">
                        <Award size={16} className="text-accent" /> Protocol Achievements
                    </h4>
                    <div className="space-y-8">
                        {badges.map((badge, i) => (
                            <div key={i} className="flex items-center gap-8 p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-500 group">
                                <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-accent group-hover:rotate-6 transition-all duration-700 shadow-2xl border border-white/5">
                                    <badge.icon size={36} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-black italic text-2xl tracking-tight">{badge.name}</h5>
                                        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{badge.date}</span>
                                    </div>
                                    <p className="text-sm text-text-muted font-medium leading-relaxed">{badge.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Reputation Breakdown */}
                <motion.div variants={itemVariants} className="glass-panel p-12 border-primary/10 bg-primary/[0.02]">
                    <h4 className="section-label mb-12">
                        <Activity size={16} className="text-primary" /> Intelligence Audit Metrics
                    </h4>
                    <div className="space-y-12">
                        {[
                            { label: 'Security Contribution', val: '92%', color: 'from-primary to-accent', shadow: 'rgba(255,0,122,0.4)' },
                            { label: 'Yield Optimization', val: '85%', color: 'from-secondary to-blue-500', shadow: 'rgba(0,212,191,0.4)' },
                            { label: 'FHE Integration', val: '98%', color: 'from-success to-emerald-400', shadow: 'rgba(34,197,94,0.4)' }
                        ].map((metric, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] mb-4">
                                    <span>{metric.label}</span>
                                    <span style={{ color: `var(--${metric.color.split('-')[1]})` }}>{metric.val}</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 flex items-center px-0.5 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: metric.val }}
                                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                                        className={`h-1.5 rounded-full bg-gradient-to-r ${metric.color}`}
                                        style={{ boxShadow: `0 0 20px ${metric.shadow}` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-16 p-10 rounded-[40px] bg-primary/5 border border-primary/10 space-y-8 relative overflow-hidden group">
                            <p className="text-lg text-text-muted font-medium italic leading-relaxed relative z-10">
                                "Your agent is currently ranked in the <span className="text-primary font-black animate-pulse">Top 5%</span> of the network tier. High FHE synergy on Shardeum has maximized your cryptographic architecture score."
                            </p>
                            <button className="w-full btn-primary py-5 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase relative z-10 shadow-glow active:scale-95 transition-transform">
                                Upgrade Reputation Tier <Zap size={14} className="ml-2 inline" />
                            </button>
                            <Shield size={160} className="absolute -right-12 -bottom-12 text-primary opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ReputationPage;
