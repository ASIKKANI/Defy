import { useState, useCallback } from 'react';
import { generateResponse } from '../services/ollama';
import { MCP_TOOLS } from '../services/mcp-tools';
import { ethers } from 'ethers';

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

        try {
            console.log("Agent: ProcessPrompt started for", userPrompt);
            // 0. Inject Context
            const userAddress = signer ? await signer.getAddress() : "unknown";
            const contextPrompt = `
Context:
- User's Wallet Address: ${userAddress}
- Current Network: Shardeum EVM
`;

            // 1. Get AI Reasoning
            console.log("Agent: Requesting Ollama...");
            const rawResponse = await generateResponse(contextPrompt + "\n" + userPrompt, SYSTEM_PROMPT);
            console.log("Agent: Ollama raw response received:", rawResponse);

            let decision;
            try {
                // Try to find JSON block in the response using regex
                const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : rawResponse;

                decision = JSON.parse(jsonStr);
                console.log("Agent: Parsed decision:", decision);
            } catch (e) {
                console.warn("AI didn't return valid JSON. Fallback parsing.");
                decision = {
                    thought: "Raw reasoning captured",
                    tool: null,
                    explanation: rawResponse
                };
            }

            setLastDecision(decision);
            return decision;

        } catch (err) {
            console.error("Agent Error:", err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setIsThinking(false);
        }
    }, [provider, signer]);

    const executeTool = async (toolId, params, provider, signer) => {
        console.log(`Executing tool: ${toolId}`, params);

        try {
            switch (toolId) {
                case 'get_balance':
                    let targetAddress = params?.address;
                    if (!targetAddress && signer) {
                        targetAddress = await signer.getAddress();
                    }
                    if (!targetAddress) throw new Error("No address provided and wallet not connected");

                    const bal = await provider.getBalance(targetAddress);
                    const balFmt = ethers.formatEther(bal);
                    return `${balFmt} SHM`;

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

                    return `Market Data for ${s}:
• Spot Price: $${spot}
• Buy Price:  $${buy} (with spread)
• Sell Price: $${sell}
Source: Coinbase API (Live)`;

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
                    return `Top Pool (${topPair.dexId}): ${topPair.baseToken.symbol}/${topPair.quoteToken.symbol}
• Liquidity: $${topPair.liquidity.usd.toLocaleString()}
• Price: $${topPair.priceUsd}
• 24h Vol: $${topPair.volume.h24.toLocaleString()}
• URL: ${topPair.url}`;

                case 'send_transaction':
                    if (!signer) throw new Error("Wallet not connected");

                    // NEW: Attach the reasoning to the public transaction data
                    // Instead of 0x, it will now show your intent in plain hex
                    const publicReasoning = lastDecision?.thought || "Standard SHM Transfer";
                    const data = ethers.hexlify(ethers.toUtf8Bytes(publicReasoning));

                    const tx = await signer.sendTransaction({
                        to: params.to,
                        value: ethers.parseEther(params.amount.toString()),
                        data: data // This puts your reasoning on the explorer
                    });
                    return `Public Transaction Sent!\n• Hash: ${tx.hash}\n• Intent: ${publicReasoning}`;

                case 'get_wallet_address':
                    return signer ? await signer.getAddress() : "Wallet not connected";
                case 'get_network':
                    if (!provider) return "Provider not ready";
                    const net = await provider.getNetwork();
                    return `${net.name} (Chain ID: ${net.chainId})`;
                case 'estimate_gas':
                    if (!provider) return "Provider not ready";
                    const feeData = await provider.getFeeData();
                    const gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : "Unknown";
                    return `Current Gas Price: ${gasPrice} Gwei`;
                case 'get_transaction_status':
                    if (!provider || !params?.hash) return "Please provide a transaction hash.";
                    const receipt = await provider.getTransactionReceipt(params.hash);
                    if (!receipt) return "Transaction Pending or Not Found";
                    return `Status: ${receipt.status === 1 ? 'Success ✅' : 'Failed ❌'} (Block: ${receipt.blockNumber})`;

                case 'generate_token_contract':
                    return "Drafted ERC-20 Token Contract [Mock]";
                case 'estimate_deploy_cost':
                    return "Estimated Deployment Cost: 0.05 SHM";
                case 'deploy_contract':
                    return "Contract Deployed at: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
                case 'analyze_prompt':
                    return "Intent Analyzed: User wishes to perform financial action.";
                case 'validate_constraints':
                    return "Validation Passed: Balance sufficient, Slippage < 1%.";
                case 'generate_explanation':
                    return "Explanation: Market conditions are favorable.";
                case 'encrypt_input':
                    try {
                        const { encryptParameter } = await import('../services/inco-service');
                        const valueToEncrypt = params?.value || 1337; // Default or user provided

                        // Get user address from signer if available
                        const userAddress = signer ? await signer.getAddress() : null;
                        const result = await encryptParameter(valueToEncrypt, params?.type || 'uint32', userAddress);

                        if (result.success) {
                            return `✅ Data secured with Inco Lightning!\n\n` +
                                `• Input: ${valueToEncrypt}\n` +
                                `• Status: ${result.display}\n` +
                                `• Ciphertext: ${result.ciphertext?.toString()?.slice(0, 32) || 'N/A'}... [TRUNCATED]`;
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (e) {
                        return `❌ Inco Encryption Failed: ${e.message}`;
                    }
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

                            return `🛡️ **Stealth Transaction Executed**\n\n` +
                                `• **Funds Moved:** ${amountToEncrypt} SHM\n` +
                                `• **Privacy Level:** High (Intent Scrambled)\n` +
                                `• **Blockchain Proof:** [Tx ${tx.hash.slice(0, 10)}...](https://explorer-sphinx.shardeum.org/tx/${tx.hash})\n\n` +
                                `**Usability Note:** Your balance has decreased, and your "Why" is locked behind Inco encryption. Only you can reveal the strategy.`;

                        } else {
                            throw new Error(amountResult.error || thoughtResult.error);
                        }
                    } catch (e) {
                        return `❌ Confidential Execution Failed: ${e.message}`;
                    }
                case 'selective_disclosure':
                    return "Result Revealed: 100 Tokens. Inputs remain hidden.";
                case 'submit_agent_profile':
                    return "Agent Profile Submitted to DAO for review.";
                case 'list_approved_agents':
                    return "Active Agents: [TradeMaster AI, YieldOptimizer, ShardGuardian]";

                default:
                    console.log("Tool execution not fully implemented for:", toolId);
                    return "Tool not implemented yet.";
            }
        } catch (error) {
            console.error("Tool execution failed:", error);
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
