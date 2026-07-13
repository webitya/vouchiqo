import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function RecentOrders({ recentPending }) {
  return (
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
          href="/admin/approvals/merchants"
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
              {recentPending.map((item, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-[#f8fafc]/50 transition-colors border-b border-[#f1f5f9] last:border-b-0"
                >
                  <TableCell className="p-4 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${item.bg} text-white flex items-center justify-center font-bold text-[10px] shadow-sm`}
                    >
                      {item.initials}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">
                        {item.type} Moderation
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 font-mono text-[10px] text-slate-500">
                    AUD-{1000 + idx}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 font-bold">
                    Platform Listing Audit
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      className={`rounded px-2.5 py-0.5 border-0 text-[9px] font-bold shadow-none ${
                        item.status === "Pending Approval"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "Auditing"
                            ? "bg-slate-900 text-white"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Link
                      href={
                        item.type === "Merchant"
                          ? "/admin/approvals/merchants"
                          : "/admin/approvals/coupons"
                      }
                      className="text-[#3e80dd] hover:underline font-bold text-xs"
                    >
                      Review
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentOrders;
