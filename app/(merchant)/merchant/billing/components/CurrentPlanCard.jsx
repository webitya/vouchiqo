"use client";

import { CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CurrentPlanCard({
  merchant,
  currentPlanId,
  plans,
  billingCycle,
  planExpiry,
  revivalCredits,
  activeListingsCount,
  planListingsLimit,
  campaignsUsedCount,
  planCampaignsLimit,
  onOpenUpgrade,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e85d04]/10 text-[#e85d04] flex items-center justify-center border border-orange-100 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-slate-900 capitalize">
                Current Plan: {plans.find((p) => p.id === currentPlanId)?.name}
              </h3>
              <Badge className="bg-emerald-100 text-emerald-800 rounded-full border-0 font-bold text-[10px] py-0.5 px-2.5 uppercase">
                Active Subscription
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Billing Cycle: <strong>{billingCycle.toUpperCase()}</strong> •
              Next Renewal:{" "}
              <strong>
                {planExpiry
                  ? new Date(planExpiry).toLocaleDateString("en-IN")
                  : "Aug 21, 2026"}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Opening billing management portal...")
            }
            className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
          >
            Manage Billing
          </Button>
          <Button
            onClick={() =>
              onOpenUpgrade(plans.find((p) => p.id === "pro") || plans[2])
            }
            className="bg-[#e85d04] hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Usage Bars: Listings, Campaigns & Revivals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        {/* 1. Active Listings Usage */}
        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span>Active Listings Used</span>
            <span>
              {activeListingsCount} /{" "}
              {planListingsLimit === 999 ? "∞" : planListingsLimit}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563eb] h-full rounded-full transition-all"
              style={{
                width: `${planListingsLimit === 999 ? 20 : Math.min(100, (activeListingsCount / planListingsLimit) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            {planListingsLimit === 999
              ? "Unlimited listings available"
              : `${planListingsLimit - activeListingsCount} remaining on this plan`}
          </span>
        </div>

        {/* 2. Active Campaigns Usage */}
        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span>Simultaneous Campaigns</span>
            <span>
              {campaignsUsedCount} /{" "}
              {planCampaignsLimit === 0 ? "Add-on" : planCampaignsLimit}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#e85d04] h-full rounded-full transition-all"
              style={{
                width: `${planCampaignsLimit === 0 ? 0 : Math.min(100, (campaignsUsedCount / planCampaignsLimit) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            {planCampaignsLimit === 0
              ? "Upgrade to Growth/Pro to launch campaigns"
              : `${planCampaignsLimit - campaignsUsedCount} active slot available`}
          </span>
        </div>

        {/* 3. Expired Revival Credits */}
        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span>Revival Credits Balance</span>
            <span>{revivalCredits} Credits</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (revivalCredits / 50) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Buy Revival Pack add-on (+25 credits for ₹499)
          </span>
        </div>
      </div>
    </div>
  );
}
