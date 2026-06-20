import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/modules/auth/auth.middleware";
import {
  listMerchants,
  reviewMerchant,
} from "@/modules/merchant/merchant.service";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/admin/merchants
 * List all merchants with any status. Admin only.
 *
 * Query params: page, limit, status
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const result = await listMerchants(searchParams);
  return ok(result);
});

/**
 * PUT /api/admin/merchants
 * Approve or reject a merchant. Admin only.
 *
 * Body: { merchantId: string, status: "approved" | "rejected", rejectionReason?: string }
 */
export const PUT = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { merchantId, status, rejectionReason } = await request.json();
  const merchant = await reviewMerchant(merchantId, status, rejectionReason);
  return ok(merchant, `Merchant ${status}`);
});
