import { NextFunction, Request, Response } from "express";
import { categorize_Initial_Emails } from "../services/ai.service";

export const categorizeInitialEmails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30;
    const result = await categorize_Initial_Emails(req.user.id, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error categorizing emails:", error);
    next(error);
  }
}