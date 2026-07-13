import { connectDB } from "@/lib/mongodb";
import { listUsers, setUserActiveStatus } from "@/modules/admin/admin.service";
import { requireRole } from "@/modules/auth/auth.middleware";
import { ok } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { ROLES } from "@/utils/constants";

/**
 * GET /api/admin/users
 * List all users. Admin only.
 *
 * Query params: page, limit, role, isActive
 */
export const GET = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { searchParams } = new URL(request.url);
  const result = await listUsers(searchParams);
  return ok(result);
});

/**
 * PUT /api/admin/users
 * Activate or deactivate a user. Admin only.
 *
 * Body: { authId: string, isActive: boolean }
 */
export const PUT = asyncHandler(async (request) => {
  await connectDB();
  await requireRole(request, ROLES.ADMIN);

  const { authId, isActive } = await request.json();
  const user = await setUserActiveStatus(authId, isActive);
  return ok(user, `User ${isActive ? "activated" : "deactivated"}`);
});
