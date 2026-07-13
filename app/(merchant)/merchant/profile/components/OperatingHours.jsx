"use client";

import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OperatingHours({ formData, handleHoursChange }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm space-y-4 text-left">
      <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-blue" />
        <span>Weekly Operating Hours</span>
      </h3>

      <div className="space-y-3">
        {Object.keys(formData.operatingHours).map((day) => {
          const hr = formData.operatingHours[day];
          return (
            <div
              key={day}
              className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 py-2 border-b border-slate-100 last:border-0"
            >
              <span className="text-xs font-bold text-brand-navy">{day}</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hr.closed}
                  onChange={(e) =>
                    handleHoursChange(day, "closed", e.target.checked)
                  }
                  className="w-4 h-4 text-brand-blue cursor-pointer rounded"
                  id={`closed-${day}`}
                />
                <label
                  htmlFor={`closed-${day}`}
                  className="text-xs font-semibold text-brand-subtext cursor-pointer select-none"
                >
                  Closed All Day
                </label>
              </div>

              {!hr.closed ? (
                <>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-brand-subtext uppercase">
                      Open Time
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={hr.open || ""}
                      onChange={(e) =>
                        handleHoursChange(day, "open", e.target.value)
                      }
                      className="bg-brand-surface border border-brand-border rounded-lg text-xs h-8 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-brand-subtext uppercase">
                      Close Time
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. 09:00 PM"
                      value={hr.close || ""}
                      onChange={(e) =>
                        handleHoursChange(day, "close", e.target.value)
                      }
                      className="bg-brand-surface border border-brand-border rounded-lg text-xs h-8 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2 text-xs font-semibold text-slate-400">
                  Store closed on {day}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
