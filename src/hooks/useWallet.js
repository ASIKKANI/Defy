
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ACTIVE_CHAIN } from '../utils/chainConfig';

export const useWallet = () => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = useCallback(async () => {
        setIsConnecting(true);
        setError(null);

        // Enhanced detection: check multiple times as some extensions are slow
        let eth = window.ethereum;
        if (!eth) {
            console.log("Wallet not found immediately, polling for 1.5s...");
            for (let i = 0; i < 3; i++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (window.ethereum) {
                    eth = window.ethereum;
                    console.log(`Wallet detected after ${(i + 1) * 500}ms`);
                    break;
                }
            }
        }

        console.log("Connect attempt. window.ethereum:", !!eth);

        if (!eth) {
            console.warn("No wallet detected. Falling back to Read-Only (Guest) mode.");
            try {
                // Initialize a read-only provider for Shardeum
                const readOnlyProvider = new ethers.JsonRpcProvider(ACTIVE_CHAIN.rpcUrls[0]);
                setProvider(readOnlyProvider);
                setAccount("Guest_Mode");
                setSigner(null);

                // Show a non-blocking toast/alert instead of a heavy alert
                console.info("Application is running in Read-only Guest Mode. Connect a wallet for transactions.");
                setIsConnecting(false);
                return;
            } catch (fallbackErr) {
                console.error("Fallback provider failed:", fallbackErr);
                setError("No wallet found and fallback failed");
                setIsConnecting(false);
                return;
            }
        }

        try {
            // If multiple providers exist (Coinbase + MetaMask), try to pick MetaMask or the primary one
            const _provider = new ethers.BrowserProvider(eth);

            // Request network switch
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ACTIVE_CHAIN.chainId }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [ACTIVE_CHAIN],
                    });
                } else {
                    throw switchError;
                }
            }

            const accounts = await _provider.send("eth_requestAccounts", []);
            const _signer = await _provider.getSigner();

            setAccount(accounts[0]);
            setProvider(_provider);
            setSigner(_signer);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) setAccount(accounts[0]);
                else disconnect();
            });
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }, []);

    return { account, provider, signer, error, connect, disconnect };
};
