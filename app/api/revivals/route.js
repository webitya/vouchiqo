import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/modules/auth/auth.middleware";
import {
  listRevivals,
  requestRevival,
  reviewRevival,
} from "@/modules/revival/revival.service";
import {
  createRevivalSchema,
  reviewRevivalSchema,
} from "@/modules/revival/revival.validation";
import { created, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/revivals
 * Admin: list revival requests.
 *
 * Query params: status (pending | approved | rejected), page, limit
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const result = await listRevivals(searchParams);
  return ok(result);
});

/**
 * POST /api/revivals
 * Merchant: request revival of an expired coupon.
 *
 * Body: { couponId, reason, newExpiresAt }
 */
export const POST = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);

  const body = await request.json();
  const data = createRevivalSchema.parse(body);

  const revival = await requestRevival(user.id, data);
  return created(revival, "Revival request submitted");
});

/**
 * PUT /api/revivals
 * Admin: approve or reject a revival request.
 *
 * Body: { revivalId, status: "approved" | "rejected", reviewNote? }
 */
export const PUT = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.ADMIN);

  const body = await request.json();
  const { revivalId, ...data } = body;
  const { status, reviewNote } = reviewRevivalSchema.parse(data);

  const revival = await reviewRevival(revivalId, user.id, status, reviewNote);
  return ok(revival, `Revival request ${status}`);
});
