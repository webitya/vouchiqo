/**
 * Standalone seed script — bypasses @/ path aliases that only work in Next.js.
 * Run with: node scripts/seed.mjs
 */
import envPkg from "@next/env";
const { loadEnvConfig } = envPkg;
loadEnvConfig(process.cwd());

import mongoose from "mongoose";

async function seed() {
  console.log("🌱 Starting Database Seeding...\n");

  // ─── Connect directly (no @/ alias issue) ───────────────────────────────────
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not found in .env");

  await mongoose.connect(uri, { bufferCommands: false });
  console.log("🔌 Connected to MongoDB.\n");

  // ─── Late imports (models use @/ too, use dynamic workaround) ───────────────
  const { auth } = await import("../lib/auth.js");
  const Merchant = (await import("../modules/merchant/merchant.model.js")).default;
  const Coupon = (await import("../modules/coupon/coupon.model.js")).default;
  const { MERCHANT_STATUS, COUPON_STATUS, DISCOUNT_TYPE, ROLES } = await import("../utils/constants.js");

  const db = mongoose.connection.db;

  // ─── Emails to clean ────────────────────────────────────────────────────────
  const demoEmails = [
    "customer@vouchiqo.com",
    "customer2@vouchiqo.com",
    "merchant@vouchiqo.com",
    "merchant2@vouchiqo.com",
    "merchant3@vouchiqo.com",
    "admin@vouchiqo.com",
  ];

  console.log("🧹 Cleaning old demo data...");
  const oldUsers = await db.collection("user").find({ email: { $in: demoEmails } }).toArray();
  const oldUserIds = oldUsers.map(u => u.id || u._id.toString());
  if (oldUserIds.length > 0) {
    await db.collection("user").deleteMany({ $or: [{ id: { $in: oldUserIds } }, { _id: { $in: oldUsers.map(u => u._id) } }] });
    await db.collection("account").deleteMany({ userId: { $in: oldUserIds } });
    await db.collection("session").deleteMany({ userId: { $in: oldUserIds } });
  }
  await Merchant.deleteMany({});
  await Coupon.deleteMany({});
  console.log("✅ Cleared old data.\n");

  const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

  // ════════════════════════════════════════════════════════════════
  //  USERS
  // ════════════════════════════════════════════════════════════════

  // Customer 1
  console.log("👤 Creating customer@vouchiqo.com ...");
  try {
    await auth.api.signUpEmail({ body: { email: "customer@vouchiqo.com", password: "Password123!", name: "Alice Johnson" } });
    console.log("   ✅ Done\n");
  } catch (e) { console.log("   ⚠️", e.message, "\n"); }

  // Customer 2
  console.log("👤 Creating customer2@vouchiqo.com ...");
  try {
    await auth.api.signUpEmail({ body: { email: "customer2@vouchiqo.com", password: "Password123!", name: "Bob Smith" } });
    console.log("   ✅ Done\n");
  } catch (e) { console.log("   ⚠️", e.message, "\n"); }

  // Admin
  console.log("👤 Creating admin@vouchiqo.com ...");
  try {
    await auth.api.signUpEmail({ body: { email: "admin@vouchiqo.com", password: "Admin@123!", name: "Super Admin" } });
    const adminUser = await db.collection("user").findOne({ email: "admin@vouchiqo.com" });
    if (adminUser) await db.collection("user").updateOne({ _id: adminUser._id }, { $set: { role: ROLES.ADMIN } });
    console.log("   ✅ Done\n");
  } catch (e) { console.log("   ⚠️", e.message, "\n"); }

  // ════════════════════════════════════════════════════════════════
  //  MERCHANT 1 — Burger House (food, New York)
  // ════════════════════════════════════════════════════════════════
  console.log("🏪 Creating Merchant: Burger House...");
  let merchantProfile1 = null;
  try {
    await auth.api.signUpEmail({ body: { email: "merchant@vouchiqo.com", password: "Merchant@123!", name: "Burger House" } });
    const mUser = await db.collection("user").findOne({ email: "merchant@vouchiqo.com" });
    if (mUser) {
      await db.collection("user").updateOne({ _id: mUser._id }, { $set: { role: ROLES.MERCHANT } });
      merchantProfile1 = await Merchant.create({
        authId: mUser.id || mUser._id.toString(),
        businessName: "Burger House",
        slug: "burger-house",
        description: "Gourmet burgers and hand-cut fries in the heart of the city. Fresh beef, brioche buns, secret sauce.",
        category: "food",
        contactEmail: "hello@burgerhouse.com",
        website: "https://burgerhouse.example.com",
        status: MERCHANT_STATUS.APPROVED,
        location: { city: "New York", state: "NY", country: "US" },
        isVerified: true,
      });
      console.log("   ✅ Done\n");
    }
  } catch (e) { console.log("   ❌", e.message, "\n"); }

  // ════════════════════════════════════════════════════════════════
  //  MERCHANT 2 — StyleZone (fashion, Los Angeles)
  // ════════════════════════════════════════════════════════════════
  console.log("🏪 Creating Merchant: StyleZone...");
  let merchantProfile2 = null;
  try {
    await auth.api.signUpEmail({ body: { email: "merchant2@vouchiqo.com", password: "Merchant@123!", name: "StyleZone" } });
    const mUser2 = await db.collection("user").findOne({ email: "merchant2@vouchiqo.com" });
    if (mUser2) {
      await db.collection("user").updateOne({ _id: mUser2._id }, { $set: { role: ROLES.MERCHANT } });
      merchantProfile2 = await Merchant.create({
        authId: mUser2.id || mUser2._id.toString(),
        businessName: "StyleZone",
        slug: "stylezone",
        description: "Trendy fashion for every season. From casual wear to formal outfits. Free delivery on orders over $50.",
        category: "fashion",
        contactEmail: "deals@stylezone.com",
        website: "https://stylezone.example.com",
        status: MERCHANT_STATUS.APPROVED,
        location: { city: "Los Angeles", state: "CA", country: "US" },
        isVerified: true,
      });
      console.log("   ✅ Done\n");
    }
  } catch (e) { console.log("   ❌", e.message, "\n"); }

  // ════════════════════════════════════════════════════════════════
  //  MERCHANT 3 — TechGadgets (electronics, San Francisco)
  // ════════════════════════════════════════════════════════════════
  console.log("🏪 Creating Merchant: TechGadgets...");
  let merchantProfile3 = null;
  try {
    await auth.api.signUpEmail({ body: { email: "merchant3@vouchiqo.com", password: "Merchant@123!", name: "TechGadgets" } });
    const mUser3 = await db.collection("user").findOne({ email: "merchant3@vouchiqo.com" });
    if (mUser3) {
      await db.collection("user").updateOne({ _id: mUser3._id }, { $set: { role: ROLES.MERCHANT } });
      merchantProfile3 = await Merchant.create({
        authId: mUser3.id || mUser3._id.toString(),
        businessName: "TechGadgets",
        slug: "techgadgets",
        description: "Latest smartphones, laptops, accessories and smart home devices. Best prices guaranteed.",
        category: "electronics",
        contactEmail: "support@techgadgets.com",
        website: "https://techgadgets.example.com",
        status: MERCHANT_STATUS.APPROVED,
        location: { city: "San Francisco", state: "CA", country: "US" },
        isVerified: true,
      });
      console.log("   ✅ Done\n");
    }
  } catch (e) { console.log("   ❌", e.message, "\n"); }

  // ════════════════════════════════════════════════════════════════
  //  COUPONS — Burger House (5 coupons)
  // ════════════════════════════════════════════════════════════════
  if (merchantProfile1) {
    console.log("🎟️  Creating Burger House coupons...");
    await Coupon.insertMany([
      {
        merchantId: merchantProfile1._id,
        title: "30% off any Gourmet Burger",
        description: "Enjoy 30% off all premium beef, chicken, and veggie burgers. Dine-in only.",
        code: "BURGER30",
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 30,
        category: "food",
        expiresAt: daysFromNow(30),
        location: { city: "New York", state: "NY", country: "US", isOnline: false },
        isFeatured: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile1._id,
        title: "Buy One Get One Free Fries",
        description: "Get a free side of hand-cut fries with any large burger combo. Valid weekdays only.",
        code: "BOGOFRIES",
        discountType: DISCOUNT_TYPE.FREEBIE,
        discountValue: 0,
        category: "food",
        expiresAt: daysFromNow(15),
        location: { city: "New York", state: "NY", country: "US", isOnline: false },
        isHot: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile1._id,
        title: "Free Drink with any Meal",
        description: "Order any full meal and get a complimentary soft drink or juice. New customers only.",
        code: "FREEDRINK",
        discountType: DISCOUNT_TYPE.FREEBIE,
        discountValue: 0,
        category: "food",
        expiresAt: daysFromNow(20),
        location: { city: "New York", state: "NY", country: "US", isOnline: false },
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile1._id,
        title: "15% off Online Delivery Orders",
        description: "Use at checkout on our website. Valid for all delivery orders above $10.",
        code: "ONLINE15",
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 15,
        category: "food",
        expiresAt: daysFromNow(60),
        location: { isOnline: true },
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile1._id,
        title: "$5 off your First Order",
        description: "New customers get $5 off their first online order. Enter code at checkout.",
        code: "WELCOME5",
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 5,
        category: "food",
        expiresAt: daysFromNow(90),
        location: { isOnline: true },
        isFeatured: true,
        status: COUPON_STATUS.ACTIVE,
      },
    ]);
    console.log("   ✅ 5 coupons created\n");
  }

  // ════════════════════════════════════════════════════════════════
  //  COUPONS — StyleZone (4 coupons)
  // ════════════════════════════════════════════════════════════════
  if (merchantProfile2) {
    console.log("🎟️  Creating StyleZone coupons...");
    await Coupon.insertMany([
      {
        merchantId: merchantProfile2._id,
        title: "20% off Summer Collection",
        description: "Shop the full summer range and save 20%. Applies to dresses, tops, shorts and swimwear.",
        code: "SUMMER20",
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 20,
        category: "fashion",
        expiresAt: daysFromNow(45),
        location: { city: "Los Angeles", state: "CA", country: "US", isOnline: false },
        isFeatured: true,
        isHot: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile2._id,
        title: "Free Shipping on Orders Over $50",
        description: "Get free standard shipping when you spend $50 or more.",
        code: "FREESHIP50",
        discountType: DISCOUNT_TYPE.FREEBIE,
        discountValue: 0,
        category: "fashion",
        expiresAt: daysFromNow(30),
        location: { isOnline: true },
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile2._id,
        title: "$15 off Men's Formal Wear",
        description: "Save $15 on all men's shirts, trousers and blazers. In-store purchase required.",
        code: "FORMAL15",
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 15,
        category: "fashion",
        expiresAt: daysFromNow(25),
        location: { city: "Los Angeles", state: "CA", country: "US", isOnline: false },
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile2._id,
        title: "Buy 2 Get 1 Free on Accessories",
        description: "Mix and match any 3 accessories (bags, scarves, belts) and get the cheapest one free.",
        code: "STYLE3FOR2",
        discountType: DISCOUNT_TYPE.FREEBIE,
        discountValue: 0,
        category: "fashion",
        expiresAt: daysFromNow(10),
        location: { city: "Los Angeles", state: "CA", country: "US", isOnline: false },
        isHot: true,
        status: COUPON_STATUS.ACTIVE,
      },
    ]);
    console.log("   ✅ 4 coupons created\n");
  }

  // ════════════════════════════════════════════════════════════════
  //  COUPONS — TechGadgets (4 coupons)
  // ════════════════════════════════════════════════════════════════
  if (merchantProfile3) {
    console.log("🎟️  Creating TechGadgets coupons...");
    await Coupon.insertMany([
      {
        merchantId: merchantProfile3._id,
        title: "10% off all Laptops",
        description: "10% off our full range of laptops including MacBook, Dell, HP and Lenovo models.",
        code: "LAPTOP10",
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 10,
        category: "electronics",
        expiresAt: daysFromNow(20),
        location: { city: "San Francisco", state: "CA", country: "US", isOnline: false },
        isFeatured: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile3._id,
        title: "$50 off Smartphones over $500",
        description: "Spend $500+ on any smartphone and get $50 off instantly at checkout.",
        code: "PHONE50",
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 50,
        category: "electronics",
        expiresAt: daysFromNow(14),
        location: { isOnline: true },
        isHot: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile3._id,
        title: "Free Wireless Earbuds with any Phone",
        description: "Purchase any smartphone above $300 and receive a free pair of wireless earbuds.",
        code: "EARBUDSFREE",
        discountType: DISCOUNT_TYPE.FREEBIE,
        discountValue: 0,
        category: "electronics",
        expiresAt: daysFromNow(7),
        location: { city: "San Francisco", state: "CA", country: "US", isOnline: false },
        isFeatured: true,
        isHot: true,
        status: COUPON_STATUS.ACTIVE,
      },
      {
        merchantId: merchantProfile3._id,
        title: "15% off Smart Home Devices",
        description: "Save on smart speakers, security cameras, smart bulbs and more. Online store only.",
        code: "SMARTHOME15",
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 15,
        category: "electronics",
        expiresAt: daysFromNow(40),
        location: { isOnline: true },
        status: COUPON_STATUS.ACTIVE,
      },
    ]);
    console.log("   ✅ 4 coupons created\n");
  }

  // ─── Print test credentials ──────────────────────────────────────────────────
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              🎉 SEEDING COMPLETE — Test Accounts              ║
╠═══════════════════════════════════════════════════════════════╣
║  ROLE        EMAIL                        PASSWORD            ║
║  ──────────  ───────────────────────────  ─────────────────── ║
║  customer    customer@vouchiqo.com        Password123!        ║
║  customer    customer2@vouchiqo.com       Password123!        ║
║  merchant    merchant@vouchiqo.com        Merchant@123!       ║
║  merchant    merchant2@vouchiqo.com       Merchant@123!       ║
║  merchant    merchant3@vouchiqo.com       Merchant@123!       ║
║  admin       admin@vouchiqo.com           Admin@123!          ║
╠═══════════════════════════════════════════════════════════════╣
║  Merchants:  Burger House | StyleZone | TechGadgets           ║
║  Coupons:    5 (food) + 4 (fashion) + 4 (electronics) = 13   ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed crashed:", err);
  process.exit(1);
});
