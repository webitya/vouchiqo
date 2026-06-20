"use client";

import { Award, PiggyBank, RotateCcw, TrendingUp } from "lucide-react";
import AnalyticsCard from "@/components/AnalyticsCard";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/KPICard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SavingsDashboard() {
  // Mock User
  const user = { name: "Sarah Jenkins", role: "customer" };

  const savingsByCategory = [
    { category: "Food & Restaurant", saved: 140, pct: 50 },
    { category: "SaaS & Productivity", saved: 95, pct: 33 },
    { category: "Travel & Rides", saved: 49.5, pct: 17 },
  ];

  const brandSavings = [
    { brand: "Zomato Delivery", claims: 4, saved: "$90.00" },
    { brand: "Notion Workspace", claims: 1, saved: "$50.00" },
    { brand: "Starbucks Coffee", claims: 3, saved: "$24.50" },
    { brand: "Airbnb Stays", claims: 1, saved: "$20.00" },
  ];

  return (
    <DashboardLayout title="Savings Dashboard" user={user}>
      {/* Welcome Accent Banner */}
      <div className="bg-brand-navy text-white p-6 rounded-xl relative overflow-hidden shadow-sm flex items-center justify-between">
        <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-bold font-heading">
            Your Savings Overview
          </h2>
          <p className="text-xs text-slate-300">
            Lifetime analytics and category breakdowns for claims and
            redemptions.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-white/10 border border-white/10 rounded-lg p-2 z-10 text-xs font-bold text-brand-warning">
          <Award className="w-4 h-4" />
          <span>Vouchiqo VIP Member</span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Cash Saved"
          value="$284.50"
          change={12.4}
          icon={PiggyBank}
        />
        <KPICard
          title="Redeemed Coupons"
          value="9 Offers"
          change={10}
          icon={Award}
        />
        <KPICard
          title="Avg. Claim Rate"
          value="98.2%"
          change={1.2}
          icon={TrendingUp}
        />
        <KPICard
          title="Revivals Driven"
          value="2 Deals"
          change={100}
          icon={RotateCcw}
        />
      </div>

      {/* Chart & Tables splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Category breakdown bar */}
        <AnalyticsCard title="Savings by Category">
          <div className="space-y-6 py-2">
            {savingsByCategory.map((item, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-brand-text">{item.category}</span>
                  <span className="text-brand-navy">
                    ${item.saved.toFixed(2)}
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

        {/* Savings Brand Breakdown Table */}
        <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-brand-navy tracking-tight uppercase">
              Top Savings Brands
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full text-xs">
              <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                <TableRow className="hover:bg-transparent border-b border-brand-border">
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Brand
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Claims Count
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                    Cash Saved
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-semibold text-brand-text">
                {brandSavings.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-brand-surface/45 transition-colors border-b border-brand-border last:border-b-0"
                  >
                    <TableCell className="p-4">{item.brand}</TableCell>
                    <TableCell className="p-4">{item.claims} claimed</TableCell>
                    <TableCell className="p-4 text-right text-brand-success font-bold">
                      {item.saved}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
