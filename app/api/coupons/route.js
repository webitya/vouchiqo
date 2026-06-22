import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/modules/auth/auth.middleware";
import {
  createCoupon,
  getFeaturedCoupons,
  getTrendingCoupons,
  listCoupons,
} from "@/modules/coupon/coupon.service";
import {
  couponQuerySchema,
  createCouponSchema,
} from "@/modules/coupon/coupon.validation";
import { created, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/coupons
 * Browse, search, and filter coupons. Public endpoint.
 *
 * Query params:
 *  - page, limit, category, search, city, discountType, sortBy, sortOrder
 *  - featured=true   → returns featured coupons (Redis cached)
 *  - trending=true   → returns trending coupons (Redis cached)
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { searchParams } = new URL(request.url);

  // Validate query params
  couponQuerySchema.parse(Object.fromEntries(searchParams));

  if (searchParams.get("featured") === "true") {
    const coupons = await getFeaturedCoupons();
    return ok({ coupons });
  }

  if (searchParams.get("trending") === "true") {
    const coupons = await getTrendingCoupons();
    return ok({ coupons });
  }

  const result = await listCoupons(searchParams);
  return ok(result);
});

/**
 * POST /api/coupons
 * Create a coupon. Merchant only.
 */
export const POST = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);

  const body = await request.json();
  const data = createCouponSchema.parse(body);

  const coupon = await createCoupon(user.id, data);
  return created(coupon, "Coupon created successfully");
});
