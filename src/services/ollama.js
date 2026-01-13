// Use ngrok URL in production, local proxy in development
const OLLAMA_HOST = import.meta.env.VITE_OLLAMA_URL || '/ollama';

export const generateResponse = async (prompt, systemPrompt) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

    try {
        console.log(`Ollama: Fetching ${OLLAMA_HOST}/api/chat...`);
        const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Ollama: Server responded with error", errBody);
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Ollama: Success response received");
        return data.message.content;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error("Ollama: Request timed out after 90 seconds");
            throw new Error("Ollama timeout: The model is taking too long to respond (90s limit).");
        }
        console.error("Ollama: Fetch failure", error);
        throw error;
    }
};

export const checkOllamaHealth = async () => {
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/tags`);
        return response.ok;
    } catch (e) {
        return false;
    }
};
