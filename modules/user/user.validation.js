import { z } from "zod";

export const updateUserSchema = z.object({
  location: z
    .object({
      city: z.string().min(1).max(100).optional(),
      state: z.string().min(1).max(100).optional(),
      country: z.string().min(1).max(100).optional(),
    })
    .optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  role: z.enum(["customer", "merchant", "admin"]).optional(),
  isActive: z.coerce.boolean().optional(),
});
