import { prismaClient } from "@repo/db/client";
import { NotFoundError } from "../utils/errors";
import { gmailClient } from "../lib/gmailClient";
import { categorizeEmailWithGemini } from "../ai/geminiCategorizer";
import { generateResponse } from "../lib/gemini";

type InitialCategorizationResult = {
  newlyCategorizedCount: number;
  totalCategorizedCount: number;
  isFirstCategorization: boolean;
};

export const categorize_Initial_Emails = async (userId: string, limit: number = 30) => {
  try {
    const categories = await prismaClient.customCategory.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    if (categories.length === 0) {
      throw new NotFoundError("No categories found for user");
    }
  
    const gmail = new gmailClient();
    await gmail.init(userId);
    const threads = await gmail.listThreadsWithFullMessages("in:inbox", limit);
  
    const initialCategorizedCount = await prismaClient.mail.count({
      where: { userId },
    });
    let categorizedCount = initialCategorizedCount;
    let newlyCategorizedCount = 0;
  
    for (const thread of threads) {
      if (categorizedCount >= limit) {
        console.log(`Reached limit of ${limit} categorized emails.`);
        break;
      }
  
      const latest = thread.latest;
      if (!latest || !latest.subject || !latest.body?.content) continue;
  
      const categoryName = await categorizeEmailWithGemini(
        latest.subject,
        latest.body.content,
        categories
      );
  
      const category = await prismaClient.customCategory.findFirst({
        where: { userId, name: categoryName },
      });
  
      if (category) {
        const existingMail = await prismaClient.mail.findUnique({
          where: { gmailId: latest.id },
          select: { id: true },
        });

        if (existingMail) {
          await prismaClient.mail.update({
            where: { gmailId: latest.id },
            data: { categoryId: category.id },
          });
        } else {
          await prismaClient.mail.create({
            data: {
              userId,
              gmailId: latest.id,
              threadId: thread.threadId,
              subject: latest.subject,
              from: latest.from,
              to: latest.to,
              snippet: latest.snippet || "",
              categoryId: category.id,
            },
          });
          categorizedCount++;
          newlyCategorizedCount++;
        }
      }
    }
    const result: InitialCategorizationResult = {
      newlyCategorizedCount,
      totalCategorizedCount: categorizedCount,
      isFirstCategorization:
        initialCategorizedCount === 0 && newlyCategorizedCount > 0,
    };
    return result;
  } catch (error) {
    console.error("Error categorizing initial emails:", error);
    throw new Error("Failed to categorize initial emails");
    
  }
};

export const summarize_Email = async (subject: string, content: string) => {
  const prompt = `
You are an email assistant. Summarize this email clearly and briefly.

Rules:
- Keep summary under 6 bullet points.
- Capture key intent, any action items, and deadlines (if present).
- Do not invent details.

Subject: ${subject}
Email Body:
${content}
  `;

  const summary = await generateResponse(prompt);
  return summary?.trim() || "No summary available.";
};
