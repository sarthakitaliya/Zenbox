import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/errors";
import { submitFeedbackSchema } from "../schemas/feedback.schema";
import { createFeedback, listFeedback } from "../services/feedback.service";

export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = submitFeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message || "Invalid input");
    }

    await createFeedback(req.user.id, parsed.data);
    res.status(201).json({ message: "Feedback submitted" });
  } catch (error) {
    next(error);
  }
};

export const getAdminFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitRaw = req.query.limit;
    const parsedLimit =
      typeof limitRaw === "string" ? Number.parseInt(limitRaw, 10) : 20;

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      throw new ValidationError("limit must be a positive number");
    }

    const result = await listFeedback(parsedLimit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
