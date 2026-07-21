"use client";

import {
  Baby,
  Car,
  CreditCard,
  Dumbbell,
  Flower2,
  Gamepad2,
  Gem,
  Gift,
  GraduationCap,
  Hammer,
  Home,
  LayoutGrid,
  MapPin,
  Plane,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Store,
  Tag,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { POPULAR_CATEGORIES } from "@/lib/mock/mock-data";

const SIDEBAR_ICONS = {
  Categories: LayoutGrid,
  Stores: Store,
  Brands: Tag,
  Festivals: Gift,
  "Cities Deals": MapPin,
};

function SidebarIcon({ label, isActive }) {
  const IconComponent = SIDEBAR_ICONS[label] || Tag;
  return (
    <IconComponent
      className={`w-4 h-4 shrink-0 transition-colors ${
        isActive ? "text-white" : "text-slate-500"
      }`}
    />
  );
}

// Category Lucide Icon components and premium accent colors (blue theme compatibility)
const CATEGORY_ICONS = {
  fashion: {
    Icon: Shirt,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-pink-50 to-rose-100",
  },
  food: {
    Icon: Utensils,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-amber-50 to-orange-100",
  },
  electronics: {
    Icon: Smartphone,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-blue-50 to-cyan-100",
  },
  beauty: {
    Icon: Flower2,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-purple-50 to-pink-100",
  },
  travel: {
    Icon: Plane,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-sky-50 to-teal-100",
  },
  home: {
    Icon: Home,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-stone-50 to-amber-100",
  },
  "home-improvement": {
    Icon: Hammer,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-slate-50 to-zinc-200",
  },
  fitness: {
    Icon: Dumbbell,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-emerald-50 to-teal-100",
  },
  education: {
    Icon: GraduationCap,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-indigo-50 to-purple-100",
  },
  "kids-baby": {
    Icon: Baby,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-sky-50 to-yellow-100",
  },
  jewellery: {
    Icon: Gem,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-amber-50 to-yellow-200",
  },
  automotive: {
    Icon: Car,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-slate-100 to-slate-200",
  },
  entertainment: {
    Icon: Gamepad2,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-fuchsia-50 to-indigo-100",
  },
  grocery: {
    Icon: ShoppingCart,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-green-50 to-emerald-100",
  },
  finance: {
    Icon: CreditCard,
    bg: "#eff6ff",
    color: "#2563eb",
    gradient: "from-teal-50 to-green-100",
  },
};

function getCategoryIcon(slug) {
  return (
    CATEGORY_ICONS[slug] || {
      Icon: Tag,
      bg: "#eff6ff",
      color: "#2563eb",
      gradient: "from-blue-50 to-indigo-100",
    }
  );
}

const CATEGORY_DESCRIPTIONS = {
  fashion: "Apparel, ethnic wear, western wear, footwear, bags",
  food: "Restaurants, cafes, cloud kitchens, bakeries, street food, delivery",
  electronics: "Mobiles, laptops, accessories, repairs, smart devices",
  beauty: "Salons, spas, skincare, cosmetics, personal care",
  travel: "Hotels, travel agencies, tour operators, car rentals",
  home: "Furniture, décor, kitchenware, soft furnishings, household goods",
  "home-improvement":
    "Tiles, sanitary, granite, hardware, paints, electrical fittings",
  fitness: "Gyms, clinics, pharmacies, diagnostic labs, yoga studios",
  education: "Coaching institutes, e-learning, skill development, workshops",
  "kids-baby": "Toys, clothing, learning kits, baby care, nursery",
  jewellery: "Gold, silver, artificial jewellery, watches, sunglasses",
  automotive: "Car service, accessories, tyres, car wash, shops",
  entertainment: "Gaming peripherals, gaming cafés, events, experiences",
  grocery: "Kirana digital, organic food, specialty grocery, dairy, dry fruits",
  finance: "Insurance, loans, mutual funds, credit cards, tax services",
};

function getCategoryDescription(slug) {
  return (
    CATEGORY_DESCRIPTIONS[slug] ||
    "Verified local store offers and discount codes"
  );
}

export default function CategoriesClient({
  categories,
  totalCategories,
  totalCoupons,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    let list = categories;
    if (searchQuery.trim()) {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [categories, searchQuery]);

  return (
    <main className="w-full bg-[#f8fafc] min-h-[80vh] pb-16 font-sans">
      {/* ── BREADCRUMB ── */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="w-full px-4 md:px-8 py-3.5 flex gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Categories</span>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="w-full px-4 md:px-8 pt-3.5 pb-8 flex flex-col gap-6">
        {/* Popular Categories Grid */}
        <section className="w-full">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {POPULAR_CATEGORIES.map((cat) => {
              const { Icon, gradient } = getCategoryIcon(cat.slug);
              return (
                <Link key={cat.title} href={`/category/${cat.slug}`}>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div
                      className={`h-20 w-full relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center border-b border-slate-200`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                      <div className="w-10 h-10 rounded-lg bg-white/90 shadow-xs flex items-center justify-center relative z-10 backdrop-blur-xs">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between text-center">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {cat.title}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-2">
                        {cat.offersCount}+ Offers
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Categories Grid */}
        <section className="w-full">
          {/* Title Bar + Search Box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              All Categories
            </h2>

            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white w-full sm:max-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-xs text-slate-900 placeholder-slate-450 outline-none w-full"
              />
            </div>
          </div>

          {/* Grid list */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCategories.map((cat) => {
                const { Icon, gradient } = getCategoryIcon(cat.slug);
                return (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div
                        className={`h-20 w-full relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center border-b border-slate-200`}
                      >
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                        <div className="w-10 h-10 rounded-lg bg-white/90 shadow-xs flex items-center justify-center relative z-10 backdrop-blur-xs">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between text-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800 truncate w-full">
                            {cat.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed hidden sm:line-clamp-2">
                            {getCategoryDescription(cat.slug)}
                          </p>
                        </div>
                        <p className="text-[10px] text-blue-600 font-bold mt-2">
                          {cat.total > 0
                            ? `${cat.total} Offers`
                            : "Offers Available"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center">
              <p className="text-xs">
                No categories found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery("")}
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
