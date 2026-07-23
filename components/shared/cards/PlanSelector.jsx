"use client";

import { CheckCircle2, Loader2, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * PlanSelector — subscription plan card.
 *
 * @param {object} plan - plan data
 * @param {string} plan.id - unique plan identifier
 * @param {string} plan.name - plan name (e.g. "Growth Partner")
 * @param {string} plan.price - price string (e.g. "₹999/mo")
 * @param {string} [plan.billingNote] - e.g. "Billed annually"
 * @param {string[]} [plan.features] - list of feature strings
 * @param {string[]} [plan.unavailable] - features NOT included (shown as strikethrough)
 * @param {string} [plan.badge] - text for the top badge (e.g. "Most Popular")
 * @param {string} [plan.color="brand-navy"] - accent colour class prefix
 * @param {boolean} [isCurrent=false] - is this the user's current plan
 * @param {boolean} [isRecommended=false] - highlight this card
 * @param {function} [onSelect] - (plan) => void
 * @param {boolean} [loading=false] - show spinner on CTA
 * @param {string} [className]
 */
export default function PlanSelector({
  plan = {},
  isCurrent = false,
  isRecommended = false,
  onSelect,
  loading = false,
  className,
}) {
  const {
    name = "Plan",
    price = "—",
    billingNote,
    features = [],
    unavailable = [],
    badge,
  } = plan;

  const highlight = isRecommended || isCurrent;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border-2 p-5 transition-all duration-200 bg-brand-bg",
        highlight
          ? "border-brand-navy shadow-lg shadow-brand-navy/10 scale-[1.02]"
          : "border-brand-border hover:border-brand-navy/40 hover:shadow-md",
        className,
      )}
    >
      {/* Top badge */}
      {(badge || isCurrent) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            className={cn(
              "text-[10px] font-bold px-3 py-0.5 rounded-full border-0 shadow-sm",
              isCurrent
                ? "bg-emerald-500 text-white"
                : "bg-brand-navy text-white",
            )}
          >
            {isCurrent ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Current Plan
              </>
            ) : (
              <>
                <Star className="w-3 h-3 mr-1 fill-current" />
                {badge}
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Plan name */}
      <h3 className="font-heading text-base font-bold text-brand-text mt-2 mb-1">
        {name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        <span className="text-2xl font-extrabold text-brand-navy">{price}</span>
        {billingNote && (
          <p className="text-[11px] text-brand-subtext mt-0.5">{billingNote}</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-5 flex-1">
        {features.map((feat, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-brand-text"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            {feat}
          </li>
        ))}
        {unavailable.map((feat, i) => (
          <li
            key={`n-${i}`}
            className="flex items-start gap-2 text-xs text-brand-subtext/60 line-through"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-border shrink-0 mt-0.5" />
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        type="button"
        disabled={isCurrent || loading}
        onClick={() => onSelect?.(plan)}
        className={cn(
          "w-full h-9 text-sm font-bold shadow-none cursor-pointer",
          isCurrent
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 cursor-default"
            : highlight
              ? "bg-brand-navy hover:bg-brand-navy/90 text-white"
              : "bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-navy hover:text-white",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            Processing…
          </>
        ) : isCurrent ? (
          "Current Plan"
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Select Plan
          </>
        )}
      </Button>
    </div>
  );
}
