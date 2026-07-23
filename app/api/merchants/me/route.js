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
  // Throws NotFoundError (404) if the user has no merchant profile,
  // which is the correct signal for client-side guards.
  const merchant = await getMerchantByAuthId(user.id);
  return ok(merchant);
});
