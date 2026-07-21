"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductOfferCard({ product }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    setIsMobile(media.matches);
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

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

  return (
    <Link
      href={href}
      className="dotd-card group relative rounded-[8px] no-underline cursor-pointer"
    >
      {/* ===== LAYER 1: PRODUCT IMAGE BANNER ===== */}
      <div
        className="dotd-card__banner absolute top-0 left-0 w-full bg-cover bg-center rounded-[8px]"
        style={{ height: "100%", backgroundImage: `url(${productImage})` }}
        role="img"
        aria-label={title}
      />

      {/* ===== DISCOUNT BADGE — top-right corner ===== */}
      <div
        className="dotd-card__badge absolute top-2 right-2 z-10"
        style={{
          background: "linear-gradient(135deg, #EA384D 0%, #c0202f 100%)",
          color: "#fff",
          fontSize: isMobile ? "8px" : "10px",
          fontWeight: 900,
          padding: isMobile ? "2px 6px" : "3px 8px",
          borderRadius: "999px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          boxShadow: "0 2px 6px rgba(234,56,77,0.35)",
        }}
      >
        {discountText}
      </div>

      {/* ===== LAYER 2: WHITE CONTENT OVERLAY ===== */}
      <div
        className={`dotd-card__box absolute bottom-0 left-0 w-full bg-white rounded-b-[8px] rounded-tl-[6px] ${
          isMobile ? "px-2.5 pt-5 pb-2.5" : "px-3.5 pt-5 pb-3.5"
        }`}
      >
        {/* ===== LAYER 3: MERCHANT LOGO — straddles image/box ===== */}
        <div
          className="dotd-card__logo-wrap absolute flex items-center justify-center bg-white"
          style={{
            width: isMobile ? "30px" : "40px",
            height: isMobile ? "30px" : "40px",
            borderRadius: "50%",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.06)",
            top: isMobile ? "-15px" : "-20px",
            left: isMobile ? "10px" : "14px",
            zIndex: 3,
            border: "1px solid #f1f5f9",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img
              src={merchantLogo}
              alt={merchantName}
              className={
                isMobile
                  ? "w-5 h-5 object-contain p-0.5"
                  : "w-7 h-7 object-contain p-0.5"
              }
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234685E8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Price badge */}
        <div className="mb-1">
          <p className="dotd-card__price text-left text-[12px] md:text-[14px] font-extrabold tracking-wide text-[#3E80DD] leading-tight">
            ₹{discountPrice.toLocaleString("en-IN")}{" "}
            <span
              style={{
                fontSize: isMobile ? "9px" : "11px",
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
        <div className="dotd-card__desc-wrap mb-2 pb-1.5">
          <p className="dotd-card__desc text-left text-[10px] md:text-[11.5px] text-[#2D3748] leading-snug font-medium line-clamp-2">
            {title}
          </p>
        </div>

        {/* Mobile-only Grab Offer button (matches desktop button styling) */}
        <div className="dotd-card__grab md:hidden mt-1.5">
          <span
            className="block w-full rounded-[4px] py-1 text-center text-[9px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all cursor-pointer"
            style={{
              backgroundColor: "#3E80DD",
              boxShadow: "0 2px 6px rgba(62,128,221,0.25)",
            }}
          >
            Grab Offer →
          </span>
        </div>

        {/* Desktop-only CTA — revealed on hover */}
        <div className="dotd-card__extra hidden md:block">
          <div className="dotd-card__cta mt-1.5">
            <button
              type="button"
              aria-label="Buy Now"
              className="dotd-card__cta-btn w-full rounded-[4px] py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all"
              style={{
                backgroundColor: "#3E80DD",
                boxShadow: "0 2px 6px rgba(62,128,221,0.25)",
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
          --anim-duration: 400ms;
          --anim-ease-v4: cubic-bezier(0.4, 0, 0.2, 1);
          --logo-lift: 30px;
          position: relative;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
          transition: box-shadow 300ms ease, border-color 300ms ease;
          display: block;
          overflow: hidden;
          height: 220px;
        }
        @media (min-width: 768px) {
          .dotd-card { height: 260px; }
        }

        .dotd-card:hover {
          border-color: rgba(62, 128, 221, 0.35);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.07);
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
          box-shadow: 3px 6px 12px 0px rgba(0,0,0,0.1);
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
            transform: translateY(0);
          }
        }
        @media (min-width: 768px) {
          .dotd-card__box { transform: translateY(32px); }
          .dotd-card:hover .dotd-card__box { transform: translateY(0) !important; }
        }

        /* Extra desktop section */
        .dotd-card__extra { display: none; }
        @media (min-width: 768px) {
          .dotd-card__extra { display: block; }
        }

        /* Dashed divider on hover */
        .dotd-card__desc-wrap {
          border-bottom: 1.5px dashed transparent;
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
