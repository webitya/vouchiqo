"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/fetcher";
import { qk } from "@/lib/query-keys";

/**
 * Centralized TanStack Query hooks for all admin operations.
 * Replaces the useState+useEffect pattern used with lib/api-helpers
 * across content, featured, revenue, revivals, ticker, and users pages.
 */

// ─────────────────────────────────────────────
// Featured Deals
// ─────────────────────────────────────────────

/**
 * Fetch all coupons for the admin featured-deals page.
 */
export function useAdminCoupons({ status } = {}) {
  const qs = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["admin-coupons", status],
    queryFn: async () => {
      const json = await apiFetch(`/api/admin/coupons${qs}`);
      return json.data?.coupons || [];
    },
  });
}

// ─────────────────────────────────────────────
// Platform Content / Settings
// ─────────────────────────────────────────────

/**
 * Fetch platform settings (revival stats, social proof, categories).
 */
export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const json = await apiFetch("/api/admin/settings");
      return json.data?.settings || {};
    },
  });
}

/**
 * Update a single platform setting key.
 */
export function useUpdateAdminSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }) =>
      apiFetch("/api/admin/settings", { method: "PUT", body: { key, value } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
  });
}

// ─────────────────────────────────────────────
// SaaS Revenue
// ─────────────────────────────────────────────

/**
 * Fetch platform revenue, subscription tiers, invoices, payouts.
 */
export function useAdminRevenue() {
  return useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const json = await apiFetch("/api/admin/revenue");
      return json.data || {};
    },
  });
}

/**
 * Mark a payout as paid.
 */
export function useUpdatePayoutStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payoutId, status }) =>
      apiFetch("/api/admin/revenue", {
        method: "PUT",
        body: { payoutId, status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue"] });
    },
  });
}

// ─────────────────────────────────────────────
// Revival Management
// ─────────────────────────────────────────────

/**
 * Fetch pending merchant revival requests.
 */
export function useMerchantRevivals() {
  return useQuery({
    queryKey: ["admin-merchant-revivals"],
    queryFn: async () => {
      const json = await apiFetch("/api/revivals?status=pending");
      return json.data?.revivals || [];
    },
  });
}

/**
 * Fetch customer revival requests.
 */
export function useCustomerRevivals() {
  return useQuery({
    queryKey: ["admin-customer-revivals"],
    queryFn: async () => {
      const json = await apiFetch("/api/revivals/customer?admin=true");
      return json.data?.revivals || [];
    },
  });
}

/**
 * Approve or reject a merchant revival request.
 */
export function useReviewMerchantRevival() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ revivalId, status }) =>
      apiFetch("/api/revivals", {
        method: "PUT",
        body: { revivalId, status, reviewNote: "Moderated by admin" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merchant-revivals"] });
    },
  });
}

/**
 * Update a customer revival request status.
 */
export function useReviewCustomerRevival() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ revivalId, status }) =>
      apiFetch("/api/revivals/customer", {
        method: "PUT",
        body: { revivalId, status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customer-revivals"] });
    },
  });
}

// ─────────────────────────────────────────────
// Ticker Management
// ─────────────────────────────────────────────

/**
 * Fetch active coupons for the homepage ticker configuration.
 */
export function useTickerCoupons() {
  return useQuery({
    queryKey: ["admin-ticker-coupons"],
    queryFn: async () => {
      const json = await apiFetch("/api/admin/coupons?status=active");
      return json.data?.coupons || [];
    },
  });
}

/**
 * Toggle isFeatured or isHot flag on a coupon.
 */
export function useToggleCouponFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, field, currentValue }) =>
      apiFetch("/api/admin/coupons", {
        method: "PUT",
        body: { couponId, [field]: !currentValue },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticker-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon flag updated and home cache busted!");
    },
    onError: () => {
      toast.error("Failed to update coupon flags.");
    },
  });
}

// ─────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────

/**
 * Fetch all platform users.
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const json = await apiFetch("/api/admin/users");
      return json.data?.users || [];
    },
  });
}

/**
 * Toggle a user's active/suspended status.
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authId, isActive }) =>
      apiFetch("/api/admin/users", {
        method: "PUT",
        body: { authId, isActive: !isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

/**
 * Export newsletter subscribers (CSV download). Not a query — uses the mutation
 * pattern because it's user-initiated.
 */
export function useExportSubscribers() {
  return useMutation({
    mutationFn: async () => {
      const json = await apiFetch("/api/admin/users?export=true");
      return json.data?.subscribers || [];
    },
  });
}
