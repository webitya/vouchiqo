"use client";

import { CheckCircle2, Heart, Star, Mail } from "lucide-react";
import Link from "next/link";

export default function BrandHeader({
  merchant,
  coupons,
  todayStr,
  activeTab,
  setActiveTab,
  isFollowing,
  handleFollow,
  followers,
  ratingVal,
  votesCount,
  isRated,
  handleRate,
  existingUser,
  setExistingUser,
  couponsCount,
  offersCount,
}) {
  return (
    <>
      {/* Breadcrumb section */}
      <div className="bg-white border-b border-[#e5e7eb] py-3.5 relative z-10">
        <div className="max-w-[1248px] mx-auto px-4">
          <ul className="flex items-center gap-2 text-[13px] text-[#6b7280] font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
            <li>
              <Link href="/" className="hover:text-[#3e80dd] transition-colors">
                Home
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link
                href="/brands"
                className="hover:text-[#3e80dd] transition-colors"
              >
                Brands
              </Link>
            </li>
            <span>/</span>
            <li className="text-[#191f2e] font-semibold">
              {merchant.businessName} Offers
            </li>
          </ul>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="relative w-full bg-gradient-to-r from-[#0D213F] to-[#1A3C5E] h-[160px] md:h-[220px] overflow-hidden select-none">
        {merchant.banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.banner}
            alt={`${merchant.businessName} banner`}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0D213F] via-[#1A3C5E] to-[#2563eb] opacity-80" />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Intro Header Section */}
      <section className="bg-white border-b border-[#e5e7eb] pb-6 select-none relative">
        <div className="max-w-[1248px] mx-auto px-4">
          {/* Overlapping layout block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-20">
            {/* Left Block: Logo & Title Details */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end w-full md:w-auto">
              {/* Logo */}
              <div
                className="-mt-[45px] md:-mt-[60px] relative z-25"
                style={{
                  width: 140,
                  height: 100,
                  borderRadius: 12,
                  border: "4px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {merchant.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={merchant.logo}
                    alt={merchant.businessName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="font-extrabold text-3xl text-[#3e80dd]">
                    {merchant.businessName?.[0]}
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1 text-left pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#191f2e] tracking-tight">
                    {merchant.businessName}
                  </h1>
                  {/* Plan badge */}
                  <span className="bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {merchant.plan || "Starter"} Partner
                  </span>
                  {merchant.isVerified !== false && (
                    <span className="bg-[#eaf5ec] text-[#2f855a] border border-[#c6f6d5] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2f855a]" />
                      <span>Verified Store</span>
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#6b7280] font-medium">
                  Best {coupons.length} Offers last validated on{" "}
                  <span className="text-[#191f2e] font-semibold">
                    {todayStr}
                  </span>
                </p>

                {/* Mobile ratings row */}
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

            {/* Right Block: Star Rating & Toggle */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 flex-shrink-0 w-full md:w-auto pb-1 justify-between md:justify-end">
              {/* Star ratings container */}
              <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2 rounded-xl shadow-sm text-right">
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
                        className={`w-4 h-4 ${
                          i < Math.floor(ratingVal) ? "fill-[#f59e0b]" : ""
                        } stroke-current`}
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

              {/* Existing user switch */}
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

          {/* Tab Links list matching GrabOn Tab */}
          <div className="max-w-[1248px] mx-auto px-4 mt-5">
            <div className="flex border-b border-[#e5e7eb] w-full">
              <button
                onClick={() => setActiveTab("all")}
                type="button"
                className={`pb-2.5 px-4 text-[13px] font-black uppercase tracking-wider transition-all border-0 bg-transparent cursor-pointer relative ${
                  activeTab === "all"
                    ? "text-[#3e80dd]"
                    : "text-[#6b7280] hover:text-[#3e80dd]"
                }`}
              >
                {"All "}
                <span className="text-[11px] font-bold text-[#9ca3af]">
                  ({coupons.length})
                </span>
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e80dd]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("cpn")}
                type="button"
                className={`pb-2.5 px-4 text-[13px] font-black uppercase tracking-wider transition-all border-0 bg-transparent cursor-pointer relative ${
                  activeTab === "cpn"
                    ? "text-[#3e80dd]"
                    : "text-[#6b7280] hover:text-[#3e80dd]"
                }`}
              >
                {"Codes "}
                <span className="text-[11px] font-bold text-[#9ca3af]">
                  ({couponsCount})
                </span>
                {activeTab === "cpn" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e80dd]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("dl")}
                type="button"
                className={`pb-2.5 px-4 text-[13px] font-black uppercase tracking-wider transition-all border-0 bg-transparent cursor-pointer relative ${
                  activeTab === "dl"
                    ? "text-[#3e80dd]"
                    : "text-[#6b7280] hover:text-[#3e80dd]"
                }`}
              >
                {"Offers "}
                <span className="text-[11px] font-bold text-[#9ca3af]">
                  ({offersCount})
                </span>
                {activeTab === "dl" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3e80dd]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
