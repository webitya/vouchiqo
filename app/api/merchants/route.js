import { connectDB } from "@/lib/mongodb";
import { requireAuth, requireRole } from "@/modules/auth/auth.middleware";
import {
  createMerchant,
  listMerchants,
} from "@/modules/merchant/merchant.service";
import { createMerchantSchema } from "@/modules/merchant/merchant.validation";
import { created, ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/merchants
 * Admin: list all merchants with filters.
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const result = await listMerchants(searchParams);
  return ok(result);
});

/**
 * POST /api/merchants
 * Create a merchant profile for the authenticated user.
 */
export const POST = asyncHandler(async (request) => {
  await connectDB();
  const { user } = await requireAuth(request);

  const body = await request.json();
  const data = createMerchantSchema.parse(body);

  const merchant = await createMerchant(user.id, data);
  return created(merchant, "Merchant profile created. Pending admin approval.");
});
