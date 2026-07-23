"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CampaignsHeader({
  campaignsCount,
  isPro,
  planName,
  onCreateClick,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My Campaigns
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Bundle multiple offers into a coordinated promo push.
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9 py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all border-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </Button>
      </div>

      {/* Allowance Progress Card */}
      <Card className="border border-slate-200/90 shadow-2xs rounded-2xl bg-white p-3.5 space-y-2 font-sans">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span>
            {campaignsCount} of {isPro ? "Unlimited" : "4"} annual campaigns
            used
          </span>
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
            {planName ? `${planName.toUpperCase()} plan` : "PRO plan"}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{
              width: isPro
                ? "25%"
                : `${Math.min(100, (campaignsCount / 4) * 100)}%`,
            }}
          />
        </div>
      </Card>
    </>
  );
}
