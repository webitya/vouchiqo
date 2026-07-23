"use client";

import {
  Calendar as CalendarIcon,
  Eye,
  FileText,
  IndianRupee,
  Layers,
  MessageSquare,
  Percent,
  Settings,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import {
  FormActions,
  FormDatePicker,
  FormInput,
  FormSection,
  FormSelect,
  FormTextarea,
} from "@/components/shared/form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const CATEGORIES = [
  { id: "fashion", label: "Fashion & Clothing" },
  { id: "food", label: "Food & Dining" },
  { id: "electronics", label: "Electronics & Gadgets" },
  { id: "beauty", label: "Beauty & Wellness" },
  { id: "travel", label: "Travel & Hospitality" },
  { id: "home", label: "Home & Living" },
  { id: "home-improvement", label: "Home Improvement" },
  { id: "fitness", label: "Fitness & Healthcare" },
  { id: "education", label: "Education & Courses" },
  { id: "kids-baby", label: "Kids & Baby Products" },
  { id: "jewellery", label: "Jewellery & Accessories" },
  { id: "automotive", label: "Automobile & Auto Services" },
  { id: "entertainment", label: "Gaming & Entertainment" },
  { id: "grocery", label: "Grocery & Essentials" },
  { id: "finance", label: "Finance & Insurance" },
];

