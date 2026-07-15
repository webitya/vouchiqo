import React from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step3Contact({ form, setForm, isExpedited, session }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
        <Phone className="w-4 h-4 text-brand-blue" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">3. Contact Details</h2>
      </div>

      {isExpedited && (
        <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-lg p-3 text-xs text-brand-blue font-medium mb-3">
          Expedited Flow: Reactivating pre-loaded coupon details for <strong>{form.brandName}</strong>. Fill in your contact info to submit!
        </div>
      )}

      {/* Email */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Email Address *</label>
        <Input
          type="email"
          placeholder="e.g. name@domain.com"
          value={form.email}
          disabled={!!session?.user?.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9 disabled:opacity-75"
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Mobile Number (WhatsApp Updates) *</label>
        <Input
          type="tel"
          placeholder="e.g. +91 9999999999"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
      </div>
    </div>
  );
}

export default Step3Contact;
