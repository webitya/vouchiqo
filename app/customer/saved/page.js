"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import CouponCard from "@/components/CouponCard";
import DashboardLayout from "@/components/DashboardLayout";
import EmptyState from "@/components/EmptyState";

export default function SavedCoupons() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Mock saved coupons
  const [saved, _setSaved] = useState([
    {
      _id: "c3",
      title: "Exclusive Notion Plus Plan: $50 Free Credits",
      discountValue: 50,
      discountType: "fixed",
      description:
        "Upgrade your team workspace or personal workspace with $50 billing credits.",
      category: "SaaS",
      successRate: 98,
      isMerchantVerified: true,
      isVouchiqoVerified: true,
      workedToday: false,
      merchantId: { name: "Notion Workspace" },
    },
  ]);

  return (
    <DashboardLayout
      title="Saved Coupons"
      user={{ name: "Sarah Jenkins", role: "customer" }}
    >
      <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
        Your Bookmarks & Saved Deals
      </h2>

      {saved.length > 0
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onRedeem={(c) => setSelectedCoupon(c)}
              />
            ))}
          </div>
        : <EmptyState
            icon={Bookmark}
            title="No saved coupons"
            description="Save coupons while browsing to keep track of deals you want to use later."
          />}
      {/* Confirmation Modal */}
      {selectedCoupon && (
        <ConfirmationModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onConfirm={async (_id) => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return `VOUCH-CLAIM-${Math.floor(1000 + Math.random() * 9000)}`;
          }}
        />
      )}
    </DashboardLayout>
  );
}
