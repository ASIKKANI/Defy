import { History, ExternalLink, Activity, Search, FileJson, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_HISTORY = [
    { id: 1, agent: "Yield Sentinel", action: "Portfolio Swap", amount: "450 SHM", status: "Success", hash: "0x8fa...a2b", time: "2 hours ago" },
    { id: 2, agent: "Vault Guardian", action: "Health Rebalance", amount: "N/A", status: "Success", hash: "0x321...f89", time: "5 hours ago" },
    { id: 3, agent: "Yield Sentinel", action: "Compound Rewards", amount: "12.4 SHM", status: "Success", hash: "0xefd...123", time: "1 day ago" },
    { id: 4, agent: "Trade Oracle", action: "Limit Order", amount: "1000 USDT", status: "Failed", hash: "0xabc...d42", time: "2 days ago" },
    { id: 5, agent: "Liquidity Miner", action: "Pool Deposit", amount: "200 SHM", status: "Success", hash: "0x789...c44", time: "3 days ago" },
];

const ActivityView = () => {
    const handleExport = (tx) => {
        const report = {
            ...tx,
            timestamp: new Date().toISOString(),
            reasoning: "Authorized by user via highly-secure frontend interface.",
            mcp_sources: ["Shardeum Oracle", "Yield-Aggregator-v2"],
            security_check: "PASSED",
            simulated_outcome: "Positive"
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `audit_report_${tx.hash}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleReplay = (tx) => {
        // In a real app, this would route to InteractionPane with params
        // For Hackathon demo, we trigger a toast or mock navigation
        const confirmReplay = window.confirm(`Initiate Forensic Replay Mode for Transaction ${tx.hash}?\n\nThis will reconstruct the decision tree using historical MCP data states.`);
        if (confirmReplay) {
            alert(`Replay environment initialized.\n\nLoading archival node data for block #${Math.floor(Math.random() * 1000000)}...`);
        }
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <h1 className="text-gradient">Agent Activity</h1>
                <p className="subtitle">Audit history for all executions triggered through your account.</p>
            </header>

            <div className="search-bar glass">
                <Search size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Search by transaction hash or agent..." />
            </div>

            <div className="history-table glass">
                <div className="table-header">
                    <span>Agent</span>
                    <span>Action</span>
                    <span>Amount</span>
                    <span>Time</span>
                    <span>Status</span>
                    <span>Audit</span>
                </div>
                <div className="table-body">
                    {MOCK_HISTORY.map((h, i) => (
                        <motion.div
                            key={h.id}
                            className="table-row"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <span className="agent-cell">{h.agent}</span>
                            <span>{h.action}</span>
                            <span>{h.amount}</span>
                            <span className="time-cell">{h.time}</span>
                            <span className={`status-pill ${h.status.toLowerCase()}`}>{h.status}</span>
                            <div className="audit-cell">
                                {h.status === 'Failed' ? (
                                    <button className="replay-btn" onClick={() => handleReplay(h)} title="Forensic Replay">
                                        <RotateCcw size={14} /> Replay
                                    </button>
                                ) : (
                                    <button className="export-btn" onClick={() => handleExport(h)} title="Export Audit JSON">
                                        <FileJson size={14} /> JSON
                                    </button>
                                )}
                                <a href="#" className="hash-link">{h.hash.substring(0, 6)}... <ExternalLink size={10} /></a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .view-container { max-width: 1000px; margin: 0 auto; }
        .search-bar { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
        .search-bar input { flex: 1; font-size: 0.9rem; }
        
        .history-table { border-radius: 20px; overflow: hidden; }
        .table-header { display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr; padding: 1.25rem 2rem; background: rgba(255, 255, 255, 0.03); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
        .table-row { display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr; padding: 1.25rem 2rem; border-bottom: 1px solid var(--glass-border); align-items: center; font-size: 0.9rem; transition: background 0.2s; }
        .table-row:hover { background: rgba(255, 255, 255, 0.02); }
        .table-row:last-child { border: none; }
        
        .agent-cell { font-weight: 600; color: var(--primary); }
        .time-cell { color: var(--text-muted); }
        .status-pill { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; text-align: center; }
        .status-pill.success { background: rgba(0, 255, 163, 0.1); color: var(--primary); }
        .status-pill.failed { background: rgba(255, 59, 59, 0.1); color: var(--warning); }
        .audit-cell { display: flex; align-items: center; gap: 0.8rem; }
        .export-btn { display: flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 6px; color: var(--text-main); transition: 0.2s; }
        .export-btn:hover { background: var(--primary); color: black; }
        .replay-btn { display: flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; padding: 0.3rem 0.6rem; background: rgba(255, 59, 59, 0.1); border-radius: 6px; color: #ff6b6b; transition: 0.2s; border: 1px solid rgba(255, 59, 59, 0.2); }
        .replay-btn:hover { background: #ff6b6b; color: white; }
        .hash-link { font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; text-decoration: none; }
      `}</style>
        </div>
    );
};

export default ActivityView;
