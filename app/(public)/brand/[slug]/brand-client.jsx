"use client";

import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CouponCard from "@/components/shared/CouponCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BrandClient({
  merchant,
  coupons = [],
  expiredCoupons = [],
  relatedBrands = [],
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("deals");
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [followers, setFollowers] = useState(merchant.followerCount || 0);

  // Expired revival state
  const [revivalStatus, setRevivalStatus] = useState({});

  useEffect(() => {
    // Determine if Open Now
    const checkOpenStatus = () => {
      if (!merchant.operatingHours) return false;
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
      const hoursToday = merchant.operatingHours[dayName];

      if (!hoursToday || hoursToday.closed) return false;

      const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g. 1430 for 2:30pm

      const parseTime = (timeStr) => {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 100 + minutes;
      };

      const openTime = parseTime(hoursToday.open);
      const closeTime = parseTime(hoursToday.close);

      return currentTime >= openTime && currentTime <= closeTime;
    };
    setIsOpenNow(checkOpenStatus());
  }, [merchant.operatingHours]);

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowers((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviveExpired = async (couponId) => {
    setRevivalStatus((prev) => ({ ...prev, [couponId]: "loading" }));
    try {
      // Find the coupon detail in our expired array
      const targetCoupon = expiredCoupons.find((c) => c._id === couponId);
      if (!targetCoupon) throw new Error();

      const res = await fetch("/api/revivals/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: targetCoupon.code || "UNKNOWN",
          brandName: merchant.businessName,
          email: "guest@vouchiqo.com", // Auto-fallback email for quick revive
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

  const planBadgeText =
    merchant.plan === "enterprise"
      ? "Enterprise Partner"
      : merchant.plan === "pro"
        ? "Pro Partner"
        : merchant.plan === "growth"
          ? "Growth Partner"
          : null;

  const planBadgeColor =
    merchant.plan === "enterprise"
      ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
      : merchant.plan === "pro"
        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
        : merchant.plan === "growth"
          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
          : "";

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      <Navbar />

      {/* Brand Header Banner */}
      <section className="relative overflow-hidden border-b border-brand-border bg-white">
        {/* Banner Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-brand-navy to-brand-blue relative overflow-hidden">
          {merchant.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={merchant.banner}
              alt={merchant.businessName}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-black/25 z-0" />
        </div>

        {/* Brand Meta info (overlapping layout) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 relative z-10 flex flex-col md:flex-row md:items-end md:gap-6 -mt-10 md:-mt-12">
          {/* Logo circle */}
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white border-4 border-white flex items-center justify-center font-black text-3xl text-brand-navy shadow-lg overflow-hidden flex-shrink-0">
            {merchant.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={merchant.logo}
                alt={merchant.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              merchant.businessName[0]
            )}
          </div>

          {/* Details */}
          <div className="flex-1 mt-4 md:mt-0 md:pb-2 space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight leading-none">
                {merchant.businessName}
              </h1>
              {merchant.isVerified !== false && (
                <Badge className="bg-brand-success/10 text-brand-success hover:bg-brand-success/15 border border-brand-success/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 fill-brand-success/10" />
                  <span>Verified Store</span>
                </Badge>
              )}
              {planBadgeText && (
                <Badge
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${planBadgeColor}`}
                >
                  {planBadgeText}
                </Badge>
              )}
            </div>
            <p className="text-xs text-brand-subtext font-bold uppercase tracking-wider">
              {merchant.category} &bull; Ranchi &amp; Jharkhand
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 md:mt-0 md:pb-2 flex gap-3 flex-shrink-0 self-stretch sm:self-auto justify-start">
            <Button
              onClick={handleFollow}
              className={`btn-secondary text-xs px-5 py-2 flex items-center gap-1.5 border-0 h-auto cursor-pointer shadow-none ${
                isFollowing
                  ? "bg-brand-success hover:bg-brand-success/90"
                  : "bg-brand-blue hover:bg-brand-blue/90"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? "fill-white" : ""}`} />
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="btn-tertiary text-xs px-5 py-2 flex items-center gap-1.5 border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </Button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="border-t border-brand-border bg-brand-surface/40 py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="block text-xl font-black text-brand-navy tracking-tight">
                {coupons.length}
              </span>
              <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wide">
                Active Coupons
              </span>
            </div>
            <div>
              <span className="block text-xl font-black text-brand-navy tracking-tight">
                {followers}
              </span>
              <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wide">
                Followers
              </span>
            </div>
            <div>
              <span className="block text-xl font-black text-brand-success tracking-tight">
                {coupons.length > 0 ? "20% Avg" : "N/A"}
              </span>
              <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wide">
                Average Discount
              </span>
            </div>
            <div>
              {isOpenNow ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse" />
                  <span className="text-sm font-bold text-brand-success">
                    Open Now
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-error" />
                  <span className="text-sm font-bold text-brand-error">
                    Closed
                  </span>
                </div>
              )}
              <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wide block mt-0.5">
                Operating Hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Tabs / Coupon grids (8 cols) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {/* Tab Switcher */}
          <div className="flex border-b border-brand-border gap-6">
            <button
              onClick={() => setActiveTab("deals")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "deals"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-brand-subtext hover:text-brand-navy"
              }`}
            >
              Active Deals ({coupons.length})
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "expired"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-brand-subtext hover:text-brand-navy"
              }`}
            >
              Expired Offers ({expiredCoupons.length})
            </button>
          </div>

          {/* Active Deals Tab */}
          {activeTab === "deals" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  isLocal={true}
                  isMarbellaLocal={
                    merchant.businessName?.toLowerCase() === "marbella"
                  }
                />
              ))}
              {coupons.length === 0 && (
                <div className="col-span-full py-12 text-center text-sm font-medium text-brand-subtext bg-white border border-brand-border rounded-xl">
                  No active coupon campaigns listed for this brand currently.
                  Check back soon!
                </div>
              )}
            </div>
          )}

          {/* Expired Deals Tab (With inline revival) */}
          {activeTab === "expired" && (
            <div className="space-y-4">
              {expiredCoupons.map((coupon) => {
                const isSuccess = revivalStatus[coupon._id] === "success";
                const isLoading = revivalStatus[coupon._id] === "loading";
                const isError = revivalStatus[coupon._id] === "error";

                return (
                  <div
                    key={coupon._id}
                    className="bg-white border border-brand-border rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
                  >
                    {/* Faded expired overlay */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-400 line-through">
                          {coupon.code}
                        </span>
                        <Badge className="bg-brand-error/10 text-brand-error border border-brand-error/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                          Expired
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">
                        {coupon.title}
                      </h4>
                      <p className="text-[11px] text-brand-subtext leading-snug">
                        {coupon.description}
                      </p>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                      {isSuccess ? (
                        <div className="flex items-center gap-1.5 text-xs text-brand-success font-bold bg-brand-success/10 border border-brand-success/20 px-4 py-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 fill-white/10" />
                          <span>Revival Vote Counted</span>
                        </div>
                      ) : (
                        <Button
                          disabled={isLoading}
                          onClick={() => handleReviveExpired(coupon._id)}
                          className="btn-primary text-xs py-2 px-5 border-0 h-auto cursor-pointer shadow-none flex items-center gap-1.5"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                              <span>Requesting...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Revive Coupon</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {expiredCoupons.length === 0 && (
                <div className="py-12 text-center text-sm font-medium text-brand-subtext bg-white border border-brand-border rounded-xl">
                  No expired campaigns listed for this brand.
                </div>
              )}
            </div>
          )}

          {/* Business long description review */}
          <div className="bg-white border border-brand-border rounded-xl p-6 md:p-8 space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider pb-3 border-b border-brand-border">
              About the Business
            </h3>
            <p className="text-xs md:text-sm text-brand-subtext leading-relaxed">
              {merchant.longDescription ||
                merchant.description ||
                "No description provided."}
            </p>
          </div>
        </div>

        {/* Right Section: Sidebar details & operating hours (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          {/* Contact Details Card */}
          <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Location &amp; Contact
            </h3>

            <div className="space-y-4 text-xs font-semibold text-brand-text">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {merchant.location?.address &&
                    `${merchant.location.address}, `}
                  {merchant.location?.city ? (
                    <>
                      {merchant.location.city},{" "}
                      {merchant.location.state || "Jharkhand"}
                      {merchant.location?.pincode &&
                        `, ${merchant.location.pincode}`}
                    </>
                  ) : (
                    "Ranchi, Jharkhand, India"
                  )}
                </p>
              </div>

              {merchant.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <span>{merchant.contactPhone}</span>
                </div>
              )}

              {merchant.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <span>{merchant.contactEmail}</span>
                </div>
              )}

              {merchant.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a
                    href={merchant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours Card */}
          {merchant.operatingHours && (
            <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
                Operating Hours
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(merchant.operatingHours).map(([day, hr]) => (
                  <div
                    key={day}
                    className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-bold text-slate-700">{day}</span>
                    <span className="text-slate-500 font-medium">
                      {hr.closed ? "Closed" : `${hr.open} - ${hr.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Map Mockup */}
          <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Store Location
            </h3>
            <div className="h-48 bg-brand-surface rounded-xl border border-brand-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e4faf15_2px,transparent_2px)] [background-size:16px_16px] z-0"></div>
              {/* Map pin vector */}
              <div className="bg-white px-3 py-2 border border-brand-border rounded-lg shadow-md flex items-center gap-2 z-10 animate-float">
                <MapPin className="w-5 h-5 text-brand-error" />
                <div>
                  <span className="text-[10px] font-black text-brand-navy block leading-none">
                    Ranchi Store
                  </span>
                  <span className="text-[8px] text-brand-subtext font-medium mt-0.5 block">
                    Verified Geolocation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Brands Section */}
      {relatedBrands.length > 0 && (
        <section className="bg-white border-t border-brand-border py-16 px-4 select-none">
          <div className="max-w-7xl mx-auto space-y-8">
            <h3 className="font-heading text-xl md:text-2xl font-black text-brand-navy tracking-tight text-left">
              Related Brands in Category
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              {relatedBrands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brand/${brand.slug}`}
                  className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:border-brand-blue flex items-center gap-3 transition-all hover:-translate-y-1 shadow-sm cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-navy text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {brand.businessName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-bold text-sm text-brand-navy truncate leading-none">
                      {brand.businessName}
                    </h5>
                    <span className="text-[9px] text-brand-subtext font-bold block mt-1 uppercase tracking-wide">
                      {brand.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
