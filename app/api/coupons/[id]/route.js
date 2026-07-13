import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/modules/auth/auth.middleware";
import {
  deleteCoupon,
  getCouponById,
  setCouponStatus,
  updateCoupon,
} from "@/modules/coupon/coupon.service";
import { updateCouponSchema } from "@/modules/coupon/coupon.validation";
import { noContent, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/coupons/:id
 * Get a single active coupon. Public.
 * Increments view count via async queue job.
 */
export const GET = asyncHandler(async (_request, { params }) => {
  await connectDB();
  const { id } = await params;
  const coupon = await getCouponById(id);
  return ok(coupon);
});

/**
 * PUT /api/coupons/:id
 * Update a coupon. Merchant owner only.
 * Also handles pausing/resuming via { status: "paused" | "active" }.
 */
export const PUT = asyncHandler(async (request, { params }) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);
  const { id } = await params;

  const body = await request.json();
  const data = updateCouponSchema.parse(body);

  // If only changing status (pause/resume), use dedicated function
  if (Object.keys(data).length === 1 && data.status) {
    const coupon = await setCouponStatus(id, user.id, data.status);
    return ok(coupon, `Coupon ${data.status}`);
  }

  const coupon = await updateCoupon(id, user.id, data);
  return ok(coupon, "Coupon updated");
});

/**
 * DELETE /api/coupons/:id
 * Soft-delete a coupon. Merchant owner only.
 */
export const DELETE = asyncHandler(async (request, { params }) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);
  const { id } = await params;

  await deleteCoupon(id, user.id);
  return noContent();
});
