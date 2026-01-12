export const MCP_TOOLS = [
    {
        id: 'get_wallet_address',
        name: 'Get Wallet',
        description: 'Get connected wallet address',
        type: 'read',
        icon: '🆔',
        keywords: ['wallet address', 'my address', 'who am i']
    },
    {
        id: 'get_balance',
        name: 'Check Balance',
        description: 'Check SHM/ETH balance',
        type: 'read',
        icon: '💰',
        keywords: ['balance', 'how much', 'funds', 'shm', 'money']
    },
    {
        id: 'get_network',
        name: 'Check Network',
        description: 'Check chain',
        type: 'read',
        icon: '🌐',
        keywords: ['network', 'chain', 'which network', 'connected to']
    },
    {
        id: 'estimate_gas',
        name: 'Estimate Gas',
        description: 'Estimate tx cost',
        type: 'read',
        icon: '⛽',
        keywords: ['gas', 'cost', 'fee', 'estimate gas']
    },
    {
        id: 'send_transaction',
        name: 'Send SHM',
        description: 'Send SHM/ETH',
        type: 'write',
        icon: '💸',
        keywords: ['send', 'transfer', 'pay', 'give'],
        params: { to: 'Recipient Address (0x...)', amount: 'Amount to send' }
    },
    {
        id: 'get_transaction_status',
        name: 'Tx Status',
        description: 'Check tx status',
        type: 'read',
        icon: '🔍',
        keywords: ['confirmed', 'status', 'track', 'tx', 'receipt']
    },
    {
        id: 'generate_token_contract',
        name: 'Draft Token',
        description: 'Draft token contract',
        type: 'write',
        icon: '📝',
        keywords: ['draft', 'template', 'token code']
    },
    {
        id: 'estimate_deploy_cost',
        name: 'Deploy Cost',
        description: 'Estimate deployment cost',
        type: 'read',
        icon: '📊',
        keywords: ['cost to deploy', 'deployment price']
    },
    {
        id: 'deploy_contract',
        name: 'Deploy Token',
        description: 'Deploy token to chain',
        type: 'write',
        icon: '🚀',
        keywords: ['deploy', 'launch', 'create token']
    },
    {
        id: 'analyze_prompt',
        name: 'Analyze Intent',
        description: 'Understand prompt intent',
        type: 'read',
        icon: '🧠',
        keywords: ['if gas <', 'explain intent', 'analyze']
    },
    {
        id: 'validate_constraints',
        name: 'Validate',
        description: 'Check limits/constraints',
        type: 'read',
        icon: '⚖️',
        keywords: ['if balance ok', 'validate', 'check limits']
    },
    {
        id: 'generate_explanation',
        name: 'Explain Why',
        description: 'Explain decision logic',
        type: 'read',
        icon: '💬',
        keywords: ['why', 'explain decision', 'reasoning']
    },
    {
        id: 'encrypt_input',
        name: 'Encrypt Input',
        description: 'Secure a value with Inco Lightning FHE',
        type: 'private',
        icon: '🔒',
        keywords: ['privately', 'secretly', 'hidden', 'encrypt'],
        params: { value: 'The number or value to encrypt', type: 'Type (uint8/16/32/64/128/256/bool)' }
    },
    {
        id: 'confidential_execute',
        name: 'Private Exec',
        description: 'Private execution via Inco. Use this for ANY request labeled private or secret.',
        type: 'private',
        icon: '🕵️',
        keywords: ['confidential', 'privacy level', 'private transaction', 'secretly execute', 'stealth'],
        params: { to: 'Recipient Address', value: 'Amount to send' }
    },
    {
        id: 'selective_disclosure',
        name: 'Disclosure',
        description: 'Reveal result only',
        type: 'private',
        icon: '👁️',
        keywords: ['hide inputs', 'reveal only']
    },
    {
        id: 'submit_agent_profile',
        name: 'Submit Profile',
        description: 'Add agent to DAO',
        type: 'write',
        icon: '🗳️',
        keywords: ['submit agent', 'add to dao', 'register agent']
    },
    {
        id: 'list_approved_agents',
        name: 'List Agents',
        description: 'Show available agents',
        type: 'read',
        icon: '📋',
        keywords: ['show agents', 'list available', 'active agents']
    },
    {
        id: 'get_token_price',
        name: 'Check Price',
        description: 'Get token price via Coinbase',
        type: 'read',
        icon: '🏷️',
        keywords: ['price', 'how much is', 'value of', 'rate'],
        params: { symbol: 'Ticker symbol (e.g., BTC, ETH, SHM)' }
    },
    {
        id: 'check_liquidity',
        name: 'Check Liquidity',
        description: 'Check pool liquidity',
        type: 'read',
        icon: '💧',
        keywords: ['liquidity', 'depth', 'pool size', 'slippage'],
        params: { pool: 'Pool pair (e.g., SHM-USDT)' }
    },

];

export const interpretPrompt = (prompt) => {
    const p = prompt.toLowerCase();

    // Exact match for tools with more specific keywords first
    const specificTools = ['deploy_contract', 'generate_token_contract', 'encrypt_input', 'confidential_execute', 'submit_agent_profile'];
    for (const toolId of specificTools) {
        const tool = MCP_TOOLS.find(t => t.id === toolId);
        if (tool.keywords.some(k => p.includes(k))) return tool;
    }

    // General keyword search
    for (const tool of MCP_TOOLS) {
        if (tool.keywords.some(k => p.includes(k))) {
            return tool;
        }
    }

    // Fallbacks
    if (p.includes('balance')) return MCP_TOOLS.find(t => t.id === 'get_balance');
    if (p.includes('price')) return MCP_TOOLS.find(t => t.id === 'get_token_price');
    if (p.includes('liquidity')) return MCP_TOOLS.find(t => t.id === 'check_liquidity');
    if (p.includes('send') || p.includes('shm')) return MCP_TOOLS.find(t => t.id === 'send_transaction');

    return MCP_TOOLS.find(t => t.id === 'send_transaction');
};
