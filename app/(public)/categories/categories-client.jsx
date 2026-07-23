"use client";

import {
  Baby,
  Car,
  CreditCard,
  Dumbbell,
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
  Sparkles,
  Store,
  Tag,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DirectoryLayout from "@/components/layout/DirectoryLayout";
import { POPULAR_CATEGORIES } from "@/lib/mock/mock-data";
import { POPULAR_MERCHANTS_SIDEBAR } from "@/utils/shared-navigation";

const SIDEBAR_ICONS = {
  Categories: LayoutGrid,
  Stores: Store,
  Brands: Tag,
  Festivals: Gift,
  "Cities Deals": MapPin,
};

function getSidebarIcon(label, isActive) {
  const IconComponent = SIDEBAR_ICONS[label] || Tag;
  return (
    <IconComponent
      style={{
        width: 16,
        height: 16,
        color: isActive ? "#ffffff" : "#4b5563",
        flexShrink: 0,
      }}
    />
  );
}

// Category Lucide Icon components and premium accent colors (blue/black theme compatibility)
const CATEGORY_ICONS = {
  fashion: { Icon: Shirt, bg: "#eff6ff", color: "#2563eb" },
  food: { Icon: Utensils, bg: "#eff6ff", color: "#2563eb" },
  electronics: { Icon: Smartphone, bg: "#eff6ff", color: "#2563eb" },
  beauty: { Icon: Sparkles, bg: "#eff6ff", color: "#2563eb" },
  travel: { Icon: Plane, bg: "#eff6ff", color: "#2563eb" },
  home: { Icon: Home, bg: "#eff6ff", color: "#2563eb" },
  "home-improvement": { Icon: Hammer, bg: "#eff6ff", color: "#2563eb" },
  fitness: { Icon: Dumbbell, bg: "#eff6ff", color: "#2563eb" },
  education: { Icon: GraduationCap, bg: "#eff6ff", color: "#2563eb" },
  "kids-baby": { Icon: Baby, bg: "#eff6ff", color: "#2563eb" },
  jewellery: { Icon: Gem, bg: "#eff6ff", color: "#2563eb" },
  automotive: { Icon: Car, bg: "#eff6ff", color: "#2563eb" },
  entertainment: { Icon: Gamepad2, bg: "#eff6ff", color: "#2563eb" },
  grocery: { Icon: ShoppingCart, bg: "#eff6ff", color: "#2563eb" },
  finance: { Icon: CreditCard, bg: "#eff6ff", color: "#2563eb" },
};

function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || { Icon: Tag, bg: "#eff6ff", color: "#2563eb" };
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
  const [showAllMerchants, setShowAllMerchants] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = useMemo(() => {
    if (!mounted) return "";
    return new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  }, [mounted]);

  const filteredCategories = useMemo(() => {
    let list = categories;
    if (searchQuery.trim()) {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [categories, searchQuery]);

  const visibleSidebarMerchants = showAllMerchants
    ? POPULAR_MERCHANTS_SIDEBAR
    : POPULAR_MERCHANTS_SIDEBAR.slice(0, 8);

  return (
    <DirectoryLayout
      activeKey="Categories"
      title="Categories"
      icon={LayoutGrid}
      stat1={{
        count: totalCategories || 172,
        label: "Total Categories",
        shortLabel: "Categories",
      }}
      stat2={{
        count: ((totalCoupons || 0) + 98142).toLocaleString(),
        label: "Total Coupons & Offers",
      }}
      aboutTitle="About Categories"
      aboutText="If there's a deal out there, we've already found it. Vouchiqo brings you verified offers across fashion, electronics, food, travel, beauty and more — all from real physical stores near you."
    >
      {/* Popular Categories */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "16px 20px 20px",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#000000",
            marginBottom: 16,
            letterSpacing: "-0.2px",
          }}
        >
          Popular Categories
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          {POPULAR_CATEGORIES.map((cat) => {
            const { Icon, bg, color } = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    background: "#ffffff",
                    padding: "16px 10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease-in-out",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    textAlign: "center",
                    height: "100%",
                  }}
                  className="brand-card-hover"
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bg,
                      borderRadius: 8,
                    }}
                  >
                    <Icon style={{ width: 24, height: 24, color: color }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#000000",
                        margin: "0 0 3px",
                      }}
                    >
                      {cat.title}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: color,
                        fontWeight: 600,
                        margin: "0 0 4px",
                      }}
                    >
                      {(cat.coupons || 0) + (cat.offers || 0)} Offers
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {getCategoryDescription(cat.slug)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Categories */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "16px 20px 20px",
        }}
      >
        {/* All Categories Header: Title + Search aligned on right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
            paddingBottom: 14,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                letterSpacing: "-0.2px",
              }}
            >
              All Categories
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#2563eb",
                background: "#eff6ff",
                padding: "3px 10px",
                borderRadius: 12,
                border: "1px solid #dbeafe",
              }}
            >
              {filteredCategories.length} Categories
            </span>
          </div>

          {/* Search Box on Right Side of Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "6px 12px",
              background: "#ffffff",
              minWidth: 240,
            }}
          >
            <Search style={{ width: 14, height: 14, color: "#9ca3af" }} />
            <input
              placeholder="Search by category name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 12,
                color: "#000000",
                outline: "none",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* All Categories Evenly Aligned 3-Column Grid */}
        {filteredCategories.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {filteredCategories.map((cat) => {
              const { Icon, bg, color } = getCategoryIcon(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      background: "#ffffff",
                      padding: "16px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                      textAlign: "center",
                      height: "100%",
                    }}
                    className="brand-card-hover"
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: bg,
                        borderRadius: 8,
                      }}
                    >
                      <Icon style={{ width: 22, height: 22, color: color }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#000000",
                          margin: "0 0 3px",
                        }}
                      >
                        {cat.title}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: color,
                          fontWeight: 600,
                          margin: "0 0 4px",
                        }}
                      >
                        {cat.total > 0
                          ? `${cat.total} Offers`
                          : "Offers Available"}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#6b7280",
                          margin: 0,
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {getCategoryDescription(cat.slug)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "#9ca3af",
            }}
          >
            <p style={{ fontSize: 13 }}>
              No categories found for &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              style={{
                marginTop: 12,
                padding: "6px 12px",
                borderRadius: 4,
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Clear Filter
            </button>
          </div>
        )}
      </section>
    </DirectoryLayout>
  );
}
