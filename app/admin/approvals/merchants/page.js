"use client";

import { Check, Store, X } from "lucide-react";
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

export default function MerchantApprovals() {
  // Mock pending merchants
  const [merchants, setMerchants] = useState([
    {
      id: "m-nike",
      name: "Nike Retail Outlet",
      email: "partner@nike.com",
      website: "https://nike.com",
      location: "Oregon, USA",
      submittedAt: "2026-06-18",
    },
    {
      id: "m-msft",
      name: "Microsoft SaaS Store",
      email: "partner@microsoft.com",
      website: "https://microsoft.com",
      location: "Seattle, USA",
      submittedAt: "2026-06-16",
    },
  ]);

  const handleAction = (id, _action) => {
    // Action is either approve or reject
    setMerchants((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <DashboardLayout
      title="Merchant Approvals"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
        Merchant Signup Review Queue
      </h2>

      {merchants.length > 0
        ? <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto flex-1">
              <Table className="w-full text-xs">
                <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                  <TableRow className="hover:bg-transparent border-b border-brand-border">
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Brand Details
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Contact Info
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Registered Location
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Submitted Date
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                      Moderation Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                  {merchants.map((merchant) => (
                    <TableRow
                      key={merchant.id}
                      className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                    >
                      <TableCell className="p-4 h-auto">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-navy">
                            {merchant.name}
                          </span>
                          <a
                            href={merchant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-brand-blue hover:underline font-bold mt-0.5"
                          >
                            {merchant.website.replace("https://", "")}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">{merchant.email}</TableCell>
                      <TableCell className="p-4">{merchant.location}</TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {merchant.submittedAt}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon"
                            onClick={() => handleAction(merchant.id, "approve")}
                            className="bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleAction(merchant.id, "reject")}
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
            icon={Store}
            title="No pending merchants"
            description="Excellent work. All merchant application submissions have been reviewed and approved."
          />}
    </DashboardLayout>
  );
}
