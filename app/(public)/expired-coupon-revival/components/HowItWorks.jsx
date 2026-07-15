import React from "react";

export function HowItWorks() {
  return (
    <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="font-heading text-xs font-black text-brand-navy uppercase tracking-wider border-b border-brand-border pb-2">
        How Revival Works
      </h3>

      <div className="space-y-3 text-[11px]">
        <div className="flex gap-2.5 items-start">
          <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-bold text-brand-navy">Submit Details</h4>
            <p className="text-brand-subtext leading-relaxed mt-0.5">
              Provide the expired coupon code or deal details. We cross-reference with our database.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 items-start">
          <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-bold text-brand-navy">Outreach Automation</h4>
            <p className="text-brand-subtext leading-relaxed mt-0.5">
              We aggregate demand and present recovery insights directly to the brand dashboard.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 items-start">
          <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
            3
          </div>
          <div>
            <h4 className="font-bold text-brand-navy">Enjoy Savings</h4>
            <p className="text-brand-subtext leading-relaxed mt-0.5">
              Once approved by the merchant, a renewed active offer code is dispatched to your email/WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
