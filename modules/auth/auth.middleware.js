import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import {
  ForbiddenError,
  TooManyRequestsError,
  UnauthorizedError,
} from "@/utils/app-error";
import { REDIS_KEYS, REDIS_TTL } from "@/utils/constants";

/**
 * Get the current session from the request.
 * Throws UnauthorizedError if not authenticated.
 *
 * @param {Request} request
 * @returns {Promise<{user: object, session: object}>}
 */
export async function requireAuth(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new UnauthorizedError();
  return session;
}

/**
 * Require auth + a specific role.
 * Pass one or more roles that are allowed.
 *
 * @param {Request} request
 * @param {...string} roles - Allowed roles (e.g. ROLES.MERCHANT, ROLES.ADMIN)
 * @returns {Promise<{user: object, session: object}>}
 */
export async function requireRole(request, ...roles) {
  const session = await requireAuth(request);

  if (!roles.includes(session.user.role)) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  return session;
}

/**
 * Simple Redis-backed rate limiter.
 *
 * @param {Request} request
 * @param {string} route - Route identifier (e.g. "POST:/api/auth/login")
 * @param {number} maxRequests - Max requests per window
 * @param {number} windowSecs - Window size in seconds (default: 60)
 */
export async function rateLimit(
  request,
  route,
  maxRequests,
  windowSecs = REDIS_TTL.RATE_LIMIT,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const key = REDIS_KEYS.rateLimit(ip, route);
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSecs);
  }

  if (current > maxRequests) {
    throw new TooManyRequestsError();
  }
}

/**
 * Acquire a Redis distributed lock (used for redemption race conditions).
 *
 * @param {string} key - Redis key
 * @param {number} ttl - Lock TTL in seconds
 * @returns {Promise<boolean>} - true if lock acquired, false if already locked
 */
export async function acquireLock(key, ttl = REDIS_TTL.REDEEM_LOCK) {
  const result = await redis.set(key, "1", "EX", ttl, "NX");
  return result === "OK";
}

/**
 * Release a Redis distributed lock.
 *
 * @param {string} key - Redis key
 */
export async function releaseLock(key) {
  await redis.del(key);
}
