// Quick MongoDB connection test
// Run with: node scripts/test-db.mjs

import { config } from "dotenv";
import { MongoClient } from "mongodb";

config(); // load .env

const uri = process.env.MONGODB_URI;

if (!uri || uri.includes("<")) {
  console.error("❌ MONGODB_URI is not set or still contains placeholder values.");
  console.error("   Current value:", uri);
  console.error("\n   Please update MONGODB_URI in your .env file first.");
  process.exit(1);
}

console.log("🔌 Connecting to MongoDB...");
console.log("   URI (masked):", uri.replace(/:([^@]+)@/, ":****@"));

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("✅ MongoDB connected successfully!");

  // List databases
  const adminDb = client.db().admin();
  const { databases } = await adminDb.listDatabases();
  console.log("\n📦 Available databases:");
  databases.forEach((db) => console.log(`   - ${db.name}`));
} catch (err) {
  console.error("❌ MongoDB connection FAILED:");
  console.error("  ", err.message);
} finally {
  await client.close();
  process.exit(0);
}
