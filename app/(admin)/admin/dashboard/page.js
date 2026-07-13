"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  DollarSign,
  Store,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardChart from "@/components/shared/DashboardChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KpisGrid from "./components/KpisGrid";
import TrafficSources from "./components/TrafficSources";
import MonthlyGoals from "./components/MonthlyGoals";
import RecentOrders from "./components/RecentOrders";
import RecentActivity from "./components/RecentActivity";



export default function AdminDashboard() {
  const [activeMetricTab, setActiveMetricTab] = useState("revenue");

  // Fetch admin analytics
  const { data: analyticsData } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  const kpis = analyticsData?.kpis ?? {
    totalUsers: 2847,
    totalMerchants: 165,
    activeCoupons: 1432,
    monthlyRevenue: 6860.0,
  };
  const pendingActions = analyticsData?.pendingActions ?? [];

  // Data ranges for metrics tabs matching the exact screenshot values
  const defaultTrendData = [
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

  const trendData = analyticsData?.trendData ?? defaultTrendData;

  const chartSeries = {
    revenue: [{ key: "revenue", name: "Revenue ($)", color: "#2563eb" }],
    orders: [{ key: "orders", name: "Orders", color: "#1d4ed8" }],
    profit: [{ key: "profit", name: "Profit ($)", color: "#0a2e6e" }],
  };

  // Mock list of pending approvals themed in white, black, and blue
  const defaultPending = [
    {
      initials: "EW",
      bg: "bg-[#2563eb]",
      name: "Emma's Shop",
      type: "Merchant",
      date: "2026-06-25",
      status: "Pending Approval",
      amount: "$49.00",
    },
    {
      initials: "JC",
      bg: "bg-[#2563eb]",
      name: "Burger Joint BOGO",
      type: "Coupon",
      date: "2026-06-24",
      status: "Auditing",
      amount: "$0.00",
    },
    {
      initials: "SG",
      bg: "bg-[#0a2e6e]",
      name: "Sofia Cafe Franchise",
      type: "Merchant",
      date: "2026-06-23",
      status: "Pending Approval",
      amount: "$49.00",
    },
    {
      initials: "AT",
      bg: "bg-[#3e80dd]",
      name: "Alex Clothing Code",
      type: "Coupon",
      date: "2026-06-22",
      status: "Auditing",
      amount: "$0.00",
    },
  ];

  const recentPending =
    pendingActions.length > 0
      ? pendingActions.map((item, idx) => {
          const initials = item.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return {
            initials,
            bg: item.type === "Merchant" ? "bg-[#3e80dd]" : "bg-[#2563eb]",
            name: item.name,
            type: item.type,
            date: item.date,
            status: item.status,
            amount: item.type === "Merchant" ? "$49.00" : "$0.00",
          };
        })
      : defaultPending;

  // Mock list of activities themed in white, black, and blue
  const defaultActivities = [
    {
      icon: Store,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New merchant registered",
      desc: "Zomato Partner submitted dashboard request",
      time: "2 min ago",
    },
    {
      icon: Users,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New customer registered",
      desc: "James Chen created an account",
      time: "15 min ago",
    },
    {
      icon: Tag,
      color: "text-[#3e80dd]",
      bg: "bg-[#3e80dd]/10",
      title: "Moderation review completed",
      desc: "Boat coupons approved by admin root",
      time: "1 hour ago",
    },
    {
      icon: DollarSign,
      color: "text-[#0a2e6e]",
      bg: "bg-[#0a2e6e]/10",
      title: "SaaS Payment received",
      desc: "$49.00 subscription charge from Starbucks",
      time: "2 hours ago",
    },
    {
      icon: AlertTriangle,
      color: "text-[#1d4ed8]",
      bg: "bg-[#1d4ed8]/10",
      title: "System check warning",
      desc: "Starbucks checkout validation check timeout",
      time: "3 hours ago",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Welcome back, Admin. Here's what's happening with your business
              today.
            </p>
          </div>
          <Link
            href="/admin/approvals/merchants"
            className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-none"
          >
            <span>New Order</span>
          </Link>
        </div>

        <KpisGrid kpis={kpis} />

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
              <DashboardChart
                title=""
                data={trendData}
                series={chartSeries[activeMetricTab]}
                type={activeMetricTab === "orders" ? "bar" : "area"}
              />
            </CardContent>
          </Card>

          {/* Traffic & Goals Column */}
          <div className="col-span-full flex flex-col gap-4 xl:col-span-4">
            <TrafficSources />
            <MonthlyGoals />
          </div>
        </div>

        {/* Bottom Section: Recent Orders & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <RecentOrders recentPending={recentPending} />
          <RecentActivity defaultActivities={defaultActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
