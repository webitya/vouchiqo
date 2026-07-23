"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MASTER_SUBMISSIONS = [
  {
    id: "REV-A-101",
    submissionDate: "2026-07-21 14:10",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.k@gmail.com",
    brandName: "Marbella Tiles & Sanitaryware",
    category: "A", // Category A (Active Merchant)
    daysSinceExpiry: 5,
    city: "Ranchi",
    businessCategory: "Home Improvement",
    status: "Pending Merchant SLA",
    sourcePlatform: "Google Search",
    possibleDuplicate: false,
    merchantContact: "+91 98351 23456",
    lastPlan: "Growth Partner",
    lastActiveListing: "Flat 20% off Italian Marble",
  },
  {
    id: "REV-B-102",
    submissionDate: "2026-07-20 16:30",
    customerName: "Ananya Sharma",
    customerEmail: "ananya.s@yahoo.com",
    brandName: "Luxe Furnishings",
    category: "B", // Category B (Lapsed Merchant)
    daysSinceExpiry: 12,
    city: "Jamshedpur",
    businessCategory: "Home & Living",
    status: "Pending Win-Back Outreach",
    sourcePlatform: "Instagram Ad",
    possibleDuplicate: false,
    merchantContact: "+91 94311 88990",
    lastPlan: "Growth Partner (Lapsed May 2026)",
    lastActiveListing: "Flat 15% off Teak Sofa Sets",
  },
  {
    id: "REV-C-103",
    submissionDate: "2026-07-19 11:00",
    customerName: "Amit Verma",
    customerEmail: "amit.verma@outlook.com",
    brandName: "Starbucks Coffee Ranchi",
    category: "C", // Category C (Unboarded Brand)
    daysSinceExpiry: 30,
    city: "Ranchi",
    businessCategory: "Food & Dining",
    status: "Pending Merchant Outreach",
    sourcePlatform: "Saw at Store",
    possibleDuplicate: true,
    liveSubmissionCount: 14,
    sampleOfferTypes: "BOGO Espresso, 20% off Frappuccino",
  },
];

// Helper to auto-calculate Priority score (High/Medium/Low)
function calculatePriority(sub) {
  if (sub.category === "A" || sub.daysSinceExpiry <= 14) return "HIGH";
  if (
    sub.category === "B" ||
    (sub.city === "Ranchi" && sub.businessCategory === "Food & Dining")
  )
    return "MEDIUM";
  return "LOW";
}

