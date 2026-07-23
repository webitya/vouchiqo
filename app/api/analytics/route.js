import { connectDB } from "@/lib/mongodb";
import { getMerchantAnalytics } from "@/modules/analytics/analytics.service";
import { requireRole } from "@/modules/auth/auth.middleware";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/analytics
 * Get analytics for the authenticated merchant's business.
 * Supports ?period=7d|30d|90d|12m query parameter.
 * Returns: overview stats, trend data, traffic sources, top coupons.
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireRole(request, ROLES.MERCHANT, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";

  const analytics = await getMerchantAnalytics(user.id, period);
  return ok(analytics);
});
