"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Settings,
  Heart,
  Loader2
} from "lucide-react";

// Defer static loads of heavy below-the-fold and modal overlay components
const ConfirmationModal = dynamic(() => import("@/components/ConfirmationModal"), {
  ssr: false,
});

const NearbyDeals = dynamic(
  () => import("@/features/location/components/nearby-deals").then((mod) => mod.NearbyDeals),
  {
    loading: () => (
      <div className="py-20 text-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto" />
        <span className="text-xs text-brand-subtext font-bold">Scanning local coordinates...</span>
      </div>
    ),
    ssr: false,
  }
);

const HowItWorks = dynamic(() => import("./how-it-works").then((mod) => mod.HowItWorks));
const Testimonials = dynamic(() => import("./testimonials").then((mod) => mod.Testimonials));
const FaqSection = dynamic(() => import("./faq-section").then((mod) => mod.FaqSection));
const MerchantCTA = dynamic(() => import("./merchant-cta").then((mod) => mod.MerchantCTA));
const PartnerBrands = dynamic(() => import("./partner-brands").then((mod) => mod.PartnerBrands));

import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLocation } from "@/hooks/use-location";
import { useSession } from "@/lib/auth-client";
import { useInterests } from "@/hooks/use-interests";

// Relative imports for neighboring feature components
import { HotDealsTicker } from "./hot-deals-ticker";
import { HeroSection } from "./hero-section";
import { CategoryStrip } from "./category-strip";
import { RevivalPromo } from "./revival-promo";
import { CountdownTimer } from "./countdown-timer";
import { Badge } from "@/components/ui/badge";

// 10 database-valid categories mapping to friendly icons/labels
const SYSTEM_CATEGORIES = [
  { name: "Food & Dining", slug: "food", emoji: "🍔" },
  { name: "Fashion & Apparel", slug: "fashion", emoji: "🛍️" },
  { name: "Electronics & Gadgets", slug: "electronics", emoji: "💻" },
  { name: "Beauty & Skincare", slug: "beauty", emoji: "💄" },
  { name: "Travel & Hotels", slug: "travel", emoji: "✈️" },
  { name: "Health & Fitness", slug: "fitness", emoji: "💪" },
  { name: "Home & Décor", slug: "home", emoji: "🏠" },
  { name: "SaaS & Productivity", slug: "entertainment", emoji: "💼" },
  { name: "Local Services", slug: "services", emoji: "🛠️" },
  { name: "Other Deals", slug: "other", emoji: "🏷️" },
];

