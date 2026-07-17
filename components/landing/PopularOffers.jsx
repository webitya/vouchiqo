// components/landing/PopularOffers.jsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ============================================
   POPULAR OFFER CARD
   Grabon-style with responsive hover:
   - SM/MD: grab-now always visible, subtle
     image/overlay shift on hover
   - LG: grab-now + redeem now hidden below
     card boundary (overflow: clip), revealed on
     hover via translateY shifts
   ============================================ */
const CATEGORY_GRADIENTS = {
  fashion: "linear-gradient(135deg, #f472b6, #db2777)", // Fashion & Clothing
  food: "linear-gradient(135deg, #fb923c, #ea580c)", // Food & Dining
  electronics: "linear-gradient(135deg, #60a5fa, #2563eb)", // Electronics & Gadgets
  beauty: "linear-gradient(135deg, #f472b6, #e11d48)", // Beauty & Wellness
  travel: "linear-gradient(135deg, #2dd4bf, #0d9488)", // Travel & Hospitality
  home: "linear-gradient(135deg, #a78bfa, #7c3aed)", // Home & Living
  "home-improvement": "linear-gradient(135deg, #fbbf24, #d97706)", // Home Improvement
  fitness: "linear-gradient(135deg, #34d399, #059669)", // Fitness & Healthcare
  education: "linear-gradient(135deg, #818cf8, #4f46e5)", // Education & Courses
  "kids-baby": "linear-gradient(135deg, #fbcfe8, #ec4899)", // Kids & Baby Products
  jewellery: "linear-gradient(135deg, #fde047, #ca8a04)", // Jewellery & Accessories
  automotive: "linear-gradient(135deg, #9ca3af, #4b5563)", // Automobile & Auto Services
  entertainment: "linear-gradient(135deg, #c084fc, #7e22ce)", // Gaming & Entertainment
  grocery: "linear-gradient(135deg, #a7f3d0, #059669)", // Grocery & Essentials
  finance: "linear-gradient(135deg, #6ee7b7, #047857)", // Finance & Insurance
  other: "linear-gradient(135deg, #38bdf8, #0284c7)", // Other
};

function PopularOfferCard({ coupon }) {
  const discountFormatted =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  const merchantName =
    coupon.merchantId?.businessName || coupon.merchantId?.name || "Partner";

  const logoUrl = coupon.merchantId?.logo || "/placeholder-brand.png";
  const coverImage = coupon.image || coupon.merchantId?.banner;
  const gradient =
    CATEGORY_GRADIENTS[coupon.category] || CATEGORY_GRADIENTS.other;

  const isExclusive = coupon.isFeatured;

  return (
    <Link
      href={`/deals/${coupon._id}`}
      className="po-card group relative rounded-md no-underline cursor-pointer"
    >
      {/* ===== LAYER 1: BANNER IMAGE (z-index 1) =====
          Fills the whole card behind everything. The white box
          covers the bottom ~40%, leaving the top ~60% visible. */}
      <div
        className="po-card__banner absolute top-0 left-0 w-full bg-cover bg-center rounded-md"
        style={{
          height: "100%",
          backgroundImage: coverImage ? `url(${coverImage})` : "none",
          background: coverImage ? undefined : gradient,
        }}
        role="img"
        aria-label={coupon.title}
      />

      {/* ===== LAYER 2: WHITE CONTENT OVERLAY (z-index 2) =====
          Bottom-anchored. ~40% of card height at rest. Grows
          UPWARD on hover (extra section expands) to reveal the
          divider + redeem button. The logo is a child, absolute-positioned
          so it straddles the image/box junction exactly like the GrabOn reference. */}
      <div className="po-card__box absolute bottom-0 left-0 w-full bg-white rounded-b-md rounded-tl-[6px] px-4 md:px-5 pt-8 pb-5">
        {/* ===== LAYER 3: LOGO (z-index 3) — on the white overlay =====
            Straddles the top edge of the white box and the banner image. */}
        <div
          className="po-card__logo-wrap absolute flex items-center justify-center bg-white"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
            top: "-28px",
            left: "16px",
            zIndex: 3,
            "--_popular-offers-logo": `url(${logoUrl})`,
            border: "1px solid #f1f5f9",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img
              src={logoUrl}
              referrerPolicy="no-referrer"
              alt={merchantName}
              className="w-8 h-8 object-contain p-0.5"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234685E8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Title badge — left aligned, matching reference image */}
        <div className="mb-1.5">
          <p className="po-card__title text-left text-[14px] md:text-[18px] font-extrabold uppercase tracking-wide text-[#3E80DD] leading-tight">
            {isExclusive ? "VOUCHIQO EXCLUSIVE" : discountFormatted}
          </p>
        </div>

        {/* Description — left aligned, matching reference image */}
        <div className="po-card__desc-wrap mb-3 pb-2.5">
          <p className="po-card__desc text-left text-[12px] md:text-[14px] text-[#2D3748] leading-snug font-medium line-clamp-2">
            {coupon.title}
          </p>
        </div>

        {/* "CLAIM NOW" button — only visible on SM/MD, hidden on desktop */}
        <div className="po-card__grab md:hidden mt-2">
          <span
            className="block w-full rounded-md py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all"
            style={{
              backgroundColor: "#3E80DD",
              boxShadow: "0 2px 8px rgba(62,128,221,0.3)",
            }}
          >
            Claim now
          </span>
        </div>

        {/* ---- EXTRA SECTION (desktop only) ----
            Collapses to zero height at rest → zero visible space.
            Expands on hover so the box grows UPWARD over the image. */}
        <div className="po-card__extra hidden md:block">
          <div className="po-card__redeem mt-2">
            <button
              type="button"
              aria-label="Redeem Now"
              className="po-card__redeem-btn w-full rounded-md py-2 text-center text-[12px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all"
              style={{
                backgroundColor: "#3E80DD",
                boxShadow: "0 2px 8px rgba(62,128,221,0.3)",
              }}
            >
              Redeem now
            </button>
          </div>
        </div>
      </div>

      {/* ---- PER-CARD HOVER STYLES ---- */}
      <style>{`
        /* ======================================
           BASE CARD WITH DISTINCT BORDER & SHADOW
           ====================================== */
        .po-card {
          --anim-duration: 500ms;
          --anim-ease-v4: cubic-bezier(0.4, 0, 0.2, 1);
          --logo-lift: 42px;
          position: relative;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04);
          transition: box-shadow 300ms ease, border-color 300ms ease;
          display: block;
          overflow: hidden;
        }

        .po-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.06);
        }

        /* ===== 3-LAYER Z-INDEX STACK ===== */
        .po-card__banner { z-index: 1; }
        .po-card__box { z-index: 2; }
        .po-card__logo-wrap { z-index: 3; }

        .po-card__logo-wrap {
          transition: box-shadow var(--anim-duration) var(--anim-ease-v4);
        }
        .po-card:hover .po-card__logo-wrap {
          box-shadow: 4px 8px 16px 0px rgba(0, 0, 0, 0.12);
        }

        .po-card__banner {
          transition: transform var(--anim-duration) var(--anim-ease-v4);
        }
        .po-card:hover .po-card__banner {
          transform: translateY(calc(-1 * var(--logo-lift)));
        }

        .po-card__box {
          transform: translateY(0);
          transition: transform var(--anim-duration) var(--anim-ease-v4);
        }
        /* sm only: gentle slide-down on hover */
        @media (max-width: 767px) {
          .po-card:hover .po-card__box {
            transform: translateY(20px);
          }
        }
        
        @media (min-width: 768px) {
          .po-card__box {
            transform: translateY(60px);
          }
          .po-card:hover .po-card__box {
            transform: translateY(0) !important;
          }
        }

        .po-card__extra {
          display: none;
        }
        @media (min-width: 768px) {
          .po-card__extra {
            display: block;
          }
        }

        .po-card__desc-wrap {
          border-bottom: 2px dashed transparent;
          transition: border-color var(--anim-duration) var(--anim-ease-v4);
        }
        .po-card:hover .po-card__desc-wrap {
          border-color: #cbd5e1 !important;
        }

        .po-card .po-card__redeem-btn {
          transition: background-color 200ms ease;
        }

        /* ======================================
           LAYOUT (responsive)
           ====================================== */
        .po-card {
          height: 220px;
        }
        @media (min-width: 768px) {
          .po-card {
            height: 340px;
          }
        }
        .po-card__banner {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .po-card__box {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%;
        }
      `}</style>
    </Link>
  );
}

