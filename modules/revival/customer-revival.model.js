import mongoose, { Schema } from "mongoose";

/**
 * CustomerRevival model.
 * Stores coupon revival requests submitted by customers/visitors.
 * Includes coupon code, brand name, submitter email, and status.
 *
 * Collection: customer_revivals
 */
const customerRevivalSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      uppercase: true,
      trim: true,
    },

    brandName: {
      type: String,
      required: [true, "Brand/store name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "contacted", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    votes: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    collection: "customer_revivals",
  }
);

// Compound index to count unique codes requested per brand
customerRevivalSchema.index({ brandName: 1, code: 1 });

const CustomerRevival =
  mongoose.models.CustomerRevival ??
  mongoose.model("CustomerRevival", customerRevivalSchema);

export default CustomerRevival;
