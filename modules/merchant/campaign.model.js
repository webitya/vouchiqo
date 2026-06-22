import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema(
  {
    merchantId: { 
      type: Schema.Types.ObjectId, 
      ref: "Merchant", 
      required: true, 
      index: true 
    },
    name: { 
      type: String, 
      required: [true, "Campaign name is required"], 
      trim: true 
    },
    type: { 
      type: String, 
      required: true 
    }, // e.g. "flash", "festival", "seasonal", "new-user", "clearance", "custom"
    objective: { 
      type: String,
      trim: true
    },
    description: { 
      type: String,
      trim: true
    },
    couponIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Coupon" 
    }],
    settings: {
      homepageSlot: { type: Boolean, default: false },
      pushNotification: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },
    status: { 
      type: String, 
      enum: ["draft", "scheduled", "live", "ended"], 
      default: "draft" 
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { 
    timestamps: true,
    collection: "campaigns"
  }
);

const Campaign = mongoose.models.Campaign ?? mongoose.model("Campaign", campaignSchema);
export default Campaign;
