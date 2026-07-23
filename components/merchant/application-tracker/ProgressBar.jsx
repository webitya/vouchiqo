"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * ProgressBar — clean single-color progress bar matching Shadcn styling.
 */
export default function ProgressBar({
  percentage = 66,
  status = "under_review",
}) {
  const isError = status === "rejected";
  const isComplete = percentage >= 100;

  return (
    <Card className="border-brand-border bg-brand-bg rounded-2xl p-5 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between text-xs font-bold text-brand-text">
        <span className="flex items-center gap-2">
          <span>Overall Application Progress</span>
          {isComplete && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Complete
            </span>
          )}
        </span>
        <span
          className={cn(
            "font-mono font-black text-sm",
            isError
              ? "text-brand-error"
              : isComplete
                ? "text-emerald-600"
                : "text-[#e85d04]",
          )}
        >
          {percentage}% Complete
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80 relative">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isError
              ? "bg-brand-error"
              : isComplete
                ? "bg-emerald-500"
                : "bg-[#e85d04]",
          )}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-semibold text-brand-subtext pt-0.5">
        <span>Step 1: Submitted (33%)</span>
        <span>Step 2: Verification (66%)</span>
        <span>Step 3: Activation (100%)</span>
      </div>
    </Card>
  );
}
