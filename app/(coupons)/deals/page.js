import DealsClient from "./deals-client";

export const dynamic = "force-dynamic";

/**
 * Metadata definitions for search crawler optimization (SEO).
 */
export const metadata = {
  title: "Verified Deals, Promo Offers & Discount Links | Vouchiqo",
  description:
    "Discover 100% verified promo offers, discount deals, and seasonal savings from top merchants on the Vouchiqo platform.",
  openGraph: {
    title: "Verified Deals, Promo Offers & Discount Links | Vouchiqo",
    description:
      "Discover 100% verified promo offers, discount deals, and seasonal savings from top merchants on the Vouchiqo platform.",
    type: "website",
  },
};

export default function DealsPage() {
  return <DealsClient />;
}
