import { Suspense } from "react";
import ExpiredCouponRevival from "./revival-client";

export const metadata = {
  title: "Expired Coupon Revival System | Vouchiqo",
  description:
    "Missed an amazing discount? Vote to revive expired promo codes on Vouchiqo. We negotiate directly with merchants to restore active coupon codes and savings.",
  openGraph: {
    title: "Expired Coupon Revival System | Vouchiqo",
    description:
      "Missed an amazing discount? Vote to revive expired promo codes on Vouchiqo. We negotiate directly with merchants to restore active coupon codes and savings.",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-surface flex items-center justify-center text-xs font-semibold text-brand-text">Loading...</div>}>
      <ExpiredCouponRevival />
    </Suspense>
  );
}
