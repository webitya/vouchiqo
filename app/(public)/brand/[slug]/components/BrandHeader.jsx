"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Heart,
  Loader2,
  RotateCcw,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Brand header: logo, title, verified badge, rating, follow, tabs.
 */
export default function BrandHeader({
  merchant,
  coupons,
  isClient,
  activeTab,
  setActiveTab,
  isFollowing,
  setIsFollowing,
  followers,
  setFollowers,
  ratingVal,
  setRatingVal,
  votesCount,
  setVotesCount,
  isRated,
  setIsRated,
  existingUser,
  setExistingUser,
  couponsCount,
  offersCount,
  todayStr,
}) {
  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowers((prev) => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    }
  };

  const handleRate = () => {
    if (!isRated) {
      setIsRated(true);
      setVotesCount((prev) => prev + 1);
      setRatingVal(5.0);
    }
  };

  return (
    <section className="bg-white border-b border-[#e5e7eb] pt-6 pb-2.5 select-none">
      <div className="max-w-[1248px] mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left Block: Logo & Title */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full md:w-auto">
          <div
            style={{
              width: 140,
              height: 80,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {merchant.logo ? (
              <img
                src={merchant.logo}
                alt={merchant.businessName}
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span className="font-extrabold text-2xl text-[#3e80dd]">
                {merchant.businessName?.[0]}
              </span>
            )}
          </div>

          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#191f2e] tracking-tight">
                {merchant.businessName} Coupon Codes
              </h1>
              {merchant.isVerified !== false && (
                <span className="bg-[#eaf5ec] text-[#2f855a] border border-[#c6f6d5] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Store</span>
                </span>
              )}
              {merchant.plan && merchant.plan !== "starter" && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                    merchant.plan === "enterprise"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : merchant.plan === "pro"
                        ? "bg-blue-50 text-brand-blue border-blue-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {merchant.plan} Partner
                </span>
              )}
              {merchant.businessType && (
                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">
                  {merchant.businessType === "both"
                    ? "Online & In-Store"
                    : merchant.businessType}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#6b7280] font-medium">
              Best {coupons.length} Coupons &amp; Offers last validated on{" "}
              <span className="text-[#191f2e] font-semibold">{todayStr}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#4b5563] font-semibold">
              <div className="flex items-center gap-1">
                <span className="text-[#9ca3af]">Category:</span>
                <span className="text-brand-navy capitalize font-bold">
                  {merchant.category}
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1" />
              <div className="flex items-center gap-1">
                <span className="text-[#9ca3af]">Active Campaigns:</span>
                <span className="text-brand-navy font-bold">
                  {coupons.length}
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1" />
              <div className="flex items-center gap-1">
                <span className="text-[#9ca3af]">Avg Discount:</span>
                <span className="text-brand-blue font-bold">~25% OFF</span>
              </div>
              {merchant.location?.city && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1" />
                  <div className="flex items-center gap-1">
                    <span className="text-[#9ca3af]">Storefront:</span>
                    <span className="text-brand-navy font-bold">
                      {merchant.location.city}, {merchant.location.state}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2 mt-1">
              <div className="flex text-[#f59e0b]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current stroke-none"
                  />
                ))}
              </div>
              <span className="text-[12px] text-[#4b5563] font-semibold">
                {ratingVal.toFixed(1)}/5 ({votesCount} votes)
              </span>
            </div>
          </div>
        </div>

        {/* Right Block: Rating & Toggle */}
        <div className="hidden md:flex flex-col items-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-xl shadow-sm text-right">
            <div>
              <button
                onClick={handleRate}
                type="button"
                className="flex text-[#f59e0b] hover:scale-105 transition-transform border-0 bg-transparent cursor-pointer p-0"
                title="Click to Rate Store"
                disabled={isRated}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(ratingVal) ? "fill-[#f59e0b]" : ""} stroke-current`}
                  />
                ))}
              </button>
              <p className="text-[11px] text-[#6b7280] font-bold mt-1 uppercase tracking-wider">
                {ratingVal.toFixed(1)} / 5 ({votesCount} votes)
              </p>
            </div>
            <div className="w-px h-8 bg-[#e2e8f0] mx-1" />
            <div className="text-left">
              <button
                onClick={handleFollow}
                type="button"
                className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider border-0 bg-transparent cursor-pointer transition-colors ${
                  isFollowing
                    ? "text-[#2f855a]"
                    : "text-[#3e80dd] hover:text-[#2563eb]"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFollowing ? "fill-[#2f855a]" : ""}`}
                />
                <span>{isFollowing ? "Following" : "Follow Store"}</span>
              </button>
              <p className="text-[10px] text-[#6b7280] font-semibold mt-1">
                {followers} Followers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-[#4b5563]">
              Existing User Offers
            </span>
            <button
              type="button"
              onClick={() => setExistingUser((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                existingUser ? "bg-[#3e80dd]" : "bg-[#d1d5db]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  existingUser ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Links */}
      <div className="max-w-[1248px] mx-auto px-4 mt-5">
        <div className="flex border-b border-[#e5e7eb] w-full">
          {[
            { key: "all", label: "All", count: coupons.length },
            { key: "cpn", label: "Coupons", count: couponsCount },
            { key: "dl", label: "Offers", count: offersCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
              className={`pb-2.5 px-4 text-[13px] font-black uppercase tracking-wider transition-all border-0 bg-transparent cursor-pointer relative ${
                activeTab === tab.key
                  ? "text-[#3e80dd]"
                  : "text-[#6b7280] hover:text-[#3e80dd]"
              }`}
            >
              {tab.label}{" "}
              <span className="text-[11px] font-bold text-[#9ca3af]">
                ({tab.count})
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e80dd]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
