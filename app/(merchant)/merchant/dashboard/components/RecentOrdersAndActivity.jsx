"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export default function RecentOrdersAndActivity({
  recentRedemptions,
  recentClaims = [],
  recentActivities,
}) {
  const [activeTab, setActiveTab] = useState("redemptions"); // "redemptions" | "claims"

  const displayList =
    activeTab === "redemptions" ? recentRedemptions : recentClaims;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Recent Orders / Claims List (2/3 width) */}
      <Card className="col-span-full xl:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full hover:shadow-sm transition-all duration-200 p-0 gap-0 text-left font-sans">
        <CardHeader className="px-4 py-3 sm:px-4 sm:py-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50 min-h-[48px]">
          <div>
            <CardTitle className="font-sans text-xs sm:text-[12px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
              {activeTab === "redemptions"
                ? "Recent Orders (Redemptions)"
                : "Recent Coupon Claims"}
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
              {activeTab === "redemptions"
                ? "Latest redeemed transactions from your store"
                : "Latest customer claims & saved codes from your store"}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Tab Switched Header */}
            <div className="flex bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("redemptions")}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md transition-all cursor-pointer border-0 ${
                  activeTab === "redemptions"
                    ? "bg-white text-[#08214d] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 bg-transparent"
                }`}
              >
                Redemptions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("claims")}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md transition-all cursor-pointer border-0 ${
                  activeTab === "claims"
                    ? "bg-white text-[#08214d] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 bg-transparent"
                }`}
              >
                Claims ({recentClaims.length})
              </button>
            </div>

            <Link
              href="/merchant/coupons"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs font-sans">
              <TableHeader className="bg-[#f8fafc] border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-2.5 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Customer
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    {activeTab === "redemptions" ? "Order ID" : "Claim ID"}
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Product
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px] text-right">
                    {activeTab === "redemptions" ? "Amount" : "Promo Code"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {displayList.length > 0 ? (
                  displayList.map((tx, idx) => (
                    <TableRow
                      key={tx.id || idx}
                      className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <TableCell className="py-2.5 px-3 flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full ${tx.bg || "bg-blue-600"} text-white flex items-center justify-center font-bold text-[9px] shadow-2xs shrink-0`}
                        >
                          {tx.initials || "CU"}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-800 text-xs">
                            {tx.name || tx.userName || "Customer"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {tx.email || "customer@example.com"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 px-3 font-mono text-[9px] text-slate-500">
                        {tx.id?.slice(0, 8) || "—"}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-slate-600 font-bold text-xs">
                        {tx.product || tx.couponTitle || "Discount Offer"}
                      </TableCell>
                      <TableCell className="py-2.5 px-3">
                        <Badge
                          className={`rounded-full px-2 py-0.5 border-0 text-[9px] font-bold shadow-none ${
                            tx.status === "Completed" ||
                            activeTab === "redemptions"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                          }`}
                        >
                          {tx.status ||
                            (activeTab === "redemptions"
                              ? "Redeemed"
                              : "Claimed")}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-right text-slate-900 font-bold text-xs">
                        {tx.amount || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-slate-400 text-xs"
                    >
                      No recent {activeTab} recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline (1/3 width) */}
      <Card className="col-span-full xl:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full hover:shadow-sm transition-all duration-200 p-0 gap-0 font-sans">
        <CardHeader className="px-4 py-3 sm:px-4 sm:py-3 border-b border-slate-100 flex flex-row justify-between items-center bg-slate-50/50 min-h-[48px]">
          <div>
            <CardTitle className="font-sans text-xs sm:text-[12px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
              Latest events from your store
            </CardDescription>
          </div>
          <Link
            href="/merchant/analytics"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 pt-3">
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                    <div className="flex-grow space-y-0.5 text-xs text-left">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-slate-800 text-[11px]">
                          {act.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                No recent store activities recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
