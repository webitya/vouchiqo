"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, History, PiggyBank, RefreshCw, Star } from "lucide-react";
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
  const user = authUser || { name: "User", role: "customer" };

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

  const claimedCoupons = coupons.slice(0, 1);
  const savedCoupons = coupons.slice(1);

  // Map recent transactions to activities list
  const activities =
    savingsData?.recentTransactions?.slice(0, 4).map((tx) => ({
      type: "claim",
      message: `Redeemed ${tx.brand} coupon (Code: ${tx.code})`,
      time: tx.date,
    })) || [];

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
      {/* Compact Welcome Banner */}
      <div className="bg-brand-navy text-white p-4 rounded-xl relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-0.5">
          <h2 className="text-lg font-bold font-sans">
            Welcome back, {username}!
          </h2>
          <p className="text-[11px] text-slate-300">
            Check out your updated savings timeline and active claims below.
          </p>
        </div>
      </div>

      {/* Compact KPI Cards Grid (2 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Cash Saved"
          value={
            savingsData?.kpis?.totalSavedAllTime !== undefined
              ? `₹${savingsData.kpis.totalSavedAllTime.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "₹0.00"
          }
          change={savingsData?.kpis?.savingsRate}
          isPositive={true}
          icon={PiggyBank}
        />
        <KPICard
          title="Active Claims"
          value={`${claimsData?.length ?? 0} Coupons`}
          change={0.0}
          isPositive={true}
          icon={History}
        />
        <KPICard
          title="Saved Items"
          value={`${claimsData?.length ?? 0} Coupons`}
          change={0.0}
          isPositive={true}
          icon={Bookmark}
        />
        <KPICard
          title="Revival Votes"
          value={`${revivalsData?.thisMonthRequests ?? 0} Votes`}
          change={0.0}
          isPositive={true}
          icon={RefreshCw}
        />
      </div>

      {/* Compact Core Dashboard Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Claimed and Saved Coupons */}
        <div className="lg:col-span-2 space-y-4">
          {/* Claimed Coupons list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Recently Claimed
            </h3>
            {claimedCoupons.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {claimedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon._id}
                      coupon={coupon}
                      onRedeem={(c) => setSelectedCoupon(c)}
                    />
                  ))}
                </div>
              : <div className="bg-brand-bg border border-brand-border rounded-xl p-6 text-center text-xs text-brand-subtext">
                  No claimed coupons yet. Browse deals to get started!
                </div>}
          </div>

          {/* Saved Coupons list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Saved For Later
            </h3>
            {savedCoupons.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon._id}
                      coupon={coupon}
                      onRedeem={(c) => setSelectedCoupon(c)}
                    />
                  ))}
                </div>
              : <div className="bg-brand-bg border border-brand-border rounded-xl p-6 text-center text-xs text-brand-subtext">
                  No saved coupons yet.
                </div>}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-4">
          <div className="bg-brand-bg border border-brand-border rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-2">
              Recent Activity
            </h3>
            {activities.length > 0
              ? <div className="space-y-3">
                  {activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-snug"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-brand-text font-semibold">
                          {act.message}
                        </p>
                        <span className="text-[10px] text-brand-subtext">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              : <div className="text-center text-xs text-brand-subtext py-2">
                  No recent activity.
                </div>}
          </div>

          {/* Verification Stamp Banner */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-4 shadow-sm flex gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy">
                Vouchiqo Security Grade
              </h4>
              <p className="text-[10px] text-brand-subtext mt-0.5 leading-snug">
                Your claims are backed by 100% cryptographic brand
                authentication layers.
              </p>
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
