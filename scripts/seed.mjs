/**
 * Standalone seed script — bypasses @/ path aliases that only work in Next.js.
 * Run with: node scripts/seed.mjs
 */
import envPkg from "@next/env";

const { loadEnvConfig } = envPkg;
loadEnvConfig(process.cwd());

import mongoose from "mongoose";

async function seed() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is required. Add it to .env.local to run the seed.",
    );
  }
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminEmail = `${adminUsername}@vouchiqo.com`;

  console.log("🌱 Starting Database Seeding...\n");

  // ─── Connect directly (no @/ alias issue) ───────────────────────────────────
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not found in .env");

  await mongoose.connect(uri, { bufferCommands: false });
  console.log("🔌 Connected to MongoDB.\n");

  // ─── Late imports (models use @/ too, use dynamic workaround) ───────────────
  const { auth } = await import("../lib/auth.js");
  const { ROLES } = await import("../utils/constants.js");

  const db = mongoose.connection.db;

  try {
    // 1. Clean existing admin if present to avoid unique/duplicate key conflicts
    const existingAdmin = await db.collection("user").findOne({ email: adminEmail });
    if (existingAdmin) {
      const adminId = existingAdmin.id || existingAdmin._id.toString();
      await db.collection("user").deleteOne({ _id: existingAdmin._id });
      await db.collection("account").deleteMany({ userId: adminId });
      await db.collection("session").deleteMany({ userId: adminId });
      console.log(`🧹 Cleaned existing admin: ${adminEmail}`);
    }

    // 2. Create Admin User
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Super Admin",
      },
    });
    console.log(`👤 Created admin account: ${adminEmail}`);

    // 3. Elevate role to admin
    const adminUser = await db.collection("user").findOne({ email: adminEmail });
    if (adminUser) {
      await db
        .collection("user")
        .updateOne({ _id: adminUser._id }, { $set: { role: ROLES.ADMIN } });
      console.log(`⚙️  Admin role elevated successfully for ${adminEmail}`);
    }

    console.log("\n🎉 Admin seeding successfully complete!");
  } catch (err) {
    console.error("❌ Seed crashed:", err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed.");
  }
}

seed();
