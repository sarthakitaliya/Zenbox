import { z } from "zod";

export const submitFeedbackSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
  rating: z.number().int().min(1).max(5),
});
