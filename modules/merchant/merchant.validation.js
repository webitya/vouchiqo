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
  autoApproveRevivals: z.boolean().optional(),
  legalEntityType: z.enum(["Proprietorship", "Partnership", "LLP", "Pvt Ltd"]).optional(),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").or(z.string().max(0)).optional(),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").or(z.string().max(0)).optional(),
  bankDetails: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),
});

export const updateMerchantSchema = createMerchantSchema.partial();