const DISCOUNT_TYPES = [
  { value: "percentage", label: "% Percentage Off" },
  { value: "fixed", label: "Flat ₹ Amount Off" },
  { value: "freebie", label: "Free Gift / Freebie" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active / Enabled" },
  { value: "paused", label: "Paused / Suspended" },
  { value: "expired", label: "Expired / Closed" },
];

const LISTING_TYPES = [
  { id: "coupon", label: "Promo Code", desc: "Code for checkout / in-store" },
  { id: "deal", label: "Sale / Flat Offer", desc: "Discounted price link" },
  { id: "special", label: "Special / Gift", desc: "BOGO or Freebie package" },
];

/**
 * CouponForm — create / edit a coupon listing.
 * Fully refactored to use the shared form component library.
 */
export default function CouponForm({
  formData,
  setFormData,
  listingType,
  setListingType,
  handleSubmit,
  isPending,
  submitText = "Save Offer",
  isEdit = false,
  merchantPlan = "starter",
  merchantName = "Store Name",
}) {
  const update = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const selectedCategory =
    CATEGORIES.find(
      (c) => c.id === formData.category || c.label === formData.category,
    ) ?? CATEGORIES[0];

  const canFeature = merchantPlan === "pro" || merchantPlan === "enterprise";

  const discountLabel =
    formData.discountType === "percentage"
      ? `${formData.discountValue || "0"}% OFF`
      : formData.discountType === "fixed"
        ? `₹${formData.discountValue || "0"} OFF`
        : "Free Gift";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start"
    >
      {/* LEFT COLUMN */}
      <div className="lg:col-span-7 space-y-6">
        {/* Listing Format Selector */}
        {!isEdit && setListingType && (
          <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-5 space-y-3">
            <FormSection title="Choose Listing Format" icon={Settings} noBorder>
              <div className="grid grid-cols-3 gap-2.5">
                {LISTING_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setListingType(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      listingType === t.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm font-bold text-slate-900"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <span className="block text-xs font-bold">{t.label}</span>
                    <span className="block text-[10px] text-brand-subtext font-medium mt-0.5 leading-snug">
                      {t.desc}
                    </span>
                  </button>
                ))}
              </div>
            </FormSection>
          </Card>
        )}

        {/* Card 1: Main Offer Details */}
        <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-5">
          <FormSection title="Edit Campaign Details" icon={FileText} noBorder>
            <FormInput
              name="title"
              label="Offer Title / Headline"
              icon={Tag}
              placeholder="e.g. Free Drink with Meal"
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
              maxLength={70}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                name="category"
                label="Category"
                icon={Layers}
                options={CATEGORIES.map((c) => ({
                  value: c.id,
                  label: c.label,
                }))}
                value={selectedCategory.id}
                onValueChange={(val) => update("category", val)}
                required
              />
              <FormInput
                name="code"
                label="Promo Code"
                icon={Ticket}
                placeholder="FREEDRINK"
                value={formData.code}
                onChange={(e) =>
                  update(
                    "code",
                    e.target.value.toUpperCase().replace(/\s/g, ""),
                  )
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                name="discountType"
                label="Discount Type"
                icon={Percent}
                options={DISCOUNT_TYPES}
                value={formData.discountType || "percentage"}
                onValueChange={(val) => update("discountType", val)}
                required
              />
              <FormInput
                name="discountValue"
                label="Discount Value (₹ or %)"
                icon={IndianRupee}
                type="number"
                placeholder="0"
                value={formData.discountValue}
                onChange={(e) => update("discountValue", e.target.value)}
              />
            </div>

            <FormTextarea
              name="description"
              label="Terms / Description"
              icon={MessageSquare}
              rows={3}
              placeholder="Enjoy great deals and savings on your order..."
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={300}
              showCounter
              required
            />
          </FormSection>
        </Card>

        {/* Card 2: Limits & Expiry */}
        <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-5">
          <FormSection
            title="Limits & Expiry Details"
            icon={CalendarIcon}
            noBorder
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormDatePicker
                name="expiresAt"
                label="Expiry Date"
                icon={CalendarIcon}
                value={formData.expiresAt}
                onChange={(val) => update("expiresAt", val)}
                minDate={new Date()}
                required
              />
              <FormInput
                name="maxClaims"
                label="Claims Limit"
                icon={Users}
                type="number"
                placeholder="e.g. 500"
                value={formData.maxClaims}
                onChange={(e) => update("maxClaims", e.target.value)}
              />
              {isEdit && (
                <FormSelect
                  name="status"
                  label="Campaign Status"
                  icon={Settings}
                  options={STATUS_OPTIONS}
                  value={formData.status}
                  onValueChange={(val) => update("status", val)}
                />
              )}
            </div>

            {/* Featured placement toggle */}
            <div className="border-t border-brand-border pt-4 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-text block">
                    Featured Homepage Placement
                  </span>
                  <span className="text-[11px] text-brand-subtext font-medium">
                    Pin this deal to the homepage hero grid for 5x visibility.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {!canFeature && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold"
                    >
                      Pro/Enterprise Only
                    </Badge>
                  )}
                  <Switch
                    disabled={!canFeature}
                    checked={formData.isFeatured}
                    onCheckedChange={(val) => update("isFeatured", val)}
                  />
                </div>
              </div>
            </div>

            <FormActions
              submitText={submitText}
              loading={isPending}
              align="end"
            />
          </FormSection>
        </Card>
      </div>

      {/* RIGHT COLUMN: Real-Time Card Preview */}
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
        <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <span className="flex items-center gap-1.5 text-xs font-bold text-brand-text uppercase tracking-wider">
              <Eye className="w-4 h-4 text-blue-600" /> Real-Time Card Preview
            </span>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200/60 text-[10px] font-bold"
            >
              Live Preview
            </Badge>
          </div>

          <div className="border border-brand-border rounded-2xl overflow-hidden bg-brand-bg shadow-sm">
            {/* Image hero */}
            <div
              className="h-32 bg-brand-navy relative flex items-end p-4 bg-cover bg-center"
              style={{
                backgroundImage: formData.image
                  ? `url(${formData.image})`
                  : "linear-gradient(to right, #0f172a, #1e293b)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="relative z-10 flex items-center justify-between w-full">
                <Badge className="bg-brand-blue text-white font-bold text-[9px] uppercase px-2 py-0.5 border-0">
                  {selectedCategory.label}
                </Badge>
                <span className="text-white text-[10px] font-bold bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                  {merchantName}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3.5">
              <div>
                <h4 className="text-sm font-black text-brand-text leading-snug">
                  {formData.title || "Free Drink with Meal"}
                </h4>
                <p className="text-[11px] text-brand-subtext font-medium mt-1 line-clamp-2">
                  {formData.description ||
                    "Enjoy great deals and savings on Free Drink with Meal."}
                </p>
              </div>

              <div className="p-3 bg-brand-surface rounded-xl border border-brand-border text-center space-y-0.5">
                <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider block">
                  Use Promo Code
                </span>
                <span className="font-mono text-base font-black text-brand-text uppercase tracking-widest block">
                  {formData.code || "FREEDRINK"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-subtext border-t border-brand-border pt-3">
                <div>
                  <span className="block text-[10px] text-brand-subtext font-bold uppercase">
                    Discount
                  </span>
                  <span className="text-blue-600 font-black">
                    {discountLabel}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-subtext font-bold uppercase">
                    Valid Until
                  </span>
                  <span className="text-brand-text font-bold">
                    {formData.expiresAt
                      ? new Date(formData.expiresAt).toLocaleDateString(
                          "en-US",
                          { month: "numeric", day: "numeric", year: "numeric" },
                        )
                      : "Select Date"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
}
