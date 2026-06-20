"use client";

import { Check, Tag, X } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CouponModeration() {
  // Mock pending coupons
  const [coupons, setCoupons] = useState([
    {
      id: "c-pending-1",
      brand: "Starbucks Coffee",
      title: "Get 30% discount on coffee packs",
      value: "30% OFF",
      rules: "Valid online only. Minimum cart $20.",
      submittedAt: "2026-06-18",
    },
  ]);

  const handleAction = (id, _action) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout
      title="Coupon Moderation"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
        Coupon Moderation Queue
      </h2>

      {coupons.length > 0
        ? <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto flex-1">
              <Table className="w-full text-xs">
                <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                  <TableRow className="hover:bg-transparent border-b border-brand-border">
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Brand
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Offer Title
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Discount Value
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Redemption Rules
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Submitted
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                      Moderation Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                  {coupons.map((coupon) => (
                    <TableRow
                      key={coupon.id}
                      className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                    >
                      <TableCell className="p-4 font-bold text-brand-navy h-auto">
                        {coupon.brand}
                      </TableCell>
                      <TableCell className="p-4">{coupon.title}</TableCell>
                      <TableCell className="p-4 text-brand-blue font-bold">
                        {coupon.value}
                      </TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {coupon.rules}
                      </TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {coupon.submittedAt}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon"
                            onClick={() => handleAction(coupon.id, "approve")}
                            className="bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleAction(coupon.id, "reject")}
                            className="bg-brand-error/15 text-brand-error hover:bg-brand-error hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        : <EmptyState
            icon={Tag}
            title="No coupons pending review"
            description="Good job. All discount campaigns are currently active and moderated."
          />}
    </DashboardLayout>
  );
}
