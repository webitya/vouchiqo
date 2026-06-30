"use client";

import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Store,
  Tag,
  Users,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/shared/KPICard";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const adminUser = { name: "Platform Admin", role: "admin" };
  const [data, setData] = useState({
    kpis: {
      totalUsers: 0,
      totalMerchants: 0,
      activeCoupons: 0,
      monthlyRevenue: 0.00
    },
    pendingActions: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Error fetching admin analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" user={adminUser}>
      {/* Welcome Banner */}
      <div className="bg-brand-navy text-white p-6 rounded-[16px] relative overflow-hidden shadow-sm flex items-center justify-between">
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-bold font-heading">Control Console</h2>
          <p className="text-xs text-slate-300">
            Overview of platform KPI claims, moderation workflows, and merchant
            approvals.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-lg p-2 z-10 text-xs font-bold text-brand-warning">
          <ShieldAlert className="w-4 h-4" />
          <span>Full System Root</span>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Platform Users"
          value={`${data.kpis.totalUsers} Members`}
          change={null}
          icon={Users}
        />
        <KPICard
          title="Registered Merchants"
          value={`${data.kpis.totalMerchants} Brands`}
          change={null}
          icon={Store}
        />
        <KPICard
          title="Active Vouchers Listed"
          value={`${data.kpis.activeCoupons} Coupons`}
          change={null}
          icon={Tag}
        />
        <KPICard
          title="Monthly SaaS Revenue"
          value={`$${data.kpis.monthlyRevenue.toFixed(2)}`}
          change={null}
          icon={DollarSign}
        />
      </div>

      {/* Approval list & stats splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending approvals (Left - 2 cols) */}
        <div className="lg:col-span-2 bg-brand-bg border border-brand-border rounded-[16px] shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-brand-navy tracking-tight uppercase">
              Pending System Actions
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full text-xs">
              <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                <TableRow className="hover:bg-transparent border-b border-brand-border">
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Type
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Target Name
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Created
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                    Status
                  </TableHead>
                  <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="p-8 text-center text-brand-subtext font-semibold h-auto">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-blue" />
                      <span>Loading pending items...</span>
                    </TableCell>
                  </TableRow>
                ) : data.pendingActions.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="p-8 text-center text-brand-subtext font-semibold h-auto">
                      No pending system moderation items.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.pendingActions.map((app, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                    >
                      <TableCell className="p-4 h-auto">
                        <Badge
                          className={`rounded text-[10px] font-bold py-0.5 px-2.5 border-0 shadow-none hover:opacity-90 cursor-default ${
                            app.type === "Merchant"
                              ? "bg-brand-blue/15 text-brand-blue hover:bg-brand-blue/15"
                              : "bg-brand-warning/15 text-brand-warning hover:bg-brand-warning/15"
                          }`}
                        >
                          {app.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 font-bold text-brand-navy">
                        {app.name}
                      </TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {app.date}
                      </TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {app.status}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <Link
                          href={
                            app.type === "Merchant"
                              ? "/admin/approvals/merchants"
                              : "/admin/approvals/coupons"
                          }
                          className="text-brand-blue hover:underline font-bold"
                        >
                          Review
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick stats details / notifications panel (Right - 1 col) */}
        <div className="space-y-6">
          <div className="bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              System Alerts
            </h3>
            <div className="space-y-3.5 text-xs text-brand-subtext font-semibold">
              <div className="flex gap-2.5 p-3 rounded-lg bg-brand-error/5 border border-brand-error/15 text-brand-error items-start">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-brand-error">
                    Failed API Webhook
                  </span>
                  <span>
                    Starbucks Coffee is reporting checkout validation check
                    timeouts.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 p-3 rounded-lg bg-brand-success/5 border border-brand-success/15 text-brand-success items-start">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-brand-success">
                    Clean Cron Job Run
                  </span>
                  <span>
                    Expiry validation scheduler executed successfully 15 minutes
                    ago.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
