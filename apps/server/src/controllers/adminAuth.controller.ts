import { NextFunction, Request, Response } from "express";
import { ValidationError, AuthenticationError } from "../utils/errors";
import { adminLoginSchema, adminRegisterSchema } from "../schemas/admin.schema";
import {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  getAdminCount,
  updateAdminLastLogin,
} from "../services/admin.service";
import { adminCookieName, signAdminToken } from "../utils/adminAuth";
import { hashPassword, verifyPassword } from "../utils/password";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeAdmin = (admin: { id: string; email: string; name: string | null; lastLoginAt: Date | null }) => ({
  id: admin.id,
  email: admin.email,
  name: admin.name,
  lastLoginAt: admin.lastLoginAt,
});

const getConfiguredAdminEmail = () => {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configuredEmail) {
    throw new Error("ADMIN_EMAIL is required");
  }
  return configuredEmail;
};

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = adminRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message || "Invalid input");
    }

    const existingCount = await getAdminCount();
    if (existingCount > 0) {
      res.status(409).json({ message: "Admin already exists" });
      return;
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const configuredAdminEmail = getConfiguredAdminEmail();
    if (normalizedEmail !== configuredAdminEmail) {
      throw new AuthenticationError("Only configured admin email can register");
    }

    const passwordHash = hashPassword(password);

    const admin = await createAdmin({
      name,
      email: normalizedEmail,
      passwordHash,
    });

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    res.cookie(adminCookieName, token, cookieOptions);

    res.status(201).json({
      message: "Admin registered",
      admin: sanitizeAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message || "Invalid input");
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const configuredAdminEmail = getConfiguredAdminEmail();
    if (normalizedEmail !== configuredAdminEmail) {
      throw new AuthenticationError("Invalid admin credentials");
    }

    const admin = await getAdminByEmail(normalizedEmail);

    if (!admin || !admin.isActive) {
      throw new AuthenticationError("Invalid admin credentials");
    }

    const validPassword = verifyPassword(password, admin.passwordHash);
    if (!validPassword) {
      throw new AuthenticationError("Invalid admin credentials");
    }

    const updatedAdmin = await updateAdminLastLogin(admin.id);

    const token = signAdminToken({
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name,
    });

    res.cookie(adminCookieName, token, cookieOptions);

    res.status(200).json({
      message: "Admin login successful",
      admin: sanitizeAdmin(updatedAdmin),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = (
  _req: Request,
  res: Response
) => {
  res.clearCookie(adminCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Admin logged out" });
};

export const getAdminMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.admin) {
      res.status(401).json({ message: "Admin authentication failed" });
      return;
    }

    const admin = await getAdminById(req.admin.id);
    if (!admin || !admin.isActive) {
      res.status(401).json({ message: "Admin authentication failed" });
      return;
    }

    res.status(200).json({
      admin: sanitizeAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminRegistrationStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await getAdminCount();
    res.status(200).json({
      canRegister: count === 0,
    });
  } catch (error) {
    next(error);
  }
};
