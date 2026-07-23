"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Lock,
  MousePointerClick,
  Share2,
  ShoppingBag,
  Ticket,
  TicketCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/shared/cards/KPICard";
import AnalyticsCard from "@/components/shared/data/AnalyticsCard";
import DataTable from "@/components/shared/data/DataTable";
import StatusBadge from "@/components/shared/data/StatusBadge";
import DashboardSkeleton from "@/components/shared/feedback/DashboardSkeleton";
import FormSelect from "@/components/shared/form/FormSelect";
import { Button } from "@/components/ui/button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_TRAFFIC_SOURCES = [
  { name: "Homepage Ticker & Banners", value: 38, color: "#2563eb" },
  { name: "Category & Search Pages", value: 28, color: "#e85d04" },
  { name: "Direct Referral Links", value: 22, color: "#10b981" },
  { name: "Social & Push Alerts", value: 12, color: "#8b5cf6" },
];

const DEMO_MONTHLY_TREND = [
  { label: "Jan", clicks: 20, redemptions: 5 },
  { label: "Feb", clicks: 10, redemptions: 2 },
  { label: "Mar", clicks: 25, redemptions: 8 },
  { label: "Apr", clicks: 12, redemptions: 3 },
  { label: "May", clicks: 35, redemptions: 15 },
  { label: "Jun", clicks: 18, redemptions: 6 },
  { label: "Jul", clicks: 30, redemptions: 10 },
  { label: "Aug", clicks: 15, redemptions: 4 },
  { label: "Sep", clicks: 40, redemptions: 18 },
  { label: "Oct", clicks: 22, redemptions: 7 },
  { label: "Nov", clicks: 32, redemptions: 12 },
  { label: "Dec", clicks: 15, redemptions: 5 },
];

const DEMO_WEEKLY_TREND = [
  { label: "Week 1", clicks: 15, redemptions: 5 },
  { label: "Week 2", clicks: 35, redemptions: 15 },
  { label: "Week 3", clicks: 20, redemptions: 8 },
  { label: "Week 4", clicks: 40, redemptions: 18 },
];

const DEMO_WEEKDAY_TREND = [
  { label: "Mon", clicks: 60, redemptions: 37 },
  { label: "Tue", clicks: 10, redemptions: 24 },
  { label: "Wed", clicks: 50, redemptions: 24 },
  { label: "Thu", clicks: 15, redemptions: 12 },
  { label: "Fri", clicks: 40, redemptions: 23 },
  { label: "Sat", clicks: 25, redemptions: 8 },
  { label: "Sun", clicks: 30, redemptions: 10 },
];

const DEMO_TOP_COUPONS_ALL = [
  { name: "Flat ₹500 Off", code: "FLAT500", redemptions: 184 },
  { name: "20% Welcome Offer", code: "WELCOME20", redemptions: 142 },
  { name: "Summer Special 30%", code: "SUMMER30", redemptions: 98 },
  { name: "Festive Flash Sale", code: "FESTIVE15", redemptions: 64 },
  { name: "Mega ₹100 Discount", code: "MEGA100", redemptions: 45 },
];

const DEMO_TOP_COUPONS_MONTH = [
  { name: "Summer Special 30%", code: "SUMMER30", redemptions: 78 },
  { name: "Flat ₹500 Off", code: "FLAT500", redemptions: 64 },
  { name: "20% Welcome Offer", code: "WELCOME20", redemptions: 52 },
  { name: "Mega ₹100 Discount", code: "MEGA100", redemptions: 31 },
  { name: "Festive Flash Sale", code: "FESTIVE15", redemptions: 24 },
];

const DEMO_TOP_COUPONS_WEEK = [
  { name: "20% Welcome Offer", code: "WELCOME20", redemptions: 28 },
  { name: "Flat ₹500 Off", code: "FLAT500", redemptions: 22 },
  { name: "Summer Special 30%", code: "SUMMER30", redemptions: 18 },
  { name: "Festive Flash Sale", code: "FESTIVE15", redemptions: 12 },
  { name: "Mega ₹100 Discount", code: "MEGA100", redemptions: 9 },
];

const DEMO_DAY_DATA = [
  { day: "Mon", value: 48 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 95 },
  { day: "Thu", value: 120 },
  { day: "Fri", value: 186 },
  { day: "Sat", value: 164 },
  { day: "Sun", value: 105 },
];

