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
    color: "border-[#e85d04] bg-orange-50/40 text-orange-900",
  },
  {
    id: "special",
    name: "Special Offer / Gift",
    icon: Gift,
    desc: "Non-standard format: BOGO, free gift with purchase, free service upgrade, bundle deals.",
    bestFor:
      "Best for: BOGO meals, free treatments, gym trials, package deals.",
    color: "border-purple-500 bg-purple-50/40 text-purple-900",
  },
];

export default function SectionType({ formData, setFormData, onNext }) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Section 1: Select Offer Type &amp; Model
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Choose how customers redeem this offer with clear guide instructions.
        </p>
      </div>

      <div className="space-y-3">
        {OFFER_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.offerType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => setFormData({ ...formData, offerType: type.id })}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all",
                isSelected
                  ? `${type.color} border-slate-900 shadow-xs`
                  : "border-slate-200/80 bg-white hover:border-slate-300",
              )}
            >
              <div className="flex items-center gap-3 mb-1">
                <Icon className="w-5 h-5 text-slate-800 shrink-0" />
                <span className="text-sm font-bold text-slate-900">
                  {type.name}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8">
                {type.desc}
              </p>
              <span className="text-[11px] text-slate-400 font-semibold block pt-2 pl-8">
                💡 {type.bestFor}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Basic Details</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
