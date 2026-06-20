"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ConfirmationModal from "@/components/ConfirmationModal";
import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NearbyDeals } from "@/features/location/components/nearby-deals";

// Relative imports for neighboring feature components
import { HotDealsTicker } from "./hot-deals-ticker";
import { HeroSection } from "./hero-section";
import { CategoryStrip } from "./category-strip";
import { RevivalPromo } from "./revival-promo";
import { PartnerBrands } from "./partner-brands";
import { HowItWorks } from "./how-it-works";
import { Testimonials } from "./testimonials";
import { FaqSection } from "./faq-section";
import { MerchantCTA } from "./merchant-cta";

export function HomeClient({ initialCoupons = [] }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      {/* 1. Hot Deals Ticker */}
      <HotDealsTicker />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* 3. Hero Section */}
      <HeroSection />

      {/* 4. Category Strip */}
      <CategoryStrip />

      {/* 5. Featured Deals (Live Database Coupons) */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full animate-fade-in-up stagger-3">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-brand-navy tracking-tight">
              Featured Deals Today
            </h2>
            <p className="text-xs text-brand-subtext mt-1">
              Top converting offers, verified by Vouchiqo community votes.
            </p>
          </div>
          <Link
            href="/deals"
            className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialCoupons.map((coupon, idx) => (
            <div key={coupon._id} className={`animate-fade-in-up stagger-${idx + 1}`}>
              <CouponCard
                coupon={coupon}
                onRedeem={(c) => setSelectedCoupon(c)}
              />
            </div>
          ))}
          {initialCoupons.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-brand-subtext font-medium">
              No featured coupons available at the moment. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* 6. Expired Coupon Revival Section */}
      <RevivalPromo />

      {/* 7. Nearby Deals — Real API, location-aware */}
      <NearbyDeals onRedeem={(c) => setSelectedCoupon(c)} />

      {/* 8. Trending Partner Brands Banner */}
      <PartnerBrands />

      {/* 9. How It Works */}
      <HowItWorks />

      {/* 10. Merchant CTA */}
      <MerchantCTA />

      {/* 11. Customer Testimonials */}
      <Testimonials />

      {/* 12. FAQ Section */}
      <FaqSection />

      {/* 13. Footer */}
      <Footer />

      {/* Confirmation/Claim Modal Overlay */}
      {selectedCoupon && (
        <ConfirmationModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onConfirm={async (_id) => {
            // Simulated API check
            await new Promise((resolve) => setTimeout(resolve, 800));
            return `VOUCH-CLAIM-${Math.floor(1000 + Math.random() * 9000)}`;
          }}
        />
      )}
    </div>
  );
}
