import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../utils/errors";
import { deleteUserById, listUsersForAdmin } from "../services/admin.service";

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitRaw = req.query.limit;
    const cursorRaw = req.query.cursor;

    const parsedLimit =
      typeof limitRaw === "string" ? Number.parseInt(limitRaw, 10) : 20;

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      throw new ValidationError("limit must be a positive number");
    }

    const result = await listUsersForAdmin({
      limit: parsedLimit,
      cursor: typeof cursorRaw === "string" ? cursorRaw : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || userId.trim() === "") {
      throw new ValidationError("userId is required");
    }

    const deleted = await deleteUserById(userId);
    if (!deleted) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
