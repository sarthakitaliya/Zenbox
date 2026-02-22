import { prismaClient } from "@repo/db/client";

export const getAdminCount = async () => {
  return prismaClient.adminUser.count();
};

export const getAdminByEmail = async (email: string) => {
  return prismaClient.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
};

export const getAdminById = async (id: string) => {
  return prismaClient.adminUser.findUnique({
    where: { id },
  });
};

export const createAdmin = async ({
  name,
  email,
  passwordHash,
}: {
  name?: string;
  email: string;
  passwordHash: string;
}) => {
  return prismaClient.adminUser.create({
    data: {
      name: name?.trim() || null,
      email: email.trim().toLowerCase(),
      passwordHash,
      isActive: true,
    },
  });
};

export const updateAdminLastLogin = async (id: string) => {
  return prismaClient.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
};

export const getAdminOverviewStats = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    users,
    connectedAccounts,
    customCategories,
    categorizedMails,
    activeUsers7d,
    newUsersLast7d,
    recentSignups,
  ] = await Promise.all([
    prismaClient.user.count(),
    prismaClient.connectedAccount.count(),
    prismaClient.customCategory.count(),
    prismaClient.mail.count(),
    prismaClient.session.findMany({
      where: {
        OR: [{ createdAt: { gte: sevenDaysAgo } }, { updatedAt: { gte: sevenDaysAgo } }],
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prismaClient.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prismaClient.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totals: {
      users,
      connectedAccounts,
      customCategories,
      categorizedMails,
    },
    activity: {
      activeUsers7d: activeUsers7d.length,
      newUsersLast7d,
    },
    recentSignups,
  };
};

export const listUsersForAdmin = async ({
  limit = 20,
  cursor,
}: {
  limit?: number;
  cursor?: string;
}) => {
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const users = await prismaClient.user.findMany({
    take: safeLimit + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const hasMore = users.length > safeLimit;
  const data = hasMore ? users.slice(0, safeLimit) : users;

  const userIds = data.map((user) => user.id);
  const lastSessionByUser =
    userIds.length > 0
      ? await prismaClient.session.groupBy({
          by: ["userId"],
          where: {
            userId: {
              in: userIds,
            },
          },
          _max: {
            updatedAt: true,
          },
        })
      : [];

  const lastActiveMap = new Map(
    lastSessionByUser.map((item) => [item.userId, item._max.updatedAt ?? null])
  );

  const usersWithLastActive = data.map((user) => ({
    ...user,
    lastActiveAt: lastActiveMap.get(user.id) ?? null,
  }));

  return {
    users: usersWithLastActive,
    nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
  };
};

export const deleteUserById = async (userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return null;
  }

  await prismaClient.$transaction(async (tx) => {
    const mails = await tx.mail.findMany({
      where: { userId },
      select: { id: true },
    });
    const mailIds = mails.map((mail) => mail.id);

    if (mailIds.length > 0) {
      await tx.attachmentMetaData.deleteMany({
        where: { mailId: { in: mailIds } },
      });
    }

    await tx.mail.deleteMany({ where: { userId } });
    await tx.customCategory.deleteMany({ where: { userId } });
    await tx.connectedAccount.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });
    await tx.session.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });

  return { id: userId };
};
