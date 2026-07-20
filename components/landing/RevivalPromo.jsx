"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RevivalPromo() {
  const [form, setForm] = useState({ code: "", brandName: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.code || !form.brandName || !form.email) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/revivals/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ code: "", brandName: "", email: "" });
      } else {
        const data = await res.json();
        setError(data.message || "Failed to submit revival request.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-surface via-white to-brand-surface py-20 px-4 border-t border-b border-brand-border select-none">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-brand-success/5 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Full Information (Badge, Headline, Subtext, Stats, Learn More Link) */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in-up stagger-1">
            <Badge className="bg-blue-600/15 text-[#2563eb] hover:bg-blue-600/20 border border-[#2563eb]/20 rounded-full px-3.5 py-1 font-extrabold text-xs shadow-none gap-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <span>INDIA'S ONLY EXPIRED COUPON REVIVAL</span>
            </Badge>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-brand-text tracking-tight leading-tight">
                Your Expired Coupon Has Value.
                <br />
                <span className="text-brand-gradient">Claim It.</span>
              </h2>
              <p className="text-sm md:text-base text-brand-subtext max-w-xl leading-relaxed font-medium">
                Don&apos;t throw away your expired discount codes. Vouchiqo&apos;s
                Revival system reconnects you with the merchant and recovers your
                savings — 48 hours, zero cost to you.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 py-3 border-t border-b border-brand-border max-w-lg">
              <div>
                <span className="block text-lg md:text-xl font-black text-brand-text">
                  5,000+
                </span>
                <span className="text-[9px] md:text-xs text-brand-subtext font-bold uppercase tracking-wider font-sans">
                  Revivals Processed
                </span>
              </div>
              <div>
                <span className="block text-lg md:text-xl font-black text-[#2563eb]">
                  ₹25L+
                </span>
                <span className="text-[9px] md:text-xs text-brand-subtext font-bold uppercase tracking-wider font-sans">
                  Recovered Savings
                </span>
              </div>
              <div>
                <span className="block text-lg md:text-xl font-black text-brand-warning">
                  78%
                </span>
                <span className="text-[9px] md:text-xs text-brand-subtext font-bold uppercase tracking-wider font-sans">
                  Approval Rate
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/expired-coupon-revival"
                className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1 hover:underline"
              >
                <span>Learn how Vouchiqo Revival works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-5 animate-fade-in-scale stagger-2 w-full">
            <div className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl relative">
              {success ? (
                <div className="text-center py-6 space-y-4 animate-fade-in-scale">
                  <div className="w-12 h-12 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center mx-auto border border-brand-success/30">
                    <Sparkles className="w-6 h-6 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text">
                    Submission Successful!
                  </h3>
                  <p className="text-xs text-brand-subtext max-w-sm mx-auto leading-relaxed">
                    We have registered your request. Our system will contact the
                    merchant to negotiate a revival. We will reach out to you
                    within 48 hours.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="ghost"
                    className="text-xs font-bold text-brand-blue hover:text-brand-blue hover:bg-brand-surface mt-2 cursor-pointer"
                  >
                    Revive Another Coupon
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                        Expired Code
                      </label>
                      <Input
                        placeholder="e.g. ZOMATO50"
                        value={form.code}
                        onChange={(e) =>
                          setForm({ ...form, code: e.target.value })
                        }
                        className="bg-brand-bg border-brand-border text-brand-text placeholder-brand-subtext/60 text-xs h-10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                        Brand Name
                      </label>
                      <Input
                        placeholder="e.g. Zomato"
                        value={form.brandName}
                        onChange={(e) =>
                          setForm({ ...form, brandName: e.target.value })
                        }
                        className="bg-brand-bg border-brand-border text-brand-text placeholder-brand-subtext/60 text-xs h-10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                      Your Email
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. shopper@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="bg-brand-bg border-brand-border text-brand-text placeholder-brand-subtext/60 text-xs h-10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-none"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-brand-error font-semibold">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-2.5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revive My Coupon</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
