import { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth";
import { fromNodeHeaders } from "better-auth/node";
import { AuthenticationError } from "../utils/errors";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log("Session:", session);
    if (!session) {
      console.log("Authentication failed: No session found");
      
      throw new AuthenticationError("Authentication failed");
    }
    req.user = session.user as any;
    next();
  } catch (error) {
    next(error);
  }
};
