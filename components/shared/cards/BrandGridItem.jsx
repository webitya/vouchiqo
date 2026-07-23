"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BrandGridItem({ name, logo, href, coupons = 12 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-center gap-1.5 group select-none text-center w-full"
      style={{ textDecoration: "none" }}
    >
      {/* 3D Flip Container (Perspective) */}
      <div
        className="w-full h-[76px] sm:h-[84px] shrink-0"
        style={{ perspective: "1000px" }}
      >
        {/* Flip Card Inner (Preserves 3D) */}
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isHovered ? "rotateX(180deg)" : "rotateX(0deg)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front Face: Logo */}
          <div
            className="absolute inset-0 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2.5 sm:p-4 shadow-sm group-hover:shadow-md transition-all duration-300"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <img
              src={logo}
              alt={name}
              className="max-h-[44px] sm:max-h-[52px] max-w-full object-contain"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%233e80dd' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Back Face: Coupon Count */}
          <div
            className="absolute inset-0 bg-[#eff6ff] rounded-xl border border-brand-blue/30 flex flex-col items-center justify-center p-2 sm:p-3 shadow-md"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-blue mb-0.5 sm:mb-1 shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] sm:text-[17px] font-bold text-brand-blue leading-none">
                {coupons}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Offers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Name Below */}
      <span className="text-[11.5px] sm:text-[13px] text-slate-800 font-semibold transition-colors group-hover:text-brand-blue truncate max-w-full px-0.5">
        {name}
      </span>
    </Link>
  );
}
