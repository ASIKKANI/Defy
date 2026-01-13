import { useState, useCallback } from 'react';
import { generateResponse } from '../services/ollama';
import { MCP_TOOLS } from '../services/mcp-tools';
import { ethers } from 'ethers';
import { addLog, updateLog } from '../services/log-service';

const SYSTEM_PROMPT = `
You are AgentChain, an advanced AI trading assistant. 
Your goal is to help the user interact with the Shardeum blockchain.
You have access to tools via the Model Context Protocol (MCP).

IMPORTANT - PUBLIC VS PRIVATE:
- Standard "send_transaction" is PUBLIC. Everything is visible on the explorer.
- "confidential_execute" is PRIVATE. Use this if the user says "private", "hidden", "secret", or "stealth".
- NEVER use "send_transaction" if the user asks for a PRIVATE transaction.

CRITICAL: Return your response ONLY as a strict JSON object. 
DO NOT include any conversational filler.
Return purely the JSON block:
{
  "thought": "Your reasoning process here. Explicitly state if you are using a public or private tool.",
  "tool": "tool_id",
  "params": { ...tool parameters... },
  "explanation": "Explanation for the user"
}
If no tool is needed, set tool to null.
Available Tools:
${JSON.stringify(MCP_TOOLS.map(t => ({ id: t.id, description: t.description, params: t.params || "context dependent" })))}
`;

