"use client";

import { ArrowRight, Loader2, RotateCcw, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RevivalPromo() {
  const [form, setForm] = useState({ code: "", brandName: "", email: "" });
  const [showAllFields, setShowAllFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, code: val });
    if (val.trim() !== "") {
      setShowAllFields(true);
    }
  };

  const handleInitialClick = () => {
    if (!showAllFields) {
      setShowAllFields(true);
    }
  };

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
        setShowAllFields(false);
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
    <section className="w-full bg-[#0A2E6E] dark:bg-zinc-950 py-16 px-4 md:px-8 border-t border-b border-[#0e3a8a] dark:border-zinc-900 select-none relative overflow-hidden">
      {/* Subtle visual radial highlight overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none z-0" />

      <div className="w-full px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Form & Callout (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Badge className="bg-blue-500/10 hover:bg-blue-500/15 text-[#38bdf8] border border-blue-500/20 rounded-full px-3.5 py-1 font-extrabold text-[10px] tracking-wider uppercase w-fit shadow-none flex items-center gap-1.5 font-sans">
              <Zap className="w-3.5 h-3.5 text-[#38bdf8] fill-current animate-pulse" />
              <span>Vouchiqo EXCLUSIVE</span>
            </Badge>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.2] font-sans">
                Got an <span className="text-[#38bdf8]">expired coupon</span>?{" "}
                <br />
                We&apos;ll bring it back to life.
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium max-w-xl font-sans">
                Submit any expired or unused promo code. Our partnerships team
                negotiates a fresh equivalent with the brand — often within 24
                hours. No other site does this.
              </p>
            </div>

            {/* Input Submission interface */}
            <div className="max-w-xl">
              {success ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 animate-fade-in-scale">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                  <div className="space-y-1 font-sans">
                    <h3 className="text-base font-extrabold text-white">
                      Request Registered!
                    </h3>
                    <p className="text-xs text-slate-300 max-w-[280px] mx-auto leading-relaxed font-medium">
                      We will contact the merchant to negotiate a revival.
                      We&apos;ll email you in 48 hours.
                    </p>
                  </div>
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="ghost"
                    className="text-xs font-extrabold text-[#38bdf8] hover:text-white hover:bg-white/5 rounded-xl mt-1 cursor-pointer font-sans"
                  >
                    Revive Another Coupon
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Paste an expired code..."
                        value={form.code}
                        onChange={handleCodeChange}
                        onFocus={handleInitialClick}
                        className="bg-white/5 border border-white/10 text-white placeholder-slate-400/70 text-xs h-11 focus-visible:ring-1 focus-visible:ring-[#38bdf8] rounded-full shadow-none w-full pr-4 pl-5 font-sans"
                      />
                    </div>
                    {!showAllFields && (
                      <Button
                        type="button"
                        onClick={handleInitialClick}
                        className="bg-[#2563eb] hover:bg-blue-500 text-white text-xs font-extrabold border-0 h-11 px-8 cursor-pointer shadow-md rounded-full transition-all duration-200 shrink-0 transform hover:-translate-y-0.5 font-sans"
                      >
                        Redeem
                      </Button>
                    )}
                  </div>

                  {/* Expandable fields (Brand Name and Email) */}
                  {showAllFields && (
                    <div className="space-y-3 pt-1 animate-fade-in-scale">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider pl-0.5 font-sans">
                            Brand Name
                          </label>
                          <Input
                            placeholder="e.g. Zomato"
                            value={form.brandName}
                            onChange={(e) =>
                              setForm({ ...form, brandName: e.target.value })
                            }
                            className="bg-white/5 border border-white/10 text-white placeholder-slate-400/70 text-xs h-10 focus-visible:ring-1 focus-visible:ring-[#38bdf8] rounded-full shadow-none pl-4 font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider pl-0.5 font-sans">
                            Your Email Address
                          </label>
                          <Input
                            type="email"
                            placeholder="e.g. shopper@email.com"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            className="bg-white/5 border border-white/10 text-white placeholder-slate-400/70 text-xs h-10 focus-visible:ring-1 focus-visible:ring-[#38bdf8] rounded-full shadow-none pl-4 font-sans"
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-red-400 font-bold text-left pl-0.5 font-sans">
                          {error}
                        </p>
                      )}

                      <div className="flex gap-2.5 pt-1.5">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-2.5 bg-[#2563eb] hover:bg-blue-500 text-white text-xs font-extrabold border-0 h-10 cursor-pointer shadow-md flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transform hover:-translate-y-0.5 font-sans"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Redeem</span>
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowAllFields(false);
                            setError("");
                          }}
                          className="text-xs font-extrabold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 rounded-full h-10 px-5 cursor-pointer font-sans"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            <div className="pt-2">
              <Link href="/expired-coupon-revival">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 font-extrabold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 font-sans">
                  <span>See How Coupon Revival Works</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Statistics Grid (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div className="grid grid-cols-2 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.07] hover:border-white/15">
                <span className="block text-3xl font-extrabold text-white tracking-tight font-sans">
                  94%
                </span>
                <span className="block text-[11px] text-blue-200/70 font-extrabold tracking-wide mt-1 uppercase font-sans">
                  Redeem success rate
                </span>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.07] hover:border-white/15">
                <span className="block text-3xl font-extrabold text-white tracking-tight font-sans">
                  &lt;24h
                </span>
                <span className="block text-[11px] text-blue-200/70 font-extrabold tracking-wide mt-1 uppercase font-sans">
                  Average turnaround
                </span>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.07] hover:border-white/15">
                <span className="block text-3xl font-extrabold text-white tracking-tight font-sans">
                  8,400
                </span>
                <span className="block text-[11px] text-blue-200/70 font-extrabold tracking-wide mt-1 uppercase font-sans">
                  Codes revived this week
                </span>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.07] hover:border-white/15">
                <span className="block text-3xl font-extrabold text-[#38bdf8] tracking-tight font-sans">
                  ₹17,500
                </span>
                <span className="block text-[11px] text-blue-200/70 font-extrabold tracking-wide mt-1 uppercase font-sans">
                  Avg. saved per user
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
