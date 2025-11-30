import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

export const getGeminiResponse = async (
  query: string,
  menuContext: MenuItem[],
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!process.env.API_KEY) return "I'm sorry, I cannot connect to the AI service right now (Missing API Key).";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a context-aware system instruction
    const menuDescription = menuContext
      .map(item => `${item.name} ($${item.price}): ${item.description}. Ingredients: ${item.ingredients.join(', ')}`)
      .join('\n');

    const systemInstruction = `
      You are 'Chef G', the AI Concierge for Digital Dining. 
      Your goal is to help customers choose food, explain ingredients, and make recommendations based on the menu below.
      Be friendly, professional, and concise.
      
      MENU CONTEXT:
      ${menuDescription}
    `;

    // We use gemini-2.5-flash for speed and efficiency in a chat context
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: query });
    return result.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of trouble connecting to the kitchen's brain right now. Please ask a waiter!";
  }
};