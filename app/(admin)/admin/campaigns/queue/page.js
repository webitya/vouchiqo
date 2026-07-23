"use client";

import { GripVertical, ListOrdered } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/shared/data/DataTable";
import FormSelect from "@/components/shared/form/FormSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const INITIAL_QUEUE = [
  {
    id: "cmp-101",
    submissionTime: "2026-07-21 15:30 IST",
    merchantName: "JewelCraft Ranchi",
    planTier: "Enterprise Partner",
    campaignType: "festival",
    campaignName: "Diwali Gold Fest",
    addOns: [
      "Email Blast (₹799)",
      "Push Alert (₹599)",
      "Ticker Priority (₹999)",
    ],
    startDate: "2026-07-23",
    status: "Pending Review",
  },
  {
    id: "cmp-102",
    submissionTime: "2026-07-21 14:15 IST",
    merchantName: "Marbella Tiles & Sanitary",
    planTier: "Growth Partner",
    campaignType: "flash",
    campaignName: "Pre-Diwali Renovation Sale",
    addOns: ["Ticker Priority (₹999)"],
    startDate: "2026-07-26",
    status: "Pending Review",
  },
  {
    id: "cmp-103",
    submissionTime: "2026-07-21 11:00 IST",
    merchantName: "Burger House Ranchi",
    planTier: "Growth Partner",
    campaignType: "bundle",
    campaignName: "Weekend BOGO Fest",
    addOns: [],
    startDate: "2026-08-01",
    status: "Pending Review",
  },
];

// Priority Score Calculation
function calculatePriorityScore(campaign) {
  let score = 50;
  if (campaign.campaignType === "festival") score += 30;
  score += (campaign.addOns?.length || 0) * 10;

  const hoursToStart =
    (new Date(campaign.startDate) - Date.now()) / (1000 * 60 * 60);
  if (hoursToStart <= 72) score += 25;

  if (
    campaign.planTier.includes("Pro") ||
    campaign.planTier.includes("Enterprise")
  )
    score += 15;

  return score;
}

export default function AdminCampaignQueuePage() {
  const [queue] = useState(INITIAL_QUEUE);
  const [typeFilter, setTypeFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const scoredQueue = queue
    .map((c) => ({
      ...c,
      priorityScore: calculatePriorityScore(c),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const filteredQueue = scoredQueue.filter((c) => {
    const matchesType = typeFilter === "all" || c.campaignType === typeFilter;
    const matchesPlan =
      planFilter === "all" ||
      c.planTier.toLowerCase().includes(planFilter.toLowerCase());
    return matchesType && matchesPlan;
  });

  const columns = [
    {
      key: "drag",
      header: "",
      width: "40px",
      cell: () => (
        <GripVertical
          className="w-4 h-4 text-slate-400 cursor-grab"
          title="Drag & Drop Reorder"
        />
      ),
    },
    {
      key: "submissionTime",
      header: "Submission Date & Time",
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-[11px] text-slate-500">
          {row.submissionTime}
        </span>
      ),
    },
    {
      key: "merchantName",
      header: "Merchant Name",
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-slate-900">{row.merchantName}</span>
      ),
    },
    {
      key: "campaignType",
      header: "Campaign Type",
      sortable: true,
      cell: (row) => (
        <Badge
          className={`rounded px-2 py-0.5 border-0 text-[9px] font-bold uppercase ${
            row.campaignType === "festival"
              ? "bg-purple-100 text-purple-800"
              : row.campaignType === "flash"
                ? "bg-orange-100 text-orange-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.campaignType}
        </Badge>
      ),
    },
    {
      key: "campaignName",
      header: "Campaign Name",
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-slate-800 max-w-[180px] truncate block">
          {row.campaignName}
        </span>
      ),
    },
    {
      key: "planTier",
      header: "Plan Tier",
      sortable: true,
      cell: (row) => (
        <Badge
          variant="outline"
          className="text-[9px] font-bold border-slate-200 text-slate-700"
        >
          {row.planTier}
        </Badge>
      ),
    },
    {
      key: "addOns",
      header: "Add-Ons Purchased",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.addOns && row.addOns.length > 0
            ? row.addOns.map((ao, idx) => (
                <Badge
                  key={idx}
                  className="bg-amber-50 text-amber-800 border-amber-200 text-[8px] font-bold"
                >
                  {ao}
                </Badge>
              ))
            : <span className="text-[10px] text-slate-400 font-normal">
                None
              </span>}
        </div>
      ),
    },
    {
      key: "priorityScore",
      header: "Priority Score",
      sortable: true,
      cell: (row) => (
        <span className="bg-orange-50 text-[#e85d04] px-2 py-0.5 rounded-full border border-orange-100 font-black text-sm">
          ⚡ {row.priorityScore}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          asChild
          size="sm"
          className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold h-7 px-3 rounded-lg cursor-pointer"
        >
          <Link href={`/admin/campaigns/queue/${row.id}`}>
            Review Campaign →
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Dedicated Campaign Review Queue"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ListOrdered className="w-6 h-6 text-[#e85d04]" /> Campaign Review
              Queue
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Auto-calculated Priority Scores • Split-screen review panel &amp;
              4-point verification checklist.
            </p>
          </div>
          <Badge className="bg-[#e85d04] text-white font-bold text-xs px-3.5 py-1.5 border-0 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
            <span>{queue.length} Pending Review</span>
          </Badge>
        </div>

        {/* Filters bar using reusable FormSelect */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <FormSelect
            value={typeFilter}
            onValueChange={setTypeFilter}
            placeholder="Campaign Type"
            options={[
              { value: "all", label: "All Campaign Types" },
              { value: "festival", label: "Festival Campaign" },
              { value: "flash", label: "Flash Sale" },
              { value: "bundle", label: "Bundle / BOGO" },
            ]}
            triggerClassName="w-full sm:w-48 bg-white border-slate-200"
          />

          <FormSelect
            value={planFilter}
            onValueChange={setPlanFilter}
            placeholder="Plan Tier"
            options={[
              { value: "all", label: "All Plan Tiers" },
              { value: "growth", label: "Growth Partner" },
              { value: "pro", label: "Pro Partner" },
              { value: "enterprise", label: "Enterprise" },
            ]}
            triggerClassName="w-full sm:w-48 bg-white border-slate-200"
          />

          <Button
            variant="outline"
            onClick={() => {
              setTypeFilter("all");
              setPlanFilter("all");
            }}
            className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer h-10 px-4"
          >
            Reset Filters
          </Button>
        </div>

        {/* Dynamic Reusable Table */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 overflow-hidden text-left">
          <DataTable
            columns={columns}
            data={filteredQueue}
            searchable={true}
            searchPlaceholder="Search campaigns by merchant name, title..."
            defaultPageSize={10}
            emptyState="No pending campaigns match the selected filters."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
