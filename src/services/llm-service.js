const LLM_HOST = '/ollama'; // Configured in vite.config.js to point to http://172.16.44.98:8000

export const generateResponse = async (prompt, systemPrompt) => {
    try {
        // Based on openapi.json, the endpoint is /run-agent and expects { prompt: "string" }
        const combinedPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

        const response = await fetch(`${LLM_HOST}/run-agent`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: combinedPrompt
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // The API returns the raw AI string directly or in a specific field. 
        // Based on common FastAPI patterns, it's likely the whole response or a 'response' field.
        // If 'data' is the string itself, return it. If it's an object, we might need a field.
        return typeof data === 'string' ? data : (data.response || data.output || JSON.stringify(data));
    } catch (error) {
        console.error("Failed to connect to LLM:", error);
        throw error;
    }
};

export const checkLLMHealth = async () => {
    try {
        // Many FastAPI implementations have a /health or / endpoint
        const response = await fetch(`${LLM_HOST}/`);
        return response.ok;
    } catch (e) {
        return false;
    }
};
