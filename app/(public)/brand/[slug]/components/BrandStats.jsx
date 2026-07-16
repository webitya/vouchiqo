"use client";

export default function BrandStats({ coupons, merchant }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#f1f5f9] text-left">
      <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-[#e2e8f0]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Active Deals
        </span>
        <span className="text-sm font-black text-[#191f2e] mt-0.5 block">
          {coupons.length} Listed
        </span>
      </div>
      <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-[#e2e8f0]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Average Discount
        </span>
        <span className="text-sm font-black text-[#191f2e] mt-0.5 block">
          Up to 45%
        </span>
      </div>
      <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-[#e2e8f0]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Channel Type
        </span>
        <span className="text-sm font-black text-[#191f2e] mt-0.5 block capitalize">
          {merchant.businessType || "Both"}
        </span>
      </div>
      <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-[#e2e8f0]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Category
        </span>
        <span className="text-sm font-black text-[#191f2e] mt-0.5 block capitalize">
          {merchant.category || "General"}
        </span>
      </div>
    </div>
  );
}
