import React, { useState } from 'react';
import {
  LayoutDashboard,
  History,
  ShieldCheck,
  Shield,
  Activity,
  Users,
  Cpu,
  Zap,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import InteractionArea from './components/Interaction/InteractionArea';
import DecisionFeed from './components/History/DecisionFeed';
import ReputationPage from './components/Reputation/ReputationPage';
import GovernancePage from './components/Governance/GovernancePage';

// Hook Imports
import { useWallet } from './hooks/useWallet';

// Mock Agents Data
const AGENTS = [
  { id: 1, name: 'TradeMaster AI', role: 'DeFi Specialist', description: 'Low-slippage trades & liquidity.', icon: '📈', status: 'Active' },
  { id: 2, name: 'NFT Scout', role: 'Asset Analyzer', description: 'Floor price and mint analysis.', icon: '🖼️', status: 'Active' },
  { id: 3, name: 'Liquidity Quant', role: 'Yield optimizer', description: 'Automated yield farming.', icon: '⚖️', status: 'Active' },
];

const App = () => {
  const { account, connect, provider, signer } = useWallet();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-16"
          >
            {/* Real-time Status Header */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-10 pb-8 border-b border-white/5">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                  </span>
                  <p className="text-[11px] font-black tracking-[0.3em] text-success uppercase">System Core Operational</p>
                </div>
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                  Defy <span className="gradient-text italic">OS</span>
                </h2>
              </div>

              <div className="flex gap-6">
                <div className="glass-panel px-8 py-4 flex items-center gap-5 bg-white/[0.02]">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Global Privacy</p>
                    <p className="text-base font-black text-secondary uppercase tracking-tight">FHE Shield Enabled</p>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary/10 rounded-2xl border border-secondary/20">
                    <ShieldCheck className="text-secondary" size={24} />
                  </div>
                </div>
                <div className="glass-panel px-8 py-4 flex items-center gap-5 bg-white/[0.02]">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Network Load</p>
                    <p className="text-base font-black text-primary uppercase tracking-tight">Latency Optimal</p>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20">
                    <Zap className="text-primary" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { label: 'Network Latency', value: '12ms', trend: '-2ms', color: 'var(--secondary)', icon: Cpu },
                { label: 'Active Encryptions', value: '1.2M', trend: '+12%', color: 'var(--primary)', icon: ShieldCheck },
                { label: 'Agent Confidence', value: '98.4%', trend: 'Stable', color: 'var(--accent)', icon: Zap },
                { label: 'DAO Participation', value: '64%', trend: '+4%', color: 'var(--success)', icon: Users }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-panel p-8 bg-white/[0.01] hover:bg-white/[0.03] group relative overflow-hidden stat-card-gradient"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-text-muted group-hover:text-white transition-all duration-500 flex items-center justify-center border border-white/5">
                      <stat.icon size={22} />
                    </div>
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-white/5 text-text-muted border border-white/5">{stat.trend}</span>
                  </div>
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                  <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10 group-hover:opacity-100 transition-opacity duration-700" style={{ color: stat.color }}></div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Agent Picker & Quick Actions */}
              <motion.div variants={itemVariants} className="lg:col-span-4 space-y-16">
                <section>
                  <div className="section-label">
                    <Cpu size={14} className="text-primary" /> Active Operatives
                  </div>
                  <div className="space-y-6">
                    {AGENTS.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        className={`w-full text-left glass-panel p-6 transition-all holographic-card group relative overflow-hidden ${selectedAgent.id === agent.id ? 'active' : 'opacity-40 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-6 relative z-10">
                          <div className="text-4xl group-hover:scale-110 transition-transform duration-700 bg-white/5 w-16 h-16 rounded-[24px] flex items-center justify-center border border-white/5 shadow-inner">
                            {agent.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-xl leading-tight group-hover:text-primary transition-colors tracking-tight">{agent.name}</h4>
                            <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] font-black mt-1">{agent.role}</p>
                          </div>
                          {selectedAgent.id === agent.id && (
                            <motion.div
                              layoutId="agent-active"
                              className="w-3 h-3 rounded-full bg-primary shadow-glow ring-4 ring-primary/20"
                            />
                          )}
                        </div>
                      </button>
                    ))}

                    <button className="w-full p-6 rounded-[28px] border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-[11px] font-black text-text-muted uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                      + Deploy New AI
                    </button>
                  </div>
                </section>

                <section className="glass-panel p-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <h5 className="text-2xl font-black uppercase tracking-tighter">Chain Interop</h5>
                    <p className="text-base text-text-muted leading-relaxed font-medium">
                      Cross-chain state execution is being handled via <span className="text-secondary font-bold">Shardeum Gateway</span>. All secrets are shielded by <span className="text-primary font-bold">Inco Lightning</span>.
                    </p>
                    <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] py-4 px-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary hover:border-primary transition-all w-full justify-center group-hover:shadow-glow">
                      <ExternalLink size={14} /> View Bridge Status
                    </button>
                  </div>
                  <div className="absolute -right-12 -bottom-12 opacity-5 text-primary group-hover:scale-110 transition-transform duration-1000">
                    <ShieldCheck size={200} />
                  </div>
                </section>
              </motion.div>

              {/* Main Interaction Area */}
              <motion.div variants={itemVariants} className="lg:col-span-8">
                <div className="glass-panel h-full min-h-[700px] border-white/10 bg-white/[0.01] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-white -z-10 group-hover:bg-[length:60px_60px] transition-all duration-1000"></div>
                  <div className="p-10 h-full">
                    <InteractionArea selectedAgent={selectedAgent} provider={provider} signer={signer} account={account} connect={connect} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      case 'history': return <DecisionFeed />;
      case 'reputation': return <ReputationPage />;
      case 'governance': return <GovernancePage />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden font-['Outfit'] select-none">
      {/* Premium Sidebar Nav */}
      <aside className="hidden md:flex w-88 border-r border-white/5 backdrop-blur-3xl bg-black/40 flex-col py-12 z-50 relative">
        <div className="mb-16 px-12">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center font-black text-xl text-white italic shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-all duration-500">D</div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Defy<span className="text-primary italic">.</span></h1>
              <p className="text-[10px] font-black text-text-muted tracking-[0.4em] uppercase opacity-40 mt-1">Core Environment</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 w-full px-8 space-y-3">
          <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] px-5 mb-6 opacity-30">Command Center</p>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Terminal Core' },
            { id: 'history', icon: History, label: 'Ledger Stream' },
            { id: 'reputation', icon: ShieldCheck, label: 'Oracle Rep' },
            { id: 'governance', icon: Users, label: 'Council DAO' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-5 p-5 rounded-[24px] transition-all duration-500 group relative ${currentPage === item.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_40px_rgba(248,45,151,0.15)]' : 'text-text-muted hover:text-text hover:bg-white/5 border border-transparent'}`}
            >
              <item.icon size={22} className={`${currentPage === item.id ? 'text-primary' : 'group-hover:text-text'} transition-colors`} />
              <span className="font-extrabold tracking-tight text-sm uppercase">{item.label}</span>
              {currentPage === item.id && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-2 h-2 rounded-full bg-primary shadow-glow ring-4 ring-primary/20"
                />
              )}
            </button>
          ))}

          <div className="pt-16 space-y-3">
            <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] px-5 mb-6 opacity-30">Security Protocol</p>
            <div className="px-5 py-4 rounded-[24px] bg-success/5 border border-success/10 flex items-center gap-4 group hover:bg-success/10 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <span className="text-[11px] font-black text-success uppercase tracking-widest leading-none">FHE Protocol Active</span>
            </div>
          </div>
        </nav>

        <div className="mt-auto px-8 w-full">
          <button
            onClick={connect}
            className={`w-full py-5 rounded-[24px] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.2em] transition-all ${account ? 'bg-white/[0.03] text-text border border-white/10 hover:bg-white/5' : 'btn-primary shadow-glow'}`}
          >
            {account ? (
              <>
                <div className={`w-2 h-2 rounded-full ${account === 'Guest_Mode' ? 'bg-amber-500' : 'bg-success'} animate-pulse shadow-glow`}></div>
                <span className="truncate">{account === 'Guest_Mode' ? 'Guest Mode' : `${account.slice(0, 6)}...${account.slice(-4)}`}</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Sync Node</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020202] relative overflow-hidden">
        {/* Animated Background Layers */}
        <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full -z-10 animate-pulse-slow"></div>
        <div className="fixed bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[180px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

        {/* Utility Top Bar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 flex-shrink-0 bg-black/40 backdrop-blur-3xl z-40">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-muted"><Cpu size={16} /></div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">CPU Utilization</p>
                <p className="text-xs font-black tracking-tight">14.2% OPTIMAL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-muted"><Shield size={16} /></div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Encryption Layer</p>
                <p className="text-xs font-black tracking-tight">256-BIT FHE</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1.5">Trust Score: 88%</p>
              <div className="h-1.5 w-36 bg-white/10 rounded-full overflow-hidden flex items-center">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-primary shadow-glow"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[1500px] mx-auto p-12 md:p-20 relative min-h-full">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Activity Ticker */}
        <footer className="h-14 border-t border-white/5 bg-black/60 backdrop-blur-xl flex items-center px-12 flex-shrink-0 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted gap-12">
          <div className="flex items-center gap-3 text-success"><Activity size={14} className="animate-pulse" /> Live Stream</div>
          <div className="overflow-hidden flex-1 relative flex items-center">
            <motion.div
              animate={{ x: [1000, -3000] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="whitespace-nowrap flex gap-24 items-center italic font-bold"
            >
              <span className="text-white/40">[LOG] Agent-14 deployed liquidity to SHM-USDC pool...</span>
              <span className="text-white/40">[SYS] Encryption routine finalized on Block #1,422,910...</span>
              <span className="text-white/40">[DAO] Governance proposal #88 passed with 94% approval...</span>
              <span className="text-white/40">[SEC] Inco Lightning Key Rotation executed successfully...</span>
              <span className="text-white/40">[NET] Shardeum Testnet latency optimized to 12ms...</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-glow"></div> Node-77 Online</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
