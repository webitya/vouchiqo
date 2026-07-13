"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Users,
} from "lucide-react";

/**
 * Single coupon card for the brand detail page.
 */
export default function CouponCard({
  coupon,
  merchant,
  isExpanded,
  onToggle,
  copiedCouponId,
  onCopyCode,
}) {
  const hasCode = coupon.code && coupon.code.trim() !== "";
  const discountText =
    coupon.discountAmount && coupon.discountType
      ? coupon.discountType === "percentage"
        ? `${coupon.discountAmount}%`
        : `₹${coupon.discountAmount}`
      : null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        overflow: "hidden",
      }}
      className="transition-all hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row items-stretch min-h-[110px]">
        {/* Left discount badge */}
        <div
          style={{
            background: hasCode
              ? "linear-gradient(135deg, #3e80dd, #1e40af)"
              : "linear-gradient(135deg, #2563eb, #047857)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 20px",
            textAlign: "center",
            minWidth: 125,
          }}
          className="sm:w-[130px] flex-shrink-0"
        >
          {discountText ? (
            <>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">Discount</span>
              <span className="text-xl sm:text-2xl font-black leading-none my-1">{discountText}</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">OFF</span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">Exclusive</span>
              <span className="text-lg font-black leading-none my-1">{hasCode ? "CODE" : "DEAL"}</span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">ACTIVE</span>
            </>
          )}
        </div>

        {/* Right content */}
        <div className="flex-1 p-5 flex flex-col justify-between text-left gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#eaf5ec] text-[#2f855a] border border-[#c6f6d5] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
              <span className="text-xs text-[#6b7280] font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>3 Uses Today</span>
              </span>
            </div>
            <h3 className="font-extrabold text-base text-[#191f2e] leading-snug">{coupon.title}</h3>
            <p className="text-[12px] text-[#6b7280] leading-relaxed line-clamp-2">{coupon.description}</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#f1f5f9]">
            <button
              onClick={() => onToggle(coupon._id)}
              type="button"
              className="text-[12px] font-black text-[#6b7280] hover:text-[#3e80dd] transition-colors flex items-center gap-1 border-0 bg-transparent cursor-pointer p-0"
            >
              <span>Show Details</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {hasCode ? (
              <div className="flex items-center">
                {copiedCouponId === coupon._id ? (
                  <span className="bg-[#eaf5ec] text-[#2f855a] border border-[#c6f6d5] text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-lg">
                    Code Copied!
                  </span>
                ) : (
                  <button
                    onClick={() => onCopyCode(coupon.code, coupon._id)}
                    type="button"
                    style={{
                      background: "#3e80dd",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "8px 16px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    className="hover:bg-[#2563eb]"
                  >
                    Get Code
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => window.open(merchant.website || "https://google.com", "_blank")}
                type="button"
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "8px 16px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                className="hover:bg-[#059669]"
              >
                Get Deal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="bg-[#fafbfc] border-t border-[#e2e8f0] p-5 text-left text-xs text-[#4b5563] space-y-3">
          <p className="font-bold uppercase tracking-wider text-[#191f2e] text-[10px]">
            Offer Details &amp; Terms
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[#6b7280] font-medium">
            <li>Applicable only on verified purchases via official partner channels.</li>
            <li>Discount applies to base order value; taxes, fees, and surcharges excluded.</li>
            <li>Cannot be combined with other ongoing merchant promotions or wallet cashbacks.</li>
            <li>Offer valid for a limited time period. Valid until stock lasts.</li>
          </ul>
          {hasCode && (
            <div className="flex items-center gap-2 pt-2">
              <span className="font-bold text-[#191f2e]">Promo Code:</span>
              <span className="font-mono bg-white border border-[#cbd5e1] text-[#3e80dd] px-2 py-1 rounded font-bold">
                {coupon.code}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