/* ============================================
   POPULAR OFFERS SECTION (Infinite Slider Layout)
   ============================================ */
export default function PopularOffers({ coupons = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    setIsMobile(media.matches);
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const finalItems = coupons.slice(0, 12);

  const itemsPerPage = isMobile ? 2 : 4;
  const totalSlides = Math.ceil(finalItems.length / itemsPerPage);

  // Auto-rotation effect for slides (5 seconds interval, infinite loop)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const slides = [];
  for (let i = 0; i < totalSlides; i++) {
    slides.push(finalItems.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
  }

  // Swipe/drag gestures
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart.current - dragEnd;
    if (diff > 50) {
      setSelectedIndex((prev) => (prev + 1) % totalSlides);
    } else if (diff < -50) {
      setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    }
    isDragging.current = false;
  };

  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const dragEnd = e.clientX;
    const diff = dragStart.current - dragEnd;
    if (diff > 50) {
      setSelectedIndex((prev) => (prev + 1) % totalSlides);
    } else if (diff < -50) {
      setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    }
    isDragging.current = false;
  };

  const handlePrev = (e) => {
    e?.preventDefault();
    setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.preventDefault();
    setSelectedIndex((prev) => (prev + 1) % totalSlides);
  };

  if (finalItems.length === 0) return null;

  return (
    <section className="g-sub-banner text-left w-full select-none relative">
      {/* Custom Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-brand-text font-heading">
          Popular Offers of the Day
        </h2>
      </div>

      {/* Carousel container wrapper */}
      <div className="relative w-full px-1">
        {/* Left Chevron at corner */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Viewport */}
        <div
          className="vouchiqo-carousel-viewport w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="vouchiqo-carousel-container w-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
          >
            {slides.map((slideItems, slideIdx) => (
              <div
                key={slideIdx}
                className="vouchiqo-carousel-slide w-full flex-shrink-0"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {slideItems.map((coupon) => (
                    <PopularOfferCard key={coupon._id} coupon={coupon} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chevron at corner */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Slide dots at bottom center */}
      {totalSlides > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`transition-all duration-300 ease-in-out rounded-full cursor-pointer h-1.5 ${
                i === selectedIndex
                  ? "w-8 bg-[#2563eb] opacity-100"
                  : "w-1.5 bg-slate-300 opacity-40 hover:opacity-100 hover:bg-[#2563eb]"
              }`}
              onClick={() => setSelectedIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
