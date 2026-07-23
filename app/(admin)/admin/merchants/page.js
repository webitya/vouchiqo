"use client";

import { Eye, Search, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INITIAL_MERCHANTS = [
  {
    id: "mch-marbella",
    businessName: "Marbella Tiles & Sanitaryware",
    category: "Home Improvement",
    location: "Ranchi, Jharkhand",
    email: "marbellaranchi11@gmail.com",
    plan: "Growth Partner",
    status: "Active",
    joinedDate: "2026-07-01",
    activeListings: 8,
    monthlyRevenue: 245000,
  },
  {
    id: "mch-jewelcraft",
    businessName: "JewelCraft Ranchi",
    category: "Jewellery & Accessories",
    location: "Ranchi, Jharkhand",
    email: "contact@jewelcraft.in",
    plan: "Pro Partner",
    status: "Active",
    joinedDate: "2026-06-15",
    activeListings: 14,
    monthlyRevenue: 480000,
  },
  {
    id: "mch-burgerhouse",
    businessName: "Burger House Ranchi",
    category: "Food & Dining",
    location: "Ranchi, Jharkhand",
    email: "manager@burgerhouse.com",
    plan: "Growth Partner",
    status: "Active",
    joinedDate: "2026-07-04",
    activeListings: 5,
    monthlyRevenue: 125000,
  },
  {
    id: "mch-urbanfashion",
    businessName: "Urban Threads Boutique",
    category: "Fashion & Clothing",
    location: "Patna, Bihar",
    email: "urbanthreads@gmail.com",
    plan: "Starter Free",
    status: "Pending Approval",
    joinedDate: "2026-07-21",
    activeListings: 1,
    monthlyRevenue: 0,
  },
  {
    id: "mch-spaluxe",
    businessName: "Aroma Spa & Wellness",
    category: "Beauty & Wellness",
    location: "Ranchi, Jharkhand",
    email: "info@aromaspa.in",
    plan: "Starter Free",
    status: "Pending Approval",
    joinedDate: "2026-07-20",
    activeListings: 0,
    monthlyRevenue: 0,
  },
  {
    id: "mch-[#8812]",
    businessName: "Luxe Furnishings",
    category: "Home & Living",
    location: "Jamshedpur, Jharkhand",
    email: "luxe.furnishings@yahoo.com",
    plan: "Growth Partner",
    status: "Suspended",
    joinedDate: "2026-05-10",
    activeListings: 0,
    monthlyRevenue: 45000,
  },
];

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState(INITIAL_MERCHANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const handleApprove = (id) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Active" } : m)),
    );
    toast.success("Merchant approved successfully!");
  };

  const handleReject = (id) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Rejected" } : m)),
    );
    toast.error("Merchant application rejected.");
  };

  const handleRequestInfo = (id) => {
    toast.success("Requested additional KYC & business info from merchant.");
  };

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      m.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlan =
      planFilter === "all" ||
      m.plan.toLowerCase().includes(planFilter.toLowerCase());

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "pending"
          ? m.status === "Pending Approval"
          : m.status === "Active";

    return matchesSearch && matchesStatus && matchesPlan && matchesTab;
  });

  const pendingCount = merchants.filter(
    (m) => m.status === "Pending Approval",
  ).length;

  return (
    <DashboardLayout
      title="Merchant Management"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-4 text-left font-sans w-full pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" /> Merchant Management
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Full merchant list, pending approvals, plan upgrades &amp; account controls.
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[10px] px-2.5 py-1">
              {pendingCount} Pending Approval Queue
            </Badge>
          )}
        </div>

        {/* Master Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-3">
          <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200 flex gap-1 justify-start h-auto w-full sm:w-auto">
            <TabsTrigger
              value="all"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              All Merchants ({merchants.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Pending Approval ({pendingCount})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Active Merchants (
              {merchants.filter((m) => m.status === "Active").length})
            </TabsTrigger>
          </TabsList>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
            <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  placeholder="Search by business name, email, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9 pl-9 rounded-lg font-normal w-full"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 rounded-lg text-xs h-9 font-normal text-slate-800">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending approval">
                    Pending Approval
                  </SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 rounded-lg text-xs h-9 font-normal text-slate-800">
                  <SelectValue placeholder="Filter Plan" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="starter">Starter Free</SelectItem>
                  <SelectItem value="growth">Growth Partner</SelectItem>
                  <SelectItem value="pro">Pro Partner</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Merchant List Table */}
          <div className="pt-2">
            <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white overflow-hidden text-left">
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px]">
                      Business Name
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px]">
                      Category
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px]">
                      Plan
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px]">
                      Status
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px]">
                      Joined Date
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px] text-right">
                      Active Listings
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px] text-right">
                      Monthly Rev (₹)
                    </TableHead>
                    <TableHead className="p-3 text-slate-500 font-medium uppercase text-[11px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 font-normal text-slate-700">
                  {filteredMerchants.length > 0
                    ? filteredMerchants.map((m) => (
                        <TableRow
                          key={m.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <TableCell className="p-3">
                            <div className="flex flex-col">
                              <Link
                                href={`/admin/merchants/${m.id}`}
                                className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                              >
                                {m.businessName}
                              </Link>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {m.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/50">
                              {m.category}
                            </span>
                          </TableCell>
                          <TableCell className="p-3">
                            <Badge
                              className={`rounded-full text-[9px] font-medium border-0 ${m.plan.includes("Pro") ? "bg-blue-100 text-blue-800" : m.plan.includes("Growth") ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-slate-100 text-slate-600"}`}
                            >
                              {m.plan}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-3">
                            <Badge
                              className={`rounded px-2 py-0.5 border-0 text-[9px] font-medium ${m.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : m.status === "Pending Approval" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
                            >
                              {m.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-3 text-slate-500 font-mono text-[11px]">
                            {m.joinedDate}
                          </TableCell>
                          <TableCell className="p-3 text-right font-mono font-medium text-slate-800">
                            {m.activeListings}
                          </TableCell>
                          <TableCell className="p-3 text-right font-semibold text-slate-900">
                            ₹{m.monthlyRevenue.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            {m.status === "Pending Approval"
                              ? <div className="flex items-center justify-center gap-1.5">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(m.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium h-6.5 px-2 rounded-md cursor-pointer shadow-2xs"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRequestInfo(m.id)}
                                    className="text-amber-700 border-amber-300 hover:bg-amber-50 text-[10px] font-medium h-6.5 px-2 rounded-md cursor-pointer"
                                  >
                                    Info
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(m.id)}
                                    className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[10px] font-medium h-6.5 px-2 rounded-md cursor-pointer"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              : <div className="flex items-center justify-center gap-2">
                                  <Link
                                    href={`/admin/merchants/${m.id}`}
                                    className="w-6.5 h-6.5 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Link>
                                </div>}
                          </TableCell>
                        </TableRow>
                      ))
                    : <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center p-8 text-slate-400 font-normal"
                        >
                          No merchants match your filter parameters.
                        </TableCell>
                      </TableRow>}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
