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
  shortDescription: z.string().max(300).optional(),
  longDescription: z.string().max(1000).optional(),

  category: z.enum(COUPON_CATEGORIES),

  location: z
    .object({
      address: z.string().optional(),
      pincode: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().default("IN"),
      coordinates: z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional(),
        })
        .optional(),
    })
    .optional(),

  contactEmail: z.string().email().or(z.string().max(0)).optional(),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  website: z.string().url().or(z.string().max(0)).optional(),
  businessType: z.enum(["online", "physical", "both"]).optional(),
  operatingHours: z.record(z.any()).optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

export const updateMerchantSchema = createMerchantSchema.partial();
