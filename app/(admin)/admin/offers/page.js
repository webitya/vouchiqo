"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_OFFERS = [
  {
    id: "off-101",
    merchantName: "JewelCraft Ranchi",
    merchantPlan: "Pro Partner",
    code: "JEWEL25",
    title: "Flat 25% OFF Gold & Diamond Jewellery",
    discount: "25% OFF",
    category: "Jewellery & Accessories",
    dateSubmitted: "2026-07-21 14:10",
    status: "Pending Verification",
    testLink: "https://vouchiqo.com/preview/JEWEL25",
    priority: true,
  },
  {
    id: "off-102",
    merchantName: "Marbella Tiles & Sanitaryware",
    merchantPlan: "Growth Partner",
    code: "MARBLE20",
    title: "Flat 20% OFF Italian Marble Tiles",
    discount: "20% OFF",
    category: "Home Improvement",
    dateSubmitted: "2026-07-21 12:45",
    status: "Pending Verification",
    testLink: "https://vouchiqo.com/preview/MARBLE20",
    priority: false,
  },
  {
    id: "off-103",
    merchantName: "Burger House Ranchi",
    merchantPlan: "Growth Partner",
    code: "BURGER50",
    title: "Flat ₹150 OFF Special Meal Combo",
    discount: "₹150 OFF",
    category: "Food & Dining",
    dateSubmitted: "2026-07-21 10:30",
    status: "Pending Verification",
    testLink: "https://vouchiqo.com/preview/BURGER50",
    priority: false,
  },
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [verifyOffer, setVerifyOffer] = useState(null);
  const [rejectOffer, setRejectOffer] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === offers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(offers.map((o) => o.id));
    }
  };

  const handleApprovePublish = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    toast.success("Offer approved & published live!");
    setVerifyOffer(null);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please state a rejection reason");
      return;
    }
    setOffers((prev) => prev.filter((o) => o.id !== rejectOffer.id));
    toast.error(`Offer rejected. Reason sent to merchant.`);
    setRejectOffer(null);
    setRejectReason("");
  };

  const handleBulkApprove = () => {
    setOffers((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
    toast.success(`Bulk approved ${selectedIds.length} offers!`);
    setSelectedIds([]);
  };

  // Sort by priority (Pro/Enterprise first)
  const sortedOffers = [...offers].sort(
    (a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0),
  );

  return (
    <DashboardLayout
      title="Offer Verification Queue"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#e85d04]" /> Offer
              Verification Queue (Task 3.2)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              4-hour verification SLA • Priority ranking for Pro &amp;
              Enterprise merchants.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Approve &amp; Publish Selected ({selectedIds.length})
              </Button>
            )}
            <Badge className="bg-[#e85d04] text-white font-bold text-xs px-3 py-1.5 border-0">
              {offers.length} Pending Verification
            </Badge>
          </div>
        </div>

        {/* Verification Queue Table */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden text-left">
          <Table className="w-full text-xs">
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-4 w-10">
                  <Checkbox
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === offers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Merchant Name
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Coupon Code
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Discount
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Category
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Date Submitted
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Status
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {sortedOffers.length > 0
                ? sortedOffers.map((o) => (
                    <TableRow
                      key={o.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <TableCell className="p-4">
                        <Checkbox
                          checked={selectedIds.includes(o.id)}
                          onCheckedChange={() => handleToggleSelect(o.id)}
                        />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {o.merchantName}
                            {o.priority && (
                              <Badge className="bg-purple-100 text-purple-800 text-[8px] font-bold">
                                Pro Priority
                              </Badge>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {o.merchantPlan}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 font-mono text-[11px] font-bold text-slate-900 uppercase">
                        {o.code}
                      </TableCell>
                      <TableCell className="p-4">
                        <span className="text-[10px] font-bold text-[#e85d04] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                          {o.discount}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-slate-600">
                        {o.category}
                      </TableCell>
                      <TableCell className="p-4 text-slate-500 font-mono text-[11px]">
                        {o.dateSubmitted}
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge className="bg-amber-100 text-amber-800 rounded text-[9px] font-bold border-0">
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setVerifyOffer(o)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold h-7 px-3 rounded-lg cursor-pointer"
                          >
                            Verify &amp; Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprovePublish(o.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold h-7 px-3 rounded-lg cursor-pointer"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectOffer(o)}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[10px] font-bold h-7 px-2.5 rounded-lg cursor-pointer"
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center p-12 text-slate-400 font-medium"
                    >
                      No pending offers in the verification queue.
                    </TableCell>
                  </TableRow>}
            </TableBody>
          </Table>
        </Card>

        {/* VERIFY DETAILS MODAL */}
        <Dialog open={!!verifyOffer} onOpenChange={() => setVerifyOffer(null)}>
          <DialogContent className="max-w-lg bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Verify Offer: {verifyOffer?.code}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Submitted by {verifyOffer?.merchantName} (
                {verifyOffer?.merchantPlan})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 block">
                  Offer Title:
                </span>
                <span>{verifyOffer?.title}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 rounded-xl font-bold">
                <span>Test Link Preview:</span>
                <a
                  href={verifyOffer?.testLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  Open Sandbox Preview <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <DialogFooter className="pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setVerifyOffer(null)}
                className="text-xs font-bold rounded-xl"
              >
                Close
              </Button>
              <Button
                onClick={() => handleApprovePublish(verifyOffer?.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Approve &amp; Publish Live
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* REJECT OFFER MODAL WITH REASON FIELD */}
        <Dialog open={!!rejectOffer} onOpenChange={() => setRejectOffer(null)}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-rose-900">
                Reject Offer: {rejectOffer?.code}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Please provide rejection feedback to the merchant.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-800">
                Rejection Reason *
              </Label>
              <Textarea
                rows={3}
                placeholder="e.g. Please specify minimum order value cap or update title font formatting."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-white border-slate-200 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectOffer(null)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
