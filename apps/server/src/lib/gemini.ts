import { GoogleGenAI } from "@google/genai";

export const GeminiAPI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateResponse = async (prompt: string): Promise<string> => {
  const response: any = await GeminiAPI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}