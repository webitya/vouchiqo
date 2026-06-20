import { z } from "zod";
import { COUPON_CATEGORIES } from "@/utils/constants";

export const createMerchantSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name cannot exceed 100 characters"),

  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  description: z.string().max(500).optional(),

  category: z.enum(COUPON_CATEGORIES),

  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().default("IN"),
    })
    .optional(),

  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
});

export const updateMerchantSchema = createMerchantSchema.partial();