export default function RevivalManagement() {
  const [submissions, setSubmissions] = useState(MASTER_SUBMISSIONS);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [duplicateOnly, setDuplicateOnly] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [winBackModalOpen, setWinBackModalOpen] = useState(false);
  const [publicFeedToggles, setPublicFeedToggles] = useState({});

  // Compute Priority & Default Sorting: Priority Descending, then Days Since Expiry Ascending
  const processedSubmissions = submissions
    .map((s) => ({
      ...s,
      priority: calculatePriority(s),
    }))
    .sort((a, b) => {
      const pRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (pRank[b.priority] !== pRank[a.priority]) {
        return pRank[b.priority] - pRank[a.priority];
      }
      return a.daysSinceExpiry - b.daysSinceExpiry;
    });

  const filteredSubmissions = processedSubmissions.filter((s) => {
    const matchesCat =
      categoryFilter === "all" || s.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      s.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesDup = !duplicateOnly || s.possibleDuplicate;
    return matchesCat && matchesStatus && matchesDup;
  });

  const handleWinBackOutreach = (sub) => {
    setSelectedSub(sub);
    setWinBackModalOpen(true);
  };

  const handleAddToOutreachList = (sub) => {
    toast.success(
      `Added ${sub.brandName} (${sub.liveSubmissionCount || 1} requests) to Merchant Sales Outreach Database!`,
    );
  };

  const togglePublicFeed = (id) => {
    setPublicFeedToggles((prev) => {
      const next = !prev[id];
      toast.success(
        `Public Social-Proof Feed toggle ${next ? "ENABLED" : "DISABLED"} for ${id}`,
      );
      return { ...prev, [id]: next };
    });
  };

  return (
    <DashboardLayout
      title="Master Revival Queue & Demand Intelligence"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-[#e85d04]" /> Master Revival
              Queue &amp; Intelligence (/admin/revivals)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Category A/B/C workflows, Win-Back outreach, priority auto-ranking
              &amp; Alternative Offer Engine.
            </p>
          </div>

          <Button
            asChild
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
          >
            <Link href="/admin/merchant-demand">
              View Merchant Demand Report →
            </Link>
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-white border-slate-200 rounded-xl text-xs h-10 font-bold text-slate-800">
              <SelectValue placeholder="Category (A/B/C)" />
            </SelectTrigger>
            <SelectContent className="z-[300]">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="A">Cat A (Active Merchant)</SelectItem>
              <SelectItem value="B">Cat B (Lapsed Merchant)</SelectItem>
              <SelectItem value="C">Cat C (Unboarded Brand)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 rounded-xl text-xs h-10 font-bold text-slate-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="z-[300]">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="outreach">Outreach Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Checkbox
              checked={duplicateOnly}
              onCheckedChange={(val) => setDuplicateOnly(!!val)}
            />
            <span>Possible Duplicates Only</span>
          </label>

          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter("all");
              setStatusFilter("all");
              setDuplicateOnly(false);
            }}
            className="text-xs font-bold rounded-xl border-slate-200 ml-auto"
          >
            Reset Filters
          </Button>
        </div>

        {/* Master Submissions Queue Table */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden text-left">
          <Table className="w-full text-xs">
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Submission Date
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Customer
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Brand / Merchant
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Cat
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                  Days Expired
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                  Priority Score
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase">
                  Status
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                  Public Feed
                </TableHead>
                <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredSubmissions.map((s) => (
                <TableRow
                  key={s.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="p-4 text-slate-500 font-mono text-[11px]">
                    {s.submissionDate}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        {s.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {s.customerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        {s.brandName}
                        {s.possibleDuplicate && (
                          <Badge className="bg-amber-100 text-amber-800 text-[8px] font-bold">
                            Duplicate Flag
                          </Badge>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {s.city} • {s.businessCategory}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      className={`rounded font-bold text-[9px] border-0 ${s.category === "A" ? "bg-emerald-100 text-emerald-800" : s.category === "B" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                    >
                      Cat {s.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-center font-mono font-bold text-slate-800">
                    {s.daysSinceExpiry}d ago
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Badge
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border-0 ${s.priority === "HIGH" ? "bg-rose-100 text-rose-800" : s.priority === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}
                    >
                      ⚡ {s.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-xs">{s.status}</TableCell>
                  <TableCell className="p-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!publicFeedToggles[s.id]}
                        onChange={() => togglePublicFeed(s.id)}
                        className="w-3.5 h-3.5 accent-[#e85d04]"
                      />
                    </label>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    {s.category === "A" && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        Auto-Routed to Merchant
                      </span>
                    )}
                    {s.category === "B" && (
                      <Button
                        size="sm"
                        onClick={() => handleWinBackOutreach(s)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold h-7 px-2.5 rounded-lg cursor-pointer"
                      >
                        Generate Win-Back
                      </Button>
                    )}
                    {s.category === "C" && (
                      <Button
                        size="sm"
                        onClick={() => handleAddToOutreachList(s)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold h-7 px-2.5 rounded-lg cursor-pointer"
                      >
                        + Sales Outreach ({s.liveSubmissionCount})
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* WIN-BACK OUTREACH MODAL FOR CATEGORY B */}
        <Dialog open={winBackModalOpen} onOpenChange={setWinBackModalOpen}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl text-left">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Win-Back Merchant Outreach
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Contact details &amp; win-back script for{" "}
                {selectedSub?.brandName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">
                  Merchant Contact
                </span>
                <span className="font-bold text-slate-900">
                  {selectedSub?.merchantContact}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">
                  Last Active Listing
                </span>
                <span className="font-bold text-slate-900">
                  {selectedSub?.lastActiveListing} ({selectedSub?.lastPlan})
                </span>
              </div>
            </div>

            <DialogFooter className="pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setWinBackModalOpen(false)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Marked win-back outcome: Reactivated!");
                  setWinBackModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Mark Reactivated
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
