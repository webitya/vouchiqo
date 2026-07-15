import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivity({ defaultActivities }) {
  return (
    <Card className="col-span-full xl:col-span-4 border-[#e2e8f0] shadow-sm">
      <CardHeader className="pb-3 border-b border-[#f1f5f9] flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-[11px] font-semibold mt-0.5">
            Latest events from your store
          </CardDescription>
        </div>
        <Link
          href="/admin/users"
          className="text-xs font-bold text-[#3e80dd] hover:underline flex items-center gap-0.5"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 px-5">
        <div className="space-y-5">
          {defaultActivities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="flex-grow space-y-0.5 text-xs text-left">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-800">
                      {act.title}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
