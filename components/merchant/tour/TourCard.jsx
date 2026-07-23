"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SIDEBAR_W = 240;
const CARD_GAP = 20;
const CARD_W = 340;

export default function TourCard({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onSkip,
}) {
  const [pos, setPos] = useState({ top: 240, left: SIDEBAR_W + CARD_GAP });
  const cardRef = useRef(null);

  useEffect(() => {
    if (!step?.anchor) return;

    const compute = () => {
      const el = document.querySelector(step.anchor);
      const card = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cardH = card ? card.offsetHeight : 220;

      if (step.mode === "content") {
        // Position the card near the page element (above / below)
        const placement = step.placement || "bottom";
        let top;
        let left = rect.left + rect.width / 2 - CARD_W / 2;

        if (placement === "bottom") {
          top = rect.bottom + 16;
        } else if (placement === "top") {
          top = rect.top - cardH - 16;
        } else if (placement === "right") {
          top = rect.top + rect.height / 2 - cardH / 2;
          left = rect.right + 16;
        } else {
          top = rect.bottom + 16;
        }

        // Clamp within viewport, keep right of sidebar
        top = Math.max(16, Math.min(window.innerHeight - cardH - 16, top));
        left = Math.max(
          SIDEBAR_W + 16,
          Math.min(window.innerWidth - CARD_W - 16, left),
        );

        setPos({ top, left });
      } else {
        // Sidebar mode: card sits to the RIGHT of the sidebar
        let top = rect.top + rect.height / 2 - cardH / 2;
        const left = SIDEBAR_W + CARD_GAP;

        top = Math.max(16, Math.min(window.innerHeight - cardH - 16, top));
        setPos({ top, left });
      }
    };

    compute();
    const t = setTimeout(compute, 120);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [step?.anchor, step?.mode, step?.placement]);

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div
      ref={cardRef}
      style={{
        position: "fixed",
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        zIndex: 70,
        width: `${CARD_W}px`,
      }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100/80 p-6 text-left animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Step label + close */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-bold text-[#e85d04] uppercase tracking-wide">
          STEP {currentStepIndex + 1} OF {totalSteps}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer -mt-0.5 -mr-1"
          aria-label="Close tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug font-heading tracking-tight mb-2">
        {step.title}
      </h3>

      {/* Body */}
      <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-5">
        {step.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Skip tour
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-[14px] px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-md shadow-orange-500/20"
        >
          {isLastStep ? "Got it" : "Next"}
        </button>
      </div>
    </div>
  );
}
