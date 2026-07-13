import React from "react";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step1Merchant({
  form,
  setForm,
  brandSuggestions,
  handleBrandChange,
  checkBrandOnBlur,
  selectBrand,
  isCategoryLocked,
  VOUCHIQO_CATEGORIES,
  citySuggestions,
  handleCityChange,
  selectCity,
  FOUND_SOURCES,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
        <Building className="w-4 h-4 text-brand-blue" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">1. Merchant Details</h2>
      </div>

      {/* Brand Name Input with Autocomplete */}
      <div className="space-y-1 relative">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brand Name *</label>
        <Input
          placeholder="e.g. Marbella, Starbucks"
          value={form.brandName}
          onChange={(e) => handleBrandChange(e.target.value)}
          onBlur={checkBrandOnBlur}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
        {brandSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg z-50 overflow-hidden text-xs max-h-40 overflow-y-auto">
            {brandSuggestions.map((b, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectBrand(b)}
                className="w-full text-left px-3 py-2 hover:bg-brand-surface transition-colors border-b border-brand-border/40 font-medium"
              >
                {b.name} <span className="text-[10px] text-slate-400">({b.category})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Category *</label>
        <select
          value={form.category}
          disabled={isCategoryLocked}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-xs focus:ring-brand-blue focus:border-brand-blue h-9 disabled:opacity-60"
        >
          <option value="">Select category...</option>
          {VOUCHIQO_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* City Autocomplete */}
      <div className="space-y-1 relative">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Merchant Location (City) *</label>
        <Input
          placeholder="e.g. Ranchi"
          value={form.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
        {citySuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg z-50 overflow-hidden text-xs">
            {citySuggestions.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectCity(c)}
                className="w-full text-left px-3 py-2 hover:bg-brand-surface transition-colors border-b border-brand-border/40 font-medium"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Where did you find this? */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Where did you find this offer? *</label>
        <select
          value={form.foundWhere}
          onChange={(e) => setForm({ ...form, foundWhere: e.target.value })}
          className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-xs focus:ring-brand-blue focus:border-brand-blue h-9"
        >
          {FOUND_SOURCES.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
      </div>

      {/* If other/another website */}
      {(form.foundWhere === "Other" || form.foundWhere === "Another Coupon Website") && (
        <div className="space-y-1 animate-fadeIn">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specify Website or Platform *</label>
          <Input
            placeholder="e.g. GrabOn, physical banner"
            value={form.foundWhereOther}
            onChange={(e) => setForm({ ...form, foundWhereOther: e.target.value })}
            className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
          />
        </div>
      )}

      {/* Merchant Website Link */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Merchant Website / Social Link (Optional)</label>
        <Input
          placeholder="e.g. @marbellaranchi or website URL"
          value={form.merchantWebsite}
          onChange={(e) => setForm({ ...form, merchantWebsite: e.target.value })}
          className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
        />
      </div>
    </div>
  );
}

export default Step1Merchant;
