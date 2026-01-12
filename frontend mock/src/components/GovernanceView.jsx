import React from 'react';
import { ShieldCheck, Vote, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_PROPOSALS = [
    { id: 1, title: "Upgrade Yield Sentinel to v2.1", status: "Active", votesFor: 85, deadline: "2 days left", description: "Implement new liquidity aggregation strategy for better APR." },
    { id: 2, title: "Slash 'Degen Farmer' for Malicious Logic", status: "Active", votesFor: 68, deadline: "4 hours left", description: "Agent detected attempting front-running attacks. Proposal to slash 100% of 10k SHM stake.", isSlashing: true },
    { id: 3, title: "Whitelist 'Arbitrage Master' Agent", status: "Passed", votesFor: 92, deadline: "Executed", description: "Add a high-risk high-reward arbitrage agent to the registry." },
    { id: 4, title: "Update Vault Guardian Safety Threshold", status: "Pending", votesFor: 12, deadline: "5 days left", description: "Decrease LTV limit from 80% to 75% for better capital protection." }
];

const GovernanceView = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <h1 className="text-gradient">DAO Governance</h1>
                <p className="subtitle">The community regulates every AI agent listed on AgentChain.</p>
            </header>

            <div className="gov-stats">
                <div className="stat-card glass">
                    <Users size={20} color="var(--primary)" />
                    <div>
                        <span className="stat-label">Active Voters</span>
                        <div className="stat-value">1,242</div>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Vote size={20} color="var(--primary)" />
                    <div>
                        <span className="stat-label">Proposals Passed</span>
                        <div className="stat-value">48</div>
                    </div>
                </div>
            </div>

            <div className="proposals-list">
                {MOCK_PROPOSALS.map((p, i) => (
                    <motion.div
                        key={p.id}
                        className="proposal-card glass"
                        style={p.isSlashing ? { borderColor: '#FF3B3B', background: 'rgba(255, 59, 59, 0.05)' } : {}}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="prop-header">
                            <span className={`status-tag ${p.status.toLowerCase()}`}>{p.status}</span>
                            <span className="deadline">{p.deadline}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <div className="prop-footer">
                            <div className="vote-progress-box">
                                <div className="vote-bar-bg">
                                    <div className="vote-bar-fill" style={{ width: `${p.votesFor}%` }}></div>
                                </div>
                                <span className="vote-percent" style={p.isSlashing ? { color: '#FF3B3B' } : {}}>{p.votesFor}% {p.isSlashing ? 'Favor Slash' : 'For'}</span>
                            </div>
                            <button className="vote-btn" style={p.isSlashing ? { borderColor: '#FF3B3B', color: '#FF3B3B' } : {}}>Vote Now</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
        .view-container { max-width: 1000px; margin: 0 auto; }
        .gov-stats { display: flex; gap: 2rem; margin-bottom: 3rem; }
        .stat-card { padding: 1.5rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; flex: 1; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
        .stat-value { font-size: 1.5rem; font-weight: 700; }
        
        .proposals-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .proposal-card { padding: 2rem; border-radius: 20px; }
        .prop-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
        .status-tag { font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; text-transform: uppercase; }
        .status-tag.active { background: rgba(0, 255, 163, 0.1); color: var(--primary); }
        .status-tag.passed { background: rgba(112, 0, 255, 0.1); color: var(--secondary); }
        .status-tag.pending { background: rgba(255, 184, 0, 0.1); color: #FFB800; }
        .deadline { font-size: 0.8rem; color: var(--text-muted); }
        
        .vote-progress-box { flex: 1; }
        .vote-bar-bg { height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }
        .vote-bar-fill { height: 100%; background: var(--primary); border-radius: 3px; }
        .vote-percent { font-size: 0.75rem; font-weight: 600; }
        
        .prop-footer { display: flex; align-items: center; gap: 2rem; margin-top: 1.5rem; }
        .vote-btn { padding: 0.6rem 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text-main); font-weight: 600; }
        .vote-btn:hover { background: var(--primary); color: black; }
      `}</style>
        </div>
    );
};

export default GovernanceView;
