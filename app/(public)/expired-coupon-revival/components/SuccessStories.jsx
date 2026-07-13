import React from "react";
import { Badge } from "@/components/ui/badge";

export function SuccessStories({ successStories }) {
  return (
    <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="font-heading text-xs font-black text-brand-navy uppercase tracking-wider border-b border-brand-border pb-2">
        Recent Successes
      </h3>

      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
        {successStories.map((story, idx) => (
          <div
            key={idx}
            className="bg-brand-surface border border-brand-border/40 rounded-lg p-3 space-y-2 text-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-black text-brand-navy block">
                  {story.brand}
                </span>
                <span className="text-[10px] text-brand-success font-bold">
                  {story.offer}
                </span>
              </div>
              <Badge className="bg-brand-success/10 text-brand-success border-0 px-2 py-0.5 text-[8px] font-bold">
                {story.date}
              </Badge>
            </div>
            <p className="text-brand-subtext leading-relaxed italic bg-white p-2.5 rounded border border-brand-border/30">
              &ldquo;{story.text}&rdquo;
            </p>
            <span className="text-[10px] font-bold text-slate-500 block text-right">
              — {story.user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuccessStories;
