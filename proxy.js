/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Vouchiqo Next.js Edge-Compatible Proxy Middleware
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Runs on Next.js Edge Runtime (100% compatible).
 * Uses fast cookie presence checking without importing Node.js DB drivers (MongoDB/BSON),
 * eliminating Edge Runtime process.getBuiltinModule errors completely.
 */

import { NextResponse } from "next/server";
import { isProtectedRoute, ROUTES } from "./utils/routes";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Step 1: Check session token cookie presence ──────────────────────────
  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  // ── Step 2: Unauthenticated user accessing protected route ─────────────
  if (!hasSessionCookie) {
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Step 3: Authenticated user — allow request to proceed ──────────────
  // Fine-grained role validation is enforced by DashboardLayout & Page components on Node.js runtime
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    // Protected dashboard namespaces
    "/admin/:path*",
    "/merchant/:path*",
    "/customer/:path*",
    "/profile/:path*",

    // Auth callback
    "/auth/:path*",

    // Auth pages
    "/login",
    "/register",
    "/admin-login",
    "/merchant-login",
    "/merchant-register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};
