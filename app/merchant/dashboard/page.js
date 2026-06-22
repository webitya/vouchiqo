"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Tag,
  TrendingUp,
} from "lucide-react";
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

export default function MerchantDashboard() {
  // Fetch merchant analytics from the real API
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["merchant-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch recent redemptions for the table
  const { data: redemptionsData, isLoading: loadingRedemptions } = useQuery({
    queryKey: ["merchant-recent-redemptions"],
    queryFn: async () => {
      const res = await fetch("/api/redemptions?limit=5");
      if (!res.ok) return { redemptions: [] };
      const json = await res.json();
      return json.data;
    },
  });

  const merchant = analyticsData?.merchant;
  const topCoupons = analyticsData?.topCoupons ?? [];
  const last30 = analyticsData?.last30Days ?? {};
  const recentRedemptions = redemptionsData?.redemptions ?? [];

  const conversionRate =
    merchant?.totalClaims && merchant.totalRedemptions
      ? ((merchant.totalRedemptions / merchant.totalClaims) * 100).toFixed(1)
      : null;

  return (
    <DashboardLayout
      title="Merchant Dashboard"
      user={{ name: merchant?.businessName || "Merchant", role: "merchant" }}
    >
      {/* Welcome Merchant Banner */}
      <div className="bg-brand-navy text-white p-6 rounded-[16px] relative overflow-hidden shadow-sm flex items-center justify-between">
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-bold font-heading">
            Partner Store:{" "}
            {isLoading
              ? <span className="opacity-50">Loading...</span>
              : (merchant?.businessName ?? "Welcome")}
          </h2>
          <p className="text-xs text-slate-300">
            {last30.redemptions != null
              ? `${last30.redemptions} redemptions in the last 30 days.`
              : "Fetching your store performance…"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-white/10 border border-white/10 rounded-lg p-2 z-10 text-xs font-bold text-brand-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verified Merchant</span>
        </div>
      </div>

      {/* KPI statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Coupons"
          value={isLoading ? "—" : `${merchant?.totalCoupons ?? 0} Coupons`}
          change={null}
          icon={Tag}
        />
        <KPICard
          title="Total Coupon Claims"
          value={isLoading ? "—" : `${merchant?.totalClaims ?? 0} Claims`}
          change={null}
          icon={Tag}
        />
        <KPICard
          title="Successful Redemptions"
          value={isLoading ? "—" : `${merchant?.totalRedemptions ?? 0} Codes`}
          change={null}
          icon={CheckCircle2}
        />
        <KPICard
          title="Checkout Conversion Rate"
          value={
            isLoading ? "—" : conversionRate ? `${conversionRate}%` : "N/A"
          }
          change={null}
          icon={TrendingUp}
        />
      </div>

      {/* Core lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Coupons (Left - 2 cols) */}
        <div className="lg:col-span-2 bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-brand-navy tracking-tight uppercase">
              Top Performing Coupons
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full text-xs">
              <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                <TableRow className="hover:bg-transparent border-b border-brand-border">
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Coupon Title
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Views
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Claims
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                    Redemptions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={idx} className="animate-pulse">
                        <TableCell className="p-4">
                          <div className="h-4 bg-slate-200 rounded w-48" />
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="h-4 bg-slate-200 rounded w-10" />
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="h-4 bg-slate-200 rounded w-10" />
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <div className="h-4 bg-slate-200 rounded w-10 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : topCoupons.length > 0
                    ? topCoupons.map((coupon) => (
                        <TableRow
                          key={coupon._id}
                          className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                        >
                          <TableCell className="p-4 font-bold text-brand-navy h-auto">
                            {coupon.title}
                          </TableCell>
                          <TableCell className="p-4 h-auto">
                            {coupon.viewCount ?? 0}
                          </TableCell>
                          <TableCell className="p-4 h-auto">
                            {coupon.totalClaims ?? 0}
                          </TableCell>
                          <TableCell className="p-4 text-right text-brand-success font-bold h-auto">
                            {coupon.totalRedemptions ?? 0}
                          </TableCell>
                        </TableRow>
                      ))
                    : <TableRow>
                        <TableCell
                          colSpan={4}
                          className="p-8 text-center text-brand-subtext font-semibold"
                        >
                          No coupons yet. Create your first offer to get
                          started.
                        </TableCell>
                      </TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Campaign Tips / Quick Actions (Right - 1 col) */}
        <div className="space-y-6">
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Quick Actions
            </h3>
            <div className="space-y-2.5">
              <a
                href="/merchant/coupons/new"
                className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5 shadow-none"
              >
                <span>Create New Coupon</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/merchant/analytics"
                className="btn-tertiary w-full text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <span>View Analytics Summary</span>
              </a>
            </div>
          </div>

          {/* 30-day summary card */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Last 30 Days
            </h3>
            <div className="flex justify-between text-xs">
              <span className="text-brand-subtext font-semibold">
                Redemptions
              </span>
              <span className="font-bold text-brand-navy">
                {loadingRedemptions ? "—" : (last30.redemptions ?? 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-subtext font-semibold">Claims</span>
              <span className="font-bold text-brand-navy">
                {isLoading ? "—" : (last30.claims ?? 0)}
              </span>
            </div>
          </div>

          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-warning/10 text-brand-warning flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy">
                Merchant Growth Tip
              </h4>
              <p className="text-[10px] text-brand-subtext mt-0.5">
                Coupons with a verified success rate above 95% see double the
                claims rate. Keep validation APIs updated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
