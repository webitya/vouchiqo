import { NextResponse } from "next/server";
import {
  getRedirectForRole,
  isAuthorizedForRoute,
  isProtectedRoute,
  ROUTES,
} from "./utils/routes";

// Define auth forms for quick lookup
const AUTH_ROUTES = new Set([
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY_OTP,
  "/merchant-login",
  "/merchant-register",
  "/admin-login",
]);

const isAuthFormRoute = (pathname) =>
  AUTH_ROUTES.has(pathname) ||
  (pathname.startsWith("/auth") && pathname !== ROUTES.AUTH.CALLBACK);

const redirectTo = (path, request) =>
  NextResponse.redirect(new URL(path, request.url));

/**
 * Next.js Middleware/Proxy for authentication redirects and route protection.
 * Utilizes centralized routing and role-based redirect rules from utils/routes.js.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Fast synchronous check on cookies first to minimize overhead
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__secure-better-auth.session_token");

  if (!hasSession) {
    return isProtectedRoute(pathname)
      ? redirectTo(ROUTES.AUTH.LOGIN, request)
      : NextResponse.next();
  }

  // 2. Cookie is present. Fetch session validation via the centralized API endpoint.
  try {
    const fetchUrl = new URL(ROUTES.API.GET_SESSION, request.url);

    // In local development: override to loopback to avoid DNS/SSL self-referencing issues.
    // In production (Vercel/VPS): use the real public URL derived from `request.url` — NEVER
    // override to 127.0.0.1 here because serverless functions cannot reach loopback addresses.
    if (process.env.NODE_ENV !== "production") {
      fetchUrl.hostname = "127.0.0.1";
      fetchUrl.port = process.env.PORT ?? "3000";
      fetchUrl.protocol = "http:";
    }

    const response = await fetch(fetchUrl.toString(), {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        host: request.headers.get("host") ?? "",
        "x-forwarded-host": request.headers.get("host") ?? "",
        "x-forwarded-proto":
          request.headers.get("x-forwarded-proto") ??
          (request.nextUrl.protocol === "https:" ? "https" : "http"),
      },
    });

    if (response.ok) {
      const session = await response.json();
      if (session?.user) {
        const { role, email } = session.user;
        console.log(
          `[Middleware] Path: "${pathname}", User: "${email}", Role: "${role}"`,
        );

        // Redirect logged-in users away from auth forms (e.g. login, register)
        if (isAuthFormRoute(pathname)) {
          const dest = getRedirectForRole(role);
          console.log(
            `[Middleware] Redirecting logged-in user away from auth form to: "${dest}"`,
          );
          return redirectTo(dest, request);
        }

        // Enforce centralized authorization rules on protected path folders
        if (!isAuthorizedForRoute(pathname, role)) {
          const dest = getRedirectForRole(role);
          console.log(
            `[Middleware] Unauthorized access attempt for "${pathname}". Redirecting to: "${dest}"`,
          );
          return redirectTo(dest, request);
        }

        return NextResponse.next();
      }
    }
  } catch (error) {
    console.error("[Middleware] session verification failed:", error.message);
  }

  // Fallback: If verification failed/expired, redirect from protected routes to login
  return isProtectedRoute(pathname)
    ? redirectTo(ROUTES.AUTH.LOGIN, request)
    : NextResponse.next();
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/merchant/:path*",
    "/customer/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/merchant-login",
    "/merchant-register",
    "/admin-login",
  ],
};
