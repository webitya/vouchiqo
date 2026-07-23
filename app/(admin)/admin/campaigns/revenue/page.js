"use client";

import { CheckCircle2, CreditCard, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
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

const REVENUE_TRANSACTIONS = [
  {
    id: "REV-2026-101",
    date: "2026-07-21 14:30",
    merchantName: "JewelCraft Ranchi",
    campaignName: "Diwali Gold Fest",
    addOnType: "Homepage Featured Slot (₹999)",
    amount: "₹999.00",
    status: "Razorpay Verified",
    invoiceUrl: "https://vouchiqo.com/invoices/INV-2026-101.pdf",
  },
  {
    id: "REV-2026-102",
    date: "2026-07-21 11:15",
    merchantName: "Marbella Tiles & Sanitary",
    campaignName: "Pre-Diwali Festival Sale",
    addOnType: "Targeted Push Notification (₹599)",
    amount: "₹599.00",
    status: "Razorpay Verified",
    invoiceUrl: "https://vouchiqo.com/invoices/INV-2026-102.pdf",
  },
  {
    id: "REV-2026-103",
    date: "2026-07-20 16:45",
    merchantName: "Burger House Ranchi",
    campaignName: "Weekend BOGO Fest",
    addOnType: "Flash Campaign Boost (₹799)",
    amount: "₹799.00",
    status: "Razorpay Verified",
    invoiceUrl: "https://vouchiqo.com/invoices/INV-2026-103.pdf",
  },
];

export default function AdminCampaignRevenuePage() {
  const revenueSummary = {
    totalAddOnRevenue: 148500,
    totalSubscriptionRevenue: 498000,
    monthlyTotal: 646500,
  };

  return (
    <DashboardLayout
      title="Campaign Revenue Management"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#e85d04]" /> Campaign Revenue
              Management (/admin/campaigns/revenue)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time Razorpay webhook payment status, add-on vs subscription
              revenue breakdown &amp; GST tax invoices.
            </p>
          </div>

          <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 border-0 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Razorpay Webhooks Active
          </Badge>
        </div>

        {/* Monthly Revenue Summary Cards & Add-on vs Subscription Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Campaign Add-On Revenue
            </span>
            <p className="text-2xl font-black text-[#e85d04]">
              ₹{revenueSummary.totalAddOnRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-slate-400 font-medium block">
              Ticker boosts, push alerts &amp; featured slots
            </span>
          </Card>

          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Merchant Subscriptions
            </span>
            <p className="text-2xl font-black text-blue-600">
              ₹{revenueSummary.totalSubscriptionRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-slate-400 font-medium block">
              Starter, Growth, Pro &amp; Enterprise plans
            </span>
          </Card>

          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Gross Monthly Platform Revenue
            </span>
            <p className="text-2xl font-black text-emerald-600">
              ₹{revenueSummary.monthlyTotal.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold block">
              +18.5% growth vs last month
            </span>
          </Card>
        </div>

        {/* Campaign Add-On Revenue Transactions Table */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden text-left">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                Campaign Add-On Payment Transactions
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Real-time status synced via Razorpay payment webhooks
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Exporting revenue records to CSV...")
              }
              className="text-xs font-bold rounded-xl border-slate-200"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-[#e85d04]" /> Export
              CSV
            </Button>
          </div>

          <Table className="w-full text-xs">
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Transaction ID
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Date &amp; Time
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Merchant Name
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Campaign Name
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Add-On Purchased
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Amount Charged
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                  Payment Status
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Invoice
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {REVENUE_TRANSACTIONS.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="p-4 font-mono text-[10px] text-slate-600 font-bold">
                    {tx.id}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 font-mono text-[11px]">
                    {tx.date}
                  </TableCell>
                  <TableCell className="p-4 font-bold text-slate-900">
                    {tx.merchantName}
                  </TableCell>
                  <TableCell className="p-4 font-bold text-slate-800">
                    {tx.campaignName}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600">
                    {tx.addOnType}
                  </TableCell>
                  <TableCell className="p-4 text-right font-black text-slate-900">
                    {tx.amount}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold border-0">
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast.success(`Downloading invoice PDF for ${tx.id}...`)
                      }
                      className="text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" /> GST PDF
                    </Button>
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
