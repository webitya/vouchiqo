"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  Sparkles,
  Home,
  Wrench,
  Shirt,
  Utensils,
  Laptop,
  Plane,
  GraduationCap,
  Baby,
  Gem,
  Car,
  Gamepad2,
  ShoppingCart,
  Briefcase,
  Check,
  CheckCircle2,
  Users
} from "lucide-react";

// The 15 categories from Merchant Categories_Phase 1.txt mapped to their standard database keys
const CATEGORIES = [
  { key: "fashion", label: "Fashion & Clothing", icon: Shirt },
  { key: "food", label: "Food & Dining", icon: Utensils },
  { key: "electronics", label: "Electronics & Gadgets", icon: Laptop },
  { key: "beauty", label: "Beauty & Wellness", icon: Sparkles },
  { key: "travel", label: "Travel & Hospitality", icon: Plane },
  { key: "home", label: "Home & Living", icon: Home },
  { key: "home-improvement", label: "Home Improvement", icon: Wrench },
  { key: "fitness", label: "Fitness & Healthcare", icon: Heart },
  { key: "education", label: "Education & Courses", icon: GraduationCap },
  { key: "kids-baby", label: "Kids & Baby Products", icon: Baby },
  { key: "jewellery", label: "Jewellery & Accessories", icon: Gem },
  { key: "automotive", label: "Automobile & Auto Services", icon: Car },
  { key: "entertainment", label: "Gaming & Entertainment", icon: Gamepad2 },
  { key: "grocery", label: "Grocery & Essentials", icon: ShoppingCart },
  { key: "finance", label: "Finance & Insurance", icon: Briefcase },
];

export function OnboardingModal({ isOpen, onClose, onSaveComplete }) {
  const [gender, setGender] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (key) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!gender) {
      return toast.error("Please select a gender preference to continue.");
    }
    if (selectedInterests.length === 0) {
      return toast.error("Please select at least one interest category.");
    }

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
      if (!res.ok) {
        throw new Error(payload.message || "Failed to save onboarding settings");
      }

      toast.success("Preferences saved successfully! 🎉");
      if (onSaveComplete) {
        onSaveComplete(selectedInterests);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-2 text-center pb-4 border-b border-slate-100 dark:border-zinc-900">
          <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
            Welcome to Vouchiqo! 🎉
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Tell us about your preferences to personalize your experience and show the most relevant deals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Section 1: Gender Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-350">
              <Users className="w-4 h-4 text-brand-blue" />
              Who are you shopping for? (Select Gender)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "men", label: "Men" },
                { value: "women", label: "Women" },
                { value: "not_preferred", label: "Rather not say" },
              ].map((item) => {
                const isSelected = gender === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGender(item.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 cursor-pointer text-sm font-semibold h-24 ${
                      isSelected
                        ? "bg-brand-blue/10 border-brand-blue text-brand-blue shadow-sm"
                        : "bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-slate-400 hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <User className={`w-6 h-6 mb-2 ${isSelected ? "text-brand-blue" : "text-slate-400"}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interest Categories */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-350">
              <Heart className="w-4 h-4 text-brand-blue" />
              What are your interests? (Select Categories)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedInterests.includes(cat.key);
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => toggleInterest(cat.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer text-xs font-semibold ${
                      isSelected
                        ? "bg-brand-blue/10 border-brand-blue text-brand-blue shadow-sm"
                        : "bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-slate-400 hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-brand-blue text-white"
                          : "bg-slate-200/60 dark:bg-zinc-800 text-slate-500"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="flex-1 truncate">{cat.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-blue shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-8 bg-brand-blue hover:bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 border-0 cursor-pointer shadow-md shadow-brand-blue/20"
          >
            {isSaving ? "Saving..." : "Start Exploring"}
            {!isSaving && <CheckCircle2 className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
