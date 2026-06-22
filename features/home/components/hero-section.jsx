"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight, Play, Search, MapPin, Home, Compass, RotateCcw, User, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  // Typewriter effect
  const categories = ["Fashion", "Electronics", "Dining", "Travel & Stays", "SaaS Tools", "Home Improvement"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Stats from DB
  const [stats, setStats] = useState({ verifiedBrands: 16, activeDeals: 120, totalSavings: 4500000 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStats(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const activeWord = categories[currentWordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(activeWord.substring(0, typedText.length - 1));
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypedText(activeWord.substring(0, typedText.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && typedText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000); // Wait 2s at full word
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % categories.length);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentWordIndex]);

  return (
    <section className="bg-[#1A3C5E] text-white py-6 md:py-10 px-4 relative overflow-hidden select-none border-b border-white/5">
      {/* Background radial overlay and blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
        
        {/* Left Column: Copy & Actions */}
        <div className="space-y-4 text-left animate-fade-in-up stagger-1 lg:pt-[34px]">
          <Badge className="bg-white/10 text-brand-warning hover:bg-white/15 border border-white/10 rounded-full px-3 py-1 font-bold text-xs shadow-none gap-1.5 w-fit animate-float">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>India's 1st Expired Coupon Revival Platform</span>
          </Badge>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
              Save More on Everything You Love
              <br />
              <span className="inline-block min-h-[50px] md:min-h-[60px] text-brand-gradient">
                {typedText}
                <span className="animate-pulse ml-0.5 font-light">|</span>
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed font-medium">
              Vouchiqo eliminates expired offers through merchant-authorized verification. Search real active coupons, or request to revive expired ones you love.
            </p>
          </div>

          {/* Two CTAs */}
          <div className="flex flex-wrap gap-4 pt-0">
            <Button
              asChild
              className="btn-primary py-2.5 px-6 text-sm font-bold border-0 h-auto cursor-pointer flex items-center gap-1.5"
            >
              <Link href="/deals">
                <span>Explore Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="btn-tertiary border-white/20 text-white hover:bg-white/10 hover:text-white py-2.5 px-6 text-sm font-bold h-auto cursor-pointer flex items-center gap-2"
            >
              <Link href="#how-it-works">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>How It Works</span>
              </Link>
            </Button>
          </div>

          {/* Trust Row Stats */}
          <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-4 md:gap-8 max-w-lg">
            <div>
              <span className="block text-2xl md:text-3xl font-black text-white tracking-tight">
                {stats.verifiedBrands}+
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">
                Verified Brands
              </span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-black text-white tracking-tight">
                {stats.activeDeals}+
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">
                Active Deals
              </span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-black text-[#00B67A] tracking-tight">
                ₹{(stats.totalSavings / 100000).toFixed(1)}L+
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">
                Total Saved
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Phone Mockup (Desktop only) */}
        <div className="hidden lg:flex justify-center items-center relative select-none animate-fade-in-scale stagger-2">
          {/* Decorative glows behind phone */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#FF7A18] to-[#FF3D77] rounded-full opacity-20 blur-3xl z-0" />
          
          {/* Physical Buttons Wrapper */}
          <div className="relative p-4">
            {/* Volume Up Button */}
            <div className="absolute left-2.5 top-28 w-1 h-10 bg-slate-800 rounded-l-[2px]" />
            {/* Volume Down Button */}
            <div className="absolute left-2.5 top-42 w-1 h-10 bg-slate-800 rounded-l-[2px]" />
            {/* Power Button */}
            <div className="absolute right-2.5 top-34 w-1 h-14 bg-slate-800 rounded-r-[2px]" />

            {/* Outer phone frame */}
            <div className="w-[300px] h-[580px] border-[10px] border-slate-800 bg-slate-950 rounded-[44px] relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-[6px] flex flex-col z-10 ring-1 ring-white/20">
              
              {/* Screen Content Wrapper */}
              <div className="bg-[#070A13] flex-1 rounded-[34px] overflow-hidden flex flex-col p-4 relative pt-10 text-left space-y-3.5 border border-white/5">
                
                {/* Glossy diagonal highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-white/8 pointer-events-none z-30 rounded-[34px]" />

                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
                  {/* Camera lens reflection */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1A3C5E]" />
                  </div>
                  {/* Green active dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>

                {/* iOS Status Bar */}
                <div className="absolute top-0.5 left-0 right-0 px-6 flex items-center justify-between text-[10px] text-white font-semibold tracking-tight z-30 select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    {/* Signal bars */}
                    <div className="flex items-end gap-[1px] h-2">
                      <div className="w-[2px] h-[3px] bg-white rounded-[0.5px]" />
                      <div className="w-[2px] h-[5px] bg-white rounded-[0.5px]" />
                      <div className="w-[2px] h-[7px] bg-white rounded-[0.5px]" />
                      <div className="w-[2px] h-[9px] bg-white rounded-[0.5px]" />
                    </div>
                    {/* Wifi Icon */}
                    <Wifi className="w-2.5 h-2.5 text-white stroke-[3]" />
                    {/* Battery */}
                    <div className="w-5 h-2.5 border border-white/60 rounded-[3px] p-[1px] flex items-center">
                      <div className="w-full h-full bg-white rounded-[1.5px]" />
                      <div className="w-[1px] h-1 bg-white/60 rounded-r-[1px] -mr-[2px]" />
                    </div>
                  </div>
                </div>

                {/* App Header */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black tracking-tight bg-gradient-to-r from-[#FF7A18] to-[#FF3D77] bg-clip-text text-transparent">
                    Vouchiqo
                  </span>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-300">
                    <MapPin className="w-2.5 h-2.5 text-brand-warning fill-brand-warning/10" />
                    <span>Ranchi</span>
                  </div>
                </div>

                {/* Search box */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 text-slate-400">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-medium">Search 1,200+ coupons...</span>
                </div>

                {/* Categories strip */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none py-0.5">
                  <span className="bg-gradient-to-r from-[#FF7A18] to-[#FF3D77] text-white text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    🍔 Food
                  </span>
                  <span className="bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    🛍️ Style
                  </span>
                  <span className="bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    ✈️ Travel
                  </span>
                </div>

                {/* Demo Voucher 1 (Starbucks) */}
                <div className="bg-[#0E1524] border border-white/5 text-white rounded-2xl p-3.5 shadow-xl space-y-2.5 relative overflow-hidden animate-float">
                  {/* Left & Right Ticket Notch Cutouts */}
                  <div className="absolute w-3 h-5 rounded-full bg-[#070A13] -left-1.5 top-1/2 -translate-y-1/2 border-r border-white/5" />
                  <div className="absolute w-3 h-5 rounded-full bg-[#070A13] -right-1.5 top-1/2 -translate-y-1/2 border-l border-white/5" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#006241] flex items-center justify-center text-[9px] font-black text-white">★</div>
                      <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-wide">Starbucks</span>
                    </div>
                    <span className="text-[8px] bg-[#00B67A]/10 text-[#00B67A] border border-[#00B67A]/20 font-black px-1.5 py-0.5 rounded-full">
                      99% Success
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-white">Buy 1 Get 1 Free</h3>
                    <p className="text-[8.5px] text-slate-400 leading-tight mt-0.5">Verified BOGO coffee voucher. Worked 4m ago.</p>
                  </div>
                  <div className="border-t border-dashed border-white/10 pt-2.5 flex items-center justify-between">
                    <span className="font-mono text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#FF7A18] font-bold">
                      SBXCOFFEE
                    </span>
                    <span className="text-[8px] text-[#00B67A] font-black tracking-wider flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#00B67A] animate-ping" />
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Demo Voucher 2 (Marbella Ranchi) */}
                <div className="bg-[#0E1524] border border-white/5 text-white rounded-2xl p-3.5 shadow-xl space-y-2.5 relative overflow-hidden animate-float" style={{ animationDelay: "1.5s" }}>
                  {/* Left & Right Ticket Notch Cutouts */}
                  <div className="absolute w-3 h-5 rounded-full bg-[#070A13] -left-1.5 top-1/2 -translate-y-1/2 border-r border-white/5" />
                  <div className="absolute w-3 h-5 rounded-full bg-[#070A13] -right-1.5 top-1/2 -translate-y-1/2 border-l border-white/5" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF7A18] to-[#FF3D77] flex items-center justify-center text-[9px] font-black text-white">M</div>
                      <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-wide">Marbella</span>
                    </div>
                    <span className="text-[8px] bg-brand-warning/10 text-brand-warning border border-brand-warning/20 font-black px-1.5 py-0.5 rounded-full">
                      🔴 Local Deal
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-white">Flat ₹5,000 Off</h3>
                    <p className="text-[8.5px] text-slate-400 leading-tight mt-0.5">Premium Tiles, Sanitary & Flooring in Ranchi.</p>
                  </div>
                  <div className="border-t border-dashed border-white/10 pt-2.5 flex items-center justify-between">
                    <span className="font-mono text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#FF7A18] font-bold">
                      MARBELLA5K
                    </span>
                    
                    {/* Barcode representation */}
                    <div className="flex gap-[1.5px] items-center h-3 opacity-30">
                      <div className="w-[1px] h-full bg-white" />
                      <div className="w-[2px] h-full bg-white" />
                      <div className="w-[1px] h-full bg-white" />
                      <div className="w-[3px] h-full bg-white" />
                      <div className="w-[1px] h-full bg-white" />
                      <div className="w-[2px] h-full bg-white" />
                      <div className="w-[1px] h-full bg-white" />
                      <div className="w-[3px] h-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#0A0E1A]/90 backdrop-blur-md border-t border-white/5 px-6 py-2.5 flex justify-between items-center text-slate-400 z-30">
                  <Home className="w-4 h-4 text-brand-blue stroke-[2.5]" />
                  <Compass className="w-4 h-4 hover:text-white transition-colors" />
                  <RotateCcw className="w-4 h-4 hover:text-white transition-colors" />
                  <User className="w-4 h-4 hover:text-white transition-colors" />
                </div>

                {/* Screen Footer Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-40" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

