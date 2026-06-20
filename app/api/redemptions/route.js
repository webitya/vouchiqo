import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/modules/auth/auth.middleware";
import {
  getUserRedemptions,
  redeemCoupon,
} from "@/modules/redemption/redemption.service";
import { redeemSchema } from "@/modules/redemption/redemption.validation";
import { created, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";

/**
 * GET /api/redemptions
 * Get the authenticated user's redemption history.
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);
  const { searchParams } = new URL(request.url);

  const result = await getUserRedemptions(user.id, searchParams);
  return ok(result);
});

/**
 * POST /api/redemptions
 * Redeem a claimed coupon.
 *
 * Uses a Redis distributed lock to prevent race conditions.
 *
 * Body: { claimId: string, couponId: string }
 */
export const POST = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);

  const body = await request.json();
  const { claimId, couponId } = redeemSchema.parse(body);

  const redemption = await redeemCoupon(user.id, claimId, couponId);
  return created(redemption, "Coupon redeemed successfully");
});
