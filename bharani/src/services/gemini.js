import { GoogleGenerativeAI } from "@google/generative-ai";

// Access the API key from Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateGeminiResponse = async (prompt, contextData = null) => {
    if (!genAI) {
        // Fallback for demo purposes if no key is provided, or throw error
        // For a seamless "good looking" demo, we might want to return a simulated response if the key is missing
        // but explicit error is better for development.
        console.warn("Gemini API Key missing (VITE_GEMINI_API_KEY). Returning mock response.");
        return "I can't connect to the Gemini Network right now (API Key missing). Please check your neural link credentials.";
    }

    try {
        // Updated to use the available 2.0 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let systemInstruction = "You are a specialized Blockchain Forensic Auditor AI. Your job is to explain complex transaction logs to users in simple, clear terms. Analyze the provided transaction context.";

        if (contextData) {
            systemInstruction += `\n\nTRANSACTION CONTEXT:\n${JSON.stringify(contextData, null, 2)}`;
        }

        const result = await model.generateContent(`${systemInstruction}\n\nUSER QUESTION: ${prompt}`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Interaction Failed:", error);
        return "Secure channel connection failed. Please ensure your API key is valid and you have access to the Gemini 2.0 models.";
    }
};
