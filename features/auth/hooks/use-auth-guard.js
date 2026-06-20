"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

const ROLE_REDIRECT = {
  admin: "/admin",
  merchant: "/merchant/dashboard",
  customer: "/customer/dashboard",
};

/**
 * Redirects already-authenticated users away from auth pages.
 * Uses better-auth's cookieCache — instant read, no network round-trip.
 *
 * @param {string} fallback - Where to redirect if role is unknown
 * @returns {{ isPending: boolean }} - true while session is being resolved
 */
export function useAuthGuard(fallback = "/customer/dashboard") {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!session?.user) return;
    const dest = ROLE_REDIRECT[session.user.role] ?? fallback;
    router.replace(dest);
  }, [session, fallback, router]);

  return { isPending };
}
