import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function KPICard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  timeFrame = "vs last month",
}) {
  return (
    <Card className="bg-brand-bg border border-brand-border rounded-xl py-0 shadow-sm overflow-hidden relative flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Top Navy Highlight Accent */}
      <div className="h-1 bg-brand-navy w-full absolute top-0 left-0"></div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="p-1.5 rounded bg-brand-surface border border-brand-border text-brand-navy">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-xl font-bold font-sans text-brand-text tracking-tight">
            {value}
          </span>
        </div>

        {/* Trend */}
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          {change !== undefined && (
            <span
              className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded ${
                isPositive
                  ? "bg-brand-success/10 text-brand-success"
                  : "bg-brand-error/10 text-brand-error"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change}%
              </span>
            </span>
          )}
          <span className="text-brand-subtext">{timeFrame}</span>
        </div>
      </CardContent>
    </Card>
  );
}
