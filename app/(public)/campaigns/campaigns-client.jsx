"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ALL_FESTIVALS, POPULAR_FESTIVALS } from "@/lib/mock/mock-data";

const HERO_CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Diwali Festive Bonanza",
    subtitle: "Celebrate with up to 60% off at top local stores",
    badge: "Limited Time Offer",
    gradient: "from-amber-600 via-orange-600 to-red-700",
    buttonText: "Claim Diwali Offers",
    bgPattern:
      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
  {
    id: 2,
    title: "Independence Day Carnival",
    subtitle: "Freedom to save big with verified local discounts",
    badge: "Grand Festive Deals",
    gradient: "from-indigo-950 via-slate-900 to-emerald-950",
    buttonText: "Explore Freedom Sales",
    bgPattern:
      "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 60%)",
  },
  {
    id: 3,
    title: "New Year Shopping Fest",
    subtitle: "Start your year with maximum savings on fashion & beauty",
    badge: "New Year Special",
    gradient: "from-fuchsia-600 via-purple-700 to-indigo-800",
    buttonText: "Browse New Year Deals",
    bgPattern:
      "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.2) 0%, transparent 70%)",
  },
];

const FESTIVAL_TEMPLATES = {
  diwali: "from-amber-50 to-orange-100",
  christmas: "from-red-50 to-rose-100",
  eid: "from-emerald-50 to-green-100",
  "new-year": "from-fuchsia-50 to-purple-100",
  "independence-day": "from-sky-50 to-indigo-100",
  "republic-day": "from-blue-50 to-cyan-100",
  "raksha-bandhan": "from-pink-50 to-rose-100",
  holi: "from-pink-50 via-purple-50 to-teal-50",
  dussehra: "from-amber-50 to-yellow-100",
  "gandhi-jayanti": "from-slate-50 to-slate-200",
  janmashtami: "from-sky-50 to-blue-100",
  "ganesh-chaturthi": "from-yellow-50 to-orange-100",
  pongal: "from-green-50 to-yellow-100",
  onam: "from-emerald-50 to-amber-100",
  navratri: "from-orange-50 to-rose-100",
  "black-friday": "from-zinc-100 to-zinc-300",
  "cyber-monday": "from-slate-100 to-slate-300",
  halloween: "from-orange-50 to-amber-200",
  "valentines-day": "from-rose-50 to-pink-100",
  "mothers-day": "from-pink-50 to-fuchsia-100",
  "fathers-day": "from-sky-50 to-blue-100",
  "friendship-day": "from-yellow-50 to-amber-100",
  "amazon-prime-day": "from-cyan-50 to-blue-100",
  "flipkart-big-billion-days": "from-blue-50 to-yellow-100",
  "myntra-fashion-sale": "from-rose-50 to-purple-100",
  "summer-sale": "from-amber-50 to-yellow-100",
  "winter-sale": "from-sky-50 to-blue-100",
};

function getFestivalGradient(slug) {
  return FESTIVAL_TEMPLATES[slug] || "from-blue-50 to-indigo-100";
}

export default function CampaignsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutType, setLayoutType] = useState("wide"); // 'compact' or 'wide'
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play interval for hero carousel (5s loop)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredFestivals = useMemo(() => {
    let list = ALL_FESTIVALS;
    if (searchQuery.trim()) {
      list = list.filter((f) =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [searchQuery]);

  return (
    <main className="w-full bg-[#f8fafc] min-h-[80vh] pb-16 font-sans">
      {/* ── BREADCRUMB ── */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="w-full px-4 md:px-8 py-3.5 flex gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Festival Offers</span>
        </div>
      </div>

      {/* ── HERO BANNER CAROUSEL ── */}
      <div className="w-full border-b border-slate-200">
        <div className="w-full h-44 sm:h-56 md:h-64 overflow-hidden relative bg-slate-900">
          {HERO_CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full bg-gradient-to-r ${
                  slide.gradient
                } transition-opacity duration-500 ease-in-out flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  backgroundImage: slide.bgPattern
                    ? `${slide.bgPattern}, linear-gradient(to right, var(--tw-gradient-stops))`
                    : undefined,
                }}
              >
                <div className="max-w-2xl flex flex-col gap-2">
                  <span className="self-start px-2.5 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                    {slide.badge}
                  </span>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-semibold">
                    {slide.subtitle}
                  </p>
                  <button className="self-start mt-2 px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Dots navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {HERO_CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="w-full px-4 md:px-8 pt-3.5 pb-8 flex flex-col gap-6">
        {/* Popular Festival Offers Grid */}
        <section className="w-full">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
            Popular Festival Offers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {POPULAR_FESTIVALS.map((fest) => {
              const totalOffers = (fest.coupons || 0) + (fest.offers || 0);
              return (
                <Link key={fest.title} href={`/category/${fest.slug}`}>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div
                      className={`h-24 flex items-center justify-center p-4 bg-gradient-to-br ${getFestivalGradient(
                        fest.slug,
                      )} relative overflow-hidden border-b border-slate-200`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                      <img
                        src={fest.image}
                        alt={fest.title}
                        className="max-h-full max-w-full object-contain relative z-10"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Cpath d='M20 12V22H4V12'/%3E%3Cpath d='M22 7H2v5h20V7z'/%3E%3Cpath d='M12 22V7'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="bg-slate-50/50 p-3 flex-1 flex flex-col justify-between text-center">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {fest.title}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">
                        {totalOffers} Active Offers
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Festival Offers Section */}
        <section className="w-full">
          {/* Title Bar + Search Box + Compact/Wide View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              All Festival Offers
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Search Box */}
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white w-full sm:max-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  placeholder="Search festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-xs text-slate-900 placeholder-slate-450 outline-none w-full"
                />
              </div>

              {/* View Layout Switcher */}
              <div className="flex gap-1.5 items-center shrink-0">
                <button
                  onClick={() => setLayoutType("compact")}
                  title="Compact View"
                  className={`h-8 px-2.5 rounded-lg border text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                    layoutType === "compact"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  ||
                </button>
                <button
                  onClick={() => setLayoutType("wide")}
                  title="Wide View"
                  className={`h-8 px-2.5 rounded-lg border text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                    layoutType === "wide"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  |||
                </button>
              </div>
            </div>
          </div>

          {/* Grid display */}
          {filteredFestivals.length > 0 ? (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 ${
                layoutType === "compact"
                  ? "md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  : "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              } gap-4`}
            >
              {filteredFestivals.map((fest) => (
                <Link key={fest.slug} href={`/category/${fest.slug}`}>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div
                      className={`h-20 w-full relative overflow-hidden bg-gradient-to-br ${getFestivalGradient(
                        fest.slug,
                      )} flex items-center justify-center p-3 border-b border-slate-200`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                      <img
                        src={fest.image}
                        alt={fest.title}
                        className="max-h-full max-w-full object-contain relative z-10"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Cpath d='M20 12V22H4V12'/%3E%3Cpath d='M22 7H2v5h20V7z'/%3E%3Cpath d='M12 22V7'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-center text-center">
                      <p className="text-xs font-bold text-slate-800 truncate w-full">
                        {fest.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center">
              <p className="text-xs">
                No festival offers found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
