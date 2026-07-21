"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MOCK_BRANDS_SEED, POPULAR_BRANDS } from "@/lib/mock/mock-data";

const BRAND_TEMPLATES = {
  samsung: "from-blue-50 to-indigo-100",
  oneplus: "from-red-50 to-rose-100",
  adidas: "from-slate-50 to-zinc-200",
  lenovo: "from-cyan-50 to-sky-100",
  apple: "from-slate-100 to-slate-300",
  myntra: "from-pink-50 to-rose-100",
  puma: "from-amber-50 to-yellow-100",
  nike: "from-emerald-50 to-teal-100",
  starbucks: "from-green-50 to-emerald-100",
  lenskart: "from-orange-50 to-amber-100",
  croma: "from-blue-50 to-cyan-100",
  dominos: "from-blue-50 to-rose-100",
  "pizza-hut": "from-red-50 to-amber-100",
  kfc: "from-rose-50 to-red-100",
  mcdonalds: "from-yellow-50 to-red-100",
};

const BRAND_LETTER_GRADIENTS = [
  "from-pink-50 to-rose-100",
  "from-amber-50 to-orange-100",
  "from-blue-50 to-indigo-100",
  "from-fuchsia-50 to-pink-100",
  "from-sky-50 to-cyan-100",
  "from-orange-50 to-amber-100",
  "from-slate-50 to-zinc-200",
  "from-emerald-50 to-teal-100",
  "from-indigo-50 to-purple-100",
  "from-sky-50 to-yellow-100",
  "from-green-50 to-emerald-100",
  "from-teal-50 to-green-100",
];

function getBrandGradient(slug) {
  if (BRAND_TEMPLATES[slug]) return BRAND_TEMPLATES[slug];
  const hash = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return BRAND_LETTER_GRADIENTS[hash % BRAND_LETTER_GRADIENTS.length];
}

export default function BrandsClient({ brands, totalBrands, totalCoupons }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridCols, setGridCols] = useState(4); // 3, 4, or 5 columns view
  const [failedLogos, setFailedLogos] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) {
        setSearchQuery(query);
      }
    }
  }, []);

  // Combine database brands with mock brands
  const allMergedBrands = useMemo(() => {
    const dbFormatted = (brands || []).map((b) => {
      let brandLogo = b.logo;
      if (!brandLogo) {
        const mockMatch = MOCK_BRANDS_SEED.find(
          (m) =>
            m.slug === b.slug ||
            m.businessName.toLowerCase() === b.businessName.toLowerCase(),
        );
        brandLogo = mockMatch ? mockMatch.logo : "";
      }
      return {
        businessName: b.businessName,
        slug: b.slug,
        logo: brandLogo || "",
        coupons: b.totalCoupons || 1,
        offers: Math.ceil((b.totalCoupons || 1) * 0.7) + 2,
      };
    });

    const dbSlugs = new Set(dbFormatted.map((b) => b.slug));
    const mocks = MOCK_BRANDS_SEED.map((m, idx) => ({
      businessName: m.businessName,
      slug: m.slug,
      logo: m.logo || "",
      coupons: 1 + (idx % 3),
      offers: 8 + (idx % 15),
    })).filter((m) => !dbSlugs.has(m.slug));

    return [...dbFormatted, ...mocks];
  }, [brands]);

  // Filter brands by search
  const filteredBrandsList = useMemo(() => {
    let list = allMergedBrands;
    if (searchQuery.trim()) {
      list = list.filter((b) =>
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [allMergedBrands, searchQuery]);

  const totalOffersCount = (totalCoupons || 0) + 1200;

  // CSS template columns classes depending on gridCols configuration
  const gridColClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
  };

  return (
    <main className="w-full bg-[#f8fafc] min-h-[80vh] pb-16 font-sans">
      {/* ── BREADCRUMB ── */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="w-full px-4 md:px-8 py-3.5 flex gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Brands</span>
        </div>
      </div>

      {/* ── MAIN CONTENT WITH RESPONSIVE GRID ── */}
      <div className="w-full px-4 md:px-8 pt-3.5 pb-8 flex flex-col gap-6">
        {/* Popular Brands Section */}
        <section className="w-full">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {POPULAR_BRANDS.map((brand) => (
              <Link key={brand.businessName} href={`/brand/${brand.slug}`}>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div
                    className={`h-24 flex items-center justify-center p-4 bg-gradient-to-br ${getBrandGradient(
                      brand.slug,
                    )} relative overflow-hidden border-b border-slate-200`}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                    {brand.logo && !failedLogos[brand.slug] ? (
                      <img
                        src={brand.logo}
                        alt={brand.businessName}
                        className="max-h-full max-w-full object-contain relative z-10"
                        onError={() => {
                          setFailedLogos((prev) => ({
                            ...prev,
                            [brand.slug]: true,
                          }));
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-white/95 text-blue-600 font-extrabold flex items-center justify-center text-base relative z-10 shadow-xs">
                        {brand.businessName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50/50 p-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {brand.businessName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      {brand.coupons} Coupons • {brand.offers} Offers
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Brands Section */}
        <section className="w-full">
          {/* Title Bar + Search Box + Column Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              All Brands
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Search Box */}
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white w-full sm:max-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  placeholder="Search by brand name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-xs text-slate-900 placeholder-slate-450 outline-none w-full"
                />
              </div>

              {/* Column Switcher (Desktop only) */}
              <div className="hidden lg:flex gap-1.5 items-center shrink-0">
                {[3, 4, 5].map((cols) => {
                  const isActive = gridCols === cols;
                  return (
                    <button
                      key={cols}
                      onClick={() => setGridCols(cols)}
                      title={`${cols} Columns View`}
                      className={`h-8 px-2.5 rounded-lg border text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {"|".repeat(cols)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid display */}
          {filteredBrandsList.length > 0 ? (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${
                gridColClasses[gridCols] || "lg:grid-cols-4"
              } gap-4`}
            >
              {filteredBrandsList.map((brand) => (
                <Link key={brand.slug} href={`/brand/${brand.slug}`}>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div
                      className={`h-20 w-full relative overflow-hidden bg-gradient-to-br ${getBrandGradient(
                        brand.slug,
                      )} flex items-center justify-center p-3 border-b border-slate-200`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                      {brand.logo && !failedLogos[brand.slug] ? (
                        <img
                          src={brand.logo}
                          alt={brand.businessName}
                          className="max-h-full max-w-full object-contain relative z-10"
                          onError={() => {
                            setFailedLogos((prev) => ({
                              ...prev,
                              [brand.slug]: true,
                            }));
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/95 text-blue-600 font-extrabold flex items-center justify-center text-xs relative z-10 shadow-xs">
                          {brand.businessName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-center text-center">
                      <p className="text-xs font-bold text-slate-800 truncate w-full">
                        {brand.businessName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center">
              <p className="text-xs">
                No brands found matching &quot;{searchQuery}&quot;
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
