import { NextFunction, Request, Response } from "express";
import { categorize_Initial_Emails, summarize_Email } from "../services/ai.service";

export const categorizeInitialEmails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      res.status(200).json({
        success: false,
        message: "GEMINI_API_KEY is not configured. Initial categorization skipped.",
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 30;
    const result = await categorize_Initial_Emails(req.user.id, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error categorizing emails:", error);
    next(error);
  }
}

export const summarizeEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      res.status(200).json({
        success: false,
        message: "GEMINI_API_KEY is not configured. Summarization is unavailable.",
      });
      return;
    }

    const { subject, content } = req.body as {
      subject?: string;
      content?: string;
    };

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: "Email content is required." });
      return;
    }

    const summary = await summarize_Email(subject || "No subject", content);
    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    console.error("Error generating summary:", error);
    next(error);
  }
};