export function HomeClient({ initialCoupons = [], latestCoupons = [] }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Auth & Profile
  const { data: session } = useSession();
  const user = session?.user;
  const { interests: savedInterests, saveInterests, syncing: updatingPrefs } = useInterests();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isPrefSheetOpen, setIsPrefSheetOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSelect, setLocationSelect] = useState("All Locations");

  // Location state
  const { city, status: locationStatus, detect: detectLocation } = useLocation();
  const [feedTab, setFeedTab] = useState("all");

  // App download capture
  const [appEmail, setAppEmail] = useState("");
  const [appSubscribed, setAppSubscribed] = useState(false);

  // Interest banner state
  const [showInterestBanner, setShowInterestBanner] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Mount logic
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync selectedInterests state with savedInterests when the preferences sheet opens
  useEffect(() => {
    if (isPrefSheetOpen) {
      setSelectedInterests(savedInterests || []);
    }
  }, [isPrefSheetOpen, savedInterests]);

  // Sync default tab with location
  useEffect(() => {
    if (city) {
      setFeedTab("near");
    } else {
      setFeedTab("all");
    }
  }, [city]);

  // Interest capture banner triggers
  useEffect(() => {
    if (!isMounted || user) return;

    const hasInterests = localStorage.getItem("vouchiqo_interests");
    const dismissed = localStorage.getItem("vouchiqo_interests_dismissed");
    if (hasInterests || dismissed) return;

    // Trigger on 10 seconds
    const timer = setTimeout(() => {
      setShowInterestBanner(true);
    }, 10000);

    // Trigger on 40% scroll
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        if (scrolled >= 40) {
          setShowInterestBanner(true);
          window.removeEventListener("scroll", handleScroll);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user, isMounted]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set("search", searchQuery);
    }
    if (locationSelect && locationSelect !== "All Locations") {
      queryParams.set("city", locationSelect);
    }
    window.location.href = `/deals?${queryParams.toString()}`;
  };

  const handleSaveInterests = async (newInterests) => {
    await saveInterests(newInterests);
    setIsPrefSheetOpen(false);
    setShowInterestBanner(false);
  };

  const handleDismissInterestsBanner = () => {
    localStorage.setItem("vouchiqo_interests_dismissed", "true");
    setShowInterestBanner(false);
  };

  // Location details checks
  const isJharkhand = city && ["ranchi", "jharkhand", "jamshedpur", "bokaro", "dhanbad"].includes(city.toLowerCase());

  const getCardProps = (coupon) => {
    const couponCity = coupon.location?.city?.toLowerCase();
    const userCity = city?.toLowerCase();
    const isLocal = city && couponCity === userCity;
    const isMarbellaLocal = isJharkhand && coupon.merchantId?.businessName?.toLowerCase() === "marbella";
    return { isLocal, isMarbellaLocal };
  };

  // Filter & Personalize feeds
  const reorderAndFilter = (list) => {
    let filtered = [...list];

    // Filter by location tab
    if (feedTab === "near" && city) {
      filtered = list.filter((c) => {
        const couponCity = c.location?.city?.toLowerCase();
        const isOnline = c.location?.isOnline !== false;
        return couponCity === city.toLowerCase() || isOnline;
      });
    }

    // Sort by interests if any are set
    if (savedInterests.length > 0) {
      const match = [];
      const rest = [];
      for (const c of filtered) {
        const catVal = c.category?.toLowerCase();
        const matchesInterest = savedInterests.some(
          (interest) => interest.toLowerCase() === catVal || interest.toLowerCase() === c.title?.toLowerCase()
        );
        if (matchesInterest) {
          match.push(c);
        } else {
          rest.push(c);
        }
      }
      filtered = [...match, ...rest];
    }

    // Elevate Marbella/Home Improvement in Ranchi/Jharkhand
    if (isJharkhand) {
      const elevated = [];
      const rest = [];
      for (const c of filtered) {
        const isMarbella = c.merchantId?.businessName?.toLowerCase() === "marbella";
        const isHomeImprovement = c.category?.toLowerCase() === "home";
        if (isMarbella || isHomeImprovement) {
          elevated.push(c);
        } else {
          rest.push(c);
        }
      }
      filtered = [...elevated, ...rest];
    }

    return filtered;
  };

  const finalFeatured = useMemo(() => {
    return reorderAndFilter(initialCoupons).slice(0, 6);
  }, [initialCoupons, feedTab, city, savedInterests, forceRefresh]);

  const finalLatest = useMemo(() => {
    return reorderAndFilter(latestCoupons).slice(0, 6);
  }, [latestCoupons, feedTab, city, savedInterests, forceRefresh]);

  // App download form submit
  const handleAppSubscribe = (e) => {
    e.preventDefault();
    if (appEmail) {
      setAppSubscribed(true);
      setAppEmail("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      {/* 1. Sticky Navbar */}
      <Navbar />

      {/* 2. Hot Deals Ticker */}
      <HotDealsTicker />

      {/* 3. Hero Section */}
      <HeroSection />

      {/* 4. Search Bar Row (Clean standalone Stripe/Shopify look) */}
      <section className="bg-brand-surface border-b border-brand-border py-6 px-4 relative z-20 shadow-sm animate-fade-in-up stagger-1">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3 bg-brand-bg p-2 rounded-xl shadow-lg border border-brand-border text-brand-text">
          {/* Location selector */}
          <div className="flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-brand-border flex-shrink-0 min-w-[160px] text-left">
            <MapPin className="w-4 h-4 text-brand-blue" />
            <Select value={locationSelect} onValueChange={setLocationSelect}>
              <SelectTrigger className="border-0 bg-transparent text-xs font-semibold cursor-pointer text-brand-text p-0 h-auto focus:ring-0 focus:ring-offset-0 gap-1.shadow-none w-full text-left justify-between [&>svg]:opacity-100">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="bg-brand-bg text-brand-text border-brand-border">
                <SelectItem value="All Locations">All Locations</SelectItem>
                <SelectItem value="Arrah">Arrah</SelectItem>
                <SelectItem value="Patna">Patna</SelectItem>
                <SelectItem value="Ranchi">Ranchi</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Online">Online/Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 flex-grow">
            <Search className="w-4 h-4 text-brand-subtext" />
            <Input
              type="text"
              placeholder="Search brands, products, food, travel, local stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="bg-transparent border-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-brand-text placeholder-brand-subtext font-medium p-0 h-auto shadow-none"
            />
          </div>

          {/* Action button */}
          <Button
            onClick={handleSearch}
            className="btn-primary py-2.5 px-6 text-xs whitespace-nowrap border-0 h-auto cursor-pointer shadow-none"
          >
            Find Discounts
          </Button>
        </div>
      </section>

      {/* 5. Location Prompt Bar (if user has no location saved) */}
      {isMounted && !city && (
        <div className="bg-[#FFF4D6] border-b border-[#FFB020]/20 py-2.5 px-4 text-center text-xs md:text-sm font-bold text-brand-navy flex items-center justify-center gap-2 relative z-20 animate-fade-in-up">
          <MapPin className="w-4 h-4 text-brand-warning fill-brand-warning/10" />
          <span>See deals near you — set your location to find verified local savings.</span>
          <button
            onClick={detectLocation}
            disabled={locationStatus === "detecting"}
            className="ml-2 bg-gradient-to-r from-[#FF7A18] to-[#FF3D77] text-white text-[10px] md:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {locationStatus === "detecting" ? "Detecting..." : "Set Location"}
          </button>
        </div>
      )}

      {/* 6. Category Strip */}
      <CategoryStrip />

      {/* 7. Flash Deals Section */}
      <section className="bg-[#0A2E6E] py-16 px-4 border-b border-white/5 text-white relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-[#FF3D77]/20 border border-[#FF3D77]/50 text-[#FF3D77] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit inline-block">
                ⚡ FLASH DEALS
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tight">
                Limited Time Offers
              </h2>
            </div>
            
            {/* Live Countdown Timer */}
            <CountdownTimer />
          </div>

          {/* Horizontally scrollable featured cards */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {initialCoupons.slice(0, 4).map((coupon) => (
              <div key={coupon._id} className="w-[300px] md:w-[320px] flex-shrink-0">
                <CouponCard
                  coupon={{ ...coupon, isHot: true }}
                  onRedeem={(c) => setSelectedCoupon(c)}
                  {...getCardProps(coupon)}
                />
              </div>
            ))}
            {initialCoupons.length === 0 && (
              <p className="text-slate-400 text-xs py-8">No flash deals active right now.</p>
            )}
          </div>
        </div>
      </section>

      {/* 8. Featured Deals (Live Database Coupons) */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full animate-fade-in-up stagger-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-heading text-brand-navy tracking-tight flex items-center gap-2">
              {isMounted && user ? (
                <>Your Personalised Deals, {user.name?.split(" ")[0]}</>
              ) : (
                <>Featured Deals Today</>
              )}
              {isMounted && savedInterests.length > 0 && (
                <span className="text-[10px] bg-brand-success/15 text-brand-success px-2 py-0.5 rounded-full font-bold border border-brand-success/20 animate-pulse">
                  Personalised
                </span>
              )}
            </h2>
            <p className="text-xs text-brand-subtext mt-1 font-medium">
              Top converting offers, verified by Vouchiqo community votes.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isMounted && user && (
              <button
                onClick={() => setIsPrefSheetOpen(true)}
                className="text-xs font-bold text-slate-500 hover:text-brand-blue flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Preferences</span>
              </button>
            )}
            <Link
              href="/deals"
              className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Location Tab Switcher */}
        {isMounted && city && (
          <div className="flex gap-2 border-b border-brand-border pb-3 mb-6">
            <button
              onClick={() => setFeedTab("near")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border flex items-center gap-1.5 cursor-pointer ${
                feedTab === "near"
                  ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                  : "bg-transparent border-brand-border text-brand-subtext hover:border-slate-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              Near {city}
            </button>
            <button
              onClick={() => setFeedTab("all")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border flex items-center gap-1.5 cursor-pointer ${
                feedTab === "all"
                  ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                  : "bg-transparent border-brand-border text-brand-subtext hover:border-slate-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              All India
            </button>
          </div>
        )}

        {/* Nudge for logged-in users with no preferences */}
        {isMounted && user && savedInterests.length === 0 && (
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 mb-6 flex items-center justify-between text-xs md:text-sm text-brand-navy">
            <span>Tell us what you like for a fully personalised deals feed.</span>
            <button
              onClick={() => setIsPrefSheetOpen(true)}
              className="text-xs font-black text-brand-blue underline hover:opacity-80"
            >
              Set Preferences
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalFeatured.map((coupon, idx) => (
            <div key={coupon._id} className={`animate-fade-in-up stagger-${idx + 1}`}>
              <CouponCard
                coupon={coupon}
                onRedeem={(c) => setSelectedCoupon(c)}
                {...getCardProps(coupon)}
              />
            </div>
          ))}
          {finalFeatured.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-brand-subtext font-medium bg-white rounded-xl border border-brand-border">
              No deals matching your filters are available. Try toggling All India.
            </div>
          )}
        </div>
      </section>

      {/* 9. Latest Added Deals Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full animate-fade-in-up stagger-3 border-t border-brand-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-heading text-brand-navy tracking-tight">
              Latest Added Deals
            </h2>
            <p className="text-xs text-brand-subtext mt-1 font-medium">
              Recently published active discount campaigns.
            </p>
          </div>
          <Link
            href="/deals?sortBy=createdAt"
            className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline"
          >
            <span>View All Latest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalLatest.map((coupon, idx) => (
            <div key={coupon._id} className={`animate-fade-in-up stagger-${idx + 1}`}>
              <CouponCard
                coupon={coupon}
                onRedeem={(c) => setSelectedCoupon(c)}
                {...getCardProps(coupon)}
              />
            </div>
          ))}
          {finalLatest.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-brand-subtext font-medium bg-white rounded-xl border border-brand-border">
              No recent coupons available at the moment. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* 10. Expired Coupon Revival Section */}
      <RevivalPromo />

      {/* 11. Nearby Deals — Real API, location-aware */}
      <NearbyDeals onRedeem={(c) => setSelectedCoupon(c)} />

      {/* 12. How It Works */}
      <HowItWorks />

      {/* 13. Trending Categories Grid (3x3 layout) */}
      <section className="py-16 bg-brand-bg border-t border-brand-border px-4 select-none">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black font-heading text-brand-navy tracking-tight">
              Browse by Trending Categories
            </h2>
            <p className="text-sm text-brand-subtext mt-2 font-medium">
              Find exactly what you want with our hand-vetted discount categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SYSTEM_CATEGORIES.slice(0, 9).map((cat, idx) => (
              <Link
                key={idx}
                href={`/deals?category=${cat.slug}`}
                className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-blue flex flex-col justify-between items-start transition-all hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <div>
                  <h4 className="font-bold text-brand-navy text-sm md:text-base group-hover:text-brand-blue transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] font-black text-brand-subtext uppercase tracking-wider block mt-1">
                    Discover Deals
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Trending Partner Brands Banner */}
      <PartnerBrands />

      {/* 15. Customer Testimonials */}
      <Testimonials />

      {/* 16. App Download Section (Coming Soon) */}
      <section className="bg-gradient-to-br from-[#1A3C5E] to-[#0A2E6E] py-16 px-4 border-b border-white/5 text-white overflow-hidden relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <Badge className="bg-white/10 text-brand-warning border-0 px-3 py-1 rounded-full text-xs font-bold w-fit animate-pulse">
              COMING SOON
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight leading-tight">
              The Vouchiqo App
              <br />
              <span className="text-brand-gradient">Instant Geolocation Savings.</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg font-medium">
              We are working on bringing Vouchiqo directly to your pocket. Set geofenced alarms for your local Ranchi/Jharkhand businesses, and never miss local verification updates.
            </p>

            {appSubscribed ? (
              <div className="flex items-center gap-2 text-brand-success font-bold text-sm bg-white/5 border border-white/10 w-fit px-4 py-2.5 rounded-xl animate-fade-in-scale">
                <CheckCircle2 className="w-4 h-4 fill-white/10" />
                <span>You will be notified on launch day!</span>
              </div>
            ) : (
              <form onSubmit={handleAppSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 text-xs h-10 focus:ring-1 focus:ring-brand-blue"
                />
                <Button
                  type="submit"
                  className="btn-primary py-2 px-6 text-xs whitespace-nowrap font-bold h-auto border-0 cursor-pointer shadow-none"
                >
                  Notify Me
                </Button>
              </form>
            )}
          </div>

          <div className="md:col-span-5 hidden md:flex justify-center select-none">
            <Smartphone className="w-64 h-64 text-slate-400/20 stroke-[0.5]" />
          </div>
        </div>
      </section>

      {/* 17. Merchant CTA */}
      <MerchantCTA />

      {/* 18. FAQ Section */}
      <FaqSection />

      {/* 19. Footer */}
      <Footer />

      {/* Confirmation/Claim Modal Overlay */}
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

      {/* Personalisation Preferences slide-in Sheet panel */}
      {isMounted && user && (
        <Sheet open={isPrefSheetOpen} onOpenChange={setIsPrefSheetOpen}>
          <SheetContent className="bg-brand-bg text-brand-text border-l border-brand-border w-[380px] p-6 space-y-6 overflow-y-auto z-[200]">
            <SheetHeader className="border-b border-brand-border pb-4">
              <SheetTitle className="text-xl font-bold font-heading text-brand-navy flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-error fill-brand-error/10" />
                <span>Verify Your Interests</span>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              <p className="text-xs text-brand-subtext font-medium leading-relaxed">
                Select your favorite shopping categories. Vouchiqo will elevate coupons matching your choices to the top of your homepage feed.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {SYSTEM_CATEGORIES.map((cat) => {
                  const isChecked = selectedInterests.includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        const next = isChecked
                          ? selectedInterests.filter((s) => s !== cat.slug)
                          : [...selectedInterests, cat.slug];
                        setSelectedInterests(next);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isChecked
                          ? "bg-brand-blue/5 border-brand-blue font-bold text-brand-blue"
                          : "border-brand-border hover:bg-brand-surface"
                      }`}
                    >
                      <span className="text-xs flex items-center gap-2">
                        <span className="text-lg">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? "bg-brand-blue border-brand-blue text-white" : "border-slate-300"
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              disabled={updatingPrefs}
              onClick={() => handleSaveInterests(selectedInterests)}
              className="btn-primary w-full py-2.5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none flex justify-center items-center gap-1.5"
            >
              {updatingPrefs ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Preferences...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </Button>
          </SheetContent>
        </Sheet>
      )}

      {/* Interest Capture Banner (for anonymous visitors) */}
      {isMounted && showInterestBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] bg-brand-bg border border-brand-border rounded-xl shadow-2xl p-6 z-[150] animate-fade-in-scale space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-brand-navy flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-warning fill-brand-warning/10" />
                <span>Personalise Your Savings</span>
              </h4>
              <p className="text-xs text-brand-subtext font-medium leading-tight">
                Select what you are shopping for today to unlock custom deals.
              </p>
            </div>
            <button
              onClick={handleDismissInterestsBanner}
              className="text-slate-400 hover:text-brand-navy p-1 rounded-full hover:bg-brand-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontally scrollable interest chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
            {SYSTEM_CATEGORIES.map((cat) => {
              const isSelected = selectedInterests.includes(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    const next = isSelected
                      ? selectedInterests.filter((s) => s !== cat.slug)
                      : [...selectedInterests, cat.slug];
                    setSelectedInterests(next);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-blue text-white border-brand-blue font-black shadow-sm"
                      : "bg-transparent border-brand-border text-brand-text hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-brand-border pt-4">
            <button
              onClick={handleDismissInterestsBanner}
              className="text-xs font-bold text-slate-500 hover:text-brand-navy cursor-pointer"
            >
              No thanks, show all
            </button>
            <Button
              onClick={() => handleSaveInterests(selectedInterests)}
              className="btn-primary py-2 px-5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none flex items-center gap-1"
            >
              Show Me Deals
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
