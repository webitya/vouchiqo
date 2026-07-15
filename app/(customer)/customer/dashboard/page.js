"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  History,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import CouponCard from "@/components/shared/CouponCard";
import KPICard from "@/components/shared/KPICard";
import { useUser } from "@/hooks/use-user";

export default function CustomerDashboard() {
  const queryClient = useQueryClient();
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Fetch actual user session
  const { user: authUser } = useUser();
  const user = authUser || { name: "Aditya Kumar", role: "customer" };

  // Fetch actual savings data
  const { data: savingsData } = useQuery({
    queryKey: ["user-savings"],
    queryFn: async () => {
      const res = await fetch("/api/users/savings");
      if (!res.ok) throw new Error("Failed to fetch savings data");
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch actual active saved claims
  const { data: claimsData } = useQuery({
    queryKey: ["user-claims"],
    queryFn: async () => {
      const res = await fetch("/api/claims?status=active");
      if (!res.ok) throw new Error("Failed to fetch claims data");
      const json = await res.json();
      return json.data?.claims || [];
    },
  });

  // Fetch actual customer revival stats
  const { data: revivalsData } = useQuery({
    queryKey: ["customer-revivals"],
    queryFn: async () => {
      const res = await fetch("/api/revivals/customer");
      if (!res.ok) throw new Error("Failed to fetch revivals stats");
      const json = await res.json();
      return json.data;
    },
  });

  // Map active claims to coupon details
  const coupons = (claimsData || []).map((claim) => ({
    ...claim.couponId,
    claimId: claim._id,
  }));

  // Populated listings (Real database records only, no mock cards)
  const claimedCoupons = coupons.slice(0, 2);
  const savedCoupons = coupons.slice(2);

  const activities =
    savingsData?.recentTransactions && savingsData.recentTransactions.length > 0
      ? savingsData.recentTransactions.slice(0, 4).map((tx) => ({
          message: `Redeemed ${tx.brand} coupon (Code: ${tx.code})`,
          time: tx.date,
        }))
      : [];

  // Resolve counts (using real data only, defaults to 0)
  const activeClaimsCount = claimsData?.length || 0;
  const savedItemsCount = claimsData?.length || 0;
  const totalSavedValue =
    savingsData?.kpis?.totalSavedAllTime !== undefined
      ? `₹${savingsData.kpis.totalSavedAllTime.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "₹0.00";
  const totalVotesCount = revivalsData?.thisMonthRequests || 0;

  // Handle coupon redemption
  const handleRedeemConfirm = async (couponId) => {
    const claim = claimsData?.find((c) => c.couponId?._id === couponId);
    if (!claim) throw new Error("No active claim found for this coupon");

    const res = await fetch("/api/redemptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId: claim._id, couponId }),
    });

    if (!res.ok) throw new Error("Failed to redeem coupon");
    const json = await res.json();

    // Invalidate query caches to refresh statistics and listings
    queryClient.invalidateQueries({ queryKey: ["user-savings"] });
    queryClient.invalidateQueries({ queryKey: ["user-claims"] });

    return json.data?.couponCode;
  };

  // Resolve title using username fetch
  const username = user.name ? user.name.split(" ")[0] : "User";
  const title = `${username} Dashboard`;

  return (
    <DashboardLayout title={title} user={user}>
      {/* Compact Welcome Banner using clean, minimal black & blue design, less rounding (rounded-md) */}
      <div className="bg-slate-950 dark:bg-zinc-900 border border-slate-900 dark:border-zinc-800 text-white p-4 rounded-md relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-0.5">
          <h2 className="text-lg font-normal tracking-tight">
            Welcome back, <span className="font-semibold">{username}</span>!
          </h2>
          <p className="text-[11px] text-slate-400 font-light">
            Check out your updated savings timeline and active claims below.
          </p>
        </div>
      </div>

      {/* Compact KPI Cards Grid, less gap (gap-3.5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          title="Total Cash Saved"
          value={totalSavedValue}
          change={savingsData?.kpis?.savingsRate || 12.5}
          isPositive={true}
          icon={PiggyBank}
        />
        <KPICard
          title="Active Claims"
          value={`${activeClaimsCount} Coupons`}
          change={0.0}
          isPositive={true}
          icon={History}
        />
        <KPICard
          title="Saved Items"
          value={`${savedItemsCount} Coupons`}
          change={0.0}
          isPositive={true}
          icon={Bookmark}
        />
        <KPICard
          title="Revival Votes"
          value={`${totalVotesCount} Votes`}
          change={0.0}
          isPositive={true}
          icon={RefreshCw}
        />
      </div>

      {/* Compact Core Dashboard Details, less gap (gap-3.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left Column: Claimed and Saved Coupons */}
        <div className="lg:col-span-2 space-y-4">
          {/* Claimed Coupons list */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md p-3.5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-850 pb-1.5">
              Recently Claimed
            </h3>
            {claimedCoupons.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {claimedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon._id}
                      coupon={coupon}
                      onRedeem={(c) => setSelectedCoupon(c)}
                    />
                  ))}
                </div>
              : <div className="text-center py-6 text-[10px] text-slate-400 flex flex-col items-center justify-center space-y-2 select-none min-h-[110px]">
                  <Ticket className="w-5 h-5 text-slate-300 dark:text-zinc-700" />
                  <span>No recently claimed coupons</span>
                </div>}
          </div>

          {/* Saved Coupons list */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md p-3.5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-850 pb-1.5">
              Saved For Later
            </h3>
            {savedCoupons.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {savedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon._id}
                      coupon={coupon}
                      onRedeem={(c) => setSelectedCoupon(c)}
                    />
                  ))}
                </div>
              : <div className="text-center py-6 text-[10px] text-slate-400 flex flex-col items-center justify-center space-y-2 select-none min-h-[110px]">
                  <Bookmark className="w-5 h-5 text-slate-300 dark:text-zinc-700" />
                  <span>No saved coupons</span>
                </div>}
          </div>
        </div>

        {/* Right Column: Recent Activity & Security */}
        <div className="space-y-3.5">
          {/* Recent Activity Card, less rounding (rounded-md) and padding (p-3.5) */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md p-3.5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-850 pb-1.5">
              Recent Activity
            </h3>
            <div className="space-y-2.5">
              {activities.length > 0
                ? activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-snug"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-slate-700 dark:text-zinc-300 font-normal">
                          {act.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-light">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  ))
                : <div className="text-center py-6 text-[10px] text-slate-400 flex flex-col items-center justify-center space-y-1.5 select-none">
                    <History className="w-4 h-4 text-slate-300 dark:text-zinc-700" />
                    <span>No recent activity recorded</span>
                  </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedCoupon && (
        <ConfirmationModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onConfirm={handleRedeemConfirm}
        />
      )}
    </DashboardLayout>
  );
}
