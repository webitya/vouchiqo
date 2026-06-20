import pino from "pino";
import { env } from "@/utils/env";

const isDev = env.NODE_ENV !== "production";

/**
 * Pino logger instance.
 *
 * In development: pretty-printed with colors and human-readable timestamps.
 * In production: JSON output for log aggregators (Datadog, CloudWatch, etc.).
 */
export const logger = pino({
  level: isDev ? "debug" : "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});
