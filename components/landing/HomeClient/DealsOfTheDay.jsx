import Link from "next/link";
import ProductOfferCard from "@/components/shared/ProductOfferCard";
import { TODAY_PRODUCT_DEALS } from "./constants";

export const DealsOfTheDay = () => (
  <section className="text-left w-full bg-white rounded-md border border-brand-border p-6 md:p-8">
    {/* Section header — same as PopularOffers */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#191F2E]">
        Popular Brand Offers Near You
      </h2>
      <Link
        href="/deals"
        className="text-sm font-semibold text-[#4685E8] hover:text-[#3771c8] transition-colors"
      >
        View All →
      </Link>
    </div>

    {/* Cards grid — same 4-column layout as PopularOffers */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {TODAY_PRODUCT_DEALS.map((product, idx) => (
        <ProductOfferCard key={idx} product={product} />
      ))}
    </div>
  </section>
);

export default DealsOfTheDay;
