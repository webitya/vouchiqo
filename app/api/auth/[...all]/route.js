import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Better Auth catch-all route handler.
 *
 * This single route handles all auth operations:
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - POST /api/auth/forget-password
 * - POST /api/auth/reset-password
 * - GET  /api/auth/verify-email
 * - GET  /api/auth/get-session
 *
 * Do not add business logic here — use auth.middleware.js in other routes.
 */
export const { GET, POST } = toNextJsHandler(auth);
