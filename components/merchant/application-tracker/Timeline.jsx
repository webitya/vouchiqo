"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  Info,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Timeline — Fully responsive chronological activity timeline with full-width titles
 * and date/time sub-rows built using Shadcn UI primitives.
 *
 * @param {object} props
 * @param {Array} props.events - List of timeline activity events
 * @param {number} [props.progressPercentage] - Overall verification percentage (0-100)
 */
export default function Timeline({ events = [], progressPercentage = 66 }) {
  if (!events || events.length === 0) return null;

  // Calculate completion stats
  const completedEvents = events.filter(
    (e) => e.type === "success" || e.completed === true,
  ).length;
  const completionRatio = Math.round((completedEvents / events.length) * 100);
  const activeProgress = progressPercentage || completionRatio || 66;

  const getEventBadge = (type) => {
    switch (type) {
      case "success":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 shadow-2xs">
            <Clock className="w-3 h-3 mr-1" /> In Audit
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 shadow-2xs">
            <AlertCircle className="w-3 h-3 mr-1" /> Action Needed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 shadow-2xs">
            <Info className="w-3 h-3 mr-1" /> Notice Log
          </Badge>
        );
    }
  };

  const getEventIcon = (title = "", type = "") => {
    const t = title.toLowerCase();
    if (t.includes("submitted") || t.includes("application")) {
      return (
        <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[2.2]" />
      );
    }
    if (t.includes("email") || t.includes("confirmation")) {
      return (
        <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[2.2]" />
      );
    }
    if (t.includes("assigned") || t.includes("admin")) {
      return (
        <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[2.2]" />
      );
    }
    if (t.includes("tax") || t.includes("gst") || t.includes("verified")) {
      return (
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[2.2]" />
      );
    }
    if (t.includes("progress") || t.includes("review")) {
      return (
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 stroke-[2.2]" />
      );
    }

    if (type === "success")
      return (
        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[2.2]" />
      );
    if (type === "warning")
      return (
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 stroke-[2.2]" />
      );
    if (type === "error")
      return (
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 stroke-[2.2]" />
      );
    return (
      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[2.2]" />
    );
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(ts);
    }
  };

  return (
    <Card className="border-slate-200/90 bg-white rounded-2xl shadow-xs overflow-hidden text-left font-sans h-full">
      {/* Card Header */}
      <CardHeader className="p-4 sm:p-6 pb-4 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              Chronological Activity Timeline
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              Real-time audit log of your merchant verification milestones
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-mono font-bold px-2.5 py-1 w-fit"
          >
            <Sparkles className="w-3 h-3 text-amber-500 mr-1 inline" />
            {completedEvents} of {events.length} Completed
          </Badge>
        </div>

        {/* Shadcn UI Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-600" /> Audit Progress
            </span>
            <span className="text-blue-700 font-mono font-black">
              {activeProgress}%
            </span>
          </div>
          <Progress
            value={activeProgress}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-[#e85d04]"
          />
        </div>
      </CardHeader>

      {/* Card Content Timeline Items */}
      <CardContent className="p-4 sm:p-6 pt-5">
        <div className="relative border-l-2 border-slate-200 ml-2.5 sm:ml-4 pl-4 sm:pl-7 space-y-5">
          {events.map((evt, idx) => {
            const isSuccess = evt.type === "success";
            const isWarning = evt.type === "warning";
            const isError = evt.type === "error";

            return (
              <div key={idx} className="relative group">
                {/* Timeline node icon bubble */}
                <div
                  className={cn(
                    "absolute -left-[27px] sm:-left-[37px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110 shrink-0",
                    isSuccess
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100"
                      : isWarning
                        ? "bg-amber-50 border-amber-300 ring-2 ring-amber-100"
                        : isError
                          ? "bg-rose-50 border-rose-300 ring-2 ring-rose-100"
                          : "bg-blue-50 border-blue-300 ring-2 ring-blue-100",
                  )}
                >
                  {getEventIcon(evt.title, evt.type)}
                </div>

                {/* Timeline content box */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all space-y-2 shadow-2xs overflow-hidden">
                  {/* Full-width Title Heading */}
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug w-full tracking-tight">
                    {evt.title}
                  </h4>

                  {/* Sub-row: Status Badge + Date & Time Timestamp below Title */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/50 pt-2">
                    <div>{getEventBadge(evt.type)}</div>

                    <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{formatTime(evt.timestamp)}</span>
                    </span>
                  </div>

                  {/* Details paragraph */}
                  {evt.detail && (
                    <p className="text-xs text-slate-600 leading-relaxed font-medium break-words pt-0.5">
                      {evt.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
