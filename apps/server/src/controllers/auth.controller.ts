import { NextFunction, Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { getAuthUrl, getTokens } from "../utils/google";
import { google } from "googleapis";

export const googleAuth = (req: Request, res: Response) => {
  const url = getAuthUrl();
  res.json({ url });
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;
    const { tokens, oauth2Client } = await getTokens(code);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: userData } = await oauth2.userinfo.get();
    const { email, name, picture } = userData;

    if (!email) {
      res.status(400).json({ error: "Email not provided by Google" });
      return;
    }
    
    if (req.user.email === email) {
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
      return;
    }

    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    const existingUser = await prismaClient.connectedAccount.findUnique({
      where: {
        email,
        userId: req.user.id,
      },
    });

    if (!existingUser) {
      await prismaClient.connectedAccount.create({
        data: {
          userId: req.user.id,
          name: name || "",
          email: email || "",
          image: picture || "",
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token!,
          expiresAt,
        },
      });
    }

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    next(error);
  }
};
