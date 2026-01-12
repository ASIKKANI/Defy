import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    ChevronRight,
    ExternalLink,
    Lock,
    Cpu
} from 'lucide-react';

const MOCK_DECISIONS = [
    {
        id: 1,
        agent: 'Yield Sentinel',
        action: 'Rebalanced Portfolio',
        time: '2m ago',
        type: 'public',
        summary: 'Moved 450 SHM to Liquidity Pool X to capture 12% APR spike.'
    },
    {
        id: 2,
        agent: 'Vault Guardian',
        action: 'Collateral Adjusted',
        time: '15m ago',
        type: 'confidential',
        summary: 'Executed risk-mitigation strategy based on private parameters.'
    },
    {
        id: 3,
        agent: 'Trade Oracle',
        action: 'Arbitrage Executed',
        time: '42m ago',
        type: 'public',
        summary: 'Captured $12 spread between Swapter and ShardeumSwap.'
    },
    {
        id: 4,
        agent: 'Yield Sentinel',
        action: 'Auto-Staked Rewards',
        time: '1h ago',
        type: 'public',
        summary: 'Compounded 12.4 SHM rewards into Validator Pool B.'
    }
];

const DecisionFeed = () => {
    return (
        <div className="feed-container">
            <div className="feed-header">
                <Activity size={18} color="var(--primary)" />
                <h3>Live Network Decisions</h3>
            </div>

            <div className="feed-list">
                {MOCK_DECISIONS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="feed-item glass"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="item-top">
                            <div className="agent-tag">
                                <Cpu size={12} />
                                {item.agent}
                            </div>
                            <span className="time-tag">{item.time}</span>
                        </div>

                        <h4 className="item-action">{item.action}</h4>
                        <p className="item-summary">{item.summary}</p>

                        <div className="item-footer">
                            {item.type === 'confidential' ? (
                                <div className="status-tag confidential">
                                    <Lock size={10} /> Confidential Logic
                                </div>
                            ) : (
                                <div className="status-tag public">
                                    <Activity size={10} /> Public Trace
                                </div>
                            )}
                            <button className="expand-btn">
                                Details <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="feed-footer">
                <button className="full-history-btn">
                    View Decision Explorer <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

export default DecisionFeed;
