"use client";

import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignStepper({
  steps,
  currentStep,
  setCurrentStep,
  onCancel,
}) {
  return (
    <div className="w-full flex items-center gap-3 py-1 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs font-sans overflow-x-auto">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="p-1 h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-4">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = idx === steps.length - 1;
          return (
            <div
              key={step.number}
              className={`flex items-center gap-2 ${!isLast ? "flex-1" : ""}`}
            >
              <button
                type="button"
                onClick={() => {
                  if (step.number < currentStep) setCurrentStep(step.number);
                }}
                className={`flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "text-slate-900 font-extrabold"
                    : isCompleted
                      ? "text-emerald-600 font-bold"
                      : "text-slate-400 font-medium"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-2xs"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200/80 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-colors min-w-[12px] ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
