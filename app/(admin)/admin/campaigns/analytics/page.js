"use client";

import { BarChart2, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminCampaignAnalyticsPage() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const analyticsSummary = {
    totalImpressions: 142000,
    totalClicks: 24500,
    totalRedemptions: 4850,
    uniqueUsers: 3920,
    conversionRate: "19.8%",
    estimatedRevenue: 485000,
    commissionCharged: 24250,
    successRate: "94.2%",
  };

  const channelBreakdown = [
    {
      channel: "Hot Deals Ticker",
      impressions: 58000,
      clicks: 9400,
      redemptions: 1950,
      rate: "20.7%",
    },
    {
      channel: "Targeted Push Alert",
      impressions: 42000,
      clicks: 8100,
      redemptions: 1620,
      rate: "20.0%",
    },
    {
      channel: "Email Blast",
      impressions: 28000,
      clicks: 4800,
      redemptions: 880,
      rate: "18.3%",
    },
    {
      channel: "Direct Link Redirection",
      impressions: 14000,
      clicks: 2200,
      redemptions: 400,
      rate: "18.1%",
    },
  ];

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast.success(
        "Post-campaign PDF report generated & auto-emailed to Pro/Enterprise merchants!",
      );
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Campaign Analytics & Reporting"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-[#e85d04]" /> Campaign
              Analytics &amp; Reporting (/admin/campaigns/analytics)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Channel attribution, conversion funnels, post-campaign PDF report
              generator &amp; automated email delivery.
            </p>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="bg-[#e85d04] hover:bg-orange-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            <span>
              {isGeneratingReport
                ? "Generating PDF..."
                : "Generate Post-Campaign PDF Report"}
            </span>
          </Button>
        </div>

        {/* 8 KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Impressions
            </span>
            <p className="text-xl font-black text-slate-900">
              {analyticsSummary.totalImpressions.toLocaleString()}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Clicks
            </span>
            <p className="text-xl font-black text-slate-900">
              {analyticsSummary.totalClicks.toLocaleString()}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Redemptions
            </span>
            <p className="text-xl font-black text-emerald-600">
              {analyticsSummary.totalRedemptions.toLocaleString()}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Unique Users
            </span>
            <p className="text-xl font-black text-slate-900">
              {analyticsSummary.uniqueUsers.toLocaleString()}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Conversion Rate
            </span>
            <p className="text-xl font-black text-blue-600">
              {analyticsSummary.conversionRate}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Est Revenue Driven
            </span>
            <p className="text-xl font-black text-slate-900">
              ₹{analyticsSummary.estimatedRevenue.toLocaleString("en-IN")}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Commission Charged
            </span>
            <p className="text-xl font-black text-[#e85d04]">
              ₹{analyticsSummary.commissionCharged.toLocaleString("en-IN")}
            </p>
          </Card>
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-4 bg-white space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Success Rate
            </span>
            <p className="text-xl font-black text-purple-600">
              {analyticsSummary.successRate}
            </p>
          </Card>
        </div>

        {/* Channel Attribution Breakdown Table */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden text-left">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                Channel Attribution Breakdown (Ticker, Push, Email, Direct)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Performance tracked individually across promotional channels
              </p>
            </div>
          </div>

          <Table className="w-full text-xs">
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Channel
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Impressions
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Clicks
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Redemptions
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Conversion %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {channelBreakdown.map((row) => (
                <TableRow
                  key={row.channel}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="p-4 font-bold text-slate-900">
                    {row.channel}
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono">
                    {row.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono">
                    {row.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="p-4 text-right font-black text-slate-900">
                    {row.redemptions.toLocaleString()}
                  </TableCell>
                  <TableCell className="p-4 text-right font-bold text-emerald-600">
                    {row.rate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
