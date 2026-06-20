import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/modules/auth/auth.middleware";
import { getMerchantByAuthId } from "@/modules/merchant/merchant.service";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";

/**
 * GET /api/merchants/me
 * Returns the authenticated user's merchant profile.
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);
  try {
    const merchant = await getMerchantByAuthId(user.id);
    return ok(merchant);
  } catch (err) {
    if (err.statusCode === 404) {
      // Return null rather than throwing 404 if profile doesn't exist yet
      return ok(null);
    }
    throw err;
  }
});
