"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MonthlyGoalsCard() {
  const goals = [
    {
      title: "Monthly Revenue",
      current: "₹6,860",
      target: "Target: ₹8,000",
      pct: "88%",
      color: "bg-[#2563eb]",
    },
    {
      title: "New Customers",
      current: "140",
      target: "Target: 165",
      pct: "85%",
      color: "bg-[#2563eb]",
    },
    {
      title: "System Uptime",
      current: "99.9%",
      target: "Target: 100%",
      pct: "99.9%",
      color: "bg-[#3e80dd]",
    },
  ];

  return (
    <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col hover:shadow-xs transition-all duration-200 p-0 gap-0 text-left">
      <CardHeader className="px-4 py-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-slate-50/50 min-h-[52px]">
        <CardTitle className="font-heading text-xs sm:text-[13px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
          Monthly Goals
        </CardTitle>
        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
          Track progress toward targets
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 space-y-4">
        {goals.map((g, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800">{g.title}</span>
              <span className="text-slate-500 font-mono">{g.pct}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${g.color}`}
                style={{ width: g.pct }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{g.current}</span>
              <span>{g.target}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
