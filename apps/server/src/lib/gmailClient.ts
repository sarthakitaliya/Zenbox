import { prismaClient } from "@repo/db/client";
import { getOAuthClient } from "../utils/google";
import { google } from "googleapis";
import { parseEmail, parseThread } from "./parseEmail";

export class gmailClient {
  private gmail: any;

  async init(userId: string) {
    const oauthClient = getOAuthClient();
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
    oauthClient.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });
    const gmail = google.gmail({
      version: "v1",
      auth: oauthClient,
    });
    gmail.users.messages;
    this.gmail = gmail;
  }
  async listThreads(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const response = await this.gmail.users.threads.list({
        userId: "me",
        q: query,
        maxResults,
      });

      const threads = response.data.threads || [];
      // console.log("Fetched threads:", threads);

      const parsedThreads = await Promise.all(
        threads.map(async (thread: any) => {
          const threadRes = await this.gmail.users.threads.get({
            userId: "me",
            id: thread.id,
            format: "metadata",
            metadataHeaders: ["Subject", "From", "To", "Date"],
          });

          const messages = threadRes.data.messages || [];
          const lastMessage = messages[messages.length - 1];

          return {
            threadId: thread.id,
            messageCount: messages.length,
            latest: parseEmail(lastMessage),
          };
        })
      );
      // console.log("Fetched threads:", parsedThreads);
      // console.log("Fetched threads:", parsedThreads[0].latest.body);
      return parsedThreads;
    } catch (error) {
      console.error("Error listing threads:", error);
      throw new Error("Failed to list threads");
    }
  }
  async getThreadWithMessages(threadId: string) {
    try {
      const response = await this.gmail.users.threads.get({
        userId: "me",
        id: threadId,
        format: "full",
      });

      return parseThread(response.data);
    } catch (error) {
      console.error("Error getting thread with messages:", error);
      throw new Error("Failed to get messages");
    }
  }
  async listEmails(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults,
      });

      const messages = response.data.messages || [];

      const metadata = await Promise.all(
        messages.map(async (msg: any) => {
          const res = await this.gmail.users.messages.get({
            userId: "me",
            id: msg.id!,
            format: "metadata",
            metadataHeaders: ["Subject", "From", "To", "Date"],
          });

          return parseEmail(res.data);
        })
      );
      return metadata;
    } catch (error) {
      console.error("Error listing messages:", error);
      throw new Error("Failed to list messages");
    }
  }

  async getMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });

      if (!response || !response.data) {
        console.error("Invalid response from Gmail API:", response);
        throw new Error("Invalid response from Gmail API");
      }

      return response.data;
    } catch (error) {
      console.error("Error getting message:", error);
      throw new Error("Failed to get message");
    }
  }
  async getFullMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });

      if (!response || !response.data) {
        console.error("Invalid response from Gmail API:", response);
        throw new Error("Invalid response from Gmail API");
      }
      const html = Buffer.from(
        response.data.payload?.parts[1]?.body?.data || "",
        "base64"
      ).toString("utf-8");
      const text = Buffer.from(
        response.data.payload?.parts[0]?.body?.data || "",
        "base64"
      ).toString("utf-8");

      // console.log("Fetched full message:", response.data);
      // console.log("headers", response.data.payload?.headers);
      // console.log("body", response.data.payload?.parts);
      // console.log("html body", html);
      // console.log("text body", text);

      return parseEmail(response.data);
    } catch (error) {
      console.error("Error getting full message:", error);
      throw new Error("Failed to get full message");
    }
  }

  async listThreadsWithFullMessages(
    query: string,
    maxResults: number = 10
  ): Promise<any[]> {
    try {
      const response = await this.gmail.users.threads.list({
        userId: "me",
        q: query,
        maxResults,
      });

      const threads = response.data.threads || [];

      const parsedThreads = await Promise.all(
        threads.map(async (thread: any) => {
          const threadRes = await this.gmail.users.threads.get({
            userId: "me",
            id: thread.id,
            format: "full",
          });

          const messages = threadRes.data.messages || [];
          const lastMessage = messages[messages.length - 1];

          return {
            threadId: thread.id,
            messageCount: messages.length,
            latest: parseEmail(lastMessage),
          };
        })
      );

      return parsedThreads;
    } catch (error) {
      console.error("Error listing threads with full messages:", error);
      throw new Error("Failed to list threads with full messages");
    }
  }
  async modifyThreadLabels(
    threadId: string,
    add: string[] = [],
    remove: string[] = []
  ) {
    try {
      await this.gmail.users.threads.modify({
        userId: "me",
        id: threadId,
        requestBody: {
          addLabelIds: add,
          removeLabelIds: remove,
        },
      });
    } catch (error) {
      console.error("Error modifying labels:", error);
      throw new Error("Failed to modify labels");
    }
  }
  trashThread(threadId: string) {
    return this.modifyThreadLabels(threadId, ["TRASH"]);
  }

  archiveThread(threadId: string) {
    return this.modifyThreadLabels(threadId, [], ["INBOX"]);
  }

  unarchiveThread(threadId: string) {
    return this.modifyThreadLabels(threadId, ["INBOX"], ["TRASH"]);
  }
  
  starThread(threadId: string) {
    return this.modifyThreadLabels(threadId, ["STARRED"]);
  }

  unstarThread(threadId: string) {
    return this.modifyThreadLabels(threadId, [], ["STARRED"]);
  }
}
