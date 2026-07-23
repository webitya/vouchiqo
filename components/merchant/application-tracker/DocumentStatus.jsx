"use client";

import { CheckCircle2, Clock, FileCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * DocumentStatus — verification status grid for uploaded documents matching website design.
 */
export default function DocumentStatus({ documents = [] }) {
  if (documents.length === 0) return null;

  const getDocBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold gap-1 px-2.5 py-0.5 shadow-none">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px] font-bold gap-1 px-2.5 py-0.5 shadow-none">
            <XCircle className="w-3 h-3 text-red-600" /> Needs Action
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-[10px] font-bold gap-1 px-2.5 py-0.5 shadow-none">
            <Clock className="w-3 h-3 text-amber-600" /> Under Review
          </Badge>
        );
    }
  };

  return (
    <Card className="border-brand-border bg-brand-bg rounded-2xl shadow-xs overflow-hidden text-left">
      <CardHeader className="pb-3 border-b border-brand-border flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-brand-blue" /> Submitted
          Verification Documents
        </CardTitle>
        <span className="text-[11px] text-brand-subtext font-semibold">
          {documents.filter((d) => d.status === "verified").length}/
          {documents.length} Verified
        </span>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc, i) => (
            <div
              key={i}
              className={cn(
                "p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors",
                doc.status === "verified"
                  ? "border-emerald-200 bg-emerald-50/40"
                  : doc.status === "rejected"
                    ? "border-red-200 bg-red-50/40"
                    : "border-amber-200/80 bg-amber-50/30",
              )}
            >
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-slate-900 truncate block">
                  {doc.name}
                </span>
                {doc.type && (
                  <span className="text-[10px] text-slate-500 block font-medium">
                    {doc.type}
                  </span>
                )}
              </div>

              <div className="shrink-0">{getDocBadge(doc.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
