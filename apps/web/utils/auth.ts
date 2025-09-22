import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "@repo/db/client";

export const auth = betterAuth({
    database: prismaAdapter(prismaClient,{
        provider:"postgresql"
    }),
    socialProviders:{
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
            scope: [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/gmail.modify",
                "https://www.googleapis.com/auth/gmail.readonly"
            ],
            accessType: "offline",
            prompt: "consent", 
        }
    },
    session:{
        disableSessionRefresh: false,
    },
});
