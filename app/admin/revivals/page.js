"use client";

import { Check, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RevivalManagement() {
  // Mock pending revivals
  const [requests, setRequests] = useState([
    {
      id: "r1",
      brandName: "Shopify Storefront",
      couponTitle: "Save 20% on Monthly Business Plan",
      votes: 489,
      pct: 90,
      status: "Voting Active",
    },
    {
      id: "r2",
      brandName: "Uber Airport",
      couponTitle: "$15 Flat discount on rides",
      votes: 312,
      pct: 75,
      status: "Voting Active",
    },
  ]);

  const handleAction = (id, _action) => {
    // Approve: contacts merchant / resolves. Archive: removes.
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <DashboardLayout
      title="Revival Requests"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
        Customer Revival Requests Queue
      </h2>

      {requests.length > 0
        ? <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto flex-1">
              <Table className="w-full text-xs">
                <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                  <TableRow className="hover:bg-transparent border-b border-brand-border">
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Brand
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Campaign Title
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Votes Count
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                      Status
                    </TableHead>
                    <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                      Moderation Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                  {requests.map((req) => (
                    <TableRow
                      key={req.id}
                      className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                    >
                      <TableCell className="p-4 font-bold text-brand-navy h-auto">
                        {req.brandName}
                      </TableCell>
                      <TableCell className="p-4">{req.couponTitle}</TableCell>
                      <TableCell className="p-4">
                        <Badge className="bg-brand-success/15 text-brand-success rounded-full border-0 font-bold px-2.5 py-0.5 text-[10px] shadow-none hover:bg-brand-success/15">
                          {req.votes} votes
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-brand-subtext">
                        {req.status}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon"
                            onClick={() => handleAction(req.id, "approve")}
                            className="bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                            title="Resolve & contact merchant"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleAction(req.id, "archive")}
                            className="bg-brand-error/15 text-brand-error hover:bg-brand-error hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                            title="Archive request"
                          >
                            <Trash2 className="w-4 h-4" />
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
            icon={RefreshCw}
            title="No pending revival requests"
            description="Good job. All customer coupon restoration requests have been processed."
          />}
    </DashboardLayout>
  );
}
