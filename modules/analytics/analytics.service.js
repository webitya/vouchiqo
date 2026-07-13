import Claim from "@/modules/claim/claim.model";
import Coupon from "@/modules/coupon/coupon.model";
import Merchant from "@/modules/merchant/merchant.model";
import Redemption from "@/modules/redemption/redemption.model";
import { NotFoundError } from "@/utils/app-error";
import { COUPON_STATUS } from "@/utils/constants";

/**
 * Get analytics for a merchant dashboard.
 * Returns aggregate stats: total coupons, redemptions, claims, views, and a
 * 30-day trend breakdown.
 *
 * @param {string} authId - Merchant's Better Auth user ID
 */
export async function getMerchantAnalytics(authId) {
  const merchant = await Merchant.findOne({ authId }).lean();
  if (!merchant) throw new NotFoundError("Merchant profile");

  const merchantId = merchant._id;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [couponsStats, recentRedemptions, recentClaims, topCoupons] =
    await Promise.all([
      // Aggregate coupon stats
      Coupon.aggregate([
        { $match: { merchantId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalViews: { $sum: "$viewCount" },
            totalClaims: { $sum: "$totalClaims" },
            totalRedemptions: { $sum: "$totalRedemptions" },
          },
        },
      ]),

      // Recent redemptions (30 days)
      Redemption.countDocuments({
        merchantId,
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Recent claims (30 days)
      Claim.countDocuments({
        merchantId,
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Top performing coupons
      Coupon.find({ merchantId, status: COUPON_STATUS.ACTIVE })
        .sort({ totalRedemptions: -1 })
        .limit(5)
        .select("title totalRedemptions totalClaims viewCount expiresAt")
        .lean(),
    ]);

  // Flatten coupon stats by status
  const statsByStatus = couponsStats.reduce((acc, s) => {
    acc[s._id] = {
      count: s.count,
      views: s.totalViews,
      claims: s.totalClaims,
      redemptions: s.totalRedemptions,
    };
    return acc;
  }, {});

  return {
    merchant: {
      businessName: merchant.businessName,
      totalCoupons: merchant.totalCoupons,
      totalRedemptions: merchant.totalRedemptions,
      totalClaims: merchant.totalClaims ?? 0,
      followerCount: merchant.followerCount,
    },
    overview: statsByStatus,
    last30Days: {
      redemptions: recentRedemptions,
      claims: recentClaims,
    },
    topCoupons,
  };
}
