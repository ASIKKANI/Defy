import React from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    History,
    Settings,
    Wallet,
    Zap
} from 'lucide-react';

const Sidebar = ({ walletConnected, setWalletConnected, activeTab, onSelectTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'governance', label: 'Governance', icon: ShieldCheck },
        { id: 'activity', label: 'Activity', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <Zap size={24} className="logo-icon" fill="var(--primary)" color="var(--primary)" />
                    <span className="logo-text">AgentChain</span>
                </div>
                <div className="network-badge">
                    <div className="status-dot"></div>
                    Shardeum Sphinx
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => onSelectTab(item.id)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className={`wallet-card glass ${walletConnected ? 'connected' : ''}`}>
                    <div className="wallet-info">
                        <Wallet size={18} color={walletConnected ? 'var(--primary)' : 'var(--text-muted)'} />
                        <div className="wallet-details">
                            <span className="wallet-status">
                                {walletConnected ? '0x8f...4a2b' : 'Disconnected'}
                            </span>
                            <span className="wallet-balance">
                                {walletConnected ? '142.5 SHM' : 'Connect to start'}
                            </span>
                        </div>
                    </div>
                    <button
                        className={`wallet-btn ${walletConnected ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => setWalletConnected(!walletConnected)}
                    >
                        {walletConnected ? 'Disconnect' : 'Connect Wallet'}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
