"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * SuccessHero — Professional hero banner matching Vouchiqo design system.
 */
export default function SuccessHero({
  applicationId = "VQ-2026-89421",
  estimatedCompletion = "27 Oct 2026, 2:30 PM",
  businessName = "Marbella Tiles & Sanitaryware",
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] text-white p-6 md:p-8 shadow-sm border border-slate-800">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Static clean green verified tick icon (Twitter-style badge in green) */}
          <div className="shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 fill-emerald-500 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5">
                Form Submitted &amp; Under Review
              </Badge>

              {businessName && (
                <span className="text-xs font-semibold text-slate-300">
                  • {businessName}
                </span>
              )}
            </div>

            <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
              Application Submitted Successfully!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              Your business profile is now under review by our compliance team.
              We are verifying your documents and will activate your account
              soon.
            </p>
          </div>
        </div>

        {/* Application ID & Est Time Box */}
        <div className="shrink-0 bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-2 text-left md:text-right">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Application ID
            </span>
            <span className="font-mono text-base md:text-lg font-black text-[#e85d04] tracking-wider">
              #{applicationId}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 md:justify-end font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Est. Processing:{" "}
              <strong className="text-white">{estimatedCompletion}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
