"use client";

import { Building2, FileText, HelpCircle, MapPin } from "lucide-react";
import StatusBadge from "@/components/shared/data/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * StatusCard — Clean application status card matching Shadcn & website design.
 */
export default function StatusCard({
  application = {},
  onViewDetails,
  onContactSupport,
}) {
  const {
    applicationId = "VQ-2026-89421",
    businessName = "Marbella Tiles & Sanitaryware",
    category = "Home Improvement",
    city = "Ranchi",
    state = "Jharkhand",
    status = "under_review",
    submittedAt,
    estimatedCompletion = "27 Oct 2026, 2:30 PM",
  } = application;

  const formatDate = (d) => {
    if (!d) return "Recently";
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  return (
    <Card className="border-brand-border bg-brand-bg rounded-2xl shadow-xs overflow-hidden text-left">
      <CardHeader className="pb-3 border-b border-brand-border flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#e85d04]" /> Application Status
            Card
          </CardTitle>
          <CardDescription className="text-xs text-brand-subtext mt-0.5 font-normal">
            Real-time verification status for your merchant profile
          </CardDescription>
        </div>
        <StatusBadge status={status} size="md" />
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Grid Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-brand-subtext block">
              Application ID
            </span>
            <span className="font-mono font-bold text-brand-navy text-sm">
              #{applicationId}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-brand-subtext block">
              Business Name
            </span>
            <span className="font-bold text-brand-text truncate block">
              {businessName}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-brand-subtext block">
              Submitted On
            </span>
            <span className="font-medium text-brand-text">
              {formatDate(submittedAt)}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-brand-subtext block">
              Est. Completion
            </span>
            <span className="font-bold text-emerald-600">
              {estimatedCompletion}
            </span>
          </div>
        </div>

        {/* Category + Location Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5 text-brand-blue" /> {category}
          </Badge>
          {city && (
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> {city}, {state}
            </Badge>
          )}
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-brand-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="text-xs font-bold rounded-xl cursor-pointer border-brand-border shadow-none"
          >
            View Submitted Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onContactSupport}
            className="text-xs font-bold text-brand-blue hover:text-blue-800 hover:bg-blue-50 rounded-xl cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" /> Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
