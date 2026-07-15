"use client";

import { Tag, Ticket } from "lucide-react";
import Link from "next/link";

/**
 * Shared listing card for brands/merchants grids.
 * Renders a card with logo, divider, name, and coupons/offers counts.
 *
 * @param {string} name - Display name
 * @param {string} slug - URL slug for the link
 * @param {string} logo - Logo image URL
 * @param {number} coupons - Number of coupons
 * @param {number} offers - Number of offers
 * @param {string} href - Link href (defaults to /brand/{slug})
 * @param {number} logoHeight - Logo container height in px (default 80)
 * @param {boolean} showStats - Whether to show coupons/offers row (default true)
 */
export default function ListingCard({
  name,
  slug,
  logo,
  coupons,
  offers,
  href,
  logoHeight = 80,
  showStats = true,
}) {
  const linkHref = href || `/brand/${slug}`;

  return (
    <Link href={linkHref} style={{ textDecoration: "none" }}>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
          e.currentTarget.style.borderColor = "#2563eb";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Logo container */}
        <div
          style={{
            height: logoHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            background: "#fff",
          }}
        >
          <img
            src={logo}
            alt={name}
            style={{
              maxHeight: "85%",
              maxWidth: "85%",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='1' ry='1'/%3E%3C/svg%3E";
            }}
          />
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: "#f3f4f6" }} />
        {/* Content area */}
        <div style={{ padding: "12px", textAlign: "left" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#000000",
              margin: "0 0 4px 0",
            }}
          >
            {name}
          </p>
          {showStats && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              <Tag className="w-3 h-3 text-[#2563eb]" />
              <span>{coupons + offers} Active Offers</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
