"use client";

import {
  ArrowRight,
  Coffee,
  Heart,
  Laptop,
  MapPin,
  Plane,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NearbyDeals } from "@/features/location/components/nearby-deals";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Mock data for featured coupons
  const featuredCoupons = [
    {
      _id: "c1",
      title: "Get 50% off your next 5 food orders",
      discountValue: 50,
      discountType: "percentage",
      description:
        "Valid on all restaurant deliveries above $15. Maximum discount cap of $10 per order.",
      category: "Food",
      successRate: 99,
      isMerchantVerified: true,
      isVouchiqoVerified: true,
      workedToday: true,
      merchantId: { name: "Zomato Delivery" },
    },
    {
      _id: "c2",
      title: "Save $20 on luxury stays globally",
      discountValue: 20,
      discountType: "fixed",
      description:
        "Book verified apartments and villas with no minimum night limits. Excludes service tax.",
      category: "Travel",
      successRate: 97,
      isMerchantVerified: true,
      isVouchiqoVerified: true,
      workedToday: true,
      merchantId: { name: "Airbnb Stays" },
    },
    {
      _id: "c3",
      title: "Exclusive Notion Plus Plan: $50 Free Credits",
      discountValue: 50,
      discountType: "fixed",
      description:
        "Upgrade your team workspace or personal workspace with $50 billing credits automatically applied.",
      category: "SaaS",
      successRate: 98,
      isMerchantVerified: true,
      isVouchiqoVerified: true,
      workedToday: false,
      merchantId: { name: "Notion Workspace" },
    },
  ];


  const trendingBrands = [
    { name: "Stripe", category: "Payments", count: 8 },
    { name: "Shopify", category: "E-Commerce", count: 14 },
    { name: "Linear", category: "Productivity", count: 4 },
    { name: "Notion", category: "Productivity", count: 9 },
    { name: "Airbnb", category: "Travel", count: 11 },
    { name: "Swiggy", category: "Food Delivery", count: 16 },
  ];

  const categories = [
    { name: "Food & Drink", icon: Coffee, color: "text-amber-500 bg-amber-50" },
    {
      name: "Fashion & Apparel",
      icon: ShoppingBag,
      color: "text-pink-500 bg-pink-50",
    },
    { name: "Tech & SaaS", icon: Laptop, color: "text-blue-500 bg-blue-50" },
    {
      name: "Travel & Hotels",
      icon: Plane,
      color: "text-emerald-500 bg-emerald-50",
    },
    { name: "Health & Care", icon: Heart, color: "text-rose-500 bg-rose-50" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      {/* 1. Hot Deals Ticker */}
      <div className="bg-brand-blue text-white overflow-hidden text-xs py-1.5 font-semibold z-40 relative">
        <div className="flex whitespace-nowrap animate-ticker">
          <div className="flex gap-16 px-4">
            <span>🚀 FLASH SALE: Zomato 50% Off — Code: ZOMATO50</span>
            <span>⚡ Stripe Integration Specials — Save Up To $200</span>
            <span>💼 Notion Plus for Teams: $50 Free Workspace Credits</span>
            <span>✈️ Airbnb Verified: $20 Off Premium Bookings</span>
            <span>☕ Starbucks: Buy One Get One Free in all local outlets</span>
          </div>
          {/* Duplicate for infinite loop */}
          <div className="flex gap-16 px-4" aria-hidden="true">
            <span>🚀 FLASH SALE: Zomato 50% Off — Code: ZOMATO50</span>
            <span>⚡ Stripe Integration Specials — Save Up To $200</span>
            <span>💼 Notion Plus for Teams: $50 Free Workspace Credits</span>
            <span>✈️ Airbnb Verified: $20 Off Premium Bookings</span>
            <span>☕ Starbucks: Buy One Get One Free in all local outlets</span>
          </div>
        </div>
      </div>

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* 3. Hero Section */}
      <section className="bg-brand-navy text-white pt-16 pb-20 px-4 relative overflow-hidden animate-fade-in-scale">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-fade-in-up stagger-1">
          <Badge className="bg-white/10 text-brand-warning hover:bg-white/15 border border-white/10 rounded-full px-3 py-1 font-bold text-xs shadow-none gap-1.5 w-fit animate-float">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>100% Verified Deals & Merchant Platform</span>
          </Badge>

          <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight max-w-2xl mx-auto">
            Verified Savings.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Real-Time
            </span>{" "}
            Customer Growth.
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Discover verified discount codes from your favorite brands. Vouchiqo
            ensures zero expired codes through continuous merchant verification.
          </p>

          {/* Search Bar in Hero */}
          <div className="bg-brand-bg rounded-lg shadow-lg max-w-xl mx-auto p-1.5 flex flex-col sm:flex-row gap-2 border border-brand-border text-brand-text">
            <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-brand-border flex-shrink-0">
              <MapPin className="w-4 h-4 text-brand-blue" />
              <Input
                type="text"
                placeholder="New York, USA"
                className="bg-transparent border-0 text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-24 p-0 h-auto shadow-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 flex-grow">
              <Search className="w-4 h-4 text-brand-subtext" />
              <Input
                type="text"
                placeholder="Search brands, food, travel, saas..."
                className="bg-transparent border-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-brand-text placeholder-brand-subtext font-medium p-0 h-auto shadow-none"
              />
            </div>
            <Button className="btn-primary py-2 px-6 text-xs whitespace-nowrap border-0 h-auto cursor-pointer shadow-none">
              Search Deals
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Category Strip */}
      <section className="bg-brand-bg border-b border-brand-border py-5 px-4 shadow-sm relative z-20 animate-fade-in-up stagger-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide py-1">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider whitespace-nowrap mr-2">
            Trending Categories:
          </span>
          <div className="flex gap-3">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-brand-border hover:border-brand-blue hover:bg-brand-surface transition-all text-xs font-bold text-brand-text bg-transparent h-auto cursor-pointer shadow-none category-card animate-fade-in-scale stagger-${idx + 1}`}
                >
                  <div className={`p-1 rounded-md ${cat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{cat.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Deals */}
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
          {featuredCoupons.map((coupon, idx) => (
            <div key={coupon._id} className={`animate-fade-in-up stagger-${idx + 1}`}>
              <CouponCard
                coupon={coupon}
                onRedeem={(c) => setSelectedCoupon(c)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Expired Coupon Revival Section */}
      <section className="bg-brand-navy text-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 animate-fade-in-up stagger-1">
            <Badge className="bg-white/10 text-brand-warning border-0 hover:bg-white/15 px-3 py-1 rounded-full text-xs font-bold shadow-none gap-1 w-fit animate-float">
              <RotateCcw className="w-3 h-3" />
              <span>REVIVAL SYSTEM</span>
            </Badge>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight leading-tight">
              Missed a great deal? <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Revive it!
              </span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              We track expired coupons. If enough customers request a revival,
              our platform contacts the merchant to re-activate the deal.
            </p>
            <div className="flex flex-col gap-3 py-2 text-sm font-semibold">
              <div className="flex gap-2.5 items-center list-item-interactive">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                  1
                </div>
                <span>Search for your favorite expired deal</span>
              </div>
              <div className="flex gap-2.5 items-center list-item-interactive">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                  2
                </div>
                <span>Submit a Quick Revival request</span>
              </div>
              <div className="flex gap-2.5 items-center list-item-interactive">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                  3
                </div>
                <span>Get notified when the brand activates it</span>
              </div>
            </div>
            <Button
              asChild
              className="btn-primary text-xs py-2.5 px-6 inline-flex mt-2 border-0 h-auto cursor-pointer shadow-none"
            >
              <Link href="/revival">Request a Coupon Revival</Link>
            </Button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 animate-fade-in-scale stagger-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Popular Revival Requests
            </h3>
            <div className="space-y-3">
              {[
                {
                  brand: "Shopify Premium Store",
                  discount: "20% OFF",
                  votes: 489,
                  pct: 90,
                },
                {
                  brand: "Uber Premier Airport",
                  discount: "$15 OFF",
                  votes: 312,
                  pct: 75,
                },
                {
                  brand: "Notion Enterprise Plan",
                  discount: "$100 CREDITS",
                  votes: 219,
                  pct: 60,
                },
              ].map((req, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/5 rounded-lg p-3.5 space-y-2.5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{req.brand}</span>
                    <span className="text-brand-warning font-semibold">
                      {req.votes} requests
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-gradient h-full rounded-full"
                      style={{ width: `${req.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Nearby Deals — real API, location-aware */}
      <NearbyDeals onRedeem={(c) => setSelectedCoupon(c)} />

      {/* 8. Trending Brands Banner */}
      <section className="bg-brand-bg border-y border-brand-border py-12 px-4 animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xs font-bold text-brand-navy uppercase tracking-widest mb-8">
            Trending Partner Brands on Vouchiqo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center text-center">
            {trendingBrands.map((brand, idx) => (
              <div
                key={idx}
                className={`p-4 border border-brand-border bg-brand-surface rounded-lg hover:border-brand-blue hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in-scale stagger-${(idx % 6) + 1}`}
              >
                <span className="text-base font-extrabold text-brand-navy tracking-tight block">
                  {brand.name}
                </span>
                <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider block mt-1">
                  {brand.count} active coupons
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. How It Works */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold font-heading text-brand-navy tracking-tight mb-3">
          Verification is the Vouchiqo Promise
        </h2>
        <p className="text-xs text-brand-subtext max-w-sm mx-auto mb-12">
          Say goodbye to fake coupon codes and broken links. Here is how
          Vouchiqo guarantees savings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "100% Brand Verification",
              desc: "Merchants authenticate directly on Vouchiqo. We cryptographically lock coupon validation keys.",
              icon: ShieldCheck,
            },
            {
              title: "Real-Time Success Metrics",
              desc: "We analyze client-side checkout inputs to dynamically display coupon claim success metrics.",
              icon: Zap,
            },
            {
              title: "Decentralized Restorations",
              desc: "Customers request revival of beloved expired deals, unlocking community-driven campaigns.",
              icon: RotateCcw,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-brand-bg border border-brand-border rounded-lg p-6 space-y-3 flex flex-col items-center hover:shadow-md transition-shadow duration-300 animate-fade-in-up stagger-${idx + 1}`}
              >
                <div className="p-3 bg-brand-navy/5 text-brand-navy rounded-full border border-brand-border transition-colors group-hover:bg-brand-navy/10">
                  <Icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-text">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-subtext leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Merchant CTA */}
      <section className="bg-brand-navy text-white py-16 px-4 border-t border-white/10 text-center relative overflow-hidden animate-fade-in-scale">
        <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight leading-tight">
            Grow Your Business With Vouchiqo
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Stop losing checkouts to broken discount boxes. List verified
            campaigns, manage subscription structures, and track real-time
            conversion rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="btn-primary text-xs py-2.5 px-6 border-0 h-auto cursor-pointer shadow-none"
            >
              <Link href="/auth/register?role=merchant">
                Create Merchant Account
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="btn-tertiary border-white text-white hover:bg-white/10 text-xs py-2.5 px-6 cursor-pointer shadow-none h-auto bg-transparent"
            >
              <Link href="/merchant/dashboard">Learn Partner Benefits</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 11. Customer Testimonials */}
      <section className="py-16 bg-brand-surface px-4 text-center max-w-6xl mx-auto w-full animate-fade-in-up">
        <h2 className="text-2xl font-bold font-heading text-brand-navy tracking-tight mb-8">
          What Our Members Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Vouchiqo is the first coupon website where the codes actually work on the first try. The dual-verification badges are a game changer.",
              author: "Sarah Jenkins",
              role: "Developer",
              rating: 5,
            },
            {
              quote:
                "As a small business owner, listing deals on Vouchiqo has helped us re-engage cart abandoners and double our checkout conversion rate.",
              author: "Marcus Vance",
              role: "Shopify Merchant",
              rating: 5,
            },
            {
              quote:
                "The coupon revival feature is amazing. We requested a discount extension from Starbucks and it was reactivated within two days!",
              author: "Jessica Croft",
              role: "Bargain Hunter",
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-brand-bg border border-brand-border rounded-lg p-6 space-y-4 text-left shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-scale stagger-${idx + 1}`}
            >
              <p className="text-xs text-brand-text italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div>
                <h4 className="font-bold text-brand-navy text-xs">
                  {item.author}
                </h4>
                <span className="text-[10px] font-semibold text-brand-subtext">
                  {item.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. FAQ Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto w-full animate-fade-in-up stagger-1">
        <h2 className="text-2xl font-bold font-heading text-brand-navy text-center tracking-tight mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full bg-brand-bg border border-brand-border rounded-xl shadow-sm animate-fade-in-scale"
        >
          {[
            {
              q: "How does Vouchiqo verify coupon codes?",
              a: "We work directly with verified merchants. Code validity keys are integrated with their web stores. We also track client-side checkout conversion logs to ensure no stale discount codes exist.",
            },
            {
              q: "What is the Expired Coupon Revival System?",
              a: "If a specific offer has expired, customers can submit a revival vote. When a threshold is met, the system alerts the merchant, offering them conversion projections to incentivize reactivating the deal.",
            },
            {
              q: "Is Vouchiqo free to use for customers?",
              a: "Absolutely! Vouchiqo is completely free for members to discover, claim, and save coupons. Merchants pay a small monthly subscription to list campaign dashboards.",
            },
          ].map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="p-5 font-heading font-bold text-sm text-brand-navy hover:no-underline transition-all">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-xs text-brand-subtext leading-relaxed border-t border-brand-border/60 pt-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

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
