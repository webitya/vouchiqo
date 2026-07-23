"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AddOnsGrid({ addOns, onOpenAddOn }) {
  return (
    <div className="space-y-3 pt-2 text-left font-sans">
      <div>
        <h3 className="font-heading text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Add-Ons &amp; Promotional Boosts (3-Column Grid)
        </h3>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Purchase individual feature add-on packs anytime without changing your
          plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-semibold">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-blue-200 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-between gap-1">
                <span className="truncate">{addon.name}</span>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] font-bold py-0.5 px-1.5 shrink-0"
                >
                  {addon.unit}
                </Badge>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {addon.desc}
              </p>
              <span className="block text-sm font-extrabold text-blue-600 pt-0.5">
                ₹{addon.price}
              </span>
            </div>

            <Button
              onClick={() => onOpenAddOn(addon)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 w-full text-xs h-8 py-1.5 rounded-xl font-bold cursor-pointer border border-slate-200/90 shadow-none"
            >
              Buy Pack — ₹{addon.price}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
