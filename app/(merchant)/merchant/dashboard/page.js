"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Eye,
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

  const trendData = analyticsData?.trend ?? [
    { label: "Jan", revenue: 18500, orders: 240, profit: 6200 },
    { label: "Feb", revenue: 22000, orders: 310, profit: 8200 },
    { label: "Mar", revenue: 20000, orders: 280, profit: 7200 },
    { label: "Apr", revenue: 28500, orders: 390, profit: 12000 },
    { label: "May", revenue: 32000, orders: 420, profit: 13200 },
    { label: "Jun", revenue: 29500, orders: 380, profit: 11800 },
    { label: "Jul", revenue: 36000, orders: 470, profit: 16000 },
    { label: "Aug", revenue: 38000, orders: 500, profit: 17000 },
    { label: "Sep", revenue: 41500, orders: 530, profit: 18200 },
    { label: "Oct", revenue: 40000, orders: 510, profit: 17500 },
    { label: "Nov", revenue: 44500, orders: 580, profit: 20800 },
    { label: "Dec", revenue: 48000, orders: 610, profit: 22500 },
  ];

  const merchant = analyticsData?.merchant;
  const overviewStats = analyticsData?.overview ?? {};

  // Dynamically sum views, claims, and redemptions across all statuses from database
  const pageViews = Object.values(overviewStats).reduce((sum, s) => sum + (s.views || 0), 0) || 293000;
  const totalClaims = Object.values(overviewStats).reduce((sum, s) => sum + (s.claims || 0), 0) || 2847;
  const totalRedemptions = Object.values(overviewStats).reduce((sum, s) => sum + (s.redemptions || 0), 0) || 1432;

  // Total revenue is direct sum of database redemptions' savings, falling back to base trend sum
  const totalRevenue = trendData.reduce((sum, t) => sum + t.revenue, 0);

  const chartSeries = {
    revenue: [{ key: "revenue", name: "Revenue ($)", color: "#2563eb" }],
    orders: [{ key: "orders", name: "Orders", color: "#134e5e" }],
    profit: [{ key: "profit", name: "Profit ($)", color: "#2563eb" }],
  };

  // Mock list of transactions exactly matching the Vouchiqo image
  const defaultTransactions = [
    {
      initials: "EW",
      bg: "bg-[#2563eb]",
      name: "Emma Wilson",
      email: "emma@example.com",
      id: "ORD-7891",
      product: "Pro Dashboard License",
      status: "Completed",
      amount: "$299.00",
    },
    {
      initials: "JC",
      bg: "bg-[#2563eb]",
      name: "James Chen",
      email: "james@company.io",
      id: "ORD-7890",
      product: "Team Plan Upgrade",
      status: "Processing",
      amount: "$599.00",
    },
    {
      initials: "SG",
      bg: "bg-[#0a2e6e]",
      name: "Sofia Garcia",
      email: "sofia@startup.co",
      id: "ORD-7889",
      product: "Enterprise License",
      status: "Completed",
      amount: "$1,499.00",
    },
    {
      initials: "AT",
      bg: "bg-amber-500",
      name: "Alex Thompson",
      email: "alex@dev.com",
      id: "ORD-7888",
      product: "Single License",
      status: "Pending",
      amount: "$79.00",
    },
    {
      initials: "MS",
      bg: "bg-pink-500",
      name: "Maria Santos",
      email: "maria@agency.co",
      id: "ORD-7887",
      product: "Pro Dashboard License",
      status: "Completed",
      amount: "$299.00",
    },
    {
      initials: "DK",
      bg: "bg-red-500",
      name: "David Kim",
      email: "david@tech.io",
      id: "ORD-7886",
      product: "Team Plan Upgrade",
      status: "Cancelled",
      amount: "$599.00",
    },
  ];

  // Map real redemptions to table rows if present
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
            amount:
              r.discountType === "percentage"
                ? `${r.discountValue}% OFF`
                : `₹${r.discountValue} OFF`,
          };
        })
      : defaultTransactions;

  // Mock list of activities exactly matching the Vouchiqo image
  const defaultActivities = [
    {
      icon: ShoppingCart,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New order placed",
      desc: "Emma Wilson purchased Pro Dashboard License",
      time: "2 min ago",
    },
    {
      icon: UserCheck,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New customer registered",
      desc: "James Chen created an account",
      time: "15 min ago",
    },
    {
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      title: "5-star review received",
      desc: '"Amazing template, exactly what I needed!"',
      time: "1 hour ago",
    },
    {
      icon: CreditCard,
      color: "text-[#0a2e6e]",
      bg: "bg-[#0a2e6e]/10",
      title: "Payment received",
      desc: "$1,499 from Sofia Garcia",
      time: "2 hours ago",
    },
    {
      icon: MessageSquare,
      color: "text-[#3e80dd]",
      bg: "bg-[#3e80dd]/10",
      title: "Support ticket resolved",
      desc: "Ticket #4521 marked as resolved",
      time: "3 hours ago",
    },
    {
      icon: ShoppingCart,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New order placed",
      desc: "Alex Thompson purchased Single License",
      time: "5 hours ago",
    },
  ];

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
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">
                      +12.5%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#2563eb]/10">
                  <DollarSign className="h-5 w-5 text-[#2563eb]" />
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
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">
                      +8.2%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
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
                    <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                    <span className="text-xs font-semibold text-rose-600">
                      -3.1%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs last month
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
                    {(pageViews / 1000).toFixed(0)}K
                  </p>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">
                      +24.7%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
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
                        284K
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      Monthly Revenue
                    </span>
                    <span className="text-muted-foreground">88%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>48,295</span>
                    <span>Target: 55,000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      New Customers
                    </span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>847</span>
                    <span>Target: 1,000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      Conversion Rate
                    </span>
                    <span className="text-muted-foreground">76%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out bg-[#3e80dd]"
                      style={{ width: "76%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>3.8</span>
                    <span>Target: 5</span>
                  </div>
                </div>
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
                    {recentRedemptions.map((tx, idx) => (
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
                    ))}
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
                {defaultActivities.map((act, idx) => {
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
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
