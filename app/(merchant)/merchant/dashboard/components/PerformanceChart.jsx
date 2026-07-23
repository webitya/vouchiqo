"use client";

import { MousePointerClick, TicketCheck } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TIME_RANGES = ["7 Days", "30 Days", "90 Days"];

// Demo performance data with fluctuating up-down values in multiples of 5
const DEMO_PERFORMANCE = {
  "7 Days": [
    { label: "Mon", clicks: 20, redemptions: 5 },
    { label: "Tue", clicks: 10, redemptions: 2 },
    { label: "Wed", clicks: 35, redemptions: 12 },
    { label: "Thu", clicks: 15, redemptions: 5 },
    { label: "Fri", clicks: 40, redemptions: 18 },
    { label: "Sat", clicks: 25, redemptions: 8 },
    { label: "Sun", clicks: 30, redemptions: 10 },
  ],
  "30 Days": [
    { label: "Aug", clicks: 20, redemptions: 5 },
    { label: "Sep", clicks: 10, redemptions: 2 },
    { label: "Oct", clicks: 25, redemptions: 8 },
    { label: "Nov", clicks: 12, redemptions: 3 },
    { label: "Dec", clicks: 35, redemptions: 15 },
    { label: "Jan", clicks: 18, redemptions: 6 },
    { label: "Feb", clicks: 30, redemptions: 10 },
    { label: "Mar", clicks: 15, redemptions: 4 },
    { label: "Apr", clicks: 40, redemptions: 18 },
    { label: "May", clicks: 22, redemptions: 7 },
    { label: "Jun", clicks: 32, redemptions: 12 },
    { label: "Jul", clicks: 15, redemptions: 5 },
  ],
  "90 Days": [
    { label: "May", clicks: 25, redemptions: 8 },
    { label: "Jun", clicks: 15, redemptions: 4 },
    { label: "Jul", clicks: 40, redemptions: 16 },
  ],
};

export default function PerformanceChart({
  trendData,
  activeRange = "30 Days",
  setActiveRange,
}) {
  const selectedDemo =
    DEMO_PERFORMANCE[activeRange] || DEMO_PERFORMANCE["30 Days"];

  // Build enriched chart data with fluctuating up-down values
  const chartData =
    trendData &&
    trendData.length > 0 &&
    trendData.some((t) => (t.orders || 0) > 0)
      ? trendData.map((t) => ({
          label: t.label,
          clicks: (t.orders || 0) * 4 + 10,
          redemptions: t.orders || 0,
        }))
      : selectedDemo;

  const totalClicksInView = chartData.reduce((s, c) => s + (c.clicks || 0), 0);

  return (
    <Card className="col-span-full xl:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full hover:shadow-xs transition-all duration-200 p-0 gap-0">
      <CardHeader className="px-4 py-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 min-h-[56px]">
        <div>
          <CardTitle className="font-heading text-xs sm:text-[13px] font-bold text-[#08214d] tracking-wider uppercase m-0 leading-none">
            Clicks vs Redemptions
          </CardTitle>
          <CardDescription className="text-[11px] font-semibold text-slate-500 mt-1 leading-none font-sans normal-case tracking-normal">
            Performance trend — last {activeRange ?? "30 Days"}
          </CardDescription>
        </div>
        <div className="flex items-center border border-slate-200/80 rounded-lg p-0.5 bg-slate-100/90 shrink-0 select-none">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setActiveRange(range)}
              className={`text-[11px] font-bold px-3 py-1 rounded-md transition-all uppercase cursor-pointer border-0 ${
                (activeRange ?? "30 Days") === range
                  ? "bg-white text-[#08214d] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-4 flex-1 flex flex-col justify-between">
        {/* Chart legend & summary */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <MousePointerClick className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-800">Clicks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#e85d04] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <TicketCheck className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                Redemptions
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Period Clicks:{" "}
            <strong className="text-slate-900">
              {totalClicksInView.toLocaleString()}
            </strong>
          </span>
        </div>

        {/* Full-Height Dynamic Chart Container */}
        <div className="h-80 sm:h-96 w-full flex-1 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 40]}
                ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
                labelStyle={{ fontSize: "10px", color: "#94a3b8" }}
                itemStyle={{ fontSize: "12px", color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#2563eb" }}
                activeDot={{ r: 5 }}
                name="Clicks"
              />
              <Line
                type="monotone"
                dataKey="redemptions"
                stroke="#e85d04"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#e85d04" }}
                activeDot={{ r: 5 }}
                name="Redemptions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
