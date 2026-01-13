import React, { useState, useEffect } from 'react';
import {
    History,
    Settings,
    BarChart3,
    Wallet,
    ShieldAlert,
    FileCode2,
    Menu,
    ChevronLeft,
    ChevronRight,
    Globe,
    Database,
    LayoutDashboard,
    Activity,
    Shield,
    Zap,
    Cpu
} from 'lucide-react';
import { ethers } from 'ethers';

const Sidebar = ({ address, setAddress, signer, setSigner, setProvider, activeView, setActiveView = () => { } }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [balance, setBalance] = useState('0.00');

    useEffect(() => {
        const fetchBalance = async () => {
            if (address && signer) {
                try {
                    // Always get a fresh provider instance to avoid NETWORK_ERROR (1 => 8119)
                    const currentProvider = new ethers.BrowserProvider(window.ethereum);

                    // DEBUG: Check Network
                    const net = await currentProvider.getNetwork();
                    console.log(`[Wallet Debug] Connected to: ${net.name} (Chain ID: ${net.chainId})`);

                    // SHM ERC-20 Check
                    const SHM_TOKEN_ADDRESS = null;

                    let bal;
                    if (SHM_TOKEN_ADDRESS) {
                        const shmContract = new ethers.Contract(
                            SHM_TOKEN_ADDRESS,
                            ["function balanceOf(address) view returns (uint256)"],
                            currentProvider
                        );
                        bal = await shmContract.balanceOf(address);
                    } else {
                        bal = await currentProvider.getBalance(address);
                    }

                    const formatted = ethers.formatEther(bal);
                    setBalance(formatted.slice(0, 8));
                } catch (e) {
                    if (e.code === 'NETWORK_ERROR') {
                        console.log("Network change detected, retrying balance fetch...");
                        // Brief delay to allow MetaMask state to settle
                        setTimeout(fetchBalance, 500);
                    } else {
                        console.error("Balance fetch error:", e);
                        setBalance('0.00');
                    }
                }
            } else {
                setBalance('0.00');
            }
        };
        fetchBalance();
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [address, signer]);

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'governance', icon: Globe, label: 'Governance' },
        { id: 'activity', icon: Activity, label: 'Activity' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const p = new ethers.BrowserProvider(window.ethereum);

                // 1. Request Accounts
                const accounts = await p.send("eth_requestAccounts", []);
                const s = await p.getSigner();

                // 2. Check & Switch Network
                const net = await p.getNetwork();
                const TARGET_CHAIN_ID = "0x1fb7"; // 8119 (Shardeum EVM Testnet)

                if (net.chainId !== 8119n) {
                    console.log("Wrong network detected. Prompting switch...");
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: TARGET_CHAIN_ID }],
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: TARGET_CHAIN_ID,
                                    chainName: 'Shardeum EVM Testnet',
                                    nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
                                    rpcUrls: ['https://lb.shardeum.org/'],
                                    blockExplorerUrls: ['https://explorer-evm.shardeum.org/']
                                }],
                            });
                        }
                    }
                }

                // 3. Update parent state
                if (setProvider) setProvider(p);
                if (setSigner) setSigner(s);
                if (setAddress) setAddress(accounts[0]);

            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <aside className={`${collapsed ? 'w-24' : 'w-72'} transition-all duration-500 border-r border-green-900/30 bg-black flex flex-col h-full relative z-20`}>
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-24 bg-black border border-green-900/50 p-1 rounded-full text-primary hover:border-primary transition-all z-30 shadow-[0_0_10px_rgba(0,255,65,0.2)]"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Header / Brand */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl border border-primary flex items-center justify-center bg-primary/5 shadow-[0_0_15px_rgba(0,255,65,0.1)] group">
                        <Shield className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tighter text-white uppercase italic">AgentChain</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#00FF41]" />
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Shardeum EVM</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-8 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${activeView === item.id
                            ? 'bg-primary/10 border border-primary/40 text-primary shadow-[inset_0_0_15px_rgba(0,255,65,0.05)]'
                            : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <item.icon size={20} className={activeView === item.id ? 'drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]' : ''} />
                        {!collapsed && (
                            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                        )}
                        {activeView === item.id && !collapsed && (
                            <div className="ml-auto w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_#00FF41]" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / Wallet Card */}
            <div className="p-6">
                <div className={`p-5 rounded-2xl border border-green-950/30 bg-green-950/5 relative overflow-hidden group transition-all ${collapsed ? 'px-2' : ''}`}>
                    {address && (
                        <div className="absolute top-0 right-0 p-2 opacity-50">
                            <Shield className="text-primary w-3 h-3" />
                        </div>
                    )}

                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'mb-4'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${address ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                            <Wallet size={16} />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">Vault Status</span>
                                <span className={`text-[10px] font-black uppercase ${address ? 'text-primary' : 'text-white/20'}`}>
                                    {address ? 'SECURED_LINK' : 'LOCKED'}
                                </span>
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <div className="space-y-4">
                            {address ? (
                                <>
                                    <div>
                                        <div className="text-2xl font-black text-white leading-none mb-1">
                                            {balance} <span className="text-[10px] text-primary italic">SHM</span>
                                        </div>
                                        <div className="text-[10px] text-white/30 truncate font-mono bg-black/40 p-1.5 rounded border border-white/5">
                                            {address}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAddress('')}
                                        className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
                                    >
                                        Disconnect
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={connectWallet}
                                    className="w-full py-3 bg-primary/10 border border-primary text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-glow flex items-center justify-center gap-2 group"
                                >
                                    <Zap size={14} className="group-hover:fill-current" />
                                    Connect Alpha
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
