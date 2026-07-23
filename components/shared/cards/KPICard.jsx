import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * KPICard — Compact, high-contrast KPI analytics card built with Shadcn UI.
 *
 * @param {string} title - metric label (e.g. "TOTAL IMPRESSIONS")
 * @param {string|number} value - primary metric number (e.g. "3", "₹12,450", "0.0%")
 * @param {number} [change] - percentage change value
 * @param {boolean} [isPositive=true] - positive vs negative trend color
 * @param {React.ComponentType} [icon] - Lucide icon component
 * @param {string} [iconClassName] - custom background/text classes for icon container
 * @param {string} [subtitle] - helper description (e.g. "ticker views", "codes claimed")
 * @param {string} [timeFrame="vs last month"] - trend comparison label
 * @param {boolean} [loading=false] - loading skeleton state
 * @param {string} [href] - optional link wrapper
 * @param {string} [className] - custom container classes
 */
export default function KPICard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconClassName,
  subtitle,
  timeFrame = "vs last month",
  loading = false,
  href,
  className,
}) {
  const cardContent = (
    <Card
      className={cn(
        "bg-white border border-slate-200/90 rounded-xl p-0 shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden relative flex flex-col justify-between h-full group",
        className,
      )}
    >
      {/* Top Navy Accent Bar */}
      <div className="h-1 bg-[#08214d] w-full absolute top-0 left-0" />

      <CardContent className="p-3 sm:p-3.5 flex flex-col justify-between h-full pt-3.5">
        {loading ? (
          <div className="space-y-2 py-0.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-6.5 w-6.5 rounded-md" />
            </div>
            <Skeleton className="h-6 w-20 rounded-md my-1" />
            <Skeleton className="h-3 w-28 rounded-md" />
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            {/* Header: Title & Icon Badge */}
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span
                className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate max-w-[calc(100%-1.75rem)]"
                title={title}
              >
                {title}
              </span>
              {Icon && (
                <div
                  className={cn(
                    "w-6.5 h-6.5 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs group-hover:scale-105 transition-all",
                    iconClassName,
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Metric Value */}
            <div className="my-1">
              <span className="text-xl sm:text-2xl font-bold text-[#08214d] tracking-tight leading-tight block">
                {value}
              </span>
            </div>

            {/* Subtitle / Helper Label */}
            {subtitle && (
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 capitalize leading-tight">
                {subtitle}
              </p>
            )}

            {/* Trend Indicator & Timeframe */}
            <div className="flex items-center flex-wrap gap-1 pt-0.5 text-[10px] sm:text-[11px] font-medium">
              {change !== undefined && change !== null && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md border",
                    isPositive
                      ? "text-blue-600 bg-blue-50/90 border-blue-100"
                      : "text-rose-600 bg-rose-50/90 border-rose-100",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 shrink-0" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                </span>
              )}
              {timeFrame && (
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                  {timeFrame}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full cursor-pointer">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
