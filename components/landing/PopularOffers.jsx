// components/landing/PopularOffers.jsx
"use client";

import Link from "next/link";

/* ============================================
   SECTION HEADER
   ============================================ */
function SectionHeader({ title, viewAllHref }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#191F2E]">{title}</h2>
      <Link
        href={viewAllHref}
        className="text-sm font-semibold text-[#4685E8] hover:text-[#3771c8] transition-colors"
      >
        View All →
      </Link>
    </div>
  );
}

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
  other: "linear-gradient(135deg, #38bdf8, #0284c7)" // Other
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
  const gradient = CATEGORY_GRADIENTS[coupon.category] || CATEGORY_GRADIENTS.other;

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
      <div className="po-card__box absolute bottom-0 left-0 w-full bg-white rounded-b-md rounded-tl-[6px] px-5 pt-8 pb-5">
        {/* ===== LAYER 3: LOGO (z-index 3) — on the white overlay =====
            Straddles the top edge of the white box and the banner image. */}
        <div
          className="po-card__logo-wrap absolute flex items-center justify-center bg-white"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
            top: "-36px",
            left: "20px",
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
              className="w-10 h-10 object-contain p-0.5"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234685E8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Title badge — left aligned, matching reference image */}
        <div className="mb-2">
          <p className="po-card__title text-left text-[18px] font-extrabold uppercase tracking-wide text-[#3E80DD] leading-tight">
            {isExclusive ? "VOUCHIQO EXCLUSIVE" : discountFormatted}
          </p>
        </div>

        {/* Description — left aligned, matching reference image */}
        <div className="po-card__desc-wrap mb-4 pb-3">
          <p className="po-card__desc text-left text-[14px] text-[#2D3748] leading-snug font-medium line-clamp-2">
            {coupon.title}
          </p>
        </div>

        {/* "CLAIM NOW" label — only visible on SM/MD, hidden on desktop */}
        <p className="po-card__grab text-left text-[12px] font-black uppercase tracking-[0.15em] text-[#3E80DD] md:hidden">
          CLAIM NOW
        </p>

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
           BASE CARD
           ====================================== */
        .po-card {
          --anim-duration: 500ms;
          --anim-ease: cubic-bezier(0.4, 0, 0.2, 1);
          --anim-ease-v2: cubic-bezier(0.4, 0, 0.2, 1);
          --anim-ease-v4: cubic-bezier(0.4, 0, 0.2, 1);
          /* Lift value synchronized to match the upward box growth height */
          --logo-lift: 42px;
          position: relative;
          box-shadow: 1px 1px 6px 0px rgba(203,203,221,1), -1px -1px 6px 0px #F7F7F8;
          transition: box-shadow 300ms ease;
          display: block;
          overflow: hidden;
        }

        .po-card:hover {
          box-shadow: 2px 2px 12px 0px rgba(203,203,221,0.8), -2px -2px 12px 0px #F7F7F8;
        }

        /* ===== 3-LAYER Z-INDEX STACK ===== */
        .po-card__banner { z-index: 1; }
        .po-card__box { z-index: 2; }
        .po-card__logo-wrap { z-index: 3; }

        /* ===== LOGO: in-flow inside the box, so it rides along
           with the box automatically — no separate transform needed.
           It sits ON the white overlay background. ===== */
        .po-card__logo-wrap {
          transition: box-shadow var(--anim-duration) var(--anim-ease-v4);
        }
        .po-card:hover .po-card__logo-wrap {
          box-shadow: 4px 8px 16px 0px rgba(0, 0, 0, 0.12);
        }

        /* ===== BANNER: lifts UP on hover, matching Grabon's
           --_popular-logo-anim-value. Synchronized timing so
           image + box + logo move together. ===== */
        .po-card__banner {
          transition: transform var(--anim-duration) var(--anim-ease-v4);
        }
        .po-card:hover .po-card__banner {
          transform: translateY(calc(-1 * var(--logo-lift)));
        }

        /* ===== BOX: on mobile (sm), slides DOWN slightly on hover so the
           banner image peeks above. On md+, translates down at rest to hide
           the button, then slides UPWARD on hover to reveal it. ===== */
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

        /* ===== EXTRA: contains the divider + button.
           We don't need max-height animations because the whole box
           shifts up via transform. ===== */
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
          border-color: #D0D7E2 !important;
        }

        .po-card .po-card__redeem-btn {
          transition: background-color 200ms ease;
        }

        /* ======================================
           LAYOUT (responsive)
           ====================================== */
        .po-card {
          height: 250px;
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
   POPULAR OFFERS SECTION
   ============================================ */
export default function PopularOffers({ coupons = [] }) {
  const items = coupons.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="g-sub-banner text-left w-full bg-white rounded-md border border-brand-border p-6 md:p-8">
      <SectionHeader title="Popular Offers of the Day" viewAllHref="/deals" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((coupon) => (
          <PopularOfferCard key={coupon._id} coupon={coupon} />
        ))}
      </div>
    </section>
  );
}
