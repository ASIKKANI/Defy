import React from 'react';
import { Settings, Shield, Bell, Moon, Database, Key } from 'lucide-react';

const SettingsView = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <h1 className="text-gradient">Settings & Safety</h1>
                <p className="subtitle">Configure your global agent parameters and privacy preferences.</p>
            </header>

            <div className="settings-grid">
                <section className="settings-section glass">
                    <div className="section-title">
                        <Shield size={20} color="var(--primary)" />
                        <h3>Risk Safety Limits</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Max Transaction Value</h4>
                            <p>Cap the maximum amount any agent can move at once.</p>
                        </div>
                        <input type="text" className="setting-input" defaultValue="500 SHM" />
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Slippage Ceiling</h4>
                            <p>Global protection against front-running and high volatility.</p>
                        </div>
                        <input type="text" className="setting-input" defaultValue="0.5%" />
                    </div>
                </section>

                <section className="settings-section glass">
                    <div className="section-title">
                        <Key size={20} color="var(--primary)" />
                        <h3>Privacy Engine (MPC/TEE)</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Hide Prompt Metadata</h4>
                            <p>Only store prompt hashes on-chain, keeping intent text local.</p>
                        </div>
                        <div className="toggle-switch active"></div>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Shielded Parameter Mode</h4>
                            <p>Auto-encrypt numerical limits before execution.</p>
                        </div>
                        <div className="toggle-switch"></div>
                    </div>
                </section>

                <section className="settings-section glass">
                    <div className="section-title">
                        <Database size={20} color="var(--primary)" />
                        <h3>Network & Nodes</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>RPC Endpoint</h4>
                            <p>Currently using Shardeum Sphinx Libery 1.1</p>
                        </div>
                        <button className="setting-action-btn">Switch RPC</button>
                    </div>
                </section>
            </div>

            <style jsx>{`
        .view-container { max-width: 800px; margin: 0 auto; }
        .settings-grid { display: flex; flex-direction: column; gap: 2rem; }
        .settings-section { padding: 2rem; border-radius: 20px; }
        .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
        .section-title h3 { font-size: 1.1rem; }
        
        .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid var(--glass-border); }
        .setting-item:last-child { border: none; padding-bottom: 0; }
        .setting-item:first-of-type { padding-top: 0; }
        
        .setting-info h4 { font-size: 1rem; margin-bottom: 0.25rem; }
        .setting-info p { font-size: 0.85rem; color: var(--text-muted); }
        
        .setting-input { padding: 0.6rem 1rem; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--glass-border); border-radius: 8px; text-align: right; width: 120px; }
        .setting-action-btn { padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: var(--text-main); font-size: 0.85rem; }
        
        .toggle-switch { width: 44px; height: 24px; background: rgba(255, 255, 255, 0.1); border-radius: 12px; position: relative; cursor: pointer; }
        .toggle-switch::after { content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; }
        .toggle-switch.active { background: var(--primary); }
        .toggle-switch.active::after { left: 24px; }
      `}</style>
        </div>
    );
};

export default SettingsView;
