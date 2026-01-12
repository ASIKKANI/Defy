import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AgentDashboard from './components/AgentDashboard';
import InteractionPane from './components/InteractionPane';
import DecisionFeed from './components/DecisionFeed';
import GovernanceView from './components/GovernanceView';
import ActivityView from './components/ActivityView';
import SettingsView from './components/SettingsView';
import './App.css';
import './Advanced.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSelectedAgent(null); // Reset agent view when switching tabs
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  const renderContent = () => {
    if (selectedAgent) {
      return (
        <InteractionPane
          agent={selectedAgent}
          onBack={() => setSelectedAgent(null)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <AgentDashboard onSelectAgent={handleSelectAgent} />;
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
    <div className="app-container">
      <Sidebar
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      <main className="content-area">
        {renderContent()}
      </main>

      <aside className="feed-area">
        <DecisionFeed />
      </aside>
    </div>
  );
}

export default App;
