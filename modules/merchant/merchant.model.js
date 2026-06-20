import mongoose, { Schema } from "mongoose";
import { COUPON_CATEGORIES, MERCHANT_STATUS } from "@/utils/constants";

/**
 * Merchant profile.
 *
 * One merchant per user (enforced via authId unique index).
 * Status controls visibility: only "approved" merchants can have active coupons.
 *
 * Collection: merchants
 */
const merchantSchema = new Schema(
  {
    // Better Auth user ID of the merchant owner
    authId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },

    // URL-friendly identifier — e.g. "pizza-hut"
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    logo: { type: String }, // Cloudinary URL
    banner: { type: String }, // Cloudinary URL

    category: {
      type: String,
      enum: COUPON_CATEGORIES,
      required: true,
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "IN" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    contactEmail: { type: String, lowercase: true, trim: true },
    website: { type: String, trim: true },

    status: {
      type: String,
      enum: Object.values(MERCHANT_STATUS),
      default: MERCHANT_STATUS.PENDING,
      index: true,
    },

    // Denormalized counters — updated via background jobs or atomic $inc
    totalCoupons: { type: Number, default: 0 },
    totalRedemptions: { type: Number, default: 0 },
    totalClaims: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
    collection: "merchants",
  },
);

merchantSchema.index({ status: 1, category: 1 });
merchantSchema.index({ "location.city": 1, status: 1 });

const Merchant =
  mongoose.models.Merchant ?? mongoose.model("Merchant", merchantSchema);

export default Merchant;
