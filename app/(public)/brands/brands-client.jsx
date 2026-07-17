"use client";

import {
  CheckCircle2,
  ChevronRight,
  Gift,
  Grid,
  Info,
  LayoutGrid,
  MapPin,
  Search,
  Store,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MOCK_BRANDS_SEED, POPULAR_BRANDS } from "@/lib/mock/mock-data";
import {
  ALPHA_LETTERS,
  POPULAR_MERCHANTS_SIDEBAR,
  SIDEBAR_NAV,
} from "@/utils/shared-navigation";

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

export default function BrandsClient({ brands, totalBrands, totalCoupons }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState("all");
  const [gridCols, setGridCols] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [showAllMerchants, setShowAllMerchants] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [failedLogos, setFailedLogos] = useState({});

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) {
        setSearchQuery(query);
        setActiveLetter("all");
      }
    }
  }, []);

  // Combine database brands with mock brands
  const allMergedBrands = useMemo(() => {
    const dbFormatted = brands.map((b, idx) => {
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
        logo: brandLogo || `/brandlogos/${10002 + (idx % 42)}.jpg`,
        coupons: b.totalCoupons || 4,
        offers: Math.ceil((b.totalCoupons || 4) * 0.7) + 2,
      };
    });

    const dbSlugs = new Set(dbFormatted.map((b) => b.slug));
    const mocks = MOCK_BRANDS_SEED.map((m, idx) => ({
      businessName: m.businessName,
      slug: m.slug,
      logo:
        m.logo ||
        `/brandlogos/${10002 + ((idx + dbFormatted.length) % 42)}.jpg`,
      coupons: 12 + (idx % 25),
      offers: 8 + (idx % 15),
    })).filter((m) => !dbSlugs.has(m.slug));

    return [...dbFormatted, ...mocks];
  }, [brands]);

  // Filter brands by search + letter
  const filteredBrandsList = useMemo(() => {
    let list = allMergedBrands;
    if (activeLetter !== "all") {
      list = list.filter((b) =>
        b.businessName.toUpperCase().startsWith(activeLetter),
      );
    }
    if (searchQuery.trim()) {
      list = list.filter((b) =>
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [allMergedBrands, activeLetter, searchQuery]);

  // Available letters
  const availableLetters = useMemo(() => {
    const set = new Set(
      allMergedBrands.map((b) => b.businessName[0].toUpperCase()),
    );
    return set;
  }, [allMergedBrands]);

  const formattedDate = useMemo(() => {
    if (!mounted) return "";
    return new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  }, [mounted]);

  const visibleMerchants = showAllMerchants
    ? POPULAR_MERCHANTS_SIDEBAR
    : POPULAR_MERCHANTS_SIDEBAR.slice(0, 8);

  const totalOffersCount = totalCoupons + 340;

  return (
    <main
      style={{
        background: "#ffffff",
        minHeight: "80vh",
        paddingBottom: 60,
        width: "100%",
      }}
    >
      {/* ── BREADCRUMB (Full Width Container) ── */}
      <div style={{ borderBottom: "1px solid #f3f4f6", background: "#ffffff" }}>
        <div
          style={{
            width: "100%",
            padding: "12px 24px",
            display: "flex",
            gap: 8,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          <span style={{ color: "#9ca3af" }}>/</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>Brands</span>
        </div>
      </div>

      {/* ── PAGE HEADER (Full Width Hero-Stats Section) ── */}
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            width: "100%",
          }}
        >
          {/* Header left group */}
          <div
            className="brands-header-left-group"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Title Section */}
            <div
              className="brands-header-title-section"
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 4,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #dbeafe",
                  flexShrink: 0,
                }}
              >
                <Tag style={{ width: 20, height: 20, color: "#2563eb" }} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#000000",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Brands
                </h1>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                  Browse top brands with verified offers
                </p>
              </div>
            </div>

            {/* Quick Stats Blocks */}
            <div
              className="brands-header-stats-section"
              style={{
                display: "flex",
                gap: 24,
                marginLeft: 24,
                paddingLeft: 24,
                borderLeft: "1px solid #e5e7eb",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#000000",
                    margin: 0,
                  }}
                >
                  {totalBrands + 24}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Total Brands
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#000000",
                    margin: 0,
                  }}
                >
                  {totalOffersCount.toLocaleString()}+
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Total Offers
                </p>
              </div>
            </div>
          </div>

          {/* Header right: Verification */}
          {formattedDate && (
            <div
              className="brands-header-verified-section"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f8fafc",
                padding: "6px 12px",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
              }}
            >
              <CheckCircle2
                style={{ width: 14, height: 14, color: "#2563eb" }}
              />
              <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 600 }}>
                Verified On: {formattedDate}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── TWO-COLUMN CONTENT GRID (Full Width Layout) ── */}
      <div
        style={{
          width: "100%",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 24,
          alignItems: "start",
        }}
        className="brand-grid-layout"
      >
        {/* ── SIDEBAR (Left Column) ── */}
        <aside className="brand-sidebar" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Navigation Links */}
          <div
            className="sidebar-nav-links"
            style={{
              background: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {SIDEBAR_NAV.map((nav) => {
              const isActive = nav.label === "Brands";
              return (
                <Link
                  key={nav.label}
                  href={nav.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    textDecoration: "none",
                    background: isActive ? "#2563eb" : "transparent",
                    color: isActive ? "#ffffff" : "#1f2937",
                    fontSize: 13,
                    fontWeight: 600,
                    borderBottom: "1px solid #f3f4f6",
                    transition: "all 0.2s",
                  }}
                  className={isActive ? "" : "sidebar-item-hover"}
                >
                  {getSidebarIcon(nav.label, isActive)}
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </div>

          {/* About Section */}
          <div
            className="sidebar-about-card"
            style={{
              background: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 10px 0",
                paddingBottom: 6,
                borderBottom: "2px solid #2563eb",
                display: "inline-block",
              }}
            >
              About Brands
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "#4b5563",
                lineHeight: 1.6,
                margin: 0,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: showMoreAbout ? "unset" : 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              Brand loyalty doesn&apos;t have to mean paying full price. At
              Vouchiqo, we bring you the best discounts on the top names in
              fashion, electronics, and everything in between. Discover verified
              promo codes and active offers.
            </p>
            <button
              onClick={() => setShowMoreAbout((v) => !v)}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: "6px 0 0",
                display: "block",
              }}
            >
              {showMoreAbout ? "Show Less" : "Read More"}
            </button>
          </div>

          {/* Popular Stores / Merchants */}
          <div
            className="sidebar-popular-card"
            style={{
              background: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              padding: "16px",
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 10px 0",
                paddingBottom: 6,
                borderBottom: "2px solid #2563eb",
                display: "inline-block",
              }}
            >
              Popular Brands
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {visibleMerchants.map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "color 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className="sidebar-link-item"
                >
                  <span>{m.label}</span>
                  <ChevronRight
                    style={{ width: 12, height: 12, color: "#9ca3af" }}
                  />
                </Link>
              ))}
            </div>
            <button
              onClick={() => setShowAllMerchants((v) => !v)}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: "8px 0 0",
                marginTop: 4,
                display: "block",
              }}
            >
              {showAllMerchants ? "See less" : "See more"}
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA (Right Column) ── */}
        <div className="brand-main-content" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── POPULAR BRANDS SECTION ── */}
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
              Popular Brands
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {POPULAR_BRANDS.map((brand) => {
                const totalOffers = brand.coupons + brand.offers;
                return (
                  <Link
                    key={brand.businessName}
                    href={`/brand/${brand.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        background: "#ffffff",
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                      }}
                      className="brand-card-hover"
                    >
                      <div
                        style={{
                          height: 75,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#ffffff",
                        }}
                      >
                        {brand.logo && !failedLogos[brand.slug] ? (
                          <img
                            src={brand.logo}
                            alt={brand.businessName}
                            style={{
                              maxHeight: "85%",
                              maxWidth: "85%",
                              objectFit: "contain",
                            }}
                            onError={() => {
                              setFailedLogos((prev) => ({ ...prev, [brand.slug]: true }));
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm border border-blue-100 uppercase">
                            {brand.businessName?.[0]}
                          </div>
                        )}
                      </div>
                      <div style={{ height: 1, background: "#f3f4f6" }} />
                      <div style={{ textAlign: "center" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#000000",
                            margin: "0 0 2px 0",
                          }}
                        >
                          {brand.businessName}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#2563eb",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {totalOffers} Active Offers
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── ALL BRANDS SECTION ── */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              padding: "16px 20px 20px",
            }}
          >
            {/* Header section with toggle and title */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#000000",
                  margin: 0,
                  letterSpacing: "-0.2px",
                }}
              >
                All Brands
              </h2>

              {/* Compact Grid Column Selector */}
              <div style={{ display: "flex", gap: 4 }}>
                {[3, 4, 5].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    title={`${cols} Columns`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 4,
                      border: "1px solid #e5e7eb",
                      background: gridCols === cols ? "#2563eb" : "#ffffff",
                      color: gridCols === cols ? "#ffffff" : "#4b5563",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    className={gridCols === cols ? "" : "grid-btn-hover"}
                  >
                    <LayoutGrid style={{ width: 14, height: 14 }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Alphabetical filter row & Search field */}
            <div
              className="alpha-search-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              {/* Alpha list */}
              <div
                className="alpha-list-wrapper"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <button
                  onClick={() => setActiveLetter("all")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: activeLetter === "all" ? "#2563eb" : "#e5e7eb",
                    background:
                      activeLetter === "all" ? "#2563eb" : "transparent",
                    color: activeLetter === "all" ? "#ffffff" : "#4b5563",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  All
                </button>
                {ALPHA_LETTERS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() =>
                      setActiveLetter(activeLetter === letter ? "all" : letter)
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor:
                        activeLetter === letter ? "#2563eb" : "#e5e7eb",
                      background:
                        activeLetter === letter ? "#2563eb" : "transparent",
                      color: activeLetter === letter ? "#ffffff" : "#1f2937",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Compact Search box */}
              <div
                className="search-box-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  padding: "5px 10px",
                  background: "#ffffff",
                  minWidth: 200,
                }}
              >
                <Search style={{ width: 14, height: 14, color: "#9ca3af" }} />
                <input
                  placeholder="Search by brands name"
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

            {/* List grid */}
            {filteredBrandsList.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                  gap: "12px",
                }}
                className="all-brands-responsive-grid"
              >
                {filteredBrandsList.map((brand) => {
                  const totalOffers = brand.coupons + brand.offers;
                  return (
                    <Link
                      key={brand.slug}
                      href={`/brand/${brand.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 6,
                          background: "#ffffff",
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          transition: "all 0.2s ease-in-out",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        }}
                        className="brand-card-hover"
                      >
                        <div
                          style={{
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ffffff",
                          }}
                        >
                          {brand.logo && !failedLogos[brand.slug] ? (
                            <img
                              src={brand.logo}
                              alt={brand.businessName}
                              style={{
                                maxHeight: "85%",
                                maxWidth: "85%",
                                objectFit: "contain",
                              }}
                              onError={() => {
                                setFailedLogos((prev) => ({ ...prev, [brand.slug]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm border border-blue-100 uppercase">
                              {brand.businessName?.[0]}
                            </div>
                          )}
                        </div>
                        <div style={{ height: 1, background: "#f3f4f6" }} />
                        <div style={{ textAlign: "center" }}>
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#000000",
                              margin: "0 0 1px 0",
                            }}
                          >
                            {brand.businessName}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "#2563eb",
                              fontWeight: 600,
                              margin: 0,
                            }}
                          >
                            {totalOffers} Offers
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
                  No brands found for &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveLetter("all");
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
        </div>
      </div>

      <style>{`
        .sidebar-item-hover:hover {
          background: #f8fafc !important;
          color: #2563eb !important;
        }
        .sidebar-link-item:hover {
          color: #2563eb !important;
        }
        .brand-card-hover:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          border-color: #2563eb !important;
          transform: translateY(-1px);
        }
        .grid-btn-hover:hover {
          background: #f8fafc !important;
          color: #2563eb !important;
          border-color: #2563eb !important;
        }
        @media (max-width: 900px) {
          .brand-grid-layout {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .brand-sidebar {
            display: contents !important;
          }
          .sidebar-nav-links {
            order: 1 !important;
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            width: 100% !important;
            background: #ffffff !important;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            padding: 4px !important;
            gap: 8px !important;
            scrollbar-width: none !important;
          }
          .sidebar-nav-links::-webkit-scrollbar {
            display: none !important;
          }
          .sidebar-nav-links a {
            flex: 1 0 auto !important;
            padding: 8px 16px !important;
            border-bottom: none !important;
            border-radius: 4px !important;
            justify-content: center !important;
          }
          .brand-main-content {
            order: 2 !important;
            width: 100% !important;
          }
          .sidebar-about-card {
            order: 3 !important;
            width: 100% !important;
          }
          .sidebar-popular-card {
            order: 4 !important;
            width: 100% !important;
          }
        }
        @media (max-width: 768px) {
          .brands-header-left-group {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            width: 100% !important;
          }
          .brands-header-stats-section {
            border-left: none !important;
            padding-left: 0 !important;
            margin-left: 0 !important;
            width: 100% !important;
            gap: 32px !important;
          }
          .brands-header-verified-section {
            width: 100% !important;
            justify-content: flex-start !important;
          }
          .alpha-search-container {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .alpha-list-wrapper {
            flex: none !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .search-box-wrapper {
            width: 100% !important;
            min-width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .all-brands-responsive-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .all-brands-responsive-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}
