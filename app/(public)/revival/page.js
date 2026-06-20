"use client";

import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Send,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CouponRevival() {
  const [formData, setFormData] = useState({
    brandName: "",
    couponTitle: "",
    approxExpiry: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.brandName || !formData.couponTitle) {
      setError("Please fill out both the Brand Name and Coupon Title fields.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API submit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (_err) {
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeRevivals = [
    {
      brand: "Shopify Storefront",
      title: "Save 20% on Monthly Business Plan",
      votes: 489,
      pct: 90,
    },
    {
      brand: "Uber Airport",
      title: "$15 Flat discount on rides",
      votes: 312,
      pct: 75,
    },
    {
      brand: "Notion Workspace",
      title: "$100 enterprise credits",
      votes: 219,
      pct: 60,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface">
      <Navbar />

      {/* Header banner */}
      <section className="bg-brand-navy text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Badge className="bg-white/10 text-brand-warning border border-white/10 hover:bg-white/15 px-3 py-1 rounded-full text-xs font-bold shadow-none gap-1.5 w-fit">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Community Driven Reactivations</span>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight">
            Expired Coupon Revival Center
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Missed an amazing offer? Help us bring it back. If enough users
            request a revival, Vouchiqo coordinates with the brand to reactivate
            the promotion.
          </p>
        </div>
      </section>

      {/* Grid splits */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Revival Request Form (Left Side - 7 cols) */}
        <section className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm">
          {submitted
            ? <div className="text-center py-8 space-y-5">
                <div className="mx-auto w-12 h-12 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center border border-brand-success/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-brand-text">
                    Revival Request Submitted!
                  </h3>
                  <p className="text-xs text-brand-subtext max-w-xs mx-auto leading-relaxed">
                    Thank you for your request. We have added this deal to our
                    moderation list. You will receive an email notice when
                    checkout voting begins.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      brandName: "",
                      couponTitle: "",
                      approxExpiry: "",
                      reason: "",
                    });
                  }}
                  variant="outline"
                  className="btn-tertiary text-xs py-2 px-6 border-brand-navy text-brand-navy hover:bg-brand-navy/5 shadow-none h-auto cursor-pointer"
                >
                  Submit Another Request
                </Button>
              </div>
            : <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
                  Revival Form
                </h2>

                {error && (
                  <div className="flex gap-2.5 p-3 rounded-lg bg-brand-error/5 border border-brand-error/15 text-brand-error text-xs items-center">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Brand Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text uppercase">
                    Brand Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Zomato, Starbucks, Shopify"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    className="bg-brand-surface border border-brand-border rounded-lg p-2.5 text-xs w-full focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue text-brand-text"
                    required
                  />
                </div>

                {/* Coupon Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text uppercase">
                    What was the offer?
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 50% off billing / Free shipping"
                    value={formData.couponTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, couponTitle: e.target.value })
                    }
                    className="bg-brand-surface border border-brand-border rounded-lg p-2.5 text-xs w-full focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue text-brand-text"
                    required
                  />
                </div>

                {/* Approximate Expiry */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text uppercase">
                    Approximate Expiry Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={formData.approxExpiry}
                    onChange={(e) =>
                      setFormData({ ...formData, approxExpiry: e.target.value })
                    }
                    className="bg-brand-surface border border-brand-border rounded-lg p-2.5 text-xs w-full focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue text-brand-text"
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text uppercase">
                    Why should we bring this back?
                  </label>
                  <Textarea
                    placeholder="Tell us how much you saved, or why you need this code again..."
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    rows={3}
                    className="bg-brand-surface border border-brand-border rounded-lg p-2.5 text-xs w-full focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue text-brand-text min-h-20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-0 h-auto cursor-pointer shadow-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {loading ? "Submitting..." : "Submit Revival Query"}
                  </span>
                </Button>
              </form>}
        </section>

        {/* Process Guide & Popular Requests (Right Side - 5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          {/* How It Works */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              How Revival Works
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-brand-subtext leading-relaxed">
                  <strong className="text-brand-text">Submit Request:</strong>{" "}
                  Fill out the brand and details. We will map it to their
                  corporate profile.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-brand-subtext leading-relaxed">
                  <strong className="text-brand-text">Community Vote:</strong>{" "}
                  Other users vote on requests. Popular deals move up the queue.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-brand-subtext leading-relaxed">
                  <strong className="text-brand-text">Reactivation:</strong>{" "}
                  Once reached, Vouchiqo automatically sends performance
                  analytics to the brand, inviting them to reactivate.
                </p>
              </div>
            </div>
          </div>

          {/* Active Revivals List */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Pending Revivals
            </h3>
            <div className="space-y-4">
              {activeRevivals.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-bold text-brand-text block">
                        {item.brand}
                      </span>
                      <span className="text-brand-subtext text-[10px]">
                        {item.title}
                      </span>
                    </div>
                    <Badge className="bg-brand-success/5 text-brand-success hover:bg-brand-success/10 border-0 shadow-none px-1.5 py-0.5 text-[10px] whitespace-nowrap flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.votes} votes</span>
                    </Badge>
                  </div>
                  <div className="w-full bg-brand-surface h-1.5 rounded-full overflow-hidden border border-brand-border">
                    <div
                      className="bg-brand-gradient h-full rounded-full"
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
