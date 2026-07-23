"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AddOnsGrid({ addOns, onOpenAddOn }) {
  return (
    <div className="space-y-4 pt-4 text-left font-sans">
      <div>
        <h3 className="font-heading text-base font-bold text-slate-900 uppercase tracking-wider">
          Add-Ons &amp; Promotional Boosts (3-Column Grid)
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Purchase individual feature add-on packs anytime without changing your
          plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center justify-between">
                <span>{addon.name}</span>
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200 text-[9px] font-bold"
                >
                  {addon.unit}
                </Badge>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {addon.desc}
              </p>
              <span className="block text-base font-black text-[#e85d04] pt-1">
                ₹{addon.price}
              </span>
            </div>

            <Button
              onClick={() => onOpenAddOn(addon)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 w-full text-xs py-2 rounded-xl font-bold cursor-pointer border border-slate-200"
            >
              Buy Pack — ₹{addon.price}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
