"use client";

import { ArrowRight, Loader2, MapPin, Navigation, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CouponCard from "@/components/shared/CouponCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/hooks/use-location";

/**
 * NearbyDeals section — fetches real coupons filtered by user's city.
 * Shows online-only deals when no location is available.
 */
export function NearbyDeals({ onRedeem }) {
  const { city, setCity, status, detect } = useLocation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");

  // Fetch coupons whenever city changes
  useEffect(() => {
    fetchNearby(city);
  }, [city]);

  async function fetchNearby(targetCity) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "6", sortBy: "createdAt", sortOrder: "desc" });
      if (targetCity) params.set("city", targetCity);

      const res = await fetch(`/api/coupons?${params}`);
      if (!res.ok) throw new Error("Failed to load deals");

      const { data } = await res.json();
      setCoupons(data?.coupons ?? []);
    } catch {
      toast.error("Could not load nearby deals. Try again.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }

  function handleDetect() {
    detect();
    toast("Detecting your location...", { icon: "📍" });
  }

  function handleManualCity(e) {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    setCity(trimmed);
    setCityInput("");
  }

  const isDetecting = status === "detecting";
  const isDenied = status === "denied";

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto w-full animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-heading text-brand-navy tracking-tight">
            {city ? `Deals in ${city}` : "Deals Nearby & Online"}
          </h2>
          <p className="text-xs text-brand-subtext mt-1">
            {city
              ? "Active promotions near your location."
              : "Share your location to see deals near you."}
          </p>
        </div>

        {/* Location Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Manual city input */}
          <form onSubmit={handleManualCity} className="flex items-center gap-1.5">
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-subtext" />
              <Input
                type="text"
                placeholder="Enter city..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="pl-7 h-8 text-xs w-32 border-brand-border bg-brand-surface"
              />
            </div>
            <Button type="submit" variant="outline" className="h-8 text-xs px-3 border-brand-border bg-brand-surface cursor-pointer shadow-none">
              Go
            </Button>
          </form>

          {/* Auto-detect button */}
          {isDenied ? (
            <span className="flex items-center gap-1 text-xs text-brand-subtext font-semibold">
              <WifiOff className="w-3.5 h-3.5" /> Location denied
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleDetect}
              disabled={isDetecting}
              className="h-8 text-xs px-3 border-brand-border bg-brand-surface flex items-center gap-1.5 cursor-pointer shadow-none"
            >
              {isDetecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-brand-blue" />
              )}
              <span>{isDetecting ? "Detecting..." : "Use My Location"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Coupon Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-subtext" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <MapPin className="w-8 h-8 text-brand-subtext mx-auto" />
          <p className="text-sm font-semibold text-brand-text">
            {city ? `No deals found in ${city} right now.` : "No deals available."}
          </p>
          {city && (
            <button
              type="button"
              onClick={() => setCity(null)}
              className="text-xs text-brand-blue font-bold hover:underline"
            >
              Show all deals instead
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon, idx) => (
              <div key={coupon._id} className={`animate-fade-in-up stagger-${(idx % 6) + 1}`}>
                <CouponCard coupon={coupon} onRedeem={onRedeem} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={city ? `/deals?city=${encodeURIComponent(city)}` : "/deals"}
              className="text-xs font-bold text-brand-blue flex items-center justify-center gap-1 hover:underline"
            >
              <span>{city ? `Browse all deals in ${city}` : "Browse all deals"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
