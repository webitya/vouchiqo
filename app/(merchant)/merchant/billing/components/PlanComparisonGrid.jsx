"use client";

import { PlanSelector } from "@/components/shared/cards";
import { Switch } from "@/components/ui/switch";

/**
 * PlanComparisonGrid — shows 4 subscription plan cards using PlanSelector.
 * @param {{ plans: object[], currentPlanId: string, billingCycle: string, setBillingCycle: function, onOpenUpgrade: function }} props
 */
export default function PlanComparisonGrid({
  plans,
  currentPlanId,
  billingCycle,
  setBillingCycle,
  onOpenUpgrade,
}) {
  return (
    <div className="space-y-6 pt-2 text-left">
      {/* Header + billing toggle */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-brand-text uppercase tracking-wider">
            Plan Comparison (All 4 Launch Tiers)
          </h3>
          <p className="text-xs text-brand-subtext font-medium">
            Select the best subscription tier for your business scale
          </p>
        </div>

        <div className="flex items-center gap-3 bg-brand-surface p-2 rounded-xl border border-brand-border shrink-0">
          <span
            className={`text-xs font-bold ${billingCycle === "monthly" ? "text-brand-text" : "text-brand-subtext"}`}
          >
            Monthly
          </span>
          <Switch
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "yearly" : "monthly")
            }
          />
          <span
            className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-brand-text" : "text-brand-subtext"}`}
          >
            Annual
            <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">
              Save 15%
            </span>
          </span>
        </div>
      </div>

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const displayPrice =
            billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
          return (
            <PlanSelector
              key={plan.id}
              plan={{
                ...plan,
                price: `₹${displayPrice?.toLocaleString("en-IN")}`,
                billingNote: `/ ${billingCycle === "yearly" ? "year" : "month"}`,
                badge: plan.popular
                  ? "Most Popular"
                  : plan.bestValue
                    ? "Best Value"
                    : undefined,
              }}
              isCurrent={currentPlanId === plan.id}
              isRecommended={plan.popular}
              onSelect={onOpenUpgrade}
            />
          );
        })}
      </div>
    </div>
  );
}
