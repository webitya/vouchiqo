"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * AdminIndicator — sleek live admin review banner.
 */
export default function AdminIndicator({
  isReviewing = true,
  reviewerName = "Vouchiqo Verification Desk #4",
  lastUpdated,
}) {
  if (!isReviewing) return null;

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
          <Eye className="w-4 h-4 text-amber-800 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>Admin is Currently Reviewing</span>
            </h4>
            <Badge className="bg-amber-200/80 text-amber-900 border-amber-300 text-[9px] font-bold px-2 py-0">
              Live Review
            </Badge>
          </div>
          <p className="text-xs text-amber-800/90 font-medium leading-snug">
            Our compliance team ({reviewerName}) is actively checking your
            submitted documents. We will notify you instantly upon completion.
          </p>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-[11px] font-semibold text-amber-800 sm:text-right shrink-0 bg-amber-100/50 px-3 py-1 rounded-lg border border-amber-200/60">
          <span className="block text-[9px] uppercase tracking-wider text-amber-900 font-bold">
            Last Updated
          </span>
          <span>
            {new Date(lastUpdated).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
