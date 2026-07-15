"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CouponCard({
  coupon,
  onRedeem,
  isLocal = false,
  isMarbellaLocal = false,
}) {
  const {
    _id,
    title,
    discountValue,
    discountType,
    description,
    merchantId,
    expiresAt,
  } = coupon;

  const discountFormatted =
    discountType === "percentage"
      ? `${discountValue}% OFF`
      : `₹${discountValue} OFF`;

  const isExpiringSoon = expiresAt
    ? new Date(expiresAt) - Date.now() < 86400000 * 2 // Less than 2 days
    : false;

  const merchantName = merchantId?.businessName || merchantId?.name;

  const isHotOrFeatured = coupon.isHot || coupon.isFeatured;

  return (
    <div
      className={`relative bg-brand-bg border border-brand-border rounded-md shadow-sm overflow-hidden flex flex-col justify-between h-full group coupon-card-interactive ${isHotOrFeatured ? "coupon-card-hot" : ""}`}
    >
      {/* Top Section */}
      <Link
        href={`/deals/${_id}`}
        className="p-3.5 flex-1 block hover:no-underline cursor-pointer"
      >
        {/* Merchant Brand Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-sm bg-brand-surface border border-brand-border flex items-center justify-center font-semibold text-[9px] text-brand-navy">
            {merchantName ? merchantName[0] : "M"}
          </div>
          <span className="text-[11px] font-medium text-brand-navy uppercase tracking-wider">
            {merchantName || "Premium Partner"}
          </span>
        </div>

        {/* Title / Discount */}
        <h3 className="font-sans text-base font-semibold text-brand-text mb-0.5 group-hover:text-brand-blue transition-colors">
          {discountFormatted}
        </h3>
        <p className="text-xs font-normal text-brand-text mb-1 leading-tight line-clamp-1">
          {title}
        </p>
        <p className="text-[11px] text-brand-subtext line-clamp-2 leading-relaxed">
          {description ||
            "No description provided. Terms and conditions apply."}
        </p>
      </Link>

      {/* Ticket Cutout Divider Bar */}
      <div className="relative w-full my-1">
        {/* Left Cutout */}
        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-surface border border-brand-border z-10"></div>
        {/* Right Cutout */}
        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-surface border border-brand-border z-10"></div>
        {/* Dashed Line */}
        <div className="border-t border-dashed border-brand-border w-full"></div>
      </div>

      {/* Bottom Section */}
      <div className="p-3.5 bg-brand-surface/50">
        <div className="flex items-center justify-between mb-2.5">
          {/* Active Today badge in green (Compact & Clean) */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
            <span>Active Today</span>
          </span>

          {/* expiring soon status */}
          {isExpiringSoon && (
            <span className="text-[10px] font-medium text-brand-error flex items-center gap-1 select-none">
              <ShieldAlert className="w-3 h-3" />
              <span>Expiring Soon</span>
            </span>
          )}
        </div>

        {/* CTA Button */}
        {onRedeem ? (
          <Button
            onClick={() => onRedeem(coupon)}
            className="w-full text-xs py-1.5 rounded-sm shadow-none border-0 h-auto cursor-pointer font-medium bg-brand-blue hover:bg-blue-600 text-white"
          >
            Claim Voucher
          </Button>
        ) : (
          <Button
            asChild
            className="w-full text-xs py-1.5 rounded-sm shadow-none border-0 h-auto cursor-pointer text-center justify-center font-medium bg-brand-blue hover:bg-blue-600 text-white"
          >
            <Link href={`/deals/${_id}`}>View Offer</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
