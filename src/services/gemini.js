import { GoogleGenerativeAI } from "@google/generative-ai";

// Access the API key from Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Use Gemini 2.5 Flash - fast and efficient
    model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });
} else {
    console.error("❌ VITE_GEMINI_API_KEY is missing in .env file!");
}

export const generateResponse = async (prompt, systemPrompt) => {
    if (!model) {
        throw new Error("Gemini API Key is missing or invalid. Please check your .env file.");
    }

    try {
        console.log("Gemini: Sending request with system prompt...");

        // Construct a structured prompt
        // Since getGenerativeModel systemInstruction support varies by version/platform, 
        // we'll explicitly include it in the user flow for robustness.
        const fullPrompt = `${systemPrompt}\n\nUSER REQUEST: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini: Success response received");
        return text;

    } catch (error) {
        console.error("Gemini Interaction Failed:", error);
        throw new Error(`Gemini API Error: ${error.message}`);
    }
};

export const checkHealth = async () => {
    return !!model;
};