export default function MerchantAnalytics() {
  const [timeRange, setTimeRange] = useState("30");
  const [trendFilter, setTrendFilter] = useState("month");
  const [couponFilter, setCouponFilter] = useState("all");

  const { data: merchant, isLoading: loadingProfile } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    },
  });

  const { data: analyticsData, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["merchant-analytics", timeRange],
    queryFn: async () => {
      const period =
        timeRange === "7" ? "7d" : timeRange === "90" ? "90d" : "30d";
      const res = await fetch(`/api/analytics?period=${period}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  if (loadingProfile || loadingAnalytics) {
    return (
      <DashboardLayout title="Store Analytics" user={{ role: "merchant" }}>
        <DashboardSkeleton mode="dashboard" />
      </DashboardLayout>
    );
  }

  const plan = merchant?.plan || "starter";
  const isGrowthPlus = plan !== "starter";
  const isProPlus = plan === "pro" || plan === "enterprise";

  const overviewStats = analyticsData?.overview ?? {};
  const kpi = analyticsData?.kpi ?? {};
  const trendData = analyticsData?.trend ?? [];
  const trafficSourcesData =
    analyticsData?.trafficSources ?? DEMO_TRAFFIC_SOURCES;
  const weekdayTrendData = analyticsData?.weekdayTrend ?? DEMO_WEEKDAY_TREND;

  const totalClicks = kpi.totalClicks ?? merchant?.totalClicks ?? 0;
  const totalClaims = kpi.totalClaims ?? merchant?.totalClaims ?? 0;
  const totalRedemptions =
    kpi.totalRedemptions ?? merchant?.totalRedemptions ?? 0;
  const totalImpressions =
    kpi.totalImpressions ?? merchant?.totalImpressions ?? 0;
  const redemptionRate = kpi.redemptionRate ?? "0.0%";
  const storePageViews = kpi.storePageViews ?? merchant?.storePageViews ?? 0;
  const totalRevenue = trendData.reduce((s, t) => s + (t.revenue || 0), 0);
  const aov =
    totalRedemptions > 0 ? Math.round(totalRevenue / totalRedemptions) : 0;

  const demoTrendSet =
    trendFilter === "week"
      ? DEMO_WEEKLY_TREND
      : trendFilter === "weekday"
        ? weekdayTrendData
        : DEMO_MONTHLY_TREND;

  const enrichedTrend =
    trendData && trendData.length > 0 ? trendData : demoTrendSet;

  const top5 =
    analyticsData?.topCoupons && analyticsData.topCoupons.length > 0
      ? analyticsData.topCoupons.map((c) => ({
          name: c.title,
          code: c.code || "OFFER",
          redemptions: c.totalRedemptions || 0,
          clicks: c.clickCount || 0,
          impressions: c.impressionCount || 0,
        }))
      : DEMO_TOP_COUPONS_ALL;

  const dayData =
    trendData &&
    trendData.length > 0 &&
    trendData.some((t) => (t.orders || 0) > 0)
      ? DAYS.map((day, i) => ({
          day,
          value: Math.round(
            trendData.reduce((s, t) => s + (t.orders || 0), 0) *
              [0.08, 0.12, 0.14, 0.18, 0.2, 0.17, 0.11][i],
          ),
        }))
      : DEMO_DAY_DATA;

  const tableRows =
    analyticsData?.topCoupons && analyticsData.topCoupons.length > 0
      ? analyticsData.topCoupons.map((c) => ({
          id: c._id || c.title,
          title: c.title,
          code: c.code || "—",
          clicks: c.clickCount || c.viewCount || 0,
          redemptions: c.totalRedemptions || 0,
          successRate:
            (c.clickCount || c.viewCount || 0) > 0
              ? parseFloat(
                  (
                    ((c.totalRedemptions || 0) /
                      (c.clickCount || c.viewCount || 1)) *
                    100
                  ).toFixed(1),
                )
              : 0,
          revenue: (c.totalRedemptions || 0) * (c.discountValue || 100),
          aov: c.discountValue || 100,
          status: c.status || "active",
        }))
      : Object.entries(overviewStats).map(([id, s]) => ({
          id,
          title: s.title || id,
          code: s.code || "—",
          clicks: s.views || s.clicks || 0,
          redemptions: s.redemptions || 0,
          successRate:
            (s.views || 0) > 0
              ? parseFloat(((s.redemptions / s.views) * 100).toFixed(1))
              : 0,
          revenue: s.revenue || 0,
          aov:
            (s.redemptions || 0) > 0
              ? Math.round((s.revenue || 0) / s.redemptions)
              : 0,
          status: s.isActive !== false ? "active" : "paused",
        }));

  const tableColumns = [
    {
      key: "title",
      header: "Coupon",
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-slate-800 truncate block max-w-[160px]">
          {row.title}
        </span>
      ),
    },
    {
      key: "code",
      header: "Code",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500 uppercase">
          {row.code}
        </span>
      ),
    },
    {
      key: "clicks",
      header: "Clicks",
      sortable: true,
      cell: (row) => (
        <span className="text-right block font-medium">
          {row.clicks.toLocaleString()}
        </span>
      ),
    },
    {
      key: "redemptions",
      header: "Redemptions",
      sortable: true,
      cell: (row) => (
        <span className="text-right block font-bold text-slate-900">
          {row.redemptions.toLocaleString()}
        </span>
      ),
    },
    {
      key: "successRate",
      header: "Success Rate",
      sortable: true,
      cell: (row) => (
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full block text-center ${row.successRate >= 10 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
        >
          {row.successRate}%
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Revenue",
      sortable: true,
      cell: (row) => (
        <span className="text-right block font-black text-slate-900">
          ₹{row.revenue.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  if (!isGrowthPlus) {
    return (
      <DashboardLayout
        title="Store Analytics"
        user={{ name: merchant?.businessName, role: "merchant" }}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5 px-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Analytics Requires Growth Plan
            </h2>
            <p className="text-sm text-slate-500 font-semibold max-w-md leading-relaxed">
              Upgrade to Growth or above to unlock detailed analytics:
              impressions, clicks, redemption rates, coupon performance tables,
              and audience insights.
            </p>
          </div>
          <Link
            href="/merchant/billing"
            className="bg-[#e85d04] hover:bg-orange-600 text-white text-sm font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Upgrade to Growth — ₹1,499/mo
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#0f172a",
      borderRadius: "8px",
      border: "none",
      color: "#fff",
      fontSize: "12px",
    },
    labelStyle: { fontSize: "10px", color: "#94a3b8" },
    itemStyle: { fontSize: "12px", color: "#fff" },
  };

  return (
    <DashboardLayout
      title="Store Analytics"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Report Interval:</span>
            <FormSelect
              value={timeRange}
              onValueChange={setTimeRange}
              options={[
                { value: "7", label: "Last 7 Days" },
                { value: "30", label: "Last 30 Days" },
                { value: "90", label: "Last 90 Days" },
              ]}
              triggerClassName="w-36 bg-slate-50 h-8 border-slate-200"
            />
          </div>
          <Button
            variant="outline"
            className="text-xs py-2 px-4 font-bold flex items-center gap-1.5 border-slate-200 rounded-xl cursor-pointer shadow-none"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </Button>
        </div>

        {/* 6 Reusable KPI Cards */}
        <div
          data-tour="analytics-kpi"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5"
        >
          <KPICard
            title="Total Impressions"
            value={totalImpressions.toLocaleString()}
            subtitle="ticker views"
            icon={Eye}
            iconClassName="bg-blue-50 border-blue-200/80 text-blue-600"
            change={18.2}
          />
          <KPICard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            subtitle="page visits"
            icon={Share2}
            iconClassName="bg-indigo-50 border-indigo-200/80 text-indigo-600"
            change={12.4}
          />
          <KPICard
            title="Coupon Claims"
            value={totalClaims.toLocaleString()}
            subtitle="codes claimed"
            icon={Ticket}
            iconClassName="bg-amber-50 border-amber-200/80 text-amber-600"
            change={8.4}
          />
          <KPICard
            title="Redemptions"
            value={totalRedemptions.toLocaleString()}
            subtitle="fully redeemed"
            icon={CheckCircle2}
            iconClassName="bg-emerald-50 border-emerald-200/80 text-emerald-600"
            change={14.1}
          />
          <KPICard
            title="Redemption Rate"
            value={`${redemptionRate}%`}
            subtitle="clicks → redeem"
            icon={TrendingUp}
            iconClassName="bg-purple-50 border-purple-200/80 text-purple-600"
            change={3.2}
          />
          <KPICard
            title="Avg. Order Value"
            value={aov > 0 ? `₹${aov}` : "—"}
            subtitle="revenue per order"
            icon={ShoppingBag}
            iconClassName="bg-orange-50 border-orange-200/80 text-[#e85d04]"
            change={5.7}
          />
        </div>

        {/* Chart Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Clicks vs Redemptions Trend (58% width) */}
          <div className="lg:col-span-7 flex flex-col">
            <AnalyticsCard
              title="Clicks vs Redemptions Trend"
              extra={
                <div className="flex items-center gap-1.5 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setTrendFilter("month")}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      trendFilter === "month"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendFilter("week")}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      trendFilter === "week"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendFilter("weekday")}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      trendFilter === "weekday"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Weekday
                  </button>
                </div>
              }
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <MousePointerClick className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Clicks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#e85d04] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <TicketCheck className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Redemptions
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Total Clicks:{" "}
                  <strong className="text-slate-900">
                    {totalClicks ||
                      (trendFilter === "week"
                        ? 830
                        : trendFilter === "weekday"
                          ? 1060
                          : 5490)}
                  </strong>
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={enrichedTrend}
                    margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 40]}
                      ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]}
                    />
                    <Tooltip {...tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#2563eb" }}
                      activeDot={{ r: 5 }}
                      name="Clicks"
                    />
                    <Line
                      type="monotone"
                      dataKey="redemptions"
                      stroke="#e85d04"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#e85d04" }}
                      activeDot={{ r: 5 }}
                      name="Redemptions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsCard>
          </div>

          {/* Top 5 Coupons by Redemptions */}
          <div className="lg:col-span-5 flex flex-col">
            <AnalyticsCard
              title="Top 5 Coupons"
              extra={
                <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setCouponFilter("all")}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      couponFilter === "all"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponFilter("month")}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      couponFilter === "month"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponFilter("week")}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      couponFilter === "week"
                        ? "bg-white text-[#08214d] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Week
                  </button>
                </div>
              }
            >
              <div className="space-y-3.5 py-1">
                {top5.map((coupon, idx) => {
                  const maxVal = top5[0]?.redemptions || 1;
                  const pct = Math.round((coupon.redemptions / maxVal) * 100);
                  return (
                    <div key={coupon.name || idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 min-w-0">
                          <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] shrink-0 font-extrabold">
                            #{idx + 1}
                          </span>
                          <span
                            className="truncate max-w-[130px] sm:max-w-[170px]"
                            title={coupon.name}
                          >
                            {coupon.name}
                          </span>
                          <span className="font-mono text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1 py-0.2 rounded font-bold shrink-0">
                            {coupon.code}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 text-xs shrink-0">
                          {coupon.redemptions}{" "}
                          <span className="text-[9px] text-slate-400 font-medium">
                            used
                          </span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0 ? "bg-[#e85d04]" : "bg-[#2563eb]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnalyticsCard>
          </div>
        </div>

        {/* Chart Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Traffic Source Breakdown"
            extra={
              <span className="text-[11px] font-semibold text-slate-400">
                Channel Share
              </span>
            }
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMO_TRAFFIC_SOURCES}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {DEMO_TRAFFIC_SOURCES.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Traffic Share"]}
                      {...tooltipStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-base font-black text-slate-900 leading-none">
                    100%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Traffic
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2.5">
                {DEMO_TRAFFIC_SOURCES.map((src) => (
                  <div
                    key={src.name}
                    className="flex items-center justify-between text-xs font-semibold p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-md shrink-0 shadow-2xs"
                        style={{ backgroundColor: src.color }}
                      />
                      <span className="text-slate-700 font-bold">
                        {src.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {src.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnalyticsCard>

          <AnalyticsCard
            title="Best Performing Days of Week"
            extra={
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-md font-bold text-[10px]">
                🔥 Peak: Friday
              </span>
            }
          >
            <div className="h-52 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dayData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v) => [v, "Redemptions"]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={26}>
                    {dayData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.value === Math.max(...dayData.map((x) => x.value))
                            ? "#e85d04"
                            : "#2563eb"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
        </div>

        {/* Reusable DataTable for Coupon Performance */}
        <AnalyticsCard title="Coupon Performance Table">
          <DataTable
            columns={tableColumns}
            data={tableRows}
            searchable={true}
            searchPlaceholder="Filter performance by coupon title, code..."
            defaultPageSize={10}
            emptyState="No coupon performance data recorded."
          />
        </AnalyticsCard>
      </div>
    </DashboardLayout>
  );
}
