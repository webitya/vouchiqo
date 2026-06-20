import { acquireLock, releaseLock } from "@/modules/auth/auth.middleware";
import Claim from "@/modules/claim/claim.model";
import Coupon from "@/modules/coupon/coupon.model";
import Merchant from "@/modules/merchant/merchant.model";
import Redemption from "@/modules/redemption/redemption.model";
import UserProfile from "@/modules/user/user.model";
import { AppError, NotFoundError } from "@/utils/app-error";
import { CLAIM_STATUS, COUPON_STATUS, REDIS_KEYS } from "@/utils/constants";
import { buildMeta, parsePagination } from "@/utils/pagination";

/**
 * Redeem a coupon.
 *
 * Flow:
 * 1. Acquire Redis lock (prevent concurrent double-redemptions)
 * 2. Validate claim and coupon
 * 3. Create redemption record
 * 4. Update counters and claim status atomically
 * 5. Release lock
 *
 * @param {string} userId
 * @param {string} claimId
 * @param {string} couponId
 */
export async function redeemCoupon(userId, claimId, couponId) {
  const lockKey = REDIS_KEYS.redeemLock(couponId, userId);
  const locked = await acquireLock(lockKey);

  if (!locked) {
    throw new AppError(
      "Redemption already in progress. Please wait.",
      409,
      "LOCK_CONFLICT",
    );
  }

  try {
    const claim = await Claim.findOne({
      _id: claimId,
      userId,
      couponId,
      status: CLAIM_STATUS.ACTIVE,
    });

    if (!claim) throw new NotFoundError("Active claim");

    const coupon = await Coupon.findOne({
      _id: couponId,
      status: COUPON_STATUS.ACTIVE,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!coupon)
      throw new AppError("Coupon is no longer valid", 400, "COUPON_INVALID");

    // Check redemption limit
    if (
      coupon.maxRedemptions &&
      coupon.totalRedemptions >= coupon.maxRedemptions
    ) {
      throw new AppError(
        "Redemption limit reached for this coupon",
        400,
        "REDEMPTION_LIMIT_REACHED",
      );
    }

    // Calculate savings amount
    const savingsAmount = calculateSavings(coupon);

    // Create redemption record
    const redemption = await Redemption.create({
      userId,
      couponId: coupon._id,
      claimId: claim._id,
      merchantId: coupon.merchantId,
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: coupon.originalPrice,
      savingsAmount,
    });

    // Update claim → redeemed
    claim.status = CLAIM_STATUS.REDEEMED;
    claim.redeemedAt = new Date();
    await claim.save();

    // Increment counters atomically
    await Promise.all([
      Coupon.findByIdAndUpdate(couponId, { $inc: { totalRedemptions: 1 } }),
      Merchant.findByIdAndUpdate(coupon.merchantId, {
        $inc: { totalRedemptions: 1 },
      }),
      UserProfile.findOneAndUpdate(
        { authId: userId },
        { $inc: { totalSavings: savingsAmount } },
        { upsert: true },
      ),
    ]);

    return redemption;
  } finally {
    await releaseLock(lockKey);
  }
}

/**
 * Get a user's redemption history.
 *
 * @param {string} userId
 * @param {URLSearchParams} searchParams
 */
export async function getUserRedemptions(userId, searchParams) {
  const { page, limit, skip } = parsePagination(searchParams);

  const [redemptions, total] = await Promise.all([
    Redemption.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "coupons",
          localField: "couponId",
          foreignField: "_id",
          as: "couponId",
        },
      },
      { $unwind: { path: "$couponId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "merchants",
          localField: "merchantId",
          foreignField: "_id",
          as: "merchantId",
        },
      },
      { $unwind: { path: "$merchantId", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          couponCode: 1,
          discountType: 1,
          discountValue: 1,
          originalPrice: 1,
          savingsAmount: 1,
          createdAt: 1,
          "couponId._id": 1,
          "couponId.title": 1,
          "couponId.image": 1,
          "couponId.category": 1,
          "merchantId._id": 1,
          "merchantId.businessName": 1,
          "merchantId.slug": 1,
          "merchantId.logo": 1,
        },
      },
    ]),
    Redemption.countDocuments({ userId }),
  ]);

  return { redemptions, meta: buildMeta(total, page, limit) };
}

/**
 * Get a single redemption by ID. Only the owner can view it.
 *
 * @param {string} redemptionId
 * @param {string} userId
 */
export async function getRedemptionById(redemptionId, userId) {
  const redemption = await Redemption.findOne({ _id: redemptionId, userId })
    .populate("couponId", "title image category code")
    .populate("merchantId", "businessName slug logo")
    .lean();

  if (!redemption) throw new NotFoundError("Redemption");
  return redemption;
}

// ─────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────

function calculateSavings(coupon) {
  if (
    coupon.discountType === "percentage" &&
    coupon.originalPrice &&
    coupon.discountValue
  ) {
    return (coupon.originalPrice * coupon.discountValue) / 100;
  }
  if (coupon.discountType === "fixed" && coupon.discountValue) {
    return coupon.discountValue;
  }
  return 0;
}
