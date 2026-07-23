"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
  Store,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecentActivityTimeline() {
  const activities = [
    {
      icon: Store,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New merchant registered",
      desc: "Zomato Partner submitted dashboard request",
      time: "2 min ago",
    },
    {
      icon: Users,
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      title: "New customer registered",
      desc: "James Chen created an account",
      time: "15 min ago",
    },
    {
      icon: Tag,
      color: "text-[#3e80dd]",
      bg: "bg-[#3e80dd]/10",
      title: "Moderation review completed",
      desc: "Boat coupons approved by admin root",
      time: "1 hour ago",
    },
    {
      icon: IndianRupee,
      color: "text-[#0a2e6e]",
      bg: "bg-[#0a2e6e]/10",
      title: "SaaS Payment received",
      desc: "₹1,499.00 subscription charge from Starbucks",
      time: "2 hours ago",
    },
    {
      icon: AlertTriangle,
      color: "text-[#1d4ed8]",
      bg: "bg-[#1d4ed8]/10",
      title: "System check warning",
      desc: "Starbucks checkout validation check timeout",
      time: "3 hours ago",
    },
  ];

  return (
    <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full hover:shadow-xs transition-all duration-200 p-0 gap-0 text-left">
      <CardHeader className="px-4 py-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 flex flex-row justify-between items-center gap-3 bg-slate-50/50 min-h-[56px]">
        <div>
          <CardTitle className="font-heading text-xs sm:text-[13px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-[11px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
            Latest events from your store
          </CardDescription>
        </div>
        <Link
          href="/admin/users"
          className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-0.5"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4">
        <div className="space-y-4">
          {activities.map((act, idx) => {
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
