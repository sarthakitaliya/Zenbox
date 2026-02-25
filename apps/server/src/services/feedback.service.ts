import { prismaClient } from "@repo/db/client";

export const createFeedback = async (
  userId: string,
  payload: {
    name?: string;
    email: string;
    message: string;
    rating: number;
  }
) => {
  return prismaClient.feedback.create({
    data: {
      userId,
      name: payload.name?.trim() || null,
      email: payload.email.trim(),
      message: payload.message.trim(),
      rating: payload.rating,
    },
  });
};

export const listFeedback = async (limit: number = 20) => {
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const items = await prismaClient.feedback.findMany({
    take: safeLimit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      rating: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return { items };
};

export const getLatestFeedbackByUser = async (userId: string) => {
  const item = await prismaClient.feedback.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      rating: true,
      createdAt: true,
    },
  });

  return { item };
};
