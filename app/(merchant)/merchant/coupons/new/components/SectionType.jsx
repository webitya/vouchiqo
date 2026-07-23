"use client";

import { ArrowRight, Gift, Link2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OFFER_TYPES = [
  {
    id: "code",
    name: "Offer with Code",
    icon: Ticket,
    desc: "Customer copies code for online checkout or presents a Smart Code at counter in-store.",
    bestFor:
      "Best for: Restaurants, salons, retail stores, or online checkouts.",
    color: "border-blue-500 bg-blue-50/40 text-blue-900",
  },
  {
    id: "deal",
    name: "Deal / Direct Link",
    icon: Link2,
    desc: "No code required. Clicking the deal opens your pre-discounted page directly.",
    bestFor:
      "Best for: E-commerce sites, product sales pages, online bookings.",
    color: "border-blue-600 bg-blue-50/40 text-blue-900",
  },
  {
    id: "special",
    name: "Special Offer / Gift",
    icon: Gift,
    desc: "Non-standard format: BOGO, free gift with purchase, free service upgrade, bundle deals.",
    bestFor:
      "Best for: BOGO meals, free treatments, gym trials, package deals.",
    color: "border-indigo-500 bg-indigo-50/40 text-indigo-900",
  },
];

export default function SectionType({ formData, setFormData, onNext }) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-4.5 space-y-4 text-left font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Section 1: Select Offer Type &amp; Model
        </h3>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Choose how customers redeem this offer with clear guide instructions.
        </p>
      </div>

      <div className="space-y-2.5">
        {OFFER_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.offerType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => setFormData({ ...formData, offerType: type.id })}
              className={cn(
                "p-3.5 rounded-xl border-2 cursor-pointer transition-all",
                isSelected
                  ? `${type.color} border-slate-900 shadow-2xs`
                  : "border-slate-200/80 bg-white hover:border-slate-300",
              )}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <Icon className="w-4 h-4 text-slate-800 shrink-0" />
                <span className="text-xs font-bold text-slate-900">
                  {type.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-6">
                {type.desc}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block pt-1.5 pl-6">
                {type.bestFor}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-1">
        <Button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9 py-2 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
        >
          <span>Continue to Basic Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
