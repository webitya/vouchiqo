"use client";

import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DealDetailsClient({ coupon, relatedCoupons = [] }) {
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Voting state
  const [votes, setVotes] = useState({ up: 12, down: 2, userVote: null });

  // Comments state
  const [comments, setComments] = useState([
    {
      author: "Arpit Kumar",
      date: "Today",
      text: "Successfully saved ₹450 on my order! Highly verified.",
    },
    {
      author: "Sneha Sinha",
      date: "Yesterday",
      text: "Code worked instantly on checkout. Thanks Vouchiqo!",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const discountFormatted =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedCode(true);
    setShowCopyModal(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleVote = (type) => {
    if (votes.userVote === type) {
      setVotes({
        ...votes,
        userVote: null,
        [type]: votes[type] - 1,
      });
    } else {
      const updates = {
        userVote: type,
        [type]: votes[type] + 1,
      };
      if (votes.userVote) {
        updates[votes.userVote] = votes[votes.userVote] - 1;
      }
      setVotes({ ...votes, ...updates });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      { author: "You", date: "Just Now", text: newComment.trim() },
      ...comments,
    ]);
    setNewComment("");
  };

  const merchantName = coupon.merchantId?.businessName || "Verified Brand";
  const logoUrl = coupon.merchantId?.logo || "/placeholder-brand.png";

  const formattedExpiry = (() => {
    if (!coupon.expiresAt) return "30 Nov 2026";
    const d = new Date(coupon.expiresAt);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="text-xs font-semibold text-brand-subtext flex items-center gap-2">
          <Link href="/" className="hover:text-brand-navy transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/deals?category=${coupon.category}`}
            className="hover:text-brand-navy transition-colors capitalize"
          >
            {coupon.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-navy font-bold">{coupon.title}</span>
        </div>

        {/* Left/Right Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60% / 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header section with brand info */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF7A18] to-[#FF3D77]"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6">
                <div className="flex items-center gap-4">
                  {/* Brand Logo */}
                  <div className="w-16 h-16 rounded-xl border border-brand-border overflow-hidden bg-brand-surface flex-shrink-0 flex items-center justify-center shadow-sm">
                    <img
                      src={logoUrl}
                      alt={merchantName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%230a2e6e' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='9' y1='21' x2='9' y2='9'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-brand-navy tracking-tight">
                      {discountFormatted}
                    </h1>
                    <p className="text-sm font-bold text-slate-800 leading-snug mt-0.5">
                      {coupon.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 select-none">
                      <Badge className="bg-brand-success/10 text-brand-success hover:bg-brand-success/15 border-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-none">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Vouchiqo Verified</span>
                      </Badge>
                      <Badge className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/15 border-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-none capitalize">
                        {coupon.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Expiry / Success Rates Progress Bar / Pulse Dot */}
                <div className="text-left sm:text-right space-y-1.5 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-4 sm:pt-0 border-brand-border">
                  <div className="flex items-center gap-1.5 text-xs text-brand-success font-bold select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
                    </span>
                    <span>Verified Active Today</span>
                  </div>

                  <div className="text-xs text-brand-subtext font-semibold flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span>Expires {formattedExpiry}</span>
                  </div>

                  <div className="hidden sm:block space-y-1 pt-1 text-right">
                    <div className="flex items-center gap-1 justify-end text-[10px] font-bold text-brand-navy">
                      <TrendingUp className="w-3 h-3 text-brand-success" />
                      <span>Success rate:</span>
                      <span className="text-brand-success font-black">
                        {coupon.successRate || 99}%
                      </span>
                    </div>
                    <div className="w-24 bg-brand-surface h-1.5 rounded-full overflow-hidden border border-brand-border">
                      <div
                        className="bg-brand-success h-full rounded-full"
                        style={{ width: `${coupon.successRate || 99}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery/Banner */}
            <div className="rounded-xl overflow-hidden shadow-sm relative h-64 md:h-80 w-full group border border-brand-border animate-fade-in-scale">
              <div
                className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: coupon.image
                    ? `url(${coupon.image})`
                    : `linear-gradient(135deg, #0a2e6e 0%, #1e4faf 100%)`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <span className="bg-brand-warning text-brand-navy text-xs font-black px-3.5 py-2 rounded-lg shadow-md uppercase tracking-wider">
                  {discountFormatted}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className="bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/40 transition-colors shadow-sm cursor-pointer border-0"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-brand-warning fill-brand-warning/10" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Description & Details */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">
                  Deal Description
                </h2>
                <p className="text-xs md:text-sm text-brand-subtext leading-relaxed">
                  {coupon.description ||
                    "Grab this verified discount from our partner brand. Use the coupon code at checkout to claim your savings. Terms and conditions apply."}
                </p>
              </div>

              <div className="pt-6 border-t border-brand-border">
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-4">
                  How to Use This Deal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-2.5 relative flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand-navy text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <Copy className="w-4 h-4 text-brand-subtext" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        Copy the Code
                      </h4>
                      <p className="text-brand-subtext text-[10px] leading-relaxed mt-1">
                        Click the dashed code box on the right sidebar to copy
                        it instantly.
                      </p>
                    </div>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-2.5 relative flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand-navy text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <ExternalLink className="w-4 h-4 text-brand-subtext" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        Shop on Brand Store
                      </h4>
                      <p className="text-brand-subtext text-[10px] leading-relaxed mt-1">
                        Visit the brand's official store and add eligible items
                        to your cart.
                      </p>
                    </div>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-2.5 relative flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand-navy text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-brand-subtext" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        Apply at Checkout
                      </h4>
                      <p className="text-brand-subtext text-[10px] leading-relaxed mt-1">
                        Paste the copied code in the coupon field to apply your
                        discount.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms expandable */}
            <details className="group border border-brand-border rounded-lg p-4 bg-brand-bg shadow-sm">
              <summary className="text-xs font-bold text-brand-navy cursor-pointer flex justify-between items-center select-none uppercase tracking-wider">
                <span>Terms & Conditions</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </summary>
              <ul className="text-xs text-brand-subtext space-y-1.5 list-disc pl-5 mt-3 leading-relaxed">
                <li>Coupon must be pasted exactly as shown.</li>
                <li>
                  Applicable on active categories and selected items only.
                </li>
                <li>
                  Cannot be combined with any other running promotions or
                  vouchers.
                </li>
                <li>
                  Vouchiqo guarantees code verification status at checkout.
                </li>
              </ul>
            </details>

            {/* Voting */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm flex items-center justify-between">
              <span className="text-xs text-brand-subtext font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-blue" />
                Did this coupon work for you?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVote("up")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    votes.userVote === "up"
                      ? "bg-brand-success/10 border-brand-success text-brand-success"
                      : "border-brand-border hover:bg-brand-surface text-brand-subtext"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes ({votes.up})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("down")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    votes.userVote === "down"
                      ? "bg-brand-error/10 border-brand-error text-brand-error"
                      : "border-brand-border hover:bg-brand-surface text-brand-subtext"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No ({votes.down})</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-base font-black text-brand-navy uppercase tracking-wider pb-3 border-b border-brand-border">
                Community Feedback
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  placeholder="Share your experience with this code..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-brand-surface text-xs focus:ring-brand-blue flex-grow"
                />
                <Button
                  type="submit"
                  className="btn-primary py-2 px-5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none"
                >
                  Submit
                </Button>
              </form>

              <div className="space-y-4">
                {comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="space-y-1.5 text-xs border-b border-brand-border/40 pb-3 last:border-b-0"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-brand-navy flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{comment.author}</span>
                      </span>
                      <span className="text-brand-subtext">{comment.date}</span>
                    </div>
                    <p className="text-brand-subtext leading-relaxed bg-brand-surface p-3 rounded-lg border border-brand-border/40">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Code box & Action CTAs (40% / 4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* Sticky Action Card */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-lg space-y-6 text-center relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-warning/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <p className="text-xs text-brand-subtext font-bold uppercase tracking-wider">
                Exclusive Promo Code
              </p>

              {/* The Code Box */}
              <div className="relative select-all">
                {/* Left Ticket Cutout */}
                <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-bg border-r border-brand-border z-10"></div>
                {/* Right Ticket Cutout */}
                <div className="absolute right-[-11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-bg border-l border-brand-border z-10"></div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`w-full border-2 border-dashed rounded-xl p-4 relative group cursor-pointer transition-all duration-300 ${
                    copiedCode
                      ? "border-brand-success bg-brand-success/5"
                      : "border-brand-navy/30 bg-brand-surface/50 hover:bg-brand-surface"
                  }`}
                  id="codeBox"
                >
                  <span className="font-mono text-xl font-black tracking-[0.2em] text-brand-navy uppercase pl-2">
                    {coupon.code}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/95 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-bold flex items-center gap-1.5 text-xs">
                      <Copy className="w-4 h-4 text-brand-warning" />
                      {copiedCode ? "Copied!" : "Click to Copy Code"}
                    </span>
                  </div>
                </button>
              </div>

              <Button
                onClick={handleCopyCode}
                className="w-full bg-gradient-to-r from-[#FF7A18] to-[#FF3D77] text-white font-bold text-xs py-3 rounded-full hover:shadow-lg transition-shadow duration-300 font-bold"
              >
                COPY CODE &amp; SHOP NOW
              </Button>

              <div className="pt-1">
                <a
                  href={coupon.merchantId?.website || "https://google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-navy hover:underline transition-colors cursor-pointer select-none"
                >
                  <span>Go to official brand site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-brand-subtext border-t border-brand-border pt-4 mt-2">
                <span className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  Expires: {formattedExpiry}
                </span>
                <span className="flex items-center gap-1 text-brand-warning font-bold">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  {coupon.totalClaims || 124} uses today
                </span>
              </div>
            </div>

            {/* Similar Deals Sidebar (Mockup inspired) */}
            {relatedCoupons.length > 0 && (
              <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-4 border-b border-brand-border pb-2">
                  Similar Deals
                </h3>
                <div className="space-y-4">
                  {relatedCoupons.map((c) => {
                    const cDiscount =
                      c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue} OFF`;
                    const cBrand =
                      c.merchantId?.businessName || "Verified Partner";
                    return (
                      <Link
                        key={c._id}
                        href={`/deals/${c._id}`}
                        className="flex gap-3 group hover:bg-brand-surface p-2 rounded-lg transition-colors -mx-2"
                      >
                        <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-brand-surface border border-brand-border flex items-center justify-center p-1.5">
                          <img
                            src={c.merchantId?.logo || "/placeholder-brand.png"}
                            alt={cBrand}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%230a2e6e' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-slate-800 text-[11px] line-clamp-2 group-hover:text-brand-blue transition-colors leading-tight">
                            {c.title}
                          </h4>
                          <p className="text-[9px] text-brand-subtext mt-0.5">
                            {cBrand}
                          </p>
                          <span className="inline-block mt-1.5 text-[8.5px] font-bold text-brand-warning bg-brand-warning/10 border border-brand-warning/20 px-2 py-0.5 rounded">
                            {cDiscount}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Merchant info card */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4 text-left">
              <h4 className="text-xs text-brand-subtext font-bold uppercase tracking-wider">
                About Brand
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-navy text-white font-bold flex items-center justify-center text-sm">
                  {merchantName[0]}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-brand-navy leading-none">
                    {merchantName}
                  </h5>
                  <span className="text-[10px] text-brand-subtext font-medium mt-1 block">
                    Verified Partner Store
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-brand-subtext leading-relaxed">
                {coupon.merchantId?.description ||
                  "A trusted merchant partner on Vouchiqo, offering verified discounts and savings to members."}
              </p>
              <Button
                asChild
                variant="outline"
                className="btn-tertiary w-full py-2 text-xs font-bold justify-center border-brand-navy text-brand-navy hover:bg-brand-navy/5 shadow-none h-auto cursor-pointer text-center"
              >
                <Link
                  href={
                    coupon.merchantId?.slug
                      ? `/brand/${coupon.merchantId.slug}`
                      : "/deals"
                  }
                >
                  Browse Brand Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Copy Code Popup Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 z-[250] flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white border border-brand-border rounded-2xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center mx-auto border border-brand-success/30">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-brand-navy">
                Code Copied!
              </h3>
              <p className="text-xs text-brand-subtext">
                The discount code has been copied to your clipboard.
              </p>
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-xl p-3 font-mono font-black text-base text-brand-navy tracking-wider">
              {coupon.code}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowCopyModal(false)}
                variant="outline"
                className="btn-tertiary flex-1 py-2 text-xs font-bold border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
              >
                Close
              </Button>
              <Button
                asChild
                className="btn-primary flex-1 py-2 text-xs font-bold border-0 h-auto cursor-pointer shadow-none flex items-center justify-center gap-1.5"
              >
                <a
                  href={coupon.merchantId?.website || "https://google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
