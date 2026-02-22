import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});
