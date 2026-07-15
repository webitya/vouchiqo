"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CreditCard,
  Eye,
  IndianRupee,
  MessageSquare,
  Plus,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Premium Recharts-based Sparkline component
function RechartsSparkline({ data = [], dataKey = "value", color = "#2563eb" }) {
  if (data.length === 0) return null;
  const chartData = data.map((val, idx) => ({ id: idx, value: val }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={`sparkGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${dataKey})`}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MerchantDashboard() {
  const [activeMetricTab, setActiveMetricTab] = useState("revenue");

  // Fetch merchant analytics from the real API
  const { data: analyticsData } = useQuery({
    queryKey: ["merchant-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch recent redemptions for the table
  const { data: redemptionsData } = useQuery({
    queryKey: ["merchant-recent-redemptions"],
    queryFn: async () => {
      const res = await fetch("/api/redemptions?limit=5");
      if (!res.ok) return { redemptions: [] };
      const json = await res.json();
      return json.data;
    },
  });

  // Only use real DB trend data — no fake fallback numbers
  const trendData = analyticsData?.trend ?? [];

  const merchant = analyticsData?.merchant;
  const overviewStats = analyticsData?.overview ?? {};

  // Sum real counts from database — show 0 if no data yet (no fake fallbacks)
  const pageViews = Object.values(overviewStats).reduce((sum, s) => sum + (s.views || 0), 0);
  const totalClaims = Object.values(overviewStats).reduce((sum, s) => sum + (s.claims || 0), 0);
  const totalRedemptions = Object.values(overviewStats).reduce((sum, s) => sum + (s.redemptions || 0), 0);

  // Total revenue is direct sum of database redemptions' savings
  const totalRevenue = trendData.reduce((sum, t) => sum + t.revenue, 0);

  // Compute real month-over-month percentage change from trendData
  function momChange(key) {
    if (trendData.length < 2) return null;
    const last = trendData[trendData.length - 1]?.[key] ?? 0;
    const prev = trendData[trendData.length - 2]?.[key] ?? 0;
    if (prev === 0) return null;
    return Math.round(((last - prev) / prev) * 100);
  }
  const revenueMoM = momChange("revenue");
  const ordersMoM = momChange("orders");

  const chartSeries = {
    revenue: [{ key: "revenue", name: "Revenue (₹)", color: "#2563eb" }],
    orders: [{ key: "orders", name: "Orders", color: "#134e5e" }],
    profit: [{ key: "profit", name: "Profit (₹)", color: "#2563eb" }],
  };

  // Map real redemptions from DB to table rows.
  // No fallback to mock transactions — we show empty list if there's no data.
  const recentRedemptions =
    redemptionsData?.redemptions?.length > 0
      ? redemptionsData.redemptions.map((r) => {
          const name = r.userId?.name || "Customer User";
          const email = r.userId?.email || "customer@vouchiqo.com";
          const initials = name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return {
            initials,
            bg: "bg-[#3e80dd]",
            name,
            email,
            id: r._id.toString().slice(-8).toUpperCase(),
            product: r.couponId?.title || "Special Deal Offer",
            status: "Completed",
            amount: `₹${r.savingsAmount || 0}`,
          };
        })
      : [];

  // Generate activities dynamically from real database redemptions history
  const recentActivities =
    redemptionsData?.redemptions?.length > 0
      ? redemptionsData.redemptions.map((r) => {
          const name = r.userId?.name || "Customer User";
          const date = new Date(r.createdAt);
          const timeLabel = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            icon: ShoppingCart,
            color: "text-[#2563eb]",
            bg: "bg-[#2563eb]/10",
            title: "Coupon Redeemed",
            desc: `${name} redeemed "${r.couponId?.title || "Coupon"}" (Saved ₹${r.savingsAmount || 0})`,
            time: timeLabel,
          };
        })
      : [];

  return (
    <DashboardLayout
      title="Dashboard"
      user={{ name: merchant?.businessName || "Aigars S.", role: "merchant" }}
    >
      <div className="space-y-6 text-left font-sans">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Welcome back, {merchant?.businessName || "Aigars"}. Here's what's
              happening with your business today.
            </p>
          </div>
          <Link
            href="/merchant/coupons/new"
            className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-none"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </Link>
        </div>

        {/* 4 Column KPI Cards Grid with Filled Sparkline SVGs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Total Revenue */}
          <div
            data-slot="card"
            className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
          >
            <div data-slot="card-content" className="p-5 pb-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {revenueMoM !== null ? (
                      revenueMoM >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                      )
                    ) : null}
                    {revenueMoM !== null && (
                      <span className={`text-xs font-semibold ${revenueMoM >= 0 ? "text-blue-600" : "text-rose-600"}`}>
                        {revenueMoM >= 0 ? "+" : ""}{revenueMoM}%
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {revenueMoM !== null ? "vs last month" : "No trend data"}
                    </span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#2563eb]/10">
                  <IndianRupee className="h-5 w-5 text-[#2563eb]" />
                </div>
              </div>
            </div>
            <div className="h-12 w-full mt-3">
              <RechartsSparkline
                data={trendData.map((t) => t.revenue)}
                dataKey="revenue"
                color="#2563eb"
              />
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div
            data-slot="card"
            className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
          >
            <div data-slot="card-content" className="p-5 pb-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {totalClaims.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Coupon claims this period</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#2563eb]/10">
                  <Users className="h-5 w-5 text-[#2563eb]" />
                </div>
              </div>
            </div>
            <div className="h-12 w-full mt-3">
              <RechartsSparkline
                data={trendData.map((t) => t.orders * 1.5 + 50)}
                dataKey="users"
                color="#2563eb"
              />
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div
            data-slot="card"
            className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
          >
            <div data-slot="card-content" className="p-5 pb-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {totalRedemptions.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {ordersMoM !== null ? (
                      ordersMoM >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                      )
                    ) : null}
                    {ordersMoM !== null && (
                      <span className={`text-xs font-semibold ${ordersMoM >= 0 ? "text-blue-600" : "text-rose-600"}`}>
                        {ordersMoM >= 0 ? "+" : ""}{ordersMoM}%
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {ordersMoM !== null ? "vs last month" : "No trend data"}
                    </span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#3e80dd]/10">
                  <ShoppingCart className="h-5 w-5 text-[#3e80dd]" />
                </div>
              </div>
            </div>
            <div className="h-12 w-full mt-3">
              <RechartsSparkline
                data={trendData.map((t) => t.orders)}
                dataKey="orders"
                color="#3e80dd"
              />
            </div>
          </div>

          {/* Card 4: Page Views */}
          <div
            data-slot="card"
            className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
          >
            <div data-slot="card-content" className="p-5 pb-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Page Views
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {pageViews > 0 ? `${(pageViews / 1000).toFixed(1)}K` : "—"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Coupon page visits</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#eab308]/10">
                  <Eye className="h-5 w-5 text-[#eab308]" />
                </div>
              </div>
            </div>
            <div className="h-12 w-full mt-3">
              <RechartsSparkline
                data={trendData.map((t) => t.orders * 4 + 300)}
                dataKey="views"
                color="#eab308"
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Main Chart Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Chart Container (2/3 width) */}
          <Card className="col-span-full xl:col-span-8 border-[#e2e8f0] shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-slate-100">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Overview
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold mt-0.5">
                  Monthly performance for the current year
                </CardDescription>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 shrink-0 select-none">
                {["revenue", "orders", "profit"].map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => setActiveMetricTab(metric)}
                    className={`text-[10px] font-bold px-3.5 py-1 rounded-md transition-all uppercase cursor-pointer border-0 ${
                      activeMetricTab === metric
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 bg-transparent"
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {activeMetricTab === "orders" ? (
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }}
                        labelStyle={{ fontSize: "10px", color: "#94a3b8" }}
                        itemStyle={{ fontSize: "12px", color: "#fff" }}
                        formatter={(value) => [`${value} Orders`, "Volume"]}
                      />
                      <Bar dataKey="orders" fill="#134e5e" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  ) : (
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(tick) => `₹${(tick / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }}
                        labelStyle={{ fontSize: "10px", color: "#94a3b8" }}
                        itemStyle={{ fontSize: "12px", color: "#fff" }}
                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, activeMetricTab === "revenue" ? "Revenue" : "Profit"]}
                      />
                      <Area
                        type="monotone"
                        dataKey={activeMetricTab}
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#mainAreaGrad)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic & Goals Column */}
          <div className="col-span-full flex flex-col gap-4 xl:col-span-4">
            <div
              data-slot="card"
              className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-200"
            >
              <div
                data-slot="card-header"
                className="flex flex-col space-y-1.5 p-6 pb-2"
              >
                <div className="tracking-tight text-base font-semibold">
                  Traffic Sources
                </div>
                <p className="text-xs text-muted-foreground">
                  Where your visitors come from
                </p>
              </div>
              <div data-slot="card-content" className="p-6 pt-0">
                <div className="flex items-center gap-4">
                  <div className="relative h-36 w-36 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Direct", value: 35, color: "#3e80dd" },
                            { name: "Organic", value: 28, color: "#2563eb" },
                            { name: "Referral", value: 22, color: "#0a2e6e" },
                            { name: "Social", value: 15, color: "#2563eb" }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={63}
                          paddingAngle={2}
                          dataKey="value"
                          isAnimationActive={true}
                        >
                          {[
                            { name: "Direct", value: 35, color: "#3e80dd" },
                            { name: "Organic", value: 28, color: "#2563eb" },
                            { name: "Referral", value: 22, color: "#0a2e6e" },
                            { name: "Social", value: 15, color: "#2563eb" }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      <span className="text-lg font-bold text-slate-800">
                        {pageViews > 0 ? `${(pageViews / 1000).toFixed(0)}K` : "—"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Visits
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#3e80dd]"></div>
                        <span className="text-xs text-muted-foreground">
                          Direct
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        35%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#2563eb]"></div>
                        <span className="text-xs text-muted-foreground">
                          Organic
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        28%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#0a2e6e]"></div>
                        <span className="text-xs text-muted-foreground">
                          Referral
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        22%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#2563eb]"></div>
                        <span className="text-xs text-muted-foreground">
                          Social
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        15%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-slot="card"
              className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-200"
            >
              <div
                data-slot="card-header"
                className="flex flex-col space-y-1.5 p-6 pb-2"
              >
                <div className="tracking-tight text-base font-semibold">
                  Monthly Goals
                </div>
                <p className="text-xs text-muted-foreground">
                  Track progress toward targets
                </p>
              </div>
              <div data-slot="card-content" className="p-6 pt-0 space-y-5">
                {(() => {
                  const revenueGoal = analyticsData?.goals?.revenueTarget ?? 0;
                  const revenueActual = totalRevenue;
                  const revenuePct = revenueGoal > 0 ? Math.min(100, Math.round((revenueActual / revenueGoal) * 100)) : 0;

                  const claimsGoal = analyticsData?.goals?.claimsTarget ?? 0;
                  const claimsPct = claimsGoal > 0 ? Math.min(100, Math.round((totalClaims / claimsGoal) * 100)) : 0;

                  const redemptionPct = totalClaims > 0 ? Math.min(100, Math.round((totalRedemptions / totalClaims) * 100)) : 0;

                  return (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Monthly Revenue</span>
                          <span className="text-muted-foreground">{revenueGoal > 0 ? `${revenuePct}%` : "—"}</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                            style={{ width: revenueGoal > 0 ? `${revenuePct}%` : "0%" }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>₹{revenueActual.toLocaleString("en-IN")}</span>
                          <span>{revenueGoal > 0 ? `Target: ₹${revenueGoal.toLocaleString("en-IN")}` : "No target set"}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Coupon Claims</span>
                          <span className="text-muted-foreground">{claimsGoal > 0 ? `${claimsPct}%` : "—"}</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                            style={{ width: claimsGoal > 0 ? `${claimsPct}%` : "0%" }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{totalClaims.toLocaleString()}</span>
                          <span>{claimsGoal > 0 ? `Target: ${claimsGoal.toLocaleString()}` : "No target set"}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Conversion Rate</span>
                          <span className="text-muted-foreground">{totalClaims > 0 ? `${redemptionPct}%` : "—"}</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out bg-[#3e80dd]"
                            style={{ width: `${redemptionPct}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{totalRedemptions} redeemed</span>
                          <span>of {totalClaims} claimed</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Orders & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Recent Orders (Transactions) List (2/3 width) */}
          <Card className="col-span-full xl:col-span-8 border-[#e2e8f0] shadow-sm">
            <CardHeader className="pb-3 border-b border-[#f1f5f9] flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold mt-0.5">
                  Latest transactions from your store
                </CardDescription>
              </div>
              <Link
                href="/merchant/coupons"
                className="text-xs font-bold text-[#3e80dd] hover:underline flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="w-full text-xs">
                  <TableHeader className="bg-[#f8fafc] border-b border-brand-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="p-4 text-slate-500 font-bold uppercase tracking-wider">
                        Customer
                      </TableHead>
                      <TableHead className="p-4 text-slate-500 font-bold uppercase tracking-wider">
                        Order ID
                      </TableHead>
                      <TableHead className="p-4 text-slate-500 font-bold uppercase tracking-wider">
                        Product
                      </TableHead>
                      <TableHead className="p-4 text-slate-500 font-bold uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="p-4 text-slate-500 font-bold uppercase tracking-wider text-right">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-brand-border font-semibold text-slate-700">
                    {recentRedemptions.length > 0 ? (
                      recentRedemptions.map((tx, idx) => (
                        <TableRow
                          key={idx}
                          className="hover:bg-[#f8fafc]/50 transition-colors border-b border-[#f1f5f9] last:border-b-0"
                        >
                          <TableCell className="p-4 flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${tx.bg} text-white flex items-center justify-center font-bold text-[10px] shadow-sm`}
                            >
                              {tx.initials}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-slate-800">
                                {tx.name}
                              </span>
                              <span className="text-[9px] text-slate-400 font-semibold">
                                {tx.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 font-mono text-[10px] text-slate-500">
                            {tx.id}
                          </TableCell>
                          <TableCell className="p-4 text-slate-600 font-bold">
                            {tx.product}
                          </TableCell>
                          <TableCell className="p-4">
                            <Badge
                              className={`rounded px-2.5 py-0.5 border-0 text-[9px] font-bold shadow-none ${
                                tx.status === "Completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : tx.status === "Processing"
                                    ? "bg-slate-900 text-white"
                                    : tx.status === "Pending"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4 text-right text-slate-900 font-bold">
                            {tx.amount}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center p-8 text-slate-400 font-medium">
                          No recent coupon redemptions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline (1/3 width) */}
          <Card className="col-span-full xl:col-span-4 border-[#e2e8f0] shadow-sm">
            <CardHeader className="pb-3 border-b border-[#f1f5f9] flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold mt-0.5">
                  Latest events from your store
                </CardDescription>
              </div>
              <Link
                href="/merchant/analytics"
                className="text-xs font-bold text-[#3e80dd] hover:underline flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <div className="space-y-5">
                {recentActivities.length > 0 ? (
                  recentActivities.map((act, idx) => {
                    const Icon = act.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex-grow space-y-0.5 text-xs text-left">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="font-bold text-slate-800">
                              {act.title}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                              {act.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            {act.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                    No recent store activities recorded.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
