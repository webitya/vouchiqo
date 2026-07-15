"use client";

import Link from "next/link";

export default function ProductOfferCard({ product }) {
  const {
    title,
    originalPrice,
    discountPrice,
    discountText,
    merchantName,
    merchantLogo,
    productImage,
    href = "/deals",
  } = product;

  const savings = originalPrice - discountPrice;

  return (
    <Link
      href={href}
      className="dotd-card group relative rounded-md no-underline cursor-pointer"
    >
      {/* ===== LAYER 1: PRODUCT IMAGE BANNER ===== */}
      <div
        className="dotd-card__banner absolute top-0 left-0 w-full bg-cover bg-center rounded-md"
        style={{ height: "100%", backgroundImage: `url(${productImage})` }}
        role="img"
        aria-label={title}
      />

      {/* ===== DISCOUNT BADGE — top-right corner ===== */}
      <div
        className="dotd-card__badge absolute top-3 right-3 z-10"
        style={{
          background: "linear-gradient(135deg, #EA384D 0%, #c0202f 100%)",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 900,
          padding: "4px 10px",
          borderRadius: "999px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: "0 3px 10px rgba(234,56,77,0.45)",
        }}
      >
        {discountText}
      </div>

      {/* ===== LAYER 2: WHITE CONTENT OVERLAY ===== */}
      <div className="dotd-card__box absolute bottom-0 left-0 w-full bg-white rounded-b-md rounded-tl-[6px] px-5 pt-8 pb-5">

        {/* ===== LAYER 3: MERCHANT LOGO — straddles image/box ===== */}
        <div
          className="dotd-card__logo-wrap absolute flex items-center justify-center bg-white"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
            top: "-36px",
            left: "20px",
            zIndex: 3,
            border: "1px solid #f1f5f9",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img
              src={merchantLogo}
              alt={merchantName}
              className="w-10 h-10 object-contain p-0.5"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234685E8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Price badge — styled like the discount label in PopularOfferCard */}
        <div className="mb-2">
          <p className="dotd-card__price text-left text-[18px] font-extrabold tracking-wide text-[#3E80DD] leading-tight">
            ₹{discountPrice.toLocaleString("en-IN")}{" "}
            <span
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                textDecoration: "line-through",
                fontWeight: 500,
              }}
            >
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          </p>
        </div>

        {/* Product title */}
        <div className="dotd-card__desc-wrap mb-4 pb-3">
          <p className="dotd-card__desc text-left text-[14px] text-[#2D3748] leading-snug font-medium line-clamp-2">
            {title}
          </p>
        </div>

        {/* Mobile-only label */}
        <p className="dotd-card__grab text-left text-[12px] font-black uppercase tracking-[0.15em] text-[#3E80DD] md:hidden">
          Grab Offer
        </p>

        {/* Desktop-only CTA — revealed on hover */}
        <div className="dotd-card__extra hidden md:block">
          <div className="dotd-card__cta mt-2">
            <button
              type="button"
              aria-label="Buy Now"
              className="dotd-card__cta-btn w-full rounded-md py-2 text-center text-[12px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all"
              style={{
                backgroundColor: "#3E80DD",
                boxShadow: "0 2px 8px rgba(62,128,221,0.3)",
              }}
            >
              Grab Offer →
            </button>
          </div>
        </div>
      </div>

      {/* ===== CARD STYLES ===== */}
      <style>{`
        .dotd-card {
          --anim-duration: 500ms;
          --anim-ease-v4: cubic-bezier(0.4, 0, 0.2, 1);
          --logo-lift: 42px;
          position: relative;
          box-shadow: 1px 1px 6px 0px rgba(203,203,221,1), -1px -1px 6px 0px #F7F7F8;
          transition: box-shadow 300ms ease;
          display: block;
          overflow: hidden;
          height: 250px;
        }
        @media (min-width: 768px) {
          .dotd-card { height: 340px; }
        }

        .dotd-card:hover {
          box-shadow: 2px 2px 12px 0px rgba(203,203,221,0.8), -2px -2px 12px 0px #F7F7F8;
        }

        /* Z-index stack */
        .dotd-card__banner { z-index: 1; }
        .dotd-card__box    { z-index: 2; }
        .dotd-card__logo-wrap { z-index: 3; }
        .dotd-card__badge  { z-index: 4; }

        /* Banner image — lifts on hover */
        .dotd-card__banner {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transition: transform var(--anim-duration) var(--anim-ease-v4);
        }
        .dotd-card:hover .dotd-card__banner {
          transform: translateY(calc(-1 * var(--logo-lift)));
        }

        /* Logo — shadow deepens on hover */
        .dotd-card__logo-wrap {
          transition: box-shadow var(--anim-duration) var(--anim-ease-v4);
        }
        .dotd-card:hover .dotd-card__logo-wrap {
          box-shadow: 4px 8px 16px 0px rgba(0,0,0,0.12);
        }

        /* White box */
        .dotd-card__box {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%;
          transform: translateY(0);
          transition: transform var(--anim-duration) var(--anim-ease-v4);
        }
        @media (max-width: 767px) {
          .dotd-card:hover .dotd-card__box {
            transform: translateY(20px);
          }
        }
        @media (min-width: 768px) {
          .dotd-card__box { transform: translateY(60px); }
          .dotd-card:hover .dotd-card__box { transform: translateY(0) !important; }
        }

        /* Extra desktop section */
        .dotd-card__extra { display: none; }
        @media (min-width: 768px) {
          .dotd-card__extra { display: block; }
        }

        /* Dashed divider on hover */
        .dotd-card__desc-wrap {
          border-bottom: 2px dashed transparent;
          transition: border-color var(--anim-duration) var(--anim-ease-v4);
        }
        .dotd-card:hover .dotd-card__desc-wrap {
          border-color: #D0D7E2 !important;
        }

        .dotd-card__cta-btn {
          transition: background-color 200ms ease;
        }
      `}</style>
    </Link>
  );
}
