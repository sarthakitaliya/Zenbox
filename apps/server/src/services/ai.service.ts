import { prismaClient } from "@repo/db/client";
import { NotFoundError } from "../utils/errors";
import { gmailClient } from "../lib/gmailClient";
import { categorizeEmailWithGemini } from "../ai/geminiCategorizer";

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
  
    let categorizedCount = await prismaClient.mail.count({
      where: { userId },
    });
  
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
        await prismaClient.mail.upsert({
          where: { gmailId: latest.id },
          update: { categoryId: category.id },
          create: {
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
      }
    }
    return `Categorized ${categorizedCount} emails successfully.`;
  } catch (error) {
    console.error("Error categorizing initial emails:", error);
    throw new Error("Failed to categorize initial emails");
    
  }
};
