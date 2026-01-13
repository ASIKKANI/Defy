const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Internal Backend URL (Link to your friend's backend / Ollama)
// We use the local address since the gateway runs on the same machine
const FRIEND_BACKEND_URL = process.env.FRIEND_BACKEND_URL || 'http://127.0.0.1:11434';

// Middleware
app.use(helmet()); // Basic security headers
app.use(cors({ origin: '*' })); // Enable CORS for ThinkRoot
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({
    status: 'online',
    message: 'AgentChain Integration API is active.',
    usage: 'Send a POST request to /agent/run'
}));

/**
 * Endpoint: Run Agent
 * POST /agent/run
 */
app.get('/agent/run', (req, res) => {
    res.status(405).json({
        error: 'Method Not Allowed',
        message: 'This endpoint requires a POST request with a JSON body containing a "prompt".'
    });
});

app.post('/agent/run', async (req, res) => {
    const { prompt } = req.body;

    // 1. Validate Input
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Field "prompt" is required and cannot be empty.' });
    }

    try {
        console.log(`[Gateway] Processing prompt: "${prompt.substring(0, 50)}..."`);

        // 2. Forward to Backend (Ollama/MCP Layer)
        const response = await fetch(`${FRIEND_BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.1:latest',
                messages: [
                    {
                        role: 'system',
                        content: 'You are the AgentChain Orchestrator. You MUST respond ONLY in valid JSON matches the following schema: { "agent": "Trading Agent", "decision": "BUY | SELL | HOLD", "confidence": number, "explanation": "string", "data_used": {}, "on_chain": boolean, "transaction_hash": "string or null", "explorer_url": "string or null" }'
                    },
                    { role: 'user', content: prompt }
                ],
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) {
            console.error(`[Gateway] Backend Error: ${response.statusText}`);
            return res.status(502).json({ error: 'Failed to communicate with the internal AI backend.' });
        }

        const data = await response.json();

        // 3. Extract and Validate response
        // Ollama returns { message: { content: "{...}" } }
        let agentResponse;
        try {
            agentResponse = JSON.parse(data.message.content);
        } catch (e) {
            console.error("[Gateway] Invalid JSON from backend:", data.message.content);
            return res.status(500).json({ error: 'Backend returned an invalid data format.' });
        }

        // 4. Return clean, UI-safe JSON
        return res.json(agentResponse);

    } catch (error) {
        console.error('[Gateway] Critical Error:', error);
        if (error.code === 'ECONNREFUSED') {
            return res.status(504).json({ error: 'Backend service is offline or unreachable.' });
        }
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'active', gateway: 'AgentChain-Adapter' }));

const server = app.listen(PORT, () => {
    console.log(`🚀 Integration API (Gateway) is running on http://localhost:${PORT}`);
    console.log(`🔗 Forwarding requests to: ${FRIEND_BACKEND_URL}`);
});

server.on('error', (error) => {
    console.error('[Gateway] Server Error:', error);
});

process.on('uncaughtException', (err) => {
    console.error('[Gateway] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[Gateway] Unhandled Rejection at:', promise, 'reason:', reason);
});
