"use client";

import {
  BarChart2,
  Calendar,
  CheckCircle2,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import AnalyticsCard from "@/components/AnalyticsCard";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MerchantAnalytics() {
  const [timeRange, setTimeRange] = useState("30");

  const deviceData = [
    { name: "Mobile Web Browser", count: 184, pct: 64 },
    { name: "Desktop Computer", count: 76, pct: 27 },
    { name: "Tablet Device", count: 24, pct: 9 },
  ];

  return (
    <DashboardLayout
      title="Store Analytics"
      user={{ name: "Zomato Partner", role: "merchant" }}
    >
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-bg border border-brand-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-text">
          <Calendar className="w-4 h-4 text-brand-blue" />
          <span>Report Interval:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-brand-surface border border-brand-border text-xs rounded-lg h-8 px-2.5 font-bold text-brand-navy shadow-none focus:ring-0 focus:ring-offset-0 w-36">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="bg-brand-bg border border-brand-border">
              <SelectItem value="7" className="text-xs font-semibold">
                Last 7 Days
              </SelectItem>
              <SelectItem value="30" className="text-xs font-semibold">
                Last 30 Days
              </SelectItem>
              <SelectItem value="90" className="text-xs font-semibold">
                Last 90 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="btn-tertiary text-xs py-1.5 px-4 font-bold flex items-center gap-1.5 w-full sm:w-auto justify-center border-brand-border cursor-pointer h-auto shadow-none hover:bg-brand-surface"
        >
          <FileText className="w-4 h-4" />
          <span>Export CSV Report</span>
        </Button>
      </div>

      {/* KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Views (CPM)"
          value="12.4K"
          change={14.8}
          icon={Users}
        />
        <KPICard
          title="Unique Claims"
          value="284 Claims"
          change={8.4}
          icon={TrendingUp}
        />
        <KPICard
          title="Redemptions Made"
          value="214 Codes"
          change={12.5}
          icon={CheckCircle2}
        />
        <KPICard
          title="Conversion Rate"
          value="75.3%"
          change={4.2}
          icon={BarChart2}
        />
      </div>

      {/* Charts/Lists splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Statistics */}
        <AnalyticsCard title="Claim Device Breakdown">
          <div className="space-y-6 py-2">
            {deviceData.map((item, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-brand-text">{item.name}</span>
                  <span className="text-brand-navy">
                    {item.count} claims ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-brand-surface h-3 rounded-full overflow-hidden border border-brand-border">
                  <div
                    className="bg-brand-gradient h-full rounded-full"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Performance Insights */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-blue" />
            <span>Conversion Insights</span>
          </h3>

          <div className="space-y-4 text-xs leading-relaxed text-brand-subtext font-semibold">
            <div className="p-3.5 bg-brand-surface border border-brand-border rounded-lg space-y-1">
              <span className="text-brand-success font-bold block">
                ✓ Peak Conversion Hour
              </span>
              <p>
                Most customers redeemed vouchers between{" "}
                <strong className="text-brand-text">7:00 PM and 9:00 PM</strong>
                , matching dinner ordering spikes.
              </p>
            </div>

            <div className="p-3.5 bg-brand-surface border border-brand-border rounded-lg space-y-1">
              <span className="text-brand-blue font-bold block">
                ✓ Category Dominance
              </span>
              <p>
                Your delivery campaign is driving{" "}
                <strong className="text-brand-text">35% more checkouts</strong>{" "}
                than typical in-store BOGO vouchers.
              </p>
            </div>

            <div className="p-3.5 bg-brand-surface border border-brand-border rounded-lg space-y-1">
              <span className="text-brand-warning font-bold block">
                ⚠ Expiry Warnings
              </span>
              <p>
                Coupons expiring in{" "}
                <strong className="text-brand-text">under 48 hours</strong> saw
                a 3x spike in redemption velocity. Consider setting shorter
                durations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
