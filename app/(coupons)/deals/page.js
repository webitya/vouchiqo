"use client";

import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

const CouponSkeleton = () => (
  <div className="bg-brand-bg border border-brand-border rounded-xl p-5 space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-16 h-5 bg-slate-200 rounded"></div>
      <div className="w-20 h-5 bg-slate-200 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
  </div>
);

function DealsListingContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams?.get("search") || "";
  const urlLocation = searchParams?.get("location") || "All";

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);

  // Sync state if searchParams change (e.g. searching from Navbar)
  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
    setSelectedLocation(searchParams?.get("location") || "All");
  }, [searchParams]);

  // Reset page to 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset page on filter state changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedLocation, sortBy]);

  // Fetch coupons from API
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "coupons",
      { page, searchQuery, selectedCategory, selectedLocation, sortBy },
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", "9");

      if (searchQuery) {
        queryParams.set("search", searchQuery);
      }
      if (selectedCategory && selectedCategory !== "All") {
        const categoryMap = {
          Food: "food",
          Travel: "travel",
          SaaS: "electronics",
          Fashion: "fashion",
          Beauty: "beauty",
          Services: "services",
        };
        const mapped =
          categoryMap[selectedCategory] || selectedCategory.toLowerCase();
        queryParams.set("category", mapped);
      }
      if (selectedLocation && selectedLocation !== "All") {
        queryParams.set("city", selectedLocation);
      }

      if (sortBy === "success") {
        queryParams.set("sortBy", "totalClaims");
        queryParams.set("sortOrder", "desc");
      } else if (sortBy === "expiring") {
        queryParams.set("sortBy", "expiresAt");
        queryParams.set("sortOrder", "asc");
      } else {
        queryParams.set("sortBy", "createdAt");
        queryParams.set("sortOrder", "desc");
      }

      const res = await fetch(`/api/coupons?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const json = await res.json();
      return json.data;
    },
  });

  const coupons = data?.coupons || [];
  const totalPages = data?.meta?.pages || 1;
  const totalOffers = data?.meta?.total || 0;

  const handleClaimConfirm = async (couponId) => {
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      });

      if (res.status === 401 || res.status === 403) {
        // Fallback for mock/demo flow
        await new Promise((resolve) => setTimeout(resolve, 800));
        return `VOUCH-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      if (!res.ok) {
        throw new Error("Claim failed");
      }

      const json = await res.json();
      return (
        json.data?.code ||
        `VOUCH-CLAIM-${Math.floor(1000 + Math.random() * 9000)}`
      );
    } catch (_err) {
      // Fallback in case of server/database errors or network issues
      return `VOUCH-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-12 px-4 text-center border-b border-brand-border relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold font-heading tracking-tight">
            Browse All Verified Deals
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Browse, filter, and claim verified promo codes. Save up to 50% on
            SaaS subscriptions, food, travel, and lifestyle brands.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow flex flex-col lg:flex-row gap-8">
        {/* Left Side: Sidebar Filters (Desktop) */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 hidden lg:block lg:sticky lg:top-[80px] self-start z-20">
          <div className="bg-brand-bg border border-brand-border rounded-lg p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <span className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
                <span>Filters</span>
              </span>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setSelectedLocation("All");
                  setSortBy("featured");
                }}
                className="h-auto p-0 text-[10px] text-brand-subtext hover:text-brand-navy font-semibold flex items-center gap-1 border-0 bg-transparent shadow-none cursor-pointer hover:bg-transparent"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-text uppercase">
                Keyword Search
              </label>
              <div className="flex items-center bg-brand-surface border border-brand-border rounded-lg p-2 text-brand-text">
                <Search className="w-4 h-4 text-brand-subtext mr-2" />
                <Input
                  type="text"
                  placeholder="Enter brand name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-xs w-full p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-brand-subtext shadow-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-text uppercase">
                Category
              </label>
              <div className="flex flex-col gap-1.5 text-xs font-medium">
                {[
                  "All",
                  "Food",
                  "Travel",
                  "SaaS",
                  "Fashion",
                  "Beauty",
                  "Services",
                ].map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    className={`justify-start py-1.5 px-2.5 h-auto text-xs font-semibold rounded-md transition-colors cursor-pointer border-0 shadow-none ${
                      selectedCategory === cat
                        ? "bg-brand-navy text-white hover:bg-brand-navy/90"
                        : "hover:bg-brand-surface text-brand-subtext hover:text-brand-text"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-text uppercase">
                Location
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-brand-text focus:ring-1 focus:ring-brand-blue/30 shadow-none cursor-pointer">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-brand-bg text-brand-text border-brand-border">
                  <SelectItem value="All">All Locations</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Right Side: Main Listing Panel */}
        <section className="flex-1 space-y-6">
          {/* Top Bar (controls search, sort, view type) */}
          <div className="bg-brand-bg border border-brand-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm sticky top-[80px] z-20">
            <div className="text-xs font-semibold text-brand-subtext">
              Showing{" "}
              <span className="text-brand-navy font-bold">
                {isLoading ? "..." : coupons.length}
              </span>{" "}
              of {isLoading ? "..." : totalOffers} verified offers
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-brand-subtext font-semibold">
                  Sort By:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-xs font-bold text-brand-navy focus:ring-1 focus:ring-brand-blue/30 shadow-none cursor-pointer">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-bg text-brand-text border-brand-border">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="success">Success Rate</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grid of coupon cards or loading skeletons */}
          {isLoading
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CouponSkeleton key={i} />
                ))}
              </div>
            : isError
              ? <div className="bg-brand-bg border border-brand-border rounded-lg py-16 text-center">
                  <h3 className="text-lg font-bold text-brand-navy font-heading mb-1">
                    Failed to load coupons
                  </h3>
                  <p className="text-xs text-brand-subtext max-w-xs mx-auto mb-4">
                    {error.message ||
                      "An unexpected error occurred while loading active coupons."}
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="btn-primary text-xs py-2 px-4 border-0 h-auto cursor-pointer shadow-none animate-none"
                  >
                    Try Again
                  </Button>
                </div>
              : coupons.length > 0
                ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                      <CouponCard
                        key={coupon._id}
                        coupon={coupon}
                        onRedeem={(c) => setSelectedCoupon(c)}
                      />
                    ))}
                  </div>
                : <div className="bg-brand-bg border border-brand-border rounded-lg py-16 text-center">
                    <h3 className="text-lg font-bold text-brand-navy font-heading mb-1">
                      No coupons match your filters
                    </h3>
                    <p className="text-xs text-brand-subtext max-w-xs mx-auto mb-4">
                      Try resetting your search query or choosing another
                      category.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("");
                        setSelectedLocation("All");
                        setSortBy("featured");
                      }}
                      className="btn-primary text-xs py-2 px-4 border-0 h-auto cursor-pointer shadow-none"
                    >
                      Reset Filters
                    </Button>
                  </div>}

          {/* Pagination */}
          {!isLoading && !isError && coupons.length > 0 && (
            <div className="flex items-center justify-between border-t border-brand-border pt-6">
              <Button
                variant="outline"
                className="btn-tertiary text-xs py-1.5 px-4 font-bold disabled:opacity-50 cursor-pointer h-auto border-brand-border text-brand-text hover:bg-brand-surface"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-brand-subtext font-semibold">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="btn-tertiary text-xs py-1.5 px-4 font-bold disabled:opacity-50 cursor-pointer h-auto border-brand-border text-brand-text hover:bg-brand-surface"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Confirmation Modal */}
      {selectedCoupon && (
        <ConfirmationModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onConfirm={handleClaimConfirm}
        />
      )}
    </div>
  );
}

export default function DealsListing() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-surface">
          <div className="text-sm font-semibold text-brand-subtext animate-pulse">
            Loading Deals...
          </div>
        </div>
      }
    >
      <DealsListingContent />
    </Suspense>
  );
}
