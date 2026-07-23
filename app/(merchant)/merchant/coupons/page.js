"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Edit,
  HelpCircle,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { useDeleteCoupon } from "@/hooks/use-coupons";

const TableSkeleton = () => (
  <TableRow className="animate-pulse border-b border-slate-100">
    <TableCell className="py-3 px-4">
      <div className="h-4 bg-slate-200 rounded w-48"></div>
    </TableCell>
    <TableCell className="py-3 px-4">
      <div className="h-4 bg-slate-200 rounded w-16"></div>
    </TableCell>
    <TableCell className="py-3 px-4">
      <div className="h-4 bg-slate-200 rounded w-10"></div>
    </TableCell>
    <TableCell className="py-3 px-4">
      <div className="h-4 bg-slate-200 rounded w-10"></div>
    </TableCell>
    <TableCell className="py-3 px-4">
      <div className="h-5 bg-slate-200 rounded-full w-16"></div>
    </TableCell>
    <TableCell className="py-3 px-4">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
    </TableCell>
    <TableCell className="py-3 px-4 text-right">
      <div className="h-7 bg-slate-200 rounded w-16 ml-auto"></div>
    </TableCell>
  </TableRow>
);

function MerchantCouponsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams?.get("status") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusParam);
  const [deleteId, setDeleteId] = useState(null);

  // Sync statusFilter whenever URL search parameter changes (e.g. from sidebar sub-navigation click)
  useEffect(() => {
    setStatusFilter(statusParam);
  }, [statusParam]);

  const deleteMutation = useDeleteCoupon();

  // 1. Fetch current merchant profile
  const { data: merchant, isLoading: loadingMerchant } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  // 2. Fetch merchant coupons
  const { data: couponsData = [], isLoading: loadingCoupons } = useQuery({
    queryKey: ["merchant-coupons", merchant?._id],
    queryFn: async () => {
      if (!merchant?._id) return [];
      const res = await fetch(
        `/api/coupons?merchantId=${merchant._id}&allDates=true`,
      );
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const json = await res.json();
      return json.data?.coupons || [];
    },
    enabled: !!merchant?._id,
  });

  const isLoading = loadingMerchant || loadingCoupons;

  // Filter coupons based on search query and status filter selection
  const filteredCoupons = couponsData.filter((coupon) => {
    const matchesSearch = coupon.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Compute live statistics for summary cards
  const totalCouponsCount = couponsData.length;
  const activeCouponsCount = couponsData.filter(
    (c) => c.status === "active",
  ).length;
  const expiredCouponsCount = couponsData.filter(
    (c) => c.status === "expired",
  ).length;

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage")
      return `${coupon.discountValue}% OFF`;
    if (coupon.discountType === "fixed") return `₹${coupon.discountValue} OFF`;
    return "Freebie";
  };

  return (
    <DashboardLayout
      title="My Offers"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="space-y-4 text-left font-sans">
        {/* Stats Cards Row */}
        <div
          data-tour="coupons-list"
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
        >
          <Card className="border border-slate-200/90 shadow-xs bg-white rounded-2xl p-4 transition-all hover:border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-extrabold text-slate-900">{totalCouponsCount}</div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                All posted deals in your account
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/90 shadow-xs bg-white rounded-2xl p-4 transition-all hover:border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Active Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-extrabold text-emerald-600">
                {activeCouponsCount}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Deals currently live and claimable
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/90 shadow-xs bg-white rounded-2xl p-4 transition-all hover:border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Expired Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-extrabold text-rose-600">
                {expiredCouponsCount}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Deals past their expiration date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Header controls */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <InputGroup className="bg-white border border-slate-200 rounded-xl h-9 px-2 w-full sm:w-64 shadow-2xs">
              <InputGroupAddon>
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="Search my offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs placeholder:text-slate-400 h-full font-medium"
              />
            </InputGroup>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                if (val === "all") router.push("/merchant/coupons");
                else router.push(`/merchant/coupons?status=${val}`);
              }}
            >
              <SelectTrigger className="bg-white border border-slate-200 text-xs rounded-xl h-9 px-3 font-semibold text-slate-800 shadow-2xs focus:ring-0 w-full sm:w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 z-[300]">
                <SelectItem value="all" className="text-xs font-semibold">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-xs font-semibold">
                  Active
                </SelectItem>
                <SelectItem value="expired" className="text-xs font-semibold">
                  Expired
                </SelectItem>
                <SelectItem value="pending" className="text-xs font-semibold">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link
            href="/merchant/coupons/new"
            data-tour="create-coupon-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 flex items-center gap-1.5 shadow-md shadow-blue-500/20 w-full sm:w-auto justify-center rounded-xl border-0 h-9 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Offer</span>
          </Link>
        </div>

        {/* Table list */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto flex-1">
            <Table className="w-full text-xs font-sans">
              <TableHeader className="bg-slate-50/70 border-b border-slate-200 hover:bg-transparent">
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Offer Detail
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Discount
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Claims
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Redemptions
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Status
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] h-auto">
                    Expiry Date
                  </TableHead>
                  <TableHead className="py-3 px-4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] text-right h-auto">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <TableSkeleton key={idx} />
                    ))
                  : filteredCoupons.length > 0
                    ? filteredCoupons.map((coupon, idx) => (
                        <TableRow
                          key={idx}
                          className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <TableCell className="py-3 px-4 h-auto">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-xs">
                                {coupon.title}
                              </span>
                              <span className="text-[9px] text-slate-400 font-semibold mt-0.5 font-mono">
                                ID: {coupon._id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                              {formatDiscount(coupon)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4 font-bold text-slate-800">
                            {coupon.totalClaims || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4 font-bold text-slate-800">
                            {coupon.totalRedemptions || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <Badge
                              className={`rounded-full text-[9px] font-bold py-0.5 px-2 border-0 shadow-none gap-1 ${
                                coupon.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                                  : coupon.status === "pending"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                                    : "bg-rose-50 text-rose-700 border border-rose-200/80"
                              }`}
                            >
                              {coupon.status === "active"
                                ? <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                : coupon.status === "pending"
                                  ? <HelpCircle className="w-3 h-3 text-blue-600" />
                                  : <XCircle className="w-3 h-3 text-rose-600" />}
                              <span className="capitalize">
                                {coupon.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-slate-500 font-medium text-xs">
                            {new Date(coupon.expiresAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  router.push(`/merchant/coupons/${coupon._id}`)
                                }
                                className="w-7 h-7 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer shadow-none"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(coupon._id)}
                                disabled={deleteMutation.isPending}
                                className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 cursor-pointer shadow-none disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    : <TableRow>
                        <TableCell
                          colSpan={7}
                          className="p-8 text-center text-slate-400 text-xs font-semibold"
                        >
                          No offers found. Click "Create Offer" to add your
                          first offer.
                        </TableCell>
                      </TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              offer and disable any active customer claims.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(deleteId, {
                  onSettled: () => setDeleteId(null),
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

export default function MerchantCouponsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400 font-semibold">Loading listings...</div>}>
      <MerchantCouponsContent />
    </Suspense>
  );
}
