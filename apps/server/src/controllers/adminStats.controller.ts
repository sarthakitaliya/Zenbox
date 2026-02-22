import { NextFunction, Request, Response } from "express";
import { getAdminOverviewStats } from "../services/admin.service";

export const getOverviewStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getAdminOverviewStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
