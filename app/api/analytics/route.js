import { connectDB } from "@/lib/mongodb";
import { getMerchantAnalytics } from "@/modules/analytics/analytics.service";
import { requireRole } from "@/modules/auth/auth.middleware";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/analytics
 * Get analytics for the authenticated merchant's business.
 * Returns: overview stats, 30-day trend, top-performing coupons.
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);

  const analytics = await getMerchantAnalytics(user.id);
  return ok(analytics);
});
