/**
 * Centralised TanStack Query key factory.
 *
 * Every query and invalidation call should reference this module so that
 * cache keys are defined in ONE place.  Previously, keys were inline string
 * arrays scattered across 15+ files — renaming or adding a key required
 * hunting through every file.
 *
 * Usage in hooks:
 *   import { qk } from "@/lib/query-keys";
 *   useQuery({ queryKey: qk.merchant.profile(), queryFn: ... })
 *
 * Usage in invalidation:
 *   queryClient.invalidateQueries({ queryKey: qk.coupons.all });
 */

const merchantKeys = {
  profile: () => ["merchant-profile"],
  analytics: () => ["merchant-analytics"],
  recentRedemptions: () => ["merchant-recent-redemptions"],
  campaigns: () => ["merchant-campaigns"],
  couponsForCampaign: () => ["merchant-coupons-for-campaign"],
  coupons: (merchantId) => ["merchant-coupons", merchantId],
  coupon: (id) => ["merchant-coupon", id],
};

const adminKeys = {
  analytics: () => ["admin-analytics"],
};

const couponKeys = {
  /** Used as an invalidation target only — no standalone query. */
  all: () => ["coupons"],
};

export const qk = {
  merchant: merchantKeys,
  admin: adminKeys,
  coupons: couponKeys,
};
