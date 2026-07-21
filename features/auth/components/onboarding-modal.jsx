"use client";

import {
  Baby,
  Car,
  Check,
  ChevronRight,
  CreditCard,
  Dumbbell,
  Flower2,
  Gamepad2,
  Gem,
  GraduationCap,
  Hammer,
  Heart,
  Home,
  Loader2,
  Plane,
  Shirt,
  ShoppingCart,
  Smartphone,
  Tag,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

/* ── Gender options (blue theme) ──────────────────────────────────── */
const GENDER_OPTIONS = [
  {
    value: "men",
    label: "Men",
    icon: User,
    accent: "text-blue-600",
    bg: "bg-blue-50",
    ring: "border-blue-500 ring-blue-200 bg-blue-50/50",
  },
  {
    value: "women",
    label: "Women",
    icon: User,
    accent: "text-pink-500",
    bg: "bg-pink-50",
    ring: "border-blue-500 ring-blue-200 bg-blue-50/50",
  },
  {
    value: "not_preferred",
    label: "Everyone",
    icon: Users,
    accent: "text-violet-600",
    bg: "bg-violet-50",
    ring: "border-blue-500 ring-blue-200 bg-blue-50/50",
  },
];

/* ── 15 categories – identical icons + gradients to the brands page ─ */
const CATEGORIES = [
  {
    key: "fashion",
    label: "Fashion & Clothing",
    icon: Shirt,
    gradient: "from-pink-50 to-rose-100",
  },
  {
    key: "food",
    label: "Food & Dining",
    icon: Utensils,
    gradient: "from-amber-50 to-orange-100",
  },
  {
    key: "electronics",
    label: "Electronics & Tech",
    icon: Smartphone,
    gradient: "from-blue-50 to-cyan-100",
  },
  {
    key: "beauty",
    label: "Beauty & Wellness",
    icon: Flower2,
    gradient: "from-purple-50 to-pink-100",
  },
  {
    key: "travel",
    label: "Travel & Hotels",
    icon: Plane,
    gradient: "from-sky-50 to-teal-100",
  },
  {
    key: "home",
    label: "Home & Living",
    icon: Home,
    gradient: "from-stone-50 to-amber-100",
  },
  {
    key: "home-improvement",
    label: "Home Improvement",
    icon: Hammer,
    gradient: "from-slate-50 to-zinc-200",
  },
  {
    key: "fitness",
    label: "Fitness & Healthcare",
    icon: Dumbbell,
    gradient: "from-emerald-50 to-teal-100",
  },
  {
    key: "education",
    label: "Education & Courses",
    icon: GraduationCap,
    gradient: "from-indigo-50 to-purple-100",
  },
  {
    key: "kids-baby",
    label: "Kids & Baby",
    icon: Baby,
    gradient: "from-sky-50 to-yellow-100",
  },
  {
    key: "jewellery",
    label: "Jewellery & Gems",
    icon: Gem,
    gradient: "from-amber-50 to-yellow-200",
  },
  {
    key: "automotive",
    label: "Automobile & Services",
    icon: Car,
    gradient: "from-slate-100 to-slate-200",
  },
  {
    key: "entertainment",
    label: "Gaming & Fun",
    icon: Gamepad2,
    gradient: "from-fuchsia-50 to-indigo-100",
  },
  {
    key: "grocery",
    label: "Grocery & Essentials",
    icon: ShoppingCart,
    gradient: "from-green-50 to-emerald-100",
  },
  {
    key: "finance",
    label: "Finance & Insurance",
    icon: CreditCard,
    gradient: "from-teal-50 to-green-100",
  },
];

export function OnboardingModal({ isOpen, onClose, onSaveComplete }) {
  const [gender, setGender] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (key) =>
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key],
    );

  const handleSave = async () => {
    if (!gender) return toast.error("Please select a shopping preference.");
    if (selectedInterests.length < 2)
      return toast.error("Please pick at least 2 categories to continue.");

    setIsSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          interests: selectedInterests,
          isOnboarded: true,
        }),
      });
      const payload = await res.json();
      if (!res.ok)
        throw new Error(payload.message || "Failed to save preferences");
      toast.success("Preferences saved! Your feed is ready.");
      onSaveComplete?.(selectedInterests);
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = gender && selectedInterests.length >= 2;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1rem)] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[820px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[92vh] overflow-y-auto outline-none font-sans text-left z-[350]"
      >
        {/* ── Header ── */}
        <DialogHeader className="text-center pb-3 border-b border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              Personalize Your Deals Feed
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            Select your preferences to unlock customized coupons, verified deals
            &amp; regional offers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* ── Section 1: Gender ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-widest">
                <User className="w-3 h-3 text-blue-600" />
                1. Who are you shopping for?
                <span className="text-blue-600 ml-0.5">*</span>
              </Label>
              {gender && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <Check className="w-3 h-3 stroke-[3]" /> Done
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = gender === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGender(item.value)}
                    className={`flex items-center justify-center gap-2 h-10 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                      isSelected
                        ? `${item.ring} ring-1 text-blue-700 border-blue-500`
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-lg ${item.bg}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.accent}`} />
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 2: Categories ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  <Heart className="w-3 h-3 text-blue-600" />
                  2. Favorite Categories
                  <span className="text-blue-600 ml-0.5">*</span>
                </Label>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Pick at least 2 &nbsp;&middot;&nbsp;{" "}
                  <span
                    className={
                      selectedInterests.length >= 2
                        ? "text-emerald-600 font-bold"
                        : "text-slate-400"
                    }
                  >
                    {selectedInterests.length} selected
                  </span>
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                Min 2
              </span>
            </div>

            {/* 2 cols mobile · 3 cols sm · 4 cols lg */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedInterests.includes(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => toggleInterest(cat.key)}
                    className={`relative flex items-center gap-2 p-2 rounded-xl border overflow-hidden text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.97] ${
                      isSelected
                        ? "border-blue-500 ring-1 ring-blue-200 text-slate-900"
                        : "border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {/* Category gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} ${isSelected ? "opacity-60" : "opacity-40"} transition-opacity`}
                    />
                    {/* Dot pattern overlay – identical to brand page */}
                    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

                    {/* White icon box – identical to brand page */}
                    <div className="w-7 h-7 rounded-lg bg-white/90 shadow-sm flex items-center justify-center flex-shrink-0 border border-white/60 relative z-10 backdrop-blur-xs">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-bold leading-tight flex-1 relative z-10">
                      {cat.label}
                    </span>

                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 relative z-10">
                        <Check className="w-2 h-2 stroke-[3] text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="pt-3 mt-2 border-t border-slate-100">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canContinue || isSaving}
            className={`w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-0 transition-all ${
              canContinue
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer active:scale-[0.99]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving preferences...
              </>
            ) : (
              <>
                Continue to Customized Feed
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
