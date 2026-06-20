import { NextResponse } from "next/server";

/**
 * Next.js Middleware for authentication redirects and route protection.
 * Performs a fast, zero-database synchronous check on cookies first.
 * Then fetches session info to enforce role-based routes.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Synchronous check: is session token cookie present?
  const hasSession = request.cookies.has("better-auth.session_token") ||
                     request.cookies.has("__secure-better-auth.session_token");

  if (!hasSession) {
    // Redirect unauthenticated requests attempting to access protected dashboards
    if (pathname.startsWith("/admin") ||
        pathname.startsWith("/merchant") ||
        pathname.startsWith("/customer") ||
        pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // 2. Session cookie exists. Verify validity and retrieve user role from API route.
  try {
    const response = await fetch(new URL("/api/auth/session", request.url), {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (response.ok) {
      const session = await response.json();
      if (session?.user) {
        const { role } = session.user;

        // Logged-in users should not access auth forms (login, signup, forgot password, otp verification)
        if (pathname.startsWith("/auth")) {
          const dest = role === "admin"
            ? "/admin/dashboard"
            : role === "merchant"
              ? "/merchant/dashboard"
              : "/customer/dashboard";
          return NextResponse.redirect(new URL(dest, request.url));
        }

        // Enforce role-based dashboard protection
        if (pathname.startsWith("/admin") && role !== "admin") {
          return NextResponse.redirect(new URL("/customer/dashboard", request.url));
        }
        if (pathname.startsWith("/merchant") && role !== "merchant") {
          return NextResponse.redirect(new URL("/customer/dashboard", request.url));
        }
        if (pathname.startsWith("/customer") && role !== "customer") {
          const dest = role === "admin"
            ? "/admin/dashboard"
            : "/merchant/dashboard";
          return NextResponse.redirect(new URL(dest, request.url));
        }

        return NextResponse.next();
      }
    }
  } catch (error) {
    console.error("Middleware session verification failed:", error);
  }

  // Fallback: If session lookup failed/expired, redirect from protected routes to login
  if (pathname.startsWith("/admin") ||
      pathname.startsWith("/merchant") ||
      pathname.startsWith("/customer") ||
      pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/merchant/:path*",
    "/customer/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
