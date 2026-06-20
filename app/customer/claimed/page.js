"use client";

import { Check, Copy, History } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClaimedCoupons() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Mock claimed history
  const claims = [
    {
      brand: "Zomato Delivery",
      offer: "50% OFF your next food order",
      code: "VOUCH-ZOMATO-48A",
      claimedAt: "2026-06-17",
      status: "Active",
    },
    {
      brand: "Starbucks Coffee",
      offer: "Buy One Get One Free",
      code: "VOUCH-BOGO-COFFEE",
      claimedAt: "2026-06-15",
      status: "Redeemed",
    },
  ];

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <DashboardLayout
      title="Claimed Coupons"
      user={{ name: "Sarah Jenkins", role: "customer" }}
    >
      <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
        Your Coupon Claims & Redeemed History
      </h2>

      {claims.length > 0
        ? <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full text-xs">
                <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                  <TableRow className="hover:bg-transparent border-b border-brand-border">
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Brand
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Offer
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Voucher Code
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Claimed Date
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                  {claims.map((claim, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                    >
                      <TableCell className="p-4 font-bold text-brand-navy">
                        {claim.brand}
                      </TableCell>
                      <TableCell className="p-4">{claim.offer}</TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-brand-surface border border-brand-border px-2.5 py-1 rounded text-brand-navy tracking-wide font-bold">
                            {claim.code}
                          </span>
                          <button
                            onClick={() => handleCopy(claim.code, idx)}
                            className="text-brand-subtext hover:text-brand-blue p-1 rounded hover:bg-brand-surface transition-all"
                          >
                            {copiedIndex === idx
                              ? <Check className="w-3.5 h-3.5 text-brand-success" />
                              : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">{claim.claimedAt}</TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant={
                            claim.status === "Active" ? "success" : "secondary"
                          }
                          className={`rounded-full text-[10px] font-bold py-0.5 px-2.5 border-0 shadow-none ${
                            claim.status === "Active"
                              ? "bg-brand-success/15 text-brand-success hover:bg-brand-success/15"
                              : "bg-brand-subtext/15 text-brand-subtext hover:bg-brand-subtext/15"
                          }`}
                        >
                          {claim.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        : <EmptyState
            icon={History}
            title="No claims history"
            description="Your claimed voucher codes will appear here once you redeem them."
          />}
    </DashboardLayout>
  );
}
