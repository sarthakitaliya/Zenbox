import { generateResponse } from "../lib/gemini";

export async function categorizeEmailWithGemini(
  subject: string,
  body: string,
  categories: { id: string; name: string; description: string | null }[]
): Promise<string> {
  const prompt = `
You are an AI email categorizer. Given the email content and the following categories, assign the best matching category.

Categories:
${categories.map((c) => `- ${c.name}: ${c.description}`).join("\n")}

Email:
Subject: ${subject}
Body: ${body}

Return only the category name. If none match, return "Other".
`;

  const result: string = await generateResponse(prompt);

  return result.trim();
}
