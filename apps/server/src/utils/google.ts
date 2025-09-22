import { google } from "googleapis";
import dotenv from "dotenv";
import { prismaClient } from "@repo/db/client";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function getTokens(code: string): Promise<any> {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return { tokens, oauth2Client };
}

export function getOAuthClient(): any {
  return oauth2Client;
}

export async function getGmailClient(userId: string) {
  const user = await prismaClient.account.findFirst({
    where: { userId },
    select: {
      accessToken: true,
      refreshToken: true,
    },
  });

  if (!user || !user.accessToken || !user.refreshToken) {
    throw new Error("User does not have Google tokens");
  }
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
  return gmail;
}
