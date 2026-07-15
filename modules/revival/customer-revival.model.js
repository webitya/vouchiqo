import mongoose, { Schema } from "mongoose";

/**
 * CustomerRevival model.
 * Stores coupon revival requests submitted by customers/visitors.
 * Captures in-depth competitive intelligence and routes to appropriate queue (Category A/B/C).
 *
 * Collection: customer_revivals
 */
const customerRevivalSchema = new Schema(
  {
<<<<<<< HEAD
    code: {
      type: String,
      uppercase: true,
      trim: true,
    },

=======
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
    brandName: {
      type: String,
      required: [true, "Brand/store name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    foundWhere: {
      type: String,
      required: [true, "Where you found this is required"],
      trim: true,
    },

    foundWhereOther: {
      type: String,
      trim: true,
    },

    merchantWebsite: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    code: {
      type: String,
      trim: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      required: [true, "Discount type is required"],
      enum: ["percentage", "fixed", "bogo", "freebie", "other"],
    },

    discountValue: {
      type: Number,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 100,
      trim: true,
    },

    foundAtDate: {
      type: Date,
      required: [true, "Date found is required"],
    },

    buyingIntent: {
      type: String,
      maxlength: 150,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
    },

<<<<<<< HEAD
    whereDidYouFindThisOffer: {
      type: String,
      trim: true,
    },

    merchantWebsite: {
      type: String,
      trim: true,
    },

    merchantCity: {
      type: String,
      trim: true,
      index: true,
    },

    discountType: {
      type: String,
      trim: true,
    },

    discountValue: {
      type: Number,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    whenSeen: {
      type: Date,
    },

    whatBuying: {
      type: String,
      trim: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
    },

    consent: {
      type: Boolean,
      default: false,
    },

    possibleDuplicate: {
      type: Boolean,
      default: false,
      index: true,
    },

    category: {
      type: String,
      enum: ["A", "B", "C"],
=======
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    routingCategory: {
      type: String,
      enum: ["A", "B", "C"],
      default: "C",
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
      index: true,
    },

    priority: {
      type: String,
<<<<<<< HEAD
      enum: ["high", "medium", "low"],
      default: "low",
=======
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "code_regenerated", "alternative_provided", "declined", "contacted"],
      default: "pending",
      index: true,
    },

    outcomeStatus: {
      type: String,
      enum: [
        "pending",
        "resolved_regenerated",
        "resolved_alternative",
        "declined",
      ],
      default: "pending",
      index: true,
    },

    declineReason: {
      type: String,
      trim: true,
    },

    alternativeOfferId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },

    includeInPublicFeed: {
      type: Boolean,
      default: false,
      index: true,
    },

    needsFollowUp: {
      type: Boolean,
      default: false,
      index: true,
    },

    votes: {
      type: Number,
      default: 1,
    },

    isPossibleDuplicate: {
      type: Boolean,
      default: false,
    },

    includeInPublicFeed: {
      type: Boolean,
      default: false,
    },

    declineReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "customer_revivals",
  },
);

// Indexes for query speed & duplicate checking
customerRevivalSchema.index({ brandName: 1, code: 1 });
customerRevivalSchema.index({ email: 1, brandName: 1, createdAt: -1 });

const CustomerRevival =
  mongoose.models.CustomerRevival ??
  mongoose.model("CustomerRevival", customerRevivalSchema);

export default CustomerRevival;
