import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "@repo/db/client";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET as string,
    database: prismaAdapter(prismaClient, {
        provider: "postgresql",
    }),
});
