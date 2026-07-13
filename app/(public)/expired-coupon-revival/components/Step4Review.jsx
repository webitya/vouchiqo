import React from "react";
import { CheckSquare } from "lucide-react";

export function Step4Review({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
        <CheckSquare className="w-4 h-4 text-brand-blue" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">4. Review & Confirm</h2>
      </div>

      {/* Summary card */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-4 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium">Merchant:</span>
          <span className="font-bold text-brand-navy">{form.brandName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium">Category:</span>
          <span className="font-bold text-brand-navy">{form.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium">Offer Code:</span>
          <span className="font-bold text-brand-navy">{form.code || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium">Offer Value:</span>
          <span className="font-bold text-brand-success">
            {form.discountType === "percentage" && `${form.discountValue}% OFF`}
            {form.discountType === "fixed" && `₹${form.discountValue} OFF`}
            {form.discountType === "bogo" && "BOGO Deal"}
            {form.discountType === "freebie" && "Free Gift"}
            {form.discountType === "other" && "Discount"}
          </span>
        </div>
      </div>

      {/* Expectation-Setting Consent Checkbox */}
      <div className="flex gap-2.5 items-start p-3 bg-brand-surface border border-brand-border rounded-lg">
        <input
          type="checkbox"
          id="consent-check"
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-1 text-brand-blue focus:ring-brand-blue cursor-pointer"
        />
        <label htmlFor="consent-check" className="text-[11px] leading-relaxed text-slate-600 font-medium cursor-pointer">
          I understand Vouchiqo will try to get this offer reactivated, but cannot guarantee a working code will be available. If this isn't possible, I'll be notified and may be offered a similar active offer from this brand or category instead.
        </label>
      </div>
    </div>
  );
}

export default Step4Review;
