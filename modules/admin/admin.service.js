import { redis } from "@/lib/redis";
import Coupon from "@/modules/coupon/coupon.model";
import UserProfile from "@/modules/user/user.model";
import { NotFoundError } from "@/utils/app-error";
import { REDIS_KEYS } from "@/utils/constants";
import { buildMeta, parsePagination } from "@/utils/pagination";

// ─────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────

/**
 * List all users with pagination.
 *
 * @param {URLSearchParams} searchParams
 */
export async function listUsers(searchParams) {
  const { page, limit, skip } = parsePagination(searchParams);
  const role = searchParams.get("role");
  const isActive = searchParams.get("isActive");

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== null && isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const [users, total] = await Promise.all([
    UserProfile.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserProfile.countDocuments(filter),
  ]);

  return { users, meta: buildMeta(total, page, limit) };
}

/**
 * Activate or deactivate a user.
 *
 * @param {string} authId
 * @param {boolean} isActive
 */
export async function setUserActiveStatus(authId, isActive) {
  const user = await UserProfile.findOneAndUpdate(
    { authId },
    { $set: { isActive } },
    { new: true },
  );
  if (!user) throw new NotFoundError("User");
  return user;
}

// ─────────────────────────────────────────────
// Coupons
// ─────────────────────────────────────────────

/**
 * List ALL coupons regardless of status (admin view).
 *
 * @param {URLSearchParams} searchParams
 */
export async function listAllCoupons(searchParams) {
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get("status");

  const filter = {};
  if (status) filter.status = status;

  const [coupons, total] = await Promise.all([
    Coupon.find(filter)
      .populate("merchantId", "businessName slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Coupon.countDocuments(filter),
  ]);

  return { coupons, meta: buildMeta(total, page, limit) };
}

/**
 * Toggle featured or hot flag on a coupon (admin action).
 *
 * @param {string} couponId
 * @param {{ isFeatured?: boolean, isHot?: boolean }} flags
 */
export async function setCouponFlags(couponId, flags) {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { $set: flags },
    { new: true },
  );

  if (!coupon) throw new NotFoundError("Coupon");

  // Bust homepage caches
  await Promise.all([
    redis.del(REDIS_KEYS.FEATURED_DEALS),
    redis.del(REDIS_KEYS.TRENDING_DEALS),
  ]);

  return coupon;
}
