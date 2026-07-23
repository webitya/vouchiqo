"use client";

import {
  CheckCircle2,
  FileSearch,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * ProgressSteps — clean 3-step application tracker pipeline matching website UI.
 */
export default function ProgressSteps({
  status = "under_review",
  submittedAt,
}) {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isDocVerified = status === "document_verified" || isApproved;
  const isUnderReview = status === "under_review" || isDocVerified;

  const steps = [
    {
      id: 1,
      name: "STEP 1: APPLICATION RECEIVED",
      statusText: "Submitted & Received",
      detail: submittedAt
        ? `Submitted on ${new Date(submittedAt).toLocaleDateString()}`
        : "Application submitted",
      state: "completed",
      icon: CheckCircle2,
    },
    {
      id: 2,
      name: "STEP 2: DOCUMENT VERIFICATION",
      statusText: isRejected
        ? "Verification Failed"
        : isDocVerified
          ? "Documents Verified"
          : "Under Review by Admin",
      detail: isDocVerified
        ? "All tax & trade credentials verified"
        : "Compliance team is verifying business documents",
      state: isRejected
        ? "rejected"
        : isDocVerified
          ? "completed"
          : isUnderReview
            ? "active"
            : "pending",
      icon: isRejected ? XCircle : isDocVerified ? CheckCircle2 : FileSearch,
    },
    {
      id: 3,
      name: "STEP 3: ACCOUNT ACTIVATION",
      statusText: isApproved
        ? "Application Accepted & Active"
        : isDocVerified
          ? "Ready for Activation"
          : "Activation Pending",
      detail: isApproved
        ? "Account ready! Start posting deals & offers"
        : "Activated within 2 hours after verification",
      state: isApproved ? "completed" : isDocVerified ? "active" : "pending",
      icon: isApproved ? ShieldCheck : Lock,
    },
  ];

  return (
    <Card className="border-brand-border bg-brand-bg rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-text">
        Application Progress Pipeline
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          const isComp = step.state === "completed";
          const isActive = step.state === "active";
          const isRej = step.state === "rejected";

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-xl p-4 border transition-all flex flex-col justify-between h-full space-y-3",
                isComp
                  ? "border-emerald-200 bg-emerald-50/40 text-slate-900"
                  : isActive
                    ? "border-orange-300 bg-orange-50/50 text-slate-900 shadow-xs"
                    : isRej
                      ? "border-red-200 bg-red-50/40 text-slate-900"
                      : "border-slate-200/80 bg-slate-50/40 opacity-70 text-slate-700",
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm",
                    isComp
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-[#e85d04] text-white"
                        : isRej
                          ? "bg-red-600 text-white"
                          : "bg-slate-200 text-slate-500",
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                    isComp
                      ? "bg-emerald-100 text-emerald-800"
                      : isActive
                        ? "bg-orange-100 text-[#e85d04]"
                        : isRej
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-600 border border-slate-200",
                  )}
                >
                  {isComp
                    ? "Completed ✓"
                    : isActive
                      ? "In Progress ⏳"
                      : isRej
                        ? "Rejected ✕"
                        : "Pending 🔒"}
                </span>
              </div>

              {/* Step info */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {step.name}
                </span>
                <h4 className="font-heading text-sm font-bold text-slate-900 mt-0.5">
                  {step.statusText}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug font-normal">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
