"use client";

import { useState } from "react";
import { 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink,
  Copy,
  Check,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CouponCard from "@/components/CouponCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DealDetailsClient({ coupon, relatedCoupons = [] }) {
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Voting state
  const [votes, setVotes] = useState({ up: 12, down: 2, userVote: null });

  // Comments state
  const [comments, setComments] = useState([
    { author: "Arpit Kumar", date: "Today", text: "Successfully saved ₹450 on my order! Highly verified." },
    { author: "Sneha Sinha", date: "Yesterday", text: "Code worked instantly on checkout. Thanks Vouchiqo!" }
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
        [type]: votes[type] - 1
      });
    } else {
      const updates = {
        userVote: type,
        [type]: votes[type] + 1
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
      ...comments
    ]);
    setNewComment("");
  };

  const merchantName = coupon.merchantId?.businessName || "Verified Brand";
  const logoUrl = coupon.merchantId?.logo || "/placeholder-brand.png";

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs font-semibold text-brand-subtext flex items-center gap-2">
          <Link href="/" className="hover:text-brand-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/deals" className="hover:text-brand-navy transition-colors">Deals</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-navy font-bold">{merchantName}</span>
        </div>

        {/* Left/Right Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (60% / 7 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header section with brand info */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-brand-border">
                <div className="flex items-center gap-4">
                  {/* Brand Logo */}
                  <div className="w-16 h-16 rounded-xl border border-brand-border overflow-hidden bg-brand-surface flex-shrink-0 flex items-center justify-center shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt={merchantName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%230a2e6e' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='9' y1='21' x2='9' y2='9'/%3E%3C/svg%3E";
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
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className="bg-brand-success/10 text-brand-success border-0 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 fill-brand-success/10" />
                        <span>Vouchiqo Verified</span>
                      </Badge>
                      <Badge className="bg-brand-blue/10 text-brand-blue border-0 px-2 py-0.5 text-[10px] font-bold">
                        {coupon.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Expiry / Success Rates */}
                <div className="text-left sm:text-right space-y-1.5 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-4 sm:pt-0 border-brand-border">
                  <div className="flex items-center gap-1.5 text-xs text-brand-success font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>{coupon.successRate || 99}% Success Rate</span>
                  </div>
                  <div className="text-xs text-brand-subtext font-semibold flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span>Expires {(() => {
                      const d = new Date(coupon.expiresAt);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider">Offer Description</h3>
                <p className="text-xs md:text-sm text-brand-subtext leading-relaxed">
                  {coupon.description || "Grab this verified discount from our partner brand. Use the coupon code at checkout to claim your savings. Terms and conditions apply."}
                </p>
              </div>

              {/* How to use */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wider">How to Redeem</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-brand-surface p-3 rounded-lg border border-brand-border/40 text-left">
                    <span className="text-xs font-black text-brand-blue block mb-1">Step 1</span>
                    <p className="text-[11px] text-brand-subtext leading-snug">Copy the code from the right panel.</p>
                  </div>
                  <div className="bg-brand-surface p-3 rounded-lg border border-brand-border/40 text-left">
                    <span className="text-xs font-black text-brand-blue block mb-1">Step 2</span>
                    <p className="text-[11px] text-brand-subtext leading-snug">Click &apos;Visit Website&apos; to browse products.</p>
                  </div>
                  <div className="bg-brand-surface p-3 rounded-lg border border-brand-border/40 text-left">
                    <span className="text-xs font-black text-brand-blue block mb-1">Step 3</span>
                    <p className="text-[11px] text-brand-subtext leading-snug">Paste code at checkout to apply discount.</p>
                  </div>
                </div>
              </div>

              {/* Terms expandable */}
              <details className="group border border-brand-border rounded-lg p-3 bg-brand-surface/40">
                <summary className="text-xs font-bold text-brand-navy cursor-pointer flex justify-between items-center select-none uppercase tracking-wider">
                  <span>Terms & Conditions</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <ul className="text-xs text-brand-subtext space-y-1.5 list-disc pl-5 mt-3 leading-relaxed">
                  <li>Coupon must be pasted exactly as shown.</li>
                  <li>Applicable on active categories and selected items only.</li>
                  <li>Cannot be combined with any other running promotions or vouchers.</li>
                  <li>Vouchiqo guarantees code verification status at checkout.</li>
                </ul>
              </details>

              {/* Voting */}
              <div className="border-t border-brand-border pt-4 flex items-center justify-between">
                <span className="text-xs text-brand-subtext font-semibold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-blue" />
                  Did this coupon work for you?
                </span>
                <div className="flex gap-2">
                  <button
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
                <Button type="submit" className="btn-primary py-2 px-5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none">
                  Submit
                </Button>
              </form>

              <div className="space-y-4">
                {comments.map((comment, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs border-b border-brand-border/40 pb-3 last:border-b-0">
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
            <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-lg space-y-6 text-center">
              
              <div className="space-y-2">
                <span className="text-xs text-brand-subtext font-bold uppercase tracking-wider">Checkout Discount Code</span>
                {/* Massive Code Box */}
                <div 
                  onClick={handleCopyCode}
                  className="border-2 border-dashed border-orange-300 bg-orange-50/40 rounded-xl p-4 cursor-pointer relative group transition-all duration-200 flex justify-between items-center"
                >
                  <span className="font-mono text-xl font-bold tracking-[0.15em] text-slate-800 uppercase pl-2">
                    {coupon.code}
                  </span>
                  <Button
                    className={`text-xs font-semibold py-2 px-4 rounded-lg border-0 h-auto cursor-pointer transition-all duration-200 ${
                      copiedCode
                        ? "bg-[#00B67A] text-white"
                        : "btn-primary shadow-sm"
                    }`}
                  >
                    {copiedCode ? "✅ Copied!" : "Copy Code"}
                  </Button>
                </div>
                <p className="text-[10px] text-brand-subtext font-medium">Click on the dashed box to copy code instantly.</p>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleCopyCode}
                  className="btn-primary w-full py-3 text-sm font-bold border-0 h-auto cursor-pointer shadow-md flex justify-center items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Code &amp; Reveal</span>
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSaved(!isSaved)}
                    variant="outline"
                    className="btn-tertiary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-brand-success fill-brand-success/10" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span>Save Deal</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="btn-tertiary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 border-brand-border text-brand-text hover:bg-brand-surface shadow-none h-auto cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? "Link Copied" : "Share Deal"}</span>
                  </Button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="border-t border-brand-border pt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500">
                <ShieldCheck className="w-4 h-4 text-brand-success" />
                <span>Vouchiqo Security Guaranteed</span>
              </div>

            </div>

            {/* Merchant info card */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4 text-left">
              <h4 className="text-xs text-brand-subtext font-bold uppercase tracking-wider">About Brand</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-navy text-white font-bold flex items-center justify-center text-sm">
                  {merchantName[0]}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-brand-navy leading-none">{merchantName}</h5>
                  <span className="text-[10px] text-brand-subtext font-medium mt-1 block">Verified Partner Store</span>
                </div>
              </div>
              <p className="text-[11px] text-brand-subtext leading-relaxed">
                {coupon.merchantId?.description || "A trusted merchant partner on Vouchiqo, offering verified discounts and savings to members."}
              </p>
              <Button
                asChild
                variant="outline"
                className="btn-tertiary w-full py-2 text-xs font-bold justify-center border-brand-navy text-brand-navy hover:bg-brand-navy/5 shadow-none h-auto cursor-pointer text-center"
              >
                <Link href={coupon.merchantId?.slug ? `/brand/${coupon.merchantId.slug}` : "/deals"}>
                  Browse Brand Profile
                </Link>
              </Button>
            </div>

          </div>

        </div>

        {/* Similar Coupons Section */}
        {relatedCoupons.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-brand-border">
            <h3 className="font-heading text-lg md:text-xl font-black text-brand-navy tracking-tight">
              Similar {coupon.category} Offers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCoupons.map((c) => (
                <CouponCard
                  key={c._id}
                  coupon={c}
                  onRedeem={(x) => setSelectedCoupon(x)}
                />
              ))}
            </div>
          </section>
        )}

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
              <h3 className="text-lg font-black text-brand-navy">Code Copied!</h3>
              <p className="text-xs text-brand-subtext">The discount code has been copied to your clipboard.</p>
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
