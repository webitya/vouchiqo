import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/modules/coupon/coupon.model";
import Merchant from "@/modules/merchant/merchant.model";

/**
 * GET /api/revivals/customer/alternatives
 * Returns up to 3 alternative active coupon suggestions based on category, city, and brand.
 */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const brandName = searchParams.get("brandName") || "";
    const discountType = searchParams.get("discountType") || "";
    const discountValue = Number(searchParams.get("discountValue") || 0);

    let merchantId = null;
    if (brandName) {
      const merchant = await Merchant.findOne({
        businessName: { $regex: `^${brandName.trim()}$`, $options: "i" },
      }).lean();
      if (merchant) {
        merchantId = merchant._id;
      }
    }

    const now = new Date();
    // Fetch all active, unexpired coupons
    const activeCoupons = await Coupon.find({
      status: "active",
      expiresAt: { $gt: now },
    })
      .populate("merchantId", "businessName location")
      .lean();

    // Map coupons to include ranking metrics
    const scored = activeCoupons.map((coupon) => {
      let score = 0;

      // 1. Same merchant check (Highest priority)
      const isSameMerchant = merchantId && coupon.merchantId?._id.toString() === merchantId.toString();
      
      // 2. Same category and same city
      const isSameCategory = coupon.category?.toLowerCase() === category.toLowerCase();
      const isSameCity = coupon.merchantId?.location?.city?.toLowerCase() === city.toLowerCase();

      if (isSameMerchant) {
        score += 1000;
      } else if (isSameCategory && isSameCity) {
        score += 500;
      } else if (isSameCategory) {
        score += 100;
      }

      // Proximity score based on discount type and value
      if (coupon.discountType === discountType) {
        score += 50;
      }
      const valDiff = Math.abs((coupon.discountValue || 0) - discountValue);
      score -= valDiff * 0.1; // Smaller difference yields a higher score

      return { coupon, score };
    });

    // Sort by score descending and take the top 3
    const topAlternatives = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => ({
        _id: s.coupon._id,
        title: s.coupon.title,
        code: s.coupon.code,
        discountType: s.coupon.discountType,
        discountValue: s.coupon.discountValue,
        brandName: s.coupon.merchantId?.businessName || "Unknown",
        city: s.coupon.merchantId?.location?.city || "National",
      }));

    return NextResponse.json({ success: true, alternatives: topAlternatives });
  } catch (err) {
    console.error("Alternative suggestion engine error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
