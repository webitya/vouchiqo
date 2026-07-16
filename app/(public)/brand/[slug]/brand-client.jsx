"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar";

// Import modular sub-components
import BrandHeader from "./components/BrandHeader";
import BrandStats from "./components/BrandStats";
import CouponCard from "./components/CouponCard";
import ExpiredOfferCard from "./components/ExpiredOfferCard";
import SidebarSection from "./components/SidebarSection";
import RelatedFooter from "./components/RelatedFooter";

export default function BrandClient({
  merchant,
  coupons = [],
  expiredCoupons = [],
  relatedBrands = [],
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCouponId, setCopiedCouponId] = useState(null);
  const [followers, setFollowers] = useState(merchant.followerCount || 42);
  const [ratingVal, setRatingVal] = useState(4.8);
  const [votesCount, setVotesCount] = useState(61);
  const [isRated, setIsRated] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [expandedCouponId, setExpandedCouponId] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Expired revival state
  const [revivalStatus, setRevivalStatus] = useState({});

  const openStatus = useMemo(() => {
    if (!merchant.operatingHours)
      return { label: "Hours Unspecified", color: "text-slate-400" };
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const hours = merchant.operatingHours[dayName];
    if (!hours || hours.closed)
      return { label: "Closed Today", color: "text-red-500" };
    return { label: "Open Now", color: "text-blue-500" };
  }, [merchant.operatingHours]);

  // Mount gate to prevent hydration date mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  const todayStr = useMemo(() => {
    if (!isClient) return "Today";
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [isClient]);

  // Filter coupons based on tab selection and existing user filter
  const filteredCoupons = useMemo(() => {
    let list = coupons;

    if (existingUser) {
      list = list.filter((c) => !c.title?.toLowerCase().includes("first"));
    }

    if (activeTab === "all") return list;
    if (activeTab === "cpn") {
      return list.filter((c) => c.code && c.code.trim() !== "");
    }
    if (activeTab === "dl") {
      return list.filter((c) => !c.code || c.code.trim() === "");
    }
    return list;
  }, [coupons, activeTab, existingUser]);

  const couponsCount = useMemo(() => {
    return coupons.filter((c) => c.code && c.code.trim() !== "").length;
  }, [coupons]);

  const offersCount = useMemo(() => {
    return coupons.filter((c) => !c.code || c.code.trim() === "").length;
  }, [coupons]);

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowers((prev) => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = (code, couponId) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCouponId(couponId);
      setTimeout(() => setCopiedCouponId(null), 2000);
      window.open(merchant.website || "https://google.com", "_blank");
    }
  };

  const handleReviveExpired = async (couponId) => {
    setRevivalStatus((prev) => ({ ...prev, [couponId]: "loading" }));
    try {
      const targetCoupon = expiredCoupons.find((c) => c._id === couponId);
      if (!targetCoupon) throw new Error();

      const res = await fetch("/api/revivals/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: targetCoupon.code || "UNKNOWN",
          brandName: merchant.businessName,
          email: "guest@vouchiqo.com",
        }),
      });

      if (res.ok) {
        setRevivalStatus((prev) => ({ ...prev, [couponId]: "success" }));
      } else {
        setRevivalStatus((prev) => ({ ...prev, [couponId]: "error" }));
      }
    } catch {
      setRevivalStatus((prev) => ({ ...prev, [couponId]: "error" }));
    }
  };

  const handleRate = () => {
    if (!isRated) {
      setIsRated(true);
      setVotesCount((prev) => prev + 1);
      setRatingVal(5.0);
    }
  };

  const toggleDetails = (couponId) => {
    setExpandedCouponId((prev) => (prev === couponId ? null : couponId));
  };

  const faqs = useMemo(() => {
    const brand = merchant.businessName || "this brand";
    return [
      {
        q: `How do I apply a discount promo code for ${brand}?`,
        a: `Select a verified offer from our page, click 'Get Code' to copy it, then paste it into the promo code entry box on ${brand}'s official website during checkout.`,
      },
      {
        q: `Are all offers on Vouchiqo verified?`,
        a: `Yes! Every discount code and offer listed on Vouchiqo is manually checked and verified by our deal hunters daily to ensure you always get working discounts.`,
      },
      {
        q: `What can I do if an offer has expired?`,
        a: `If an offer has expired, you can vote to revive it by clicking 'Revive Offer'. Our team monitors these requests and reaches out to ${brand} to secure new active promotional offers.`,
      },
    ];
  }, [merchant.businessName]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6fa] text-[#191f2e] font-sans">
      <Navbar />

      {/* Brand Header: cover, breadcrumbs, rating and tags */}
      <BrandHeader
        merchant={merchant}
        coupons={coupons}
        todayStr={todayStr}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFollowing={isFollowing}
        handleFollow={handleFollow}
        followers={followers}
        ratingVal={ratingVal}
        votesCount={votesCount}
        isRated={isRated}
        handleRate={handleRate}
        existingUser={existingUser}
        setExistingUser={setExistingUser}
        couponsCount={couponsCount}
        offersCount={offersCount}
      />

      {/* Main Content layout grid */}
      <main className="max-w-[1248px] mx-auto px-4 py-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Coupons Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Key Stats Row */}
          <BrandStats coupons={coupons} merchant={merchant} />

          <div className="space-y-4 pt-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                isExpanded={expandedCouponId === coupon._id}
                toggleDetails={() => toggleDetails(coupon._id)}
                copiedCouponId={copiedCouponId}
                handleCopyCode={handleCopyCode}
                merchant={merchant}
              />
            ))}

            {filteredCoupons.length === 0 && (
              <div className="py-16 text-center bg-white border border-[#e2e8f0] rounded-2xl p-6">
                <p className="text-[13px] font-bold text-[#6b7280]">
                  No active campaigns matching your selection listed for
                  this brand currently.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setExistingUser(false);
                  }}
                  type="button"
                  className="mt-4 text-[#3e80dd] font-black uppercase text-xs hover:underline border-0 bg-transparent cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Expired Coupons section */}
          {expiredCoupons.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-extrabold text-[#4b5563] uppercase tracking-wider text-left">
                Expired Offers
              </h3>
              <div className="space-y-2">
                {expiredCoupons.map((coupon) => (
                  <ExpiredOfferCard
                    key={coupon._id}
                    coupon={coupon}
                    revivalStatus={revivalStatus}
                    handleReviveExpired={handleReviveExpired}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (4 cols) */}
        <SidebarSection
          merchant={merchant}
          openStatus={openStatus}
          faqs={faqs}
          copiedLink={copiedLink}
          handleShare={handleShare}
        />
      </main>

      {/* Related brands footer */}
      <RelatedFooter relatedBrands={relatedBrands} merchant={merchant} />

      <Footer />
    </div>
  );
}
