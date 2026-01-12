import { ShieldCheck, Lock, Coins, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const MOCK_AGENTS = [
    {
        id: 'defy-live',
        name: 'DEFY Oracle',
        purpose: 'Direct interface to the DEFY Confidential Agentic OS (Live Backend).',
        risk: 'Low',
        reputation: 100,
        status: 'Live Beta',
        color: '#00D1FF',
        stake: '1,000,000 SHM',
        isPremium: false
    },
    {
        id: 1,
        name: 'Yield Sentinel',
        purpose: 'Optimizes SHM staking and liquidity provision across Shardeum dApps.',
        risk: 'Low',
        reputation: 98,
        status: 'Active',
        color: '#00FFA3',
        stake: '50,000 SHM',
        isPremium: false
    },
    {
        id: 2,
        name: 'Vault Guardian',
        purpose: 'Automated collateral management and liquidation protection for lending protocols.',
        risk: 'Medium',
        reputation: 95,
        status: 'Active',
        color: '#7000FF',
        stake: '120,000 SHM',
        isPremium: false
    },
    {
        id: 3,
        name: 'Trade Oracle',
        purpose: 'Executing complex swap strategies and arbitrage across emerging DEXs.',
        risk: 'High',
        reputation: 82,
        status: 'Under Review',
        color: '#FF3B3B',
        stake: '10,000 SHM',
        isPremium: false
    },
    {
        id: 5,
        name: 'Alpha Predator v1',
        purpose: 'Institutional-grade arbitrage bot with HFT execution logic.',
        risk: 'High',
        reputation: 99,
        status: 'Premium',
        color: '#F0B90B',
        stake: '500,000 SHM',
        isPremium: true,
        price: '100 SHM/mo'
    }
];

const AgentDashboard = ({ onSelectAgent }) => {
    const [subscribingTo, setSubscribingTo] = useState(null);

    const handleAgentClick = (agent) => {
        if (agent.isPremium) {
            setSubscribingTo(agent);
        } else {
            onSelectAgent(agent);
        }
    };

    const confirmSubscription = () => {
        // Simulate payment unlock
        if (subscribingTo) {
            // In a real app, update state/context here
            onSelectAgent(subscribingTo);
            setSubscribingTo(null);
        }
    };

    return (
        <div className="dashboard-root">
            <header className="dashboard-header">
                <h1 className="text-gradient">Verified AI Agents</h1>
                <p className="subtitle">Only DAO-approved agents verified for safety and logic transparency are listed here.</p>
            </header>

            <div className="agent-grid">
                {MOCK_AGENTS.map((agent, index) => (
                    <motion.div
                        key={agent.id}
                        className={`agent-card glass ${agent.isPremium ? 'premium-agent' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, borderColor: agent.color }}
                        onClick={() => handleAgentClick(agent)}
                    >
                        <div className="card-header">
                            <div className="agent-icon-box" style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40` }}>
                                {agent.isPremium ? <Lock color={agent.color} size={24} /> : <ShieldCheck color={agent.color} size={24} />}
                            </div>
                            <div className="header-badges">
                                <div className="stake-badge" title="Developer Stake">
                                    <Coins size={12} /> {agent.stake}
                                </div>
                                <div className="agent-status-badge" style={{ color: agent.color, background: `${agent.color}10` }}>
                                    {agent.status}
                                </div>
                            </div>
                        </div>

                        <h3 className="agent-name">{agent.name}</h3>
                        <p className="agent-purpose">{agent.purpose}</p>

                        <div className="agent-stats">
                            <div className="stat-item">
                                <span className="stat-label">Risk Level</span>
                                <span className={`stat-value risk-${agent.risk.toLowerCase()}`}>{agent.risk}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Reputation</span>
                                <div className="rep-bar-container">
                                    <div className="rep-bar" style={{ width: `${agent.reputation}%`, background: agent.color }}></div>
                                    <span className="rep-text">{agent.reputation}%</span>
                                </div>
                            </div>
                        </div>

                        <button className="select-btn" style={{ '--hover-color': agent.color }}>
                            {agent.isPremium ? 'Subscribe to Unlock' : 'Interact with Agent'}
                        </button>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {subscribingTo && (
                    <div className="modal-backdrop">
                        <motion.div
                            className="subscription-modal glass"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <div className="modal-icon-bg">
                                    <Sparkles size={32} color="#F0B90B" />
                                </div>
                                <h2>Unlock Premium Agent</h2>
                                <p>You are about to subscribe to <b>{subscribingTo.name}</b></p>
                            </div>

                            <div className="sub-details">
                                <div className="detail-row">
                                    <span>Subscription Price</span>
                                    <span className="price-tag">{subscribingTo.price}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Developer Stake</span>
                                    <span>{subscribingTo.stake}</span>
                                </div>
                                <div className="feature-list">
                                    <li>✓ HFT Logic Engine</li>
                                    <li>✓ Priority Execution</li>
                                    <li>✓ 24/7 Support</li>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setSubscribingTo(null)}>Cancel</button>
                                <button className="confirm-btn" onClick={confirmSubscription}>Pay & Unlock</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentDashboard;
