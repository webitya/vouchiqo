"use client";

import {
  Award,
  Building,
  Check,
  Clock,
  FileCheck,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Store,
  Tag,
  Upload,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { signUp } from "@/lib/auth-client";
import {
  INDIAN_CITIES,
  lookupByPincode,
  lookupStateByCity,
} from "@/utils/indianGeoLookup";

const CATEGORIES = [
  { id: "fashion", label: "Fashion & Clothing" },
  { id: "food", label: "Food & Dining" },
  { id: "electronics", label: "Electronics & Gadgets" },
  { id: "beauty", label: "Beauty & Wellness" },
  { id: "travel", label: "Travel & Hospitality" },
  { id: "home", label: "Home & Living" },
  { id: "home-improvement", label: "Home Improvement" },
  { id: "fitness", label: "Fitness & Healthcare" },
  { id: "education", label: "Education & Courses" },
  { id: "kids-baby", label: "Kids & Baby Products" },
  { id: "jewellery", label: "Jewellery & Accessories" },
  { id: "automotive", label: "Automobile & Auto Services" },
  { id: "entertainment", label: "Gaming & Entertainment" },
  { id: "grocery", label: "Grocery & Essentials" },
  { id: "finance", label: "Finance & Insurance" },
];

const BUSINESS_TYPES = [
  "Physical Store / Retail Shop",
  "Restaurant / Café / Food Service",
  "Service Provider (salon, gym, clinic)",
  "Online-Only Business",
  "Online + Physical Store (both)",
  "Service + Product (mixed)",
  "Professional Services (education, finance)",
];

const COMMISSION_TABLE = [
  {
    category: "Fashion & Clothing",
    model: "CPA",
    rate: "5%",
    example: "₹1,000 sale → ₹50 commission",
  },
  {
    category: "Food & Dining",
    model: "CPA",
    rate: "3% dine-in / 2% delivery",
    example: "₹800 bill → ₹24 commission",
  },
  {
    category: "Electronics & Gadgets",
    model: "CPA",
    rate: "2.5% blended",
    example: "₹10,000 purchase → ₹250 commission",
  },
  {
    category: "Beauty & Wellness",
    model: "CPA",
    rate: "6% services / 4% retail",
    example: "₹1,500 service → ₹90 commission",
  },
  {
    category: "Travel & Hospitality",
    model: "CPA",
    rate: "5% hotels / 4% packages",
    example: "₹3,000 booking → ₹150 commission",
  },
  {
    category: "Home & Living / Improvement",
    model: "CPA",
    rate: "2% – 5%",
    example: "₹4,000 item → ₹200 commission",
  },
  {
    category: "Education & Courses",
    model: "CPL",
    rate: "₹300 / qualified lead",
    example: "10 enquiries → ₹3,000 CPL",
  },
  {
    category: "Finance & Insurance",
    model: "CPL",
    rate: "₹150 – ₹350 / lead",
    example: "Per verified lead",
  },
];

export function MerchantOnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Section A: Business Identity
    registeredName: "",
    tradingName: "",
    category: "fashion",
    businessType: "Physical Store / Retail Shop",
    address: "",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "834001",
    additionalLocation: "",

    // Section B: Contact Details & Account Setup
    contactName: "",
    designation: "Owner",
    mobile: "",
    whatsapp: "",
    email: "",
    password: "",
    websiteUrl: "",
    instagramHandle: "",
    facebookUrl: "",
    googleUrl: "",

    // Section C: Verification Documents
    docType: "GST Registration Certificate",
    docFileUrl: "",
    shopPhotoUrl: "",
    logoUrl: "",

    // Section D: Choose Your Plan
    selectedPlan: "starter",
    referralCode: "",

    // Section E: Commission, Operating Hours & First Offer Intent
    expectedOfferType: "Percentage discount (% off) with a code",
    avgBillValue: "₹500 – ₹1,500",
    commissionAgreed: false,
    operatingDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    openingTime: "10:00 AM",
    closingTime: "08:00 PM",

    // Section F: Declarations & Submission
    commit1: false,
    commit2: false,
    commit3: false,
    commit4: false,
    commit5: false,
    commit6: false,
    commit7: false,
    applyFounding: "yes",
    policy1: false,
    policy2: false,
    policy3: false,
    policy4: false,
    policy5: false,
    signatoryName: "",
    submissionDate: new Date().toISOString().split("T")[0],
    digitalInitials: "",
  });

  const STEPS = [
    { num: 1, label: "Identity", icon: Building },
    { num: 2, label: "Contact", icon: Phone },
    { num: 3, label: "Documents", icon: Upload },
    { num: 4, label: "Plan", icon: Award },
    { num: 5, label: "Hours & Intent", icon: Clock },
    { num: 6, label: "Declaration", icon: ShieldCheck },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.registeredName.trim())
        return toast.error("Please enter your Registered Business Name");
      if (!formData.address.trim())
        return toast.error("Please enter your Business Address");
    } else if (currentStep === 2) {
      if (!formData.contactName.trim())
        return toast.error("Please enter Contact Person Name");
      if (!formData.mobile.trim() || formData.mobile.length < 10)
        return toast.error("Please enter a valid 10-digit Mobile Number");
      if (!formData.email.trim() || !formData.email.includes("@"))
        return toast.error("Please enter a valid Business Email");
      if (!formData.password || formData.password.length < 6)
        return toast.error("Password must be at least 6 characters");
    } else if (currentStep === 3) {
      // Documents optional preview for onboarding
    } else if (currentStep === 4) {
      if (!formData.selectedPlan) return toast.error("Please select a Plan");
    } else if (currentStep === 5) {
      if (!formData.commissionAgreed)
        return toast.error(
          "Please confirm acceptance of category commission structure",
        );
    }
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.commit1 ||
      !formData.commit2 ||
      !formData.commit3 ||
      !formData.commit4 ||
      !formData.commit5 ||
      !formData.commit6 ||
      !formData.commit7
    ) {
      toast.error("Please accept all 7 Merchant Commitments before submitting");
      return;
    }
    if (
      !formData.policy1 ||
      !formData.policy2 ||
      !formData.policy3 ||
      !formData.policy4 ||
      !formData.policy5
    ) {
      toast.error("Please accept all Policy Agreements");
      return;
    }
    if (!formData.signatoryName.trim() || !formData.digitalInitials.trim()) {
      toast.error("Please enter your Signatory Name and Digital Initials");
      return;
    }

    setIsSubmitting(true);
    try {
      // ── Step 1: Create the user account via Better Auth ──────────────────
      const { error: signUpError } = await signUp.email({
        name: formData.tradingName.trim() || formData.registeredName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        data: {
          role: "merchant",
          phoneNumber: formData.mobile,
        },
      });

      if (signUpError) {
        throw new Error(
          signUpError.message || "Account creation failed. Please try again.",
        );
      }

      // ── Step 2: Create merchant profile (session now active) ─────────────
      // Auto-generate a URL-safe slug from the business name
      const rawSlug = (formData.tradingName || formData.registeredName)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 45);
      // Append short random suffix to avoid collisions
      const slug = `${rawSlug}-${Math.random().toString(36).substring(2, 6)}`;

      // Map human-readable businessType → schema enum (online | physical | both)
      const btMap = {
        "Online-Only Business": "online",
        "Online + Physical Store (both)": "both",
        "Service + Product (mixed)": "both",
      };
      const businessType = btMap[formData.businessType] ?? "physical";

      const merchantRes = await fetch("/api/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          businessName: formData.registeredName,
          slug,
          category: formData.category,
          contactEmail: formData.email.trim().toLowerCase(),
          contactPhone: formData.mobile,
          whatsappNumber: formData.whatsapp,
          businessType,
          location: {
            address: formData.address,
            pincode: formData.pincode,
            city: formData.city,
            state: formData.state,
          },
        }),
      });

      if (!merchantRes.ok) {
        const json = await merchantRes.json().catch(() => ({}));
        throw new Error(
          json.message ||
            json.error ||
            "Merchant profile creation failed. Please contact support.",
        );
      }

      toast.success(
        "Merchant onboarding application submitted! Verification in 24–48 hrs.",
      );
      router.push("/merchant/dashboard");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-zinc-950/40 text-slate-800 dark:text-zinc-100 font-sans antialiased select-none text-left">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col justify-start items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-3">
          {/* Header Title */}
          <div className="text-center space-y-0.5 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Vouchiqo Merchant Onboarding
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
              ⏱ 5 minutes to complete &nbsp;•&nbsp; 24–48 hrs approval
              &nbsp;•&nbsp; ₹0 to start
            </p>
          </div>

          {/* Stepper Navigation */}
          <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-2.5">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = currentStep === s.num;
                const isDone = currentStep > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num < currentStep) setCurrentStep(s.num);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : isDone
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-zinc-800/40 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                      <span>Step {s.num}</span>
                    </div>
                    <span className="text-[10px] font-semibold truncate mt-0.5">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* SECTION 1: BUSINESS IDENTITY */}
          {currentStep === 1 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-4 space-y-3">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" /> Section A:
                  Business Identity
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                  Who you are and what business you operate
                </p>
              </div>

              <div className="space-y-3 mt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Building className="w-3.5 h-3.5 text-blue-600" />{" "}
                      Registered Business Name *
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. Marbella Tiles & Sanitary Pvt Ltd"
                      value={formData.registeredName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registeredName: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Store className="w-3.5 h-3.5 text-blue-500" /> Trading /
                      Brand Name (Recommended)
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. Marbella"
                      value={formData.tradingName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tradingName: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> Primary
                      Business Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-850 dark:text-zinc-300 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none">
                        <SelectValue placeholder="Select primary category" />
                      </SelectTrigger>
                      <SelectContent className="z-[300]">
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Store className="w-3.5 h-3.5 text-blue-500" /> Business
                      Type *
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(val) =>
                        setFormData({ ...formData, businessType: val })
                      }
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-850 dark:text-zinc-300 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent className="z-[300]">
                        {BUSINESS_TYPES.map((bt) => (
                          <SelectItem key={bt} value={bt}>
                            {bt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> Full
                    Operating Business Address *
                  </Label>
                  <Textarea
                    rows={2}
                    placeholder="Shop No. 14, Lalpur Chowk, Main Road, Ranchi, Jharkhand – 834001"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="font-bold text-xs text-slate-800 dark:text-zinc-250">
                      PIN Code *
                    </Label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 802301 or 834001"
                      value={formData.pincode}
                      onChange={async (e) => {
                        const pin = e.target.value;
                        setFormData((prev) => ({ ...prev, pincode: pin }));
                        if (pin.length === 6) {
                          const geo = await lookupByPincode(pin);
                          if (geo) {
                            setFormData((prev) => ({
                              ...prev,
                              city: geo.city || prev.city,
                              state: geo.state || prev.state,
                            }));
                          }
                        }
                      }}
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-mono font-bold focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <Label className="font-bold text-xs text-slate-800 dark:text-zinc-250">
                      City / District *
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(val) => {
                        const geo = lookupStateByCity(val);
                        setFormData((prev) => ({
                          ...prev,
                          city: val,
                          state: geo ? geo.state : prev.state,
                          pincode:
                            geo && !prev.pincode ? geo.pincode : prev.pincode,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl text-xs h-10 px-3 font-bold text-slate-855 dark:text-zinc-300 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent className="z-[300]">
                        {INDIAN_CITIES.map((c) => (
                          <SelectItem
                            key={`${c.city}-${c.state}`}
                            value={c.city}
                          >
                            {c.city} ({c.state})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold text-xs text-slate-800 dark:text-zinc-250">
                      State (Auto-detected) *
                    </Label>
                    <Input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Next &gt;
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 2: CONTACT DETAILS & ACCOUNT SETUP */}
          {currentStep === 2 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" /> Section B: Contact
                  Details &amp; Account Setup
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                  Verification contact and dashboard login credentials
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <User className="w-3.5 h-3.5 text-blue-500" /> Contact
                      Person Name *
                    </Label>
                    <Input
                      type="text"
                      placeholder="Rajan Kumar Singh"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Tag className="w-3.5 h-3.5 text-slate-500" /> Designation
                      / Role
                    </Label>
                    <Input
                      type="text"
                      placeholder="Owner / Director"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Phone className="w-3.5 h-3.5 text-blue-500" /> Primary
                      Mobile Number *
                    </Label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />{" "}
                      WhatsApp Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Mail className="w-3.5 h-3.5 text-blue-500" /> Business
                      Email (Login ID) *
                    </Label>
                    <Input
                      type="email"
                      placeholder="info@marbella.in"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                      <Lock className="w-3.5 h-3.5 text-slate-500" /> Create
                      Password *
                    </Label>
                    <Input
                      type="password"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-700 dark:text-slate-300 border-slate-350 dark:border-zinc-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  &lt; Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Next &gt;
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 3: BUSINESS VERIFICATION DOCUMENTS */}
          {currentStep === 3 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" /> Section C:
                  Verification Documents
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                  Document proof for Verified Merchant Badge
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                    <FileCheck className="w-3.5 h-3.5 text-blue-500" /> Primary
                    Identity Document Type *
                  </Label>
                  <Select
                    value={formData.docType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, docType: val })
                    }
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-850 dark:text-zinc-300 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[300]">
                      <SelectItem value="GST Registration Certificate">
                        GST Registration Certificate (Preferred)
                      </SelectItem>
                      <SelectItem value="Udyam / MSME Certificate">
                        Udyam / MSME Registration Certificate
                      </SelectItem>
                      <SelectItem value="Trade Licence">
                        Trade Licence (Municipal Corporation)
                      </SelectItem>
                      <SelectItem value="Shop & Establishment Act">
                        Shop &amp; Establishment Act Certificate
                      </SelectItem>
                      <SelectItem value="Owner PAN Card">
                        Owner PAN Card
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-zinc-250">
                    <Upload className="w-3.5 h-3.5 text-blue-500" /> Document
                    File URL / Image Link
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://drive.google.com/... or file link"
                    value={formData.docFileUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, docFileUrl: e.target.value })
                    }
                    className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="text-slate-700 dark:text-slate-300 border-slate-350 dark:border-zinc-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  &lt; Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Next &gt;
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 4: PLAN SELECTION */}
          {currentStep === 4 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" /> Section D: Choose
                  Your Plan
                </h3>
                <p className="text-xs text-slate-555 dark:text-slate-400 font-medium">
                  Select a subscription plan matching your scale
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "starter",
                    name: "STARTER FREE",
                    price: "₹0 / Free",
                    desc: "Up to 3 active listings, CPA commission on sales only",
                    badge: "Popular",
                  },
                  {
                    id: "growth",
                    name: "GROWTH PARTNER",
                    price: "₹999/mo (Founding)",
                    desc: "Up to 15 active listings, 4 campaigns/yr, 14-day free trial",
                    badge: "Founding Deal",
                  },
                  {
                    id: "pro",
                    name: "PRO PARTNER",
                    price: "₹2,999/mo (Founding)",
                    desc: "Unlimited listings, 50 revivals/mo, push sends included",
                    badge: "Best Value",
                  },
                  {
                    id: "enterprise",
                    name: "ENTERPRISE",
                    price: "Custom Pricing",
                    desc: "Unlimited listings & campaigns + dedicated account manager",
                    badge: "Scale",
                  },
                ].map((plan) => {
                  const isSelected = formData.selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() =>
                        setFormData({ ...formData, selectedPlan: plan.id })
                      }
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/15 shadow-xs"
                          : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-350"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {plan.name}
                        </span>
                        <Badge className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 font-bold border-0">
                          {plan.badge}
                        </Badge>
                      </div>
                      <span className="text-sm font-extrabold text-blue-600 block">
                        {plan.price}
                      </span>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 font-medium mt-1">
                        {plan.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="text-slate-700 dark:text-slate-300 border-slate-350 dark:border-zinc-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  &lt; Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Next &gt;
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 5: COMMISSION & HOURS */}
          {currentStep === 5 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Section E:
                  Commission &amp; Hours
                </h3>
                <p className="text-xs text-slate-555 dark:text-slate-400 font-medium">
                  Category commission rate acknowledgment and operating hours
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-855 rounded-2xl space-y-2">
                  <Label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Category Performance Commission Structure
                  </Label>
                  <div className="text-[11px] text-slate-650 dark:text-slate-400 space-y-1">
                    {COMMISSION_TABLE.slice(0, 4).map((c) => (
                      <div
                        key={c.category}
                        className="flex justify-between border-b border-slate-200/60 dark:border-zinc-855 pb-1"
                      >
                        <span className="font-semibold">{c.category}:</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {c.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3.5 bg-blue-550/5 dark:bg-blue-950/5 border border-blue-200 dark:border-blue-900/30 rounded-xl cursor-pointer">
                  <Checkbox
                    checked={formData.commissionAgreed}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, commissionAgreed: !!val })
                    }
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    I acknowledge and accept the Vouchiqo performance commission
                    structure for my category.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(4)}
                  className="text-slate-700 dark:text-slate-300 border-slate-355 dark:border-zinc-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  &lt; Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Next &gt;
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 6: DECLARATIONS & SUBMIT */}
          {currentStep === 6 && (
            <Card className="border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Section F:
                  Declarations &amp; Submission
                </h3>
                <p className="text-xs text-slate-555 dark:text-slate-400 font-medium">
                  Final commitments and digital signature
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  7 Merchant Commitments (Mandatory)
                </Label>
                {[
                  {
                    key: "commit1",
                    text: "All submitted business information is accurate, real, and currently operating.",
                  },
                  {
                    key: "commit2",
                    text: "I will honour every verified offer published on Vouchiqo for customers during validity.",
                  },
                  {
                    key: "commit3",
                    text: "I will submit only genuine, working offer codes and deals.",
                  },
                  {
                    key: "commit4",
                    text: "I will enter actual transaction values when confirming Smart Codes.",
                  },
                  {
                    key: "commit5",
                    text: "I understand Vouchiqo earns performance commission on sales/leads.",
                  },
                  {
                    key: "commit6",
                    text: "I will keep my counter staff informed about active offers.",
                  },
                  {
                    key: "commit7",
                    text: "I will pause or delete offers if stock runs out or terms change.",
                  },
                ].map((c) => (
                  <label
                    key={c.key}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-855 rounded-xl text-xs cursor-pointer"
                  >
                    <Checkbox
                      checked={formData[c.key]}
                      onCheckedChange={(val) =>
                        setFormData({ ...formData, [c.key]: !!val })
                      }
                      className="mt-0.5"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-300">
                      {c.text}
                    </span>
                  </label>
                ))}

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <Label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Policy Agreements
                  </Label>
                  {[
                    { key: "policy1", text: "Agree to Merchant Agreement" },
                    { key: "policy2", text: "Agree to Terms of Service" },
                    { key: "policy3", text: "Agree to Privacy Policy" },
                    { key: "policy4", text: "Agree to Verification Policy" },
                    {
                      key: "policy5",
                      text: "Agree to Refund & Cancellation Policy",
                    },
                  ].map((p) => (
                    <label
                      key={p.key}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Checkbox
                        checked={formData[p.key]}
                        onCheckedChange={(val) =>
                          setFormData({ ...formData, [p.key]: !!val })
                        }
                      />
                      <span>{p.text}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-slate-800 dark:text-zinc-250">
                      Authorised Signatory Full Name *
                    </Label>
                    <Input
                      type="text"
                      placeholder="Rajan Kumar Singh"
                      value={formData.signatoryName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          signatoryName: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-medium focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-slate-800 dark:text-zinc-250">
                      Digital Signature / Initials *
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. R.K.S."
                      value={formData.digitalInitials}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          digitalInitials: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-10 rounded-xl font-mono uppercase font-bold focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 focus-visible:border-2 focus-visible:shadow-none shadow-none placeholder:font-normal placeholder:text-xs placeholder:text-slate-400/80"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(5)}
                  className="text-slate-700 dark:text-slate-300 border-slate-350 dark:border-zinc-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  &lt; Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-8 rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Sticky Bottom Footer */}
      <Footer />
    </div>
  );
}
