"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TrafficAndGoals({
  pageViews,
  totalRevenue,
  totalClaims,
  totalRedemptions,
  analyticsData,
}) {
  const trafficData = [
    { name: "Direct", value: 35, color: "#3e80dd" },
    { name: "Organic", value: 28, color: "#2563eb" },
    { name: "Referral", value: 22, color: "#0a2e6e" },
    { name: "Social", value: 15, color: "#8b5cf6" },
  ];

  const revenueGoal = analyticsData?.goals?.revenueTarget ?? 0;
  const revenueActual = totalRevenue;
  const revenuePct =
    revenueGoal > 0
      ? Math.min(100, Math.round((revenueActual / revenueGoal) * 100))
      : 0;

  const claimsGoal = analyticsData?.goals?.claimsTarget ?? 0;
  const claimsPct =
    claimsGoal > 0
      ? Math.min(100, Math.round((totalClaims / claimsGoal) * 100))
      : 0;

  const redemptionPct =
    totalClaims > 0
      ? Math.min(100, Math.round((totalRedemptions / totalClaims) * 100))
      : 0;

  return (
    <div className="col-span-full flex flex-col gap-4 xl:col-span-4">
      {/* Traffic Card */}
      <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col hover:shadow-sm transition-all duration-200 p-0 gap-0 font-sans">
        <CardHeader className="px-4 py-3 sm:px-4 sm:py-3 border-b border-slate-100 bg-slate-50/50 min-h-[48px]">
          <CardTitle className="font-sans text-xs sm:text-[12px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
            Traffic Sources
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
            Where your visitors come from
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-28 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={52}
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive={true}
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-sm font-bold text-slate-800">
                  {pageViews > 0 ? `${(pageViews / 1000).toFixed(0)}K` : "—"}
                </span>
                <span className="text-[9px] text-slate-400">
                  Visits
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {trafficData.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: t.color }}
                    ></div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {t.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">
                    {t.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Card */}
      <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col hover:shadow-sm transition-all duration-200 p-0 gap-0 font-sans">
        <CardHeader className="px-4 py-3 sm:px-4 sm:py-3 border-b border-slate-100 bg-slate-50/50 min-h-[48px]">
          <CardTitle className="font-sans text-xs sm:text-[12px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
            Monthly Goals
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
            Track progress toward targets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-800">
                Monthly Revenue
              </span>
              <span className="text-slate-500 font-bold">
                {revenueGoal > 0 ? `${revenuePct}%` : "—"}
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                style={{ width: revenueGoal > 0 ? `${revenuePct}%` : "0%" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>₹{revenueActual.toLocaleString("en-IN")}</span>
              <span>
                {revenueGoal > 0
                  ? `Target: ₹${revenueGoal.toLocaleString("en-IN")}`
                  : "No target set"}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-800">Coupon Claims</span>
              <span className="text-slate-500 font-bold">
                {claimsGoal > 0 ? `${claimsPct}%` : "—"}
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                style={{ width: claimsGoal > 0 ? `${claimsPct}%` : "0%" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{totalClaims.toLocaleString()}</span>
              <span>
                {claimsGoal > 0
                  ? `Target: ${claimsGoal.toLocaleString()}`
                  : "No target set"}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-800">
                Conversion Rate
              </span>
              <span className="text-slate-500 font-bold">
                {totalClaims > 0 ? `${redemptionPct}%` : "—"}
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                style={{ width: `${redemptionPct}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{totalRedemptions} redeemed</span>
              <span>of {totalClaims} claimed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
