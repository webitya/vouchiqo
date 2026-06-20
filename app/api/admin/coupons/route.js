import { connectDB } from "@/lib/mongodb";
import { listAllCoupons, setCouponFlags } from "@/modules/admin/admin.service";
import { requireRole } from "@/modules/auth/auth.middleware";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/admin/coupons
 * List all coupons regardless of status. Admin only.
 *
 * Query params: page, limit, status
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const result = await listAllCoupons(searchParams);
  return ok(result);
});

/**
 * PUT /api/admin/coupons
 * Set featured/hot flags on a coupon. Admin only.
 * Also clears the Redis homepage cache.
 *
 * Body: { couponId: string, isFeatured?: boolean, isHot?: boolean }
 */
export const PUT = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { couponId, isFeatured, isHot } = await request.json();

  const flags = {};
  if (isFeatured !== undefined) flags.isFeatured = isFeatured;
  if (isHot !== undefined) flags.isHot = isHot;

  const coupon = await setCouponFlags(couponId, flags);
  return ok(coupon, "Coupon flags updated");
});
