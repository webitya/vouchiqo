import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { claimCoupon, getUserClaims } from "@/modules/claim/claim.service";
import {
  claimQuerySchema,
  createClaimSchema,
} from "@/modules/claim/claim.validation";
import { created, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";

/**
 * GET /api/claims
 * Get the authenticated user's saved coupons.
 *
 * Query params: page, limit, status (active | redeemed | expired)
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);

  const { searchParams } = new URL(request.url);
  claimQuerySchema.parse(Object.fromEntries(searchParams));

  const result = await getUserClaims(user.id, searchParams);
  return ok(result);
});

/**
 * POST /api/claims
 * Save/claim a coupon for the authenticated user.
 *
 * Body: { couponId: string }
 */
export const POST = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);

  const body = await request.json();
  const { couponId } = createClaimSchema.parse(body);

  const claim = await claimCoupon(user.id, couponId);
  return created(claim, "Coupon saved to your collection");
});
