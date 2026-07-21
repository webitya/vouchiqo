"use client";

import {
  ArrowRight,
  Calendar,
  Clock,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const HowItWorks = React.memo(function HowItWorks() {
  const handleCopyCode = () => {
    navigator.clipboard.writeText("SAVE20");
    toast.success("Code copied to clipboard! ✂️");
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950/40 py-16 px-4 md:px-8 select-none border-t border-b border-slate-100 dark:border-zinc-900/60 transition-all">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Trust Messaging & Explanations (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2] font-sans">
                Deals you can trust. <br />
                <span className="text-blue-600">Savings you can verify.</span>
              </h2>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-xl font-sans">
              Every deal on Vouchiqo is backed by verification signals designed
              to help you avoid expired codes, misleading offers, and wasted
              checkout attempts.
            </p>

            {/* Connected Trust Signals List */}
            <div className="space-y-4 pt-5 border-t border-slate-150/60 dark:border-zinc-900">
              {/* Trust Signal 1 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-200 font-sans">
                    Merchant Verified
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                    Deals are checked against trusted merchant and partner
                    sources.
                  </p>
                </div>
              </div>

              {/* Trust Signal 2 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-200 font-sans">
                    Community Success
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                    See recent success signals from shoppers before trying a
                    deal.
                  </p>
                </div>
              </div>

              {/* Trust Signal 3 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-200 font-sans">
                    Expired Deal Revival
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                    Missed a deal? Request a revival and give popular offers
                    another chance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/expired-coupon-revival">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 font-sans">
                  <span>Learn how verification works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Verified Deal Preview & Trust Strip (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full">
            {/* Main Verified Deal Card Showcase */}
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-md relative overflow-hidden transition-all duration-200 hover:shadow-lg">
              {/* Verified Badge Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {/* Amazon placeholder or Logo */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400">
                    AMZN
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-none">
                      Amazon
                    </h4>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold leading-none font-sans">
                      Store Partner
                    </span>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 rounded-full px-2.5 py-0.5 font-bold text-[9px] tracking-wide flex items-center gap-1 shadow-none select-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  VERIFIED DEAL
                </Badge>
              </div>

              {/* Title */}
              <div className="text-left mb-5">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 font-sans">
                  Up to 20% Off Electronics
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed font-sans">
                  Save on laptops, smart home devices, and audio accessories.
                </p>
              </div>

              {/* Code Showcase with copy CTA */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-850 rounded-2xl p-4 mb-5 text-left relative">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">
                  Discount Code
                </span>
                <div className="flex items-center justify-between mt-1.5 font-sans">
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wide">
                    SAVE20
                  </span>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="h-8 text-xs font-extrabold px-4 bg-blue-50 hover:bg-blue-100 border-0 text-blue-600 rounded-lg shadow-none shrink-0 cursor-pointer transition-colors duration-150 font-sans"
                  >
                    Copy Code
                  </Button>
                </div>
              </div>

              {/* Verification Signals (Interactive Preview Stats) */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-left border-t border-slate-100 dark:border-zinc-850 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-none uppercase tracking-wide">
                      Last Checked
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      12 mins ago
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-none uppercase tracking-wide">
                      Success Rate
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      92%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#2563eb] dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-none uppercase tracking-wide">
                      Shoppers Used
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      1,248 today
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-none uppercase tracking-wide">
                      Validity
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Expires in 2 days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
