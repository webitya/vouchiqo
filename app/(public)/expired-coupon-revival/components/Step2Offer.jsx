import React from "react";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step2Offer({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
        <Tag className="w-4 h-4 text-brand-blue" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">2. Offer Details</h2>
      </div>

      {/* Expired Code */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expired Coupon Code (Optional)</label>
        <Input
          placeholder="e.g. OFF50"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9 uppercase"
        />
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Discount Type *</label>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "% Off", value: "percentage" },
            { label: "Flat ₹ Off", value: "fixed" },
            { label: "BOGO", value: "bogo" },
            { label: "Free Gift", value: "freebie" },
            { label: "Other", value: "other" },
          ].map((t) => (
            <label key={t.value} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="discountType"
                value={t.value}
                checked={form.discountType === t.value}
                onChange={(e) => setForm({ ...form, discountType: e.target.value, discountValue: "" })}
                className="text-brand-blue focus:ring-brand-blue"
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Discount Value */}
      {(form.discountType === "percentage" || form.discountType === "fixed") && (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Discount Value ({form.discountType === "percentage" ? "%" : "₹"}) *
          </label>
          <Input
            type="number"
            placeholder={form.discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
          />
        </div>
      )}

      {/* Brief Description */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brief Offer Description *</label>
          <span className="text-[9px] font-semibold text-slate-400">{form.description.length}/100</span>
        </div>
        <Input
          placeholder="e.g. 20% off all bathroom fittings"
          value={form.description}
          maxLength={100}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
      </div>

      {/* When did you find this? */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">When did you see/find this offer? *</label>
        <Input
          type="date"
          value={form.foundAtDate}
          onChange={(e) => setForm({ ...form, foundAtDate: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
      </div>

      {/* What were you trying to buy? */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">What were you trying to buy? (Optional)</label>
        <Input
          placeholder="e.g. Kitchen wall tiles"
          value={form.buyingIntent}
          maxLength={150}
          onChange={(e) => setForm({ ...form, buyingIntent: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
      </div>
    </div>
  );
}

export default Step2Offer;
