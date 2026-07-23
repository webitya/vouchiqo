"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TrafficSourcesCard() {
  const sources = [
    { label: "Direct", pct: "35%", color: "bg-[#3e80dd]" },
    { label: "Organic", pct: "28%", color: "bg-[#2563eb]" },
    { label: "Referral", pct: "22%", color: "bg-[#0a2e6e]" },
    { label: "Social", pct: "15%", color: "bg-[#8b5cf6]" },
  ];

  return (
    <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col hover:shadow-xs transition-all duration-200 p-0 gap-0 text-left">
      <CardHeader className="px-4 py-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-slate-50/50 min-h-[52px]">
        <CardTitle className="font-heading text-xs sm:text-[13px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
          Traffic Sources
        </CardTitle>
        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
          Where your visitors come from
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-4">
        <div className="flex items-center gap-4">
          <div className="relative h-32 w-32 shrink-0 flex items-center justify-center bg-slate-50 rounded-full border-4 border-blue-500/20">
            <div className="text-center">
              <span className="text-base font-black text-slate-800 block">
                284K
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Visits
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            {sources.map((src, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${src.color}`} />
                  <span className="text-slate-600">{src.label}</span>
                </div>
                <span className="text-slate-900 font-bold">{src.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
