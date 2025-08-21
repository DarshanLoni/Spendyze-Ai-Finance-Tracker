import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a structured financial summary based on user transactions.
 * @param {Array} transactions - The user's transactions.
 * @param {string} context - Optional context for the prompt, e.g., 'for an email alert'.
 * @returns {Promise<{ overview: string, positive: string, suggestion: string }>}
 */
export const generateFinancialSummary = async (transactions, context = '') => {
  const prompt = `Based on the following JSON transaction data, provide a structured financial summary ${context}.
  Return your response strictly in valid JSON format with the following fields:
  {
    "overview": "2-3 sentence summary of overall financial activity.",
    "positive": "Highlight one positive financial trend.",
    "suggestion": "Suggest one area for improvement."
  }

  Be concise and encouraging. All monetary values should be presented using the Indian Rupee symbol (₹).

  Transactions:
  ${JSON.stringify(transactions, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
    });

    const parsed = JSON.parse(response.text);

    return {
      overview: parsed.overview || "",
      positive: parsed.positive || "",
      suggestion: parsed.suggestion || ""
    };
  } catch (err) {
    console.error("AI Summary Generation Error:", err);
    throw new Error("Failed to generate summary from AI.");
  }
};


/**
 * Analyzes a bill image and extracts transaction details.
 * @param {string} base64Image - The base64 encoded image string.
 * @returns {Promise<Object>} The extracted transaction data.
 */
export const analyzeBillWithAI = async (base64Image) => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg', // Assuming jpeg, adjust if other types are supported
        },
    };
    
    const prompt = "Analyze this receipt or bill. Extract the total amount, suggest a relevant title (e.g., vendor name), determine the most likely expense category, and find the transaction date.";

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A short, relevant title for the transaction, like the merchant's name." },
            amount: { type: Type.NUMBER, description: "The total amount of the transaction." },
            category: { 
                type: Type.STRING, 
                description: "The most likely expense category from the provided list.",
                enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other']
            },
            date: { type: Type.STRING, description: "The date of the transaction in YYYY-MM-DD format. Infer from the bill if possible, otherwise use today's date."}
        },
        required: ["title", "amount", "category", "date"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const parsedJson = JSON.parse(response.text);
        
        return {
            ...parsedJson,
            type: 'Expense', // Bill scanning is always for expenses
        };
    } catch (err) {
        console.error("AI Bill Scan Error:", err);
        throw new Error("Failed to analyze bill with AI.");
    }
};


/**
 * Gets a response from the chatbot based on conversation history and transaction data.
 * @param {Array} history - The recent conversation history.
 * @param {Array} transactions - The user's recent transactions.
 * @returns {Promise<string>} The chatbot's response text.
 */
export const getChatbotResponse = async (history, transactions) => {
    const transactionContext = JSON.stringify(transactions, null, 2);
    
    const systemInstruction = `You are a friendly and helpful financial assistant named Fin.
    Analyze the user's financial data to answer their questions. The user's recent transactions are provided below in JSON format.
    Base your answers SOLELY on this data. Do not make up information. If you don't know the answer, say so.
    Be concise and clear in your responses. When mentioning any monetary value, you MUST use the Indian Rupee symbol (₹) and not the word "Rupees" or "INR". For example, write ₹500, not 500 Rupees.
    Current date is ${new Date().toDateString()}.
    
    TRANSACTION DATA:
    ${transactionContext}`;

    const chatHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

    // The last message is the new prompt, so it's not part of the history
    const lastMessage = chatHistory.pop();
    if (!lastMessage || lastMessage.role !== 'user') {
        throw new Error("Invalid chat history format.");
    }

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            history: chatHistory
        });

        const result = await chat.sendMessage({ message: lastMessage.parts[0].text });
        return result.text;
    } catch (err) {
        console.error("AI Chatbot Error:", err);
        throw new Error("Failed to get response from AI Chatbot.");
    }
};
