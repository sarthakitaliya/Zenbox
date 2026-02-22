import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../utils/errors";
import { adminCookieName, verifyAdminToken } from "../utils/adminAuth";

export const adminAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const cookieHeader = req.headers.cookie || "";
    const token = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${adminCookieName}=`))
      ?.split("=")[1];

    if (!token) {
      throw new AuthenticationError("Admin authentication failed");
    }

    const payload = verifyAdminToken(decodeURIComponent(token));
    req.admin = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
