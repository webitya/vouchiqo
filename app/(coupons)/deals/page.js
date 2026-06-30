import DealsListing from "./deals-client";

export const dynamic = "force-dynamic";

/**
 * Generate dynamic SEO metadata based on search parameters for category, search, and location.
 */
export async function generateMetadata({ searchParams }) {
  const { category, search, location } = await searchParams;

  let title = "Verified Promo Codes & Coupons | Vouchiqo";
  let description =
    "Browse, search, and claim verified promo codes and discounts. Save up to 50% on SaaS, food, travel, and lifestyle on Vouchiqo.";

  if (category && category !== "All") {
    const formattedCat = category.charAt(0).toUpperCase() + category.slice(1);
    title = `Verified ${formattedCat} Coupons & Promo Codes | Vouchiqo`;
    description = `Claim verified ${formattedCat} coupons on Vouchiqo. Save on your favorite ${formattedCat} subscriptions and brands.`;
  }

  if (location && location !== "All") {
    title = `${title} in ${location}`;
    description = `${description} Active deals available in ${location}.`;
  }

  if (search) {
    title = `Search Results for "${search}" | Vouchiqo`;
    description = `Discover active coupons and discount codes matching "${search}" on Vouchiqo.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function Page() {
  return <DealsListing />;
}
