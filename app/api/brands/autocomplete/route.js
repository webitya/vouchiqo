import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Merchant from "@/modules/merchant/merchant.model";

/**
 * GET /api/brands/autocomplete
 * Public endpoint to fetch matching brands for autocomplete search.
 */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    if (!query) {
      return NextResponse.json({ success: true, brands: [] });
    }

    const merchants = await Merchant.find({
      businessName: { $regex: query, $options: "i" }
    })
      .select("businessName status category location")
      .limit(10)
      .lean();

    const brands = merchants.map((m) => ({
      name: m.businessName,
      status: m.status,
      category: m.category,
      city: m.location?.city || "",
    }));

    return NextResponse.json({ success: true, brands });
  } catch (err) {
    console.error("Autocomplete search error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
