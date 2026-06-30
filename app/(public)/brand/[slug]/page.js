import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/modules/coupon/coupon.model";
import Merchant from "@/modules/merchant/merchant.model";
import BrandClient from "./brand-client";

export const dynamic = "force-dynamic";

/**
 * Generate dynamic SEO metadata for the Brand page.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();

  try {
    const merchant = await Merchant.findOne({
      slug,
      status: "approved",
    }).lean();
    if (!merchant) throw new Error();

    const title = `${merchant.businessName} Coupons, Promo Codes & Deals | Vouchiqo`;
    const description =
      merchant.shortDescription ||
      `Save at ${merchant.businessName} with verified coupon codes, discounts, and expiring offers. 100% community-tested and active.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch (err) {
    return {
      title: "Brand Store Not Found | Vouchiqo",
      description:
        "The requested brand storefront could not be located on Vouchiqo.",
    };
  }
}

/**
 * Server Component fetching the brand profile, coupons, and related brands.
 */
export default async function BrandPage({ params }) {
  const { slug } = await params;
  await connectDB();

  let merchant;
  let coupons = [];
  let expiredCoupons = [];
  let relatedBrands = [];

  try {
    merchant = await Merchant.findOne({ slug, status: "approved" }).lean();
    if (!merchant) {
      notFound();
    }

    // Fetch active coupons
    const rawCoupons = await Coupon.find({
      merchantId: merchant._id,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .populate("merchantId", "businessName slug logo")
      .lean();
    coupons = JSON.parse(JSON.stringify(rawCoupons || []));

    // Fetch expired coupons
    const rawExpired = await Coupon.find({
      merchantId: merchant._id,
      $or: [
        { status: "expired" },
        { status: "active", expiresAt: { $lte: new Date() } },
      ],
    })
      .populate("merchantId", "businessName slug logo")
      .lean();
    expiredCoupons = JSON.parse(JSON.stringify(rawExpired || []));

    // Fetch related brands in the same category
    const rawRelated = await Merchant.find({
      category: merchant.category,
      status: "approved",
      _id: { $ne: merchant._id },
    })
      .limit(4)
      .lean();
    relatedBrands = JSON.parse(JSON.stringify(rawRelated || []));
  } catch (err) {
    console.error("Error loading brand profile:", err);
    notFound();
  }

  return (
    <BrandClient
      merchant={JSON.parse(JSON.stringify(merchant))}
      coupons={coupons}
      expiredCoupons={expiredCoupons}
      relatedBrands={relatedBrands}
    />
  );
}
