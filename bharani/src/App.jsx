import React, { useState, useEffect } from 'react';
import { useAgent } from './hooks/useAgent';
import { ethers } from 'ethers';
import Sidebar from './components/Layout/Sidebar';
import DecisionFeed from './components/Layout/DecisionFeed';
import AgentDashboard from './components/Dashboard/AgentDashboard';
import InteractionPane from './components/Interaction/InteractionPane';
import GovernanceView from './components/Governance/GovernanceView';
import ActivityView from './components/Activity/ActivityView';
import SettingsView from './components/Settings/SettingsView';
import { AnimatePresence, motion } from 'framer-motion';
import Plasma from './components/Effects/Plasma';
import { PaymentProvider } from './context/PaymentContext';
import { AccessProvider } from './context/AccessContext';

const App = () => {
    return (
        <AccessProvider>
            <PaymentProvider>
                <AppContent />
            </PaymentProvider>
        </AccessProvider>
    );
};

const AppContent = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [address, setAddress] = useState('');
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, interaction, governance, activity, settings
    const [selectedAgent, setSelectedAgent] = useState(null);

    useEffect(() => {
        const initWallet = async () => {
            if (window.ethereum) {
                try {
                    const p = new ethers.BrowserProvider(window.ethereum);
                    setProvider(p);
                    const accounts = await p.listAccounts();
                    if (accounts.length > 0) {
                        const s = await p.getSigner();
                        setSigner(s);
                        setAddress(await s.getAddress());
                    }
                } catch (e) {
                    console.error("Wallet init error:", e);
                }
            }
        };
        initWallet();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                } else {
                    setAddress('');
                    setSigner(null);
                }
            });
        }
    }, []);

    const handleSelectAgent = (agent) => {
        setSelectedAgent(agent);
        setActiveView('interaction');
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <AgentDashboard onSelectAgent={handleSelectAgent} />;
            case 'interaction':
                return (
                    <InteractionPane
                        agent={selectedAgent || { name: 'Generic Model', purpose: 'Standard Logic', icon: () => null }}
                        onBack={() => setActiveView('dashboard')}
                        useAgent={useAgent}
                        provider={provider}
                        signer={signer}
                    />
                );
            case 'governance':
                return <GovernanceView />;
            case 'activity':
                return <ActivityView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <AgentDashboard onSelectAgent={handleSelectAgent} />;
        }
    };

    return (
        <div className="flex h-screen w-full bg-black text-white font-mono hacker-grid overflow-hidden scanline relative">
            {/* Column 1: Navigation Sidebar */}
            <Sidebar
                address={address}
                setAddress={setAddress}
                signer={signer}
                activeView={activeView}
                setActiveView={setActiveView}
            />

            {/* Column 2: Main Dynamic Content */}
            <main className="flex-1 relative flex flex-col min-w-0 bg-black/40">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="flex-1 h-full overflow-hidden"
                    >
                        {renderView()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Column 3: Live Decision Feed */}
            <aside className="w-96 flex-shrink-0 relative hidden 2xl:block">
                <DecisionFeed />
            </aside>

            {/* Global Aesthetics */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
                <Plasma
                    color="#00FF41"
                    speed={0.3}
                    direction="forward"
                    scale={1}
                    opacity={0.4}
                    mouseInteractive={true}
                />
            </div>
            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-50" />
            </div>
        </div>
    );
};

export default App;
