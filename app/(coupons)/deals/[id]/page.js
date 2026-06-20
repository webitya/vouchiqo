"use client";

import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CouponDetails({ params }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mock coupon detail
  const coupon = {
    _id: "c1",
    title: "Get 50% off your next 5 food orders",
    discountValue: 50,
    discountType: "percentage",
    description:
      "Valid on all restaurant deliveries above $15. Maximum discount cap of $10 per order. Valid for new and returning users. Cannot be combined with other promotional codes.",
    category: "Food",
    successRate: 99,
    isMerchantVerified: true,
    isVouchiqoVerified: true,
    workedToday: true,
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    merchantId: {
      _id: "m1",
      name: "Zomato Delivery",
      rating: 4.9,
      reviewsCount: 184,
      description:
        "Fast, reliable restaurant food delivery network serving over 100 cities globally.",
    },
  };

  const discountFormatted =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `$${coupon.discountValue} OFF`;

  const relatedCoupons = [
    {
      _id: "c4",
      title: "Buy One Get One Free on Handcrafted Beverages",
      discountValue: 100,
      discountType: "percentage",
      description:
        "BOGO offer on all tall, grande, and venti espresso drinks. Valid in-store only.",
      category: "Food",
      successRate: 96,
      isMerchantVerified: true,
      isVouchiqoVerified: true,
      workedToday: true,
      merchantId: { name: "Starbucks Coffee" },
    },
    {
      _id: "c6",
      title: "Get 15% discount on local airport rides",
      discountValue: 15,
      discountType: "percentage",
      description:
        "Ride in comfort. Maximum discount of $12. Valid on Uber Premier.",
      category: "Travel",
      successRate: 92,
      isMerchantVerified: false,
      isVouchiqoVerified: true,
      workedToday: false,
      merchantId: { name: "Uber Rides" },
    },
  ];

  const shareOffer = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow space-y-8">
        {/* Breadcrumbs */}
        <div className="text-xs font-semibold text-brand-subtext flex gap-2">
          <Link href="/" className="hover:text-brand-navy">
            Home
          </Link>
          <span>/</span>
          <Link href="/deals" className="hover:text-brand-navy">
            Deals
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-bold">
            {coupon.merchantId.name}
          </span>
        </div>

        {/* Main Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coupon Ticket and details (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Massive Ticket UI */}
            <div className="coupon-ticket bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 relative">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-brand-success/10 text-brand-success hover:bg-brand-success/15 border-0 shadow-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Vouchiqo Verified Offer</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This code is dynamically synchronized with the brand's
                          checkout system.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Badge className="bg-brand-success/5 text-brand-success hover:bg-brand-success/10 border-0 shadow-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{coupon.successRate}% Success Rate</span>
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold font-heading text-brand-navy tracking-tight">
                    {discountFormatted}
                  </h1>
                  <h2 className="text-lg font-bold text-brand-text">
                    {coupon.title}
                  </h2>
                </div>

                <p className="text-xs text-brand-subtext leading-relaxed">
                  {coupon.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-brand-text">
                  <span className="flex items-center gap-1.5 text-brand-navy">
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span>
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-brand-success">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Secure Checkout</span>
                  </span>
                </div>
              </div>

              {/* Redemptions controls inside the card */}
              <div className="md:w-60 flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-brand-border pt-6 md:pt-0 md:pl-6 space-y-3.5">
                <Button
                  onClick={() => setSelectedCoupon(coupon)}
                  className="btn-primary w-full text-sm py-2.5 border-0 h-auto cursor-pointer shadow-none"
                >
                  Claim Voucher Code
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSaved(!isSaved)}
                    variant="outline"
                    className="btn-tertiary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
                  >
                    {isSaved
                      ? <>
                          <BookmarkCheck className="w-4 h-4 text-brand-success" />
                          <span>Saved</span>
                        </>
                      : <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save</span>
                        </>}
                  </Button>
                  <Button
                    onClick={shareOffer}
                    variant="outline"
                    className="btn-tertiary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? "Copied" : "Share"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-3.5">
              <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                Terms and Conditions
              </h3>
              <ul className="text-xs text-brand-subtext space-y-2 list-disc pl-4 leading-relaxed">
                <li>Valid on Zomato application deliveries only.</li>
                <li>
                  Minimum cart value of $15 is required before discount is
                  applied.
                </li>
                <li>
                  Offer is valid on credit card and internet banking checkouts.
                </li>
                <li>
                  Coupon codes are unique and restricted to 5 checkouts per user
                  account.
                </li>
                <li>
                  Vouchiqo guarantees 100% refund of transaction fees in case of
                  vendor failure.
                </li>
              </ul>
            </div>

            {/* Review Section */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
                Community Reviews & Feedback
              </h3>

              <div className="space-y-4">
                {[
                  {
                    user: "David C.",
                    rating: 5,
                    date: "Today",
                    comment:
                      "Worked instantly! Saved $10 on my dinner. Highly recommend.",
                  },
                  {
                    user: "Emma L.",
                    rating: 5,
                    date: "Yesterday",
                    comment:
                      "Awesome verification process. Vouchiqo works much better than other code aggregators.",
                  },
                  {
                    user: "Ryan T.",
                    rating: 4,
                    date: "3 days ago",
                    comment:
                      "Good coupon. Cap on max discount is $10 but still saved 50% on my smaller order.",
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-brand-navy flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-brand-subtext" />
                        <span>{rev.user}</span>
                      </span>
                      <span className="text-brand-subtext">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 text-brand-warning">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-brand-subtext leading-relaxed bg-brand-surface p-2.5 rounded-lg border border-brand-border/40">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merchant sidebar profile (Right) */}
          <aside className="space-y-6">
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-brand-border pb-4">
                <div className="w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center font-bold text-lg text-white">
                  {coupon.merchantId.name[0]}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-brand-navy leading-snug">
                    {coupon.merchantId.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-brand-text mt-0.5">
                    <Star className="w-3.5 h-3.5 text-brand-warning fill-brand-warning" />
                    <span>{coupon.merchantId.rating}</span>
                    <span className="text-brand-subtext">
                      ({coupon.merchantId.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <p className="text-xs text-brand-subtext leading-relaxed">
                  {coupon.merchantId.description}
                </p>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-3 text-center text-xs font-bold text-brand-navy">
                  Active Vouchiqo Partner Since 2024
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="btn-tertiary w-full text-xs py-2 justify-center text-center font-bold cursor-pointer border-brand-navy text-brand-navy hover:bg-brand-navy/5 shadow-none h-auto"
                >
                  <Link href={`/merchants/${coupon.merchantId._id}`}>
                    Browse Brand Profile
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Coupons */}
        <section className="space-y-6">
          <h3 className="font-heading text-lg font-bold text-brand-navy tracking-tight">
            Similar Food & Delivery Offers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCoupons.map((c) => (
              <CouponCard
                key={c._id}
                coupon={c}
                onRedeem={(x) => setSelectedCoupon(x)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Confirmation Modal */}
      {selectedCoupon && (
        <ConfirmationModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onConfirm={async (_id) => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return `VOUCH-CLAIM-${Math.floor(1000 + Math.random() * 9000)}`;
          }}
        />
      )}
    </div>
  );
}
