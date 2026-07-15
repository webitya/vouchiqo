import React from "react";

export function MonthlyGoals() {
  return (
    <div
      data-slot="card"
      className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-200"
    >
      <div
        data-slot="card-header"
        className="flex flex-col space-y-1.5 p-6 pb-2"
      >
        <div className="tracking-tight text-base font-semibold">
          Monthly Goals
        </div>
        <p className="text-xs text-muted-foreground">
          Track progress toward targets
        </p>
      </div>
      <div data-slot="card-content" className="p-6 pt-0 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Monthly Revenue
            </span>
            <span className="text-muted-foreground">88%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
              style={{ width: "88%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>$6,860</span>
            <span>Target: $8,000</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              New Customers
            </span>
            <span className="text-muted-foreground">85%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#2563eb]"
              style={{ width: "85%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>140</span>
            <span>Target: 165</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              System Uptime
            </span>
            <span className="text-muted-foreground">99.9%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#3e80dd]"
              style={{ width: "99.9%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>99.9%</span>
            <span>Target: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyGoals;
