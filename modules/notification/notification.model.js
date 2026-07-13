import mongoose, { Schema } from "mongoose";

/**
 * Notification model.
 *
 * Stores in-app notifications. Email notifications are sent via BullMQ jobs.
 * This collection tracks what was notified and whether it was read.
 *
 * Collection: notifications
 */
const notificationSchema = new Schema(
  {
    userId: {
      type: String, // Better Auth user ID
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "coupon_expiring",
        "coupon_claimed",
        "coupon_redeemed",
        "merchant_approved",
        "merchant_rejected",
        "revival_approved",
        "revival_rejected",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      maxlength: 300,
    },

    isRead: { type: Boolean, default: false, index: true },

    // Extra context (e.g. couponId, merchantId) for deep-linking
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "notifications",
  },
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ??
  mongoose.model("Notification", notificationSchema);

export default Notification;
