import { prismaClient } from "@repo/db/client";
import { gmailClient } from "../lib/gmailClient.js";


export const getEmails = async (userId: string, query: string) => {
  try {
    const g = new gmailClient();
    await g.init(userId);
    // console.log("Gmail client initialized for user:", userId);

    const messages = await g.listThreads(query, 50);
    // console.log("Fetched messages:", messages);

    return messages;
  } catch (error) {
    console.error("Error fetching inbox:", error);
    throw new Error("Failed to fetch inbox");
  }
};

export const getEmailById = async (userId: string, threadId: string) => {
  try {
    const g = new gmailClient();
    await g.init(userId);
    const mailCategory = await prismaClient.mail.findUnique({
      where: { gmailId: threadId },
      select: {
        category: {
          select: {
            icon: true,
          }
        }
      }
    });
    const email = await g.getThreadWithMessages(threadId);
    return {
      ...email,
      categoryIcon: mailCategory?.category?.icon ?? null,
    };
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Failed to fetch email");
  }
};

export const getMergedInboxEmails = async (userId: string, query: string) => {
  const gmail = new gmailClient();
  await gmail.init(userId);

  const threads = await gmail.listThreads(query, 50); // metadata only
  const gmailIds = threads.map(t => t.latest.id);
  console.log("gmailIds:", gmailIds);
  
  const categorized = await prismaClient.mail.findMany({
    where: {
      userId,
      gmailId: { in: gmailIds },
    },
    select: {
      gmailId: true,
      category:{
        select:{
          name: true,
          icon: true,
        }
      }
    },
  });

  const categoryMap = new Map(categorized.map(c => [c.gmailId, { name: c.category?.name ?? null, icon: c.category?.icon ?? null }]));

  return threads.map(t => ({
    latest: { ...t.latest },
    threadId: t.threadId,
    messageCount: t.messageCount,
    categoryName: categoryMap.get(t.latest.id)?.name ?? null,
    categoryIcon: categoryMap.get(t.latest.id)?.icon ?? null,
  }));
};