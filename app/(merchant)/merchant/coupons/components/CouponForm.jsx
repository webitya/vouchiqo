"use client";

import {
  Calendar,
  FileText,
  FolderOpen,
  IndianRupee,
  Loader2,
  Percent,
  Save,
  Settings,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function FieldLabel({ icon: Icon, children, hint }) {
  return (
    <Label className="text-xs font-bold text-brand-text uppercase flex items-center gap-1.5 mb-1.5 text-left">
      {Icon && <Icon className="w-3.5 h-3.5 text-brand-blue" />}
      <span>{children}</span>
      {hint && (
        <span className="text-[10px] font-medium text-brand-subtext normal-case tracking-normal">
          ({hint})
        </span>
      )}
    </Label>
  );
}

export default function CouponForm({
  formData,
  setFormData,
  listingType,
  setListingType,
  handleSubmit,
  isPending,
  submitText = "Save Offer",
  isEdit = false,
  couponCategories = [],
  merchantPlan = "starter",
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start"
    >
      {/* Form Content (7 columns) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Listing format selector - only if not editing */}
        {!isEdit && (
          <div className="bg-white border border-brand-border p-4 rounded-xl shadow-sm space-y-3">
            <FieldLabel icon={Settings}>Choose Listing Format</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: "coupon",
                  label: "Promo Code",
                  desc: "Monospace promo code",
                },
                {
                  id: "deal",
                  label: "Sale/Flat Offer",
                  desc: "Discounted price list",
                },
                {
                  id: "special",
                  label: "Special/Gift",
                  desc: "Loyalty, BOGO, or Freebie",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setListingType(t.id)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    listingType === t.id
                      ? "border-brand-navy bg-brand-surface shadow-sm ring-1 ring-brand-navy"
                      : "border-brand-border hover:bg-brand-surface/40"
                  }`}
                >
                  <span className="block text-xs font-bold text-brand-navy">
                    {t.label}
                  </span>
                  <span className="block text-[9px] text-brand-subtext font-medium mt-0.5 leading-snug">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
            {isEdit ? "Edit Campaign Details" : "Campaign Details"}
          </h3>

          {/* Title */}
          <div className="space-y-1">
            <FieldLabel icon={Tag}>Offer Title / Headline</FieldLabel>
            <Input
              type="text"
              placeholder="e.g. 50% Off your next dinner"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
              required
            />
          </div>

          {/* Grid 1: Category & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <FieldLabel icon={FolderOpen}>Category</FieldLabel>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-brand-border">
                  {couponCategories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="text-xs font-semibold capitalize"
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <FieldLabel icon={Ticket}>Promo Code</FieldLabel>
              <Input
                type="text"
                placeholder="e.g. SAVE50"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none uppercase font-mono"
                required
              />
            </div>
          </div>

          {/* Grid 2: Discount Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <FieldLabel icon={Percent}>Discount Type</FieldLabel>
              <Select
                value={formData.discountType}
                onValueChange={(val) =>
                  setFormData({ ...formData, discountType: val })
                }
              >
                <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-brand-border">
                  <SelectItem
                    value="percentage"
                    className="text-xs font-semibold"
                  >
                    Percentage OFF (%)
                  </SelectItem>
                  <SelectItem value="fixed" className="text-xs font-semibold">
                    Fixed Cash OFF (₹)
                  </SelectItem>
                  <SelectItem value="freebie" className="text-xs font-semibold">
                    Freebie/Gift
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.discountType !== "freebie" && (
              <div className="space-y-1">
                <FieldLabel
                  icon={
                    formData.discountType === "percentage"
                      ? Percent
                      : IndianRupee
                  }
                >
                  Discount Value{" "}
                  {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                </FieldLabel>
                <Input
                  type="number"
                  placeholder={
                    formData.discountType === "percentage" ? "50" : "200"
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none"
                  required
                />
              </div>
            )}
          </div>

          {/* Terms / Description */}
          <div className="space-y-1">
            <FieldLabel icon={FileText}>Terms / Description</FieldLabel>
            <Textarea
              placeholder="Detail maximum discount caps, eligibility, and validation rules..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full min-h-[80px] p-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
            />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
            Limits & Expiry Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Expiry Date */}
            <div className="space-y-1">
              <FieldLabel icon={Calendar}>Expiry Date</FieldLabel>
              <Input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none"
                required
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-1">
              <FieldLabel icon={Users}>Claims Limit</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={formData.maxClaims}
                onChange={(e) =>
                  setFormData({ ...formData, maxClaims: e.target.value })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none"
              />
            </div>

            {/* Status Toggle - only if editing */}
            {isEdit && (
              <div className="space-y-1">
                <FieldLabel icon={Settings}>Campaign Status</FieldLabel>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-brand-border">
                    <SelectItem
                      value="active"
                      className="text-xs font-semibold text-brand-success"
                    >
                      Active / Enabled
                    </SelectItem>
                    <SelectItem
                      value="paused"
                      className="text-xs font-semibold text-amber-500"
                    >
                      Paused / Suspended
                    </SelectItem>
                    <SelectItem
                      value="expired"
                      className="text-xs font-semibold text-brand-error"
                    >
                      Expired / Closed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Featured Placement Toggle (Pro/Enterprise gated) */}
            <div className="space-y-1 sm:col-span-3 border-t border-brand-border pt-4 mt-2 text-left">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-brand-navy block">
                    Featured Homepage Placement
                  </span>
                  <span className="text-[10px] text-brand-subtext font-semibold block">
                    Pin this deal to the homepage hero grid to drive 5x more
                    clicks.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Lock badge if not Pro/Enterprise */}
                  {!(
                    merchantPlan === "pro" || merchantPlan === "enterprise"
                  ) && (
                    <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pro/Enterprise Only
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={
                      !(merchantPlan === "pro" || merchantPlan === "enterprise")
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isFeatured: !formData.isFeatured,
                      })
                    }
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.isFeatured ? "bg-brand-blue" : "bg-slate-200"
                    } ${!(merchantPlan === "pro" || merchantPlan === "enterprise") ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.isFeatured ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-0 h-auto cursor-pointer shadow-none"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isPending ? "Saving..." : submitText}</span>
        </Button>
      </div>

      {/* Real-time Preview Sidebar (5 columns) */}
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
        <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider text-left">
          Real-time Card Preview
        </h4>

        {/* Simulated Coupon Card */}
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Header Box */}
          <div className="bg-brand-surface p-4 flex justify-between items-start border-b border-brand-border">
            <div className="space-y-1">
              <span className="text-[9px] bg-brand-blue/10 text-brand-blue font-bold px-2 py-0.5 rounded capitalize">
                {formData.category}
              </span>
              <h3 className="font-heading text-sm font-extrabold text-brand-navy leading-snug">
                {formData.title || "Offer Title / Coupon Headline"}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <p className="text-xs text-brand-subtext font-medium leading-relaxed italic">
              {formData.description ||
                "Describe campaign guidelines, restrictions, or terms..."}
            </p>

            {/* Simulated Monospace Code Banner */}
            <div className="bg-brand-surface border border-dashed border-brand-border rounded-xl p-3.5 flex flex-col items-center justify-center space-y-1">
              <span className="text-[10px] text-brand-subtext font-bold uppercase tracking-wider">
                Use Promo Code
              </span>
              <span className="font-mono text-base font-black text-brand-navy tracking-widest uppercase">
                {formData.code || "SAVE50"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-subtext border-t border-slate-100 pt-3">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">
                  Discount
                </span>
                <span className="text-brand-blue font-bold">
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue || "0"}% OFF`
                    : formData.discountType === "fixed"
                      ? `₹${formData.discountValue || "0"} OFF`
                      : "Free Gift"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">
                  Valid Until
                </span>
                <span className="text-brand-navy font-bold">
                  {formData.expiresAt
                    ? new Date(formData.expiresAt).toLocaleDateString()
                    : "Select Date"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
