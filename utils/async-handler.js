import { handleError } from "@/utils/api-response";

/**
 * Wraps an async Next.js App Router route handler with centralized error handling.
 *
 * Usage:
 *   export const GET = asyncHandler(async (req, ctx) => { ... });
 *
 * Without this wrapper, any thrown error will result in a 500 with no body in production.
 *
 * @param {Function} fn - Async route handler (req, ctx) => Response
 * @returns {Function} - Handler with error catching
 */
export function asyncHandler(fn) {
  return async (request, context) => {
    try {
      return await fn(request, context);
    } catch (err) {
      return handleError(err);
    }
  };
}
