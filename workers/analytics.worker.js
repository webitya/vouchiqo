/**
 * Analytics BullMQ Worker
 *
 * Processes background jobs queued by the analytics queue.
 * Currently handles:
 *  - RECORD_VIEW: increments viewCount on a coupon document
 *
 * This worker is meant to run in a separate long-lived process (not Next.js).
 * Start it with: node workers/analytics.worker.js
 *
 * In production, use PM2 or a Dockerfile CMD to keep this running.
 */

import "../utils/dns-bypass.mjs";

import { Worker } from "bullmq";
import mongoose from "mongoose";
import { redis } from "../lib/redis.js";
import { JOB_NAMES, QUEUE_NAMES } from "../utils/constants.js";

// ─────────────────────────────────────────────
// Bootstrap DB connection
// ─────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("[analytics-worker] MONGODB_URI env variable is missing.");
  process.exit(1);
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("[analytics-worker] MongoDB connected");
}

// ─────────────────────────────────────────────
// Inline Coupon model reference (avoid Next.js imports)
// ─────────────────────────────────────────────

const couponSchema = new mongoose.Schema(
  {
    viewCount: { type: Number, default: 0 },
  },
  { strict: false, collection: "coupons" },
);

const Coupon = mongoose.models.Coupon ?? mongoose.model("Coupon", couponSchema);

// ─────────────────────────────────────────────
// Worker
// ─────────────────────────────────────────────

const worker = new Worker(
  QUEUE_NAMES.ANALYTICS,
  async (job) => {
    await connectDB();

    if (job.name === JOB_NAMES.RECORD_VIEW) {
      const { couponId } = job.data;

      if (!couponId) {
        console.warn("[analytics-worker] RECORD_VIEW job missing couponId");
        return;
      }

      await Coupon.findByIdAndUpdate(couponId, { $inc: { viewCount: 1 } });
      console.log(`[analytics-worker] View recorded for coupon ${couponId}`);
    } else {
      console.warn(`[analytics-worker] Unknown job: ${job.name}`);
    }
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

worker.on("completed", (job) => {
  console.log(`[analytics-worker] Job ${job.id} (${job.name}) completed`);
});

worker.on("failed", (job, err) => {
  console.error(
    `[analytics-worker] Job ${job?.id} (${job?.name}) failed:`,
    err.message,
  );
});

worker.on("error", (err) => {
  console.error("[analytics-worker] Worker error:", err);
});

console.log("[analytics-worker] Analytics worker started");