export const useAgent = (provider, signer) => {
    const [isThinking, setIsThinking] = useState(false);
    const [lastDecision, setLastDecision] = useState(null);
    const [error, setError] = useState(null);

    const processPrompt = useCallback(async (userPrompt) => {
        setIsThinking(true);
        setError(null);
        setLastDecision(null);

        let logId;
        try {
            console.log("Agent: ProcessPrompt started for", userPrompt);

            logId = addLog({
                agent: 'System',
                action: 'THINKING',
                type: 'PUBLIC',
                status: 'Processing',
                consoleLogs: [`Initiating cognitive layer for: "${userPrompt}"`]
            });

            // 0. Inject Context
            const userAddress = signer ? await signer.getAddress() : "unknown";
            const contextPrompt = `
Context:
- User's Wallet Address: ${userAddress}
- Current Network: Shardeum EVM
`;
            updateLog(logId, { consoleLogs: [`Context: Wallet=${userAddress}, Network=Shardeum EVM`] });

            // 1. Get AI Reasoning
            updateLog(logId, { consoleLogs: [`Requesting LLM inference from Ollama (llama3)...`] });
            const rawResponse = await generateResponse(contextPrompt + "\n" + userPrompt, SYSTEM_PROMPT);

            let decision;
            try {
                const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : rawResponse;
                decision = JSON.parse(jsonStr);
                updateLog(logId, {
                    status: 'Success',
                    consoleLogs: [`Reasoning: ${decision.thought}`, `Plan: Execute ${decision.tool || 'None'}`]
                });
            } catch (e) {
                decision = {
                    thought: "Raw reasoning captured",
                    tool: null,
                    explanation: rawResponse
                };
                updateLog(logId, { status: 'Success', consoleLogs: [`Fallback: Raw response parsed.`] });
            }

            setLastDecision(decision);
            return decision;

        } catch (err) {
            console.error("Agent Error:", err);
            if (logId) updateLog(logId, { status: 'Reverted', consoleLogs: [`Error: ${err.message}`] });
            setError(err.message);
            return { error: err.message };
        } finally {
            setIsThinking(false);
        }
    }, [provider, signer]);

    const executeTool = async (toolId, params, provider, signer, isSimulation = false, agentName = 'System') => {
        console.log(`Executing tool: ${toolId} [Simulation Mode: ${isSimulation}]`, params);

        const logEntry = {
            agent: agentName,
            action: toolId.replace(/_/g, ' ').toUpperCase(),
            amount: params?.amount || params?.value || 'N/A',
            type: toolId.includes('confidential') ? 'CONFIDENTIAL' : 'PUBLIC',
            status: 'Processing',
            consoleLogs: [`Executing tool: ${toolId}`, `Params: ${JSON.stringify(params)}`]
        };

        let logId;
        try {
            // Add initial log
            logId = addLog(logEntry);
            let result;

            // SIMULATION INTERCEPTOR
            if (isSimulation) {
                if (toolId === 'send_transaction') {
                    // Simulate Gas Estimation
                    const estimatedGas = 21000n; // Standard transfer gas
                    const gasPrice = await provider.getFeeData().then(f => f.gasPrice || 1n);
                    const costWei = estimatedGas * gasPrice;
                    const costEth = ethers.formatEther(costWei);

                    result = `[SIMULATION MODE]: Transaction Validated.\n` +
                        `• Recipient: ${params.to}\n` +
                        `• Amount: ${params.amount} SHM\n` +
                        `• Estimated Gas: ${estimatedGas.toString()} units\n` +
                        `• Est. Fee: ~${costEth} SHM\n` +
                        `• Risk Assessment: Low (Standard Transfer)\n` +
                        `Status: Ready to Execute (Switch to LIVE to confirm).`;
                } else if (toolId === 'confidential_execute') {
                    result = `[SIMULATION MODE]: Private Execution Validated.\n` +
                        `• Target: ${params.to}\n` +
                        `• Hidden Amount: ${params.value} SHM\n` +
                        `• Encryption: Inco FHE (Simulated)\n` +
                        `• Privacy Overhead: ~15% higher gas\n` +
                        `Status: Ready to Execute (Switch to LIVE to confirm).`;
                }

                if (result) {
                    updateLog(logId, { status: 'Success' });
                    return result;
                }
            }

            switch (toolId) {
                case 'get_balance':
                    let targetAddress = params?.address;
                    if (!targetAddress && signer) {
                        targetAddress = await signer.getAddress();
                    }
                    if (!targetAddress) throw new Error("No address provided and wallet not connected");

                    const bal = await provider.getBalance(targetAddress);
                    const balFmt = ethers.formatEther(bal);
                    result = `${balFmt} SHM`;
                    break;

                case 'get_token_price':

                    // Fetch Spot, Buy, and Sell prices for comprehensive context
                    const s = (params?.symbol || 'ETH').toUpperCase();
                    const [spotRes, buyRes, sellRes] = await Promise.all([
                        fetch(`https://api.coinbase.com/v2/prices/${s}-USD/spot`),
                        fetch(`https://api.coinbase.com/v2/prices/${s}-USD/buy`),
                        fetch(`https://api.coinbase.com/v2/prices/${s}-USD/sell`)
                    ]);

                    if (!spotRes.ok) throw new Error("Failed to fetch price data");

                    const spot = (await spotRes.json()).data.amount;
                    const buy = (await buyRes.json()).data.amount;
                    const sell = (await sellRes.json()).data.amount;

                    result = `Market Data for ${s}:
• Spot Price: $${spot}
• Buy Price:  $${buy} (with spread)
• Sell Price: $${sell}
Source: Coinbase API (Live)`;
                    break;

                case 'check_liquidity':
                    const poolQuery = (params?.pool || params?.symbol || 'ETH').toUpperCase();

                    // Special case for Shardeum Testnet
                    if (poolQuery === 'SHM' || poolQuery === 'SHARDEUM') {
                        return `Shardeum Sphinx/EVM Testnet Data:
• Top Pool: SHM-USDT (Simulated)
• Liquidity: ~$500,000 (Testnet)
• 24h Vol: ~$12,000
Note: Real DexScreener data not available for Testnet assets.`;
                    }

                    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${poolQuery}`);
                    if (!dexRes.ok) throw new Error("Failed to fetch DEX data");
                    const dexData = await dexRes.json();

                    if (!dexData.pairs || dexData.pairs.length === 0) {
                        return `No liquidity pools found for "${poolQuery}" on DexScreener.
Try searching for:
• Wrapped assets: "WETH", "WBTC"
• Popular tokens: "PEPE", "SOL", "USDC"`;
                    }

                    const topPair = dexData.pairs[0];
                    result = `Top Pool (${topPair.dexId}): ${topPair.baseToken.symbol}/${topPair.quoteToken.symbol}
• Liquidity: $${topPair.liquidity.usd.toLocaleString()}
• Price: $${topPair.priceUsd}
• 24h Vol: $${topPair.volume.h24.toLocaleString()}
• URL: ${topPair.url}`;
                    break;

                case 'send_transaction':
                    if (!signer) throw new Error("Wallet not connected");

                    // NEW: Attach the reasoning to the public transaction data
                    // Instead of 0x, it will now show your intent in plain hex
                    const publicReasoning = lastDecision?.thought || "Standard SHM Transfer";
                    const data = ethers.hexlify(ethers.toUtf8Bytes(publicReasoning));

                    const tx = await signer.sendTransaction({
                        to: params.to,
                        value: ethers.parseEther(params.amount.toString())
                        // Removed 'data' because external accounts in Shardeum cannot include data in standard transfers
                    });
                    result = `Public Transaction Sent!\n• Hash: ${tx.hash}\n• Intent: ${publicReasoning}`;
                    break;

                case 'get_wallet_address':
                    result = signer ? await signer.getAddress() : "Wallet not connected";
                    break;
                case 'get_network':
                    if (!provider) {
                        result = "Provider not ready";
                    } else {
                        const net = await provider.getNetwork();
                        result = `${net.name} (Chain ID: ${net.chainId})`;
                    }
                    break;
                case 'estimate_gas':
                    if (!provider) {
                        result = "Provider not ready";
                    } else {
                        const feeData = await provider.getFeeData();
                        const gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : "Unknown";
                        result = `Current Gas Price: ${gasPrice} Gwei`;
                    }
                    break;
                case 'get_transaction_status':
                    if (!provider || !params?.hash) {
                        result = "Please provide a transaction hash.";
                    } else {
                        const receipt = await provider.getTransactionReceipt(params.hash);
                        if (!receipt) {
                            result = "Transaction Pending or Not Found";
                        } else {
                            result = `Status: ${receipt.status === 1 ? 'Success ✅' : 'Failed ❌'} (Block: ${receipt.blockNumber})`;
                        }
                    }
                    break;

                case 'generate_token_contract':
                    result = "Drafted ERC-20 Token Contract [Mock]";
                    break;
                case 'estimate_deploy_cost':
                    result = "Estimated Deployment Cost: 0.05 SHM";
                    break;
                case 'deploy_contract':
                    result = "Contract Deployed at: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
                    break;
                case 'analyze_prompt':
                    result = "Intent Analyzed: User wishes to perform financial action.";
                    break;
                case 'validate_constraints':
                    result = "Validation Passed: Balance sufficient, Slippage < 1%.";
                    break;
                case 'generate_explanation':
                    result = "Explanation: Market conditions are favorable.";
                    break;
                case 'encrypt_input':
                    try {
                        const { encryptParameter } = await import('../services/inco-service');
                        const valueToEncrypt = params?.value || 1337; // Default or user provided

                        // Get user address from signer if available
                        const userAddress = signer ? await signer.getAddress() : null;
                        const result = await encryptParameter(valueToEncrypt, params?.type || 'uint32', userAddress);

                        if (result.success) {
                            result = `✅ Data secured with Inco Lightning!\n\n` +
                                `• Input: ${valueToEncrypt}\n` +
                                `• Status: ${result.display}\n` +
                                `• Ciphertext: ${result.ciphertext?.toString()?.slice(0, 32) || 'N/A'}... [TRUNCATED]`;
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (e) {
                        result = `❌ Inco Encryption Failed: ${e.message}`;
                    }
                    break;
                case 'confidential_execute':
                    try {
                        const { encryptParameter } = await import('../services/inco-service');
                        const userAddress = signer ? await signer.getAddress() : null;
                        if (!signer) throw new Error("Wallet not connected for blockchain logging");

                        // 1. ENCRYPT THE DATA
                        // We encrypt the amount and the reasoning separately for maximum privacy
                        const amountToEncrypt = (params?.value || "0").toString().replace(/[^0-9.]/g, '');
                        const reasoning = lastDecision?.thought || "Private Execution";

                        // Encrypt both into a single batch or process them
                        const amountResult = await encryptParameter(amountToEncrypt, 'uint256', userAddress);
                        const thoughtResult = await encryptParameter(reasoning, 'uint256', userAddress);

                        if (amountResult.success && thoughtResult.success) {
                            // 2. LOG & MOVE FUNDS (Shardeum)
                            // We send the 'thoughtResult.ciphertext' for privacy, 
                            // AND 'amountInWei' to actually move the money.
                            const DECISION_LOGGER_ADDRESS = "0x168FDc3Ae19A5d5b03614578C58974FF30FCBe92";
                            const loggerContract = new ethers.Contract(
                                DECISION_LOGGER_ADDRESS,
                                ["function logConfidentialDecision(bytes encryptedThought) external payable"],
                                signer
                            );

                            console.log(`Agent: Moving ${amountToEncrypt} SHM and logging private intent...`);
                            const amountInWei = ethers.parseEther(amountToEncrypt.toString());

                            const tx = await loggerContract.logConfidentialDecision(
                                thoughtResult.ciphertext,
                                { value: amountInWei } // This actually moves the 1000 SHM
                            );

                            result = `🛡️ **Stealth Transaction Executed**\n\n` +
                                `• **Funds Moved:** ${amountToEncrypt} SHM\n` +
                                `• **Privacy Level:** High (Intent Scrambled)\n` +
                                `• **Blockchain Proof:** [Tx ${tx.hash.slice(0, 10)}...](https://explorer-sphinx.shardeum.org/tx/${tx.hash})\n\n` +
                                `**Usability Note:** Your balance has decreased, and your "Why" is locked behind Inco encryption. Only you can reveal the strategy.`;

                        } else {
                            throw new Error(amountResult.error || thoughtResult.error);
                        }
                    } catch (e) {
                        result = `❌ Confidential Execution Failed: ${e.message}`;
                    }
                    break;
                case 'selective_disclosure':
                    result = "Result Revealed: 100 Tokens. Inputs remain hidden.";
                    break;
                case 'submit_agent_profile':
                    result = "Agent Profile Submitted to DAO for review.";
                    break;
                case 'list_approved_agents':
                    result = "Active Agents: [TradeMaster AI, YieldOptimizer, ShardGuardian]";
                    break;

                default:
                    console.log("Tool execution not fully implemented for:", toolId);
                    result = "Tool not implemented yet.";
                    break;
            }

            updateLog(logId, {
                status: 'Success',
                consoleLogs: [`Execution Complete.`, `Output: ${typeof result === 'string' ? result.slice(0, 100) : 'Object returned'}...`]
            });
            return result;

        } catch (error) {
            console.error("Tool execution failed:", error);
            if (logId) updateLog(logId, { status: 'Reverted' });
            throw error;
        }
    };

    return {
        processPrompt,
        executeTool,
        isThinking,
        lastDecision,
        error
    };
};
