"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Send,
  Building,
  Tag,
  Phone,
  CheckSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { INDIAN_CITIES } from "@/utils/cities";

// 15 Vouchiqo standard categories
const VOUCHIQO_CATEGORIES = [
  "Food & Dining",
  "Fashion & Apparel",
  "Beauty & Wellness",
  "Electronics & Gadgets",
  "Home Improvement",
  "Health & Fitness",
  "Entertainment & Leisure",
  "Travel & Tourism",
  "Education & Learning",
  "Automotive",
  "Financial Services",
  "Pets",
  "Real Estate",
  "Professional Services",
  "Groceries & Essentials",
];

const FOUND_SOURCES = [
  "Vouchiqo",
  "Instagram",
  "WhatsApp Forward",
  "Google Search",
  "Another Coupon Website",
  "Physical Store or Flyer",
  "Friend or Family",
  "Other",
];

export default function ExpiredCouponRevival() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Auto-complete suggestions state
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [isExpedited, setIsExpedited] = useState(false);

  const [form, setForm] = useState({
    brandName: "",
    category: "",
    foundWhere: "Vouchiqo",
    foundWhereOther: "",
    merchantWebsite: "",
    city: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    description: "",
    foundAtDate: new Date().toISOString().split("T")[0],
    buyingIntent: "",
    email: "",
    mobile: "+91",
    consent: false,
  });

  const [stats, setStats] = useState({
    totalRequests: 5240,
    thisMonthRequests: 142,
  });

  const [successStories, setSuccessStories] = useState([
    {
      user: "Anish S. from Ranchi",
      brand: "Marbella Tiles & Sanitary",
      offer: "Saved ₹5,400 on home flooring tiles",
      date: "2 days ago",
      text: "Vouchiqo helped reactivate the flat ₹5,000 discount. Marbella Ranchi approved it immediately after receiving the request batch.",
    },
    {
      user: "Sarah J. from Delhi",
      brand: "Starbucks Coffee",
      offer: "Revived Buy 1 Get 1 Free Espresso",
      date: "5 days ago",
      text: "Requested Starbucks BOGO revival. Within 48 hours, Vouchiqo updated the code to active, and I redeemed it in-store.",
    },
    {
      user: "Rohan D. from Bangalore",
      brand: "Notion Premium Team Plan",
      offer: "Recovered $100 SaaS Workspace Credits",
      date: "1 week ago",
      text: "Our team credits coupon had expired. Vouchiqo contacted Notion's merchant partnership team, and they re-enabled it for our domain!",
    },
  ]);

  // Pre-fill parameters if arriving from an expired offer card
  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const code = searchParams.get("code");
    const discountType = searchParams.get("discountType");
    const discountValue = searchParams.get("discountValue");
    const description = searchParams.get("description");
    const isCategoryAMerchant = searchParams.get("activeMerchant") === "true";

    if (brand) {
      setForm((prev) => ({
        ...prev,
        brandName: brand,
        category: category || "",
        code: code || "",
        discountType: discountType || "percentage",
        discountValue: discountValue || "",
        description: description || "",
      }));

      if (category) {
        setIsCategoryLocked(true);
      }

      if (isCategoryAMerchant) {
        setIsExpedited(true);
        // Expedited flow bypasses steps 1 & 2 directly to step 3/4
        setStep(3);
      }
    }
  }, [searchParams]);

  // Set email when logged in
  useEffect(() => {
    if (session?.user?.email) {
      setForm((prev) => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  // Fetch stats & social-proof successes
  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch("/api/revivals/customer"),
          fetch("/api/admin/settings?public=true"),
        ]);

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.status === "success") {
            setStats(statsJson.data);
          }
        }

        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson.status === "success" && settingsJson.data?.settings) {
            const s = settingsJson.data.settings;
            if (s.social_proof && s.social_proof.length > 0) {
              setSuccessStories(s.social_proof);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load revival client statistics:", err);
      }
    }
    loadData();
  }, []);

  // Handle autocomplete query for brands
  const handleBrandChange = async (val) => {
    setForm((prev) => ({ ...prev, brandName: val }));
    if (val.trim().length > 1) {
      try {
        const res = await fetch(`/api/brands/autocomplete?query=${encodeURIComponent(val)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setBrandSuggestions(json.brands);
          }
        }
      } catch (err) {
        console.error("Error fetching brand suggestions:", err);
      }
    } else {
      setBrandSuggestions([]);
    }
  };

  // Select brand suggestion
  const selectBrand = (b) => {
    setForm((prev) => ({
      ...prev,
      brandName: b.name,
      category: b.category || prev.category,
      city: b.city || prev.city,
    }));
    if (b.category) {
      setIsCategoryLocked(true);
    }
    setBrandSuggestions([]);
  };

  // Perform backend check on blur to see if category should lock
  const checkBrandOnBlur = async () => {
    if (!form.brandName.trim()) return;
    try {
      const res = await fetch(`/api/brands/autocomplete?query=${encodeURIComponent(form.brandName)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.brands.length > 0) {
          const matched = json.brands.find(
            (b) => b.name.toLowerCase() === form.brandName.trim().toLowerCase()
          );
          if (matched && matched.category) {
            setForm((prev) => ({ ...prev, category: matched.category, city: matched.city || prev.city }));
            setIsCategoryLocked(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // City autocomplete filtering
  const handleCityChange = (val) => {
    setForm((prev) => ({ ...prev, city: val }));
    if (val.trim().length > 0) {
      const filtered = INDIAN_CITIES.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions([]);
    }
  };

  const selectCity = (c) => {
    setForm((prev) => ({ ...prev, city: c }));
    setCitySuggestions([]);
  };

  const nextStep = () => {
    // Validate Step 1
    if (step === 1) {
      if (!form.brandName.trim() || !form.category || !form.foundWhere || !form.city.trim()) {
        setError("Please fill out all required merchant details.");
        return;
      }
      if ((form.foundWhere === "Other" || form.foundWhere === "Another Coupon Website") && !form.foundWhereOther?.trim()) {
        setError("Please specify where you found this offer.");
        return;
      }
    }
    // Validate Step 2
    if (step === 2) {
      if (!form.discountType || !form.description.trim() || !form.foundAtDate) {
        setError("Please complete all required offer details.");
        return;
      }
      if ((form.discountType === "percentage" || form.discountType === "fixed") && !form.discountValue) {
        setError("Please enter the discount value.");
        return;
      }
    }
    // Validate Step 3
    if (step === 3) {
      const mobileClean = form.mobile.replace(/\D/g, "");
      if (!form.email.trim() || !form.mobile.trim()) {
        setError("Contact details are required.");
        return;
      }
      if (mobileClean.length < 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    if (isExpedited && step === 3) {
      // If expedited, going back drops you out of expedited view to step 1
      setIsExpedited(false);
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setError("You must check the consent box to proceed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        discountValue: form.discountValue ? Number(form.discountValue) : null,
      };

      const res = await fetch("/api/revivals/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        // Optimistically increment stats counters
        setStats((prev) => ({
          totalRequests: prev.totalRequests + 1,
          thisMonthRequests: prev.thisMonthRequests + 1,
        }));
      } else {
        setError(data.message || "Failed to submit revival request.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0c1a2c] via-[#11243b] to-[#0c1a2c] text-white py-14 px-4 text-center border-b border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          <Badge className="bg-orange-500/15 text-[#FF7A18] hover:bg-orange-500/20 border border-[#FF7A18]/20 rounded-full px-3.5 py-1 font-bold text-xs shadow-none gap-1.5 w-fit mx-auto">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Community-Driven Restorations</span>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white leading-tight">
            Expired Offer Revival
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Missed a discount? Submit the expired details. We will negotiate with the brand to get a new code issued for you.
          </p>

          <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 max-w-sm mx-auto">
            <div className="text-center flex-1">
              <span className="block text-xl font-black text-[#FFB020]">{stats.thisMonthRequests}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">This Month</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center flex-1">
              <span className="block text-xl font-black text-[#00B67A]">{stats.totalRequests}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main split sections */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 4-Step Form */}
        <section className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-xl p-5 md:p-7 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-14 h-14 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center mx-auto border border-brand-success/30">
                <CheckCircle2 className="w-7 h-7 fill-brand-success/10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-brand-navy">Request Received!</h3>
                <p className="text-xs text-brand-subtext max-w-sm mx-auto leading-relaxed">
                  We've successfully logged your revival request. We will contact the merchant and notify you at <strong>{form.email}</strong> once a resolution (new code or alternative) is available.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setIsExpedited(false);
                  setForm({
                    brandName: "",
                    category: "",
                    foundWhere: "Vouchiqo",
                    foundWhereOther: "",
                    merchantWebsite: "",
                    city: "",
                    code: "",
                    discountType: "percentage",
                    discountValue: "",
                    description: "",
                    foundAtDate: new Date().toISOString().split("T")[0],
                    buyingIntent: "",
                    email: session?.user?.email || "",
                    mobile: "+91",
                    consent: false,
                  });
                }}
                className="btn-primary py-2 px-6 text-xs font-bold border-0 h-auto cursor-pointer"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{isExpedited ? "Expedited Review" : `Step ${step} of 4`}</span>
                  <span>
                    {step === 1 && "Merchant details"}
                    {step === 2 && "Offer specifications"}
                    {step === 3 && "Contact info"}
                    {step === 4 && "Consent & Submit"}
                  </span>
                </div>
                <div className="w-full bg-brand-surface h-1.5 rounded-full overflow-hidden border border-brand-border">
                  <div
                    className="bg-brand-blue h-full transition-all duration-300"
                    style={{ width: isExpedited ? "75%" : `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-2.5 p-3 rounded-lg bg-brand-error/5 border border-brand-error/15 text-brand-error text-xs items-center">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: MERCHANT DETAILS */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
                    <Building className="w-4 h-4 text-brand-blue" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">1. Merchant Details</h2>
                  </div>

                  {/* Brand Name Input with Autocomplete */}
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brand Name *</label>
                    <Input
                      placeholder="e.g. Marbella, Starbucks"
                      value={form.brandName}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      onBlur={checkBrandOnBlur}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                    {brandSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg z-50 overflow-hidden text-xs max-h-40 overflow-y-auto">
                        {brandSuggestions.map((b, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectBrand(b)}
                            className="w-full text-left px-3 py-2 hover:bg-brand-surface transition-colors border-b border-brand-border/40 font-medium"
                          >
                            {b.name} <span className="text-[10px] text-slate-400">({b.category})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Category *</label>
                    <select
                      value={form.category}
                      disabled={isCategoryLocked}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-xs focus:ring-brand-blue focus:border-brand-blue h-9 disabled:opacity-60"
                    >
                      <option value="">Select category...</option>
                      {VOUCHIQO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Autocomplete */}
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Merchant Location (City) *</label>
                    <Input
                      placeholder="e.g. Ranchi"
                      value={form.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                    {citySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg z-50 overflow-hidden text-xs">
                        {citySuggestions.map((c, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectCity(c)}
                            className="w-full text-left px-3 py-2 hover:bg-brand-surface transition-colors border-b border-brand-border/40 font-medium"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Where did you find this? */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Where did you find this offer? *</label>
                    <select
                      value={form.foundWhere}
                      onChange={(e) => setForm({ ...form, foundWhere: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-xs focus:ring-brand-blue focus:border-brand-blue h-9"
                    >
                      {FOUND_SOURCES.map((src) => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>

                  {/* If other/another website */}
                  {(form.foundWhere === "Other" || form.foundWhere === "Another Coupon Website") && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specify Website or Platform *</label>
                      <Input
                        placeholder="e.g. GrabOn, physical banner"
                        value={form.foundWhereOther}
                        onChange={(e) => setForm({ ...form, foundWhereOther: e.target.value })}
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                      />
                    </div>
                  )}

                  {/* Merchant Website Link */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Merchant Website / Social Link (Optional)</label>
                    <Input
                      placeholder="e.g. @marbellaranchi or website URL"
                      value={form.merchantWebsite}
                      onChange={(e) => setForm({ ...form, merchantWebsite: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: OFFER DETAILS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
                    <Tag className="w-4 h-4 text-brand-blue" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">2. Offer Details</h2>
                  </div>

                  {/* Expired Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expired Coupon Code (Optional)</label>
                    <Input
                      placeholder="e.g. OFF50"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9 uppercase"
                    />
                  </div>

                  {/* Discount Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Discount Type *</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: "% Off", value: "percentage" },
                        { label: "Flat ₹ Off", value: "fixed" },
                        { label: "BOGO", value: "bogo" },
                        { label: "Free Gift", value: "freebie" },
                        { label: "Other", value: "other" },
                      ].map((t) => (
                        <label key={t.value} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="discountType"
                            value={t.value}
                            checked={form.discountType === t.value}
                            onChange={(e) => setForm({ ...form, discountType: e.target.value, discountValue: "" })}
                            className="text-brand-blue focus:ring-brand-blue"
                          />
                          <span>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Discount Value */}
                  {(form.discountType === "percentage" || form.discountType === "fixed") && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Discount Value ({form.discountType === "percentage" ? "%" : "₹"}) *
                      </label>
                      <Input
                        type="number"
                        placeholder={form.discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
                        value={form.discountValue}
                        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                      />
                    </div>
                  )}

                  {/* Brief Description */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brief Offer Description *</label>
                      <span className="text-[9px] font-semibold text-slate-400">{form.description.length}/100</span>
                    </div>
                    <Input
                      placeholder="e.g. 20% off all bathroom fittings"
                      value={form.description}
                      maxLength={100}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                  </div>

                  {/* When did you find this? */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">When did you see/find this offer? *</label>
                    <Input
                      type="date"
                      value={form.foundAtDate}
                      onChange={(e) => setForm({ ...form, foundAtDate: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                  </div>

                  {/* What were you trying to buy? */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">What were you trying to buy? (Optional)</label>
                    <Input
                      placeholder="e.g. Kitchen wall tiles"
                      value={form.buyingIntent}
                      maxLength={150}
                      onChange={(e) => setForm({ ...form, buyingIntent: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CUSTOMER CONTACT */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
                    <Phone className="w-4 h-4 text-brand-blue" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">3. Contact Details</h2>
                  </div>

                  {isExpedited && (
                    <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-lg p-3 text-xs text-brand-blue font-medium mb-3">
                      Expedited Flow: Reactivating pre-loaded coupon details for <strong>{form.brandName}</strong>. Fill in your contact info to submit!
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Email Address *</label>
                    <Input
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={form.email}
                      disabled={!!session?.user?.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9 disabled:opacity-75"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Mobile Number (WhatsApp Updates) *</label>
                    <Input
                      type="tel"
                      placeholder="e.g. +91 9999999999"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-9"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: CONSENT & SUBMIT */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-2">
                    <CheckSquare className="w-4 h-4 text-brand-blue" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">4. Review & Confirm</h2>
                  </div>

                  {/* Summary card */}
                  <div className="bg-brand-surface border border-brand-border rounded-lg p-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Merchant:</span>
                      <span className="font-bold text-brand-navy">{form.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Category:</span>
                      <span className="font-bold text-brand-navy">{form.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Offer Code:</span>
                      <span className="font-bold text-brand-navy">{form.code || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Offer Value:</span>
                      <span className="font-bold text-brand-success">
                        {form.discountType === "percentage" && `${form.discountValue}% OFF`}
                        {form.discountType === "fixed" && `₹${form.discountValue} OFF`}
                        {form.discountType === "bogo" && "BOGO Deal"}
                        {form.discountType === "freebie" && "Free Gift"}
                        {form.discountType === "other" && "Discount"}
                      </span>
                    </div>
                  </div>

                  {/* Expectation-Setting Consent Checkbox */}
                  <div className="flex gap-2.5 items-start p-3 bg-brand-surface border border-brand-border rounded-lg">
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                      className="mt-1 text-brand-blue focus:ring-brand-blue cursor-pointer"
                    />
                    <label htmlFor="consent-check" className="text-[11px] leading-relaxed text-slate-600 font-medium cursor-pointer">
                      I understand Vouchiqo will try to get this offer reactivated, but cannot guarantee a working code will be available. If this isn't possible, I'll be notified and may be offered a similar active offer from this brand or category instead.
                    </label>
                  </div>
                </div>
              )}

              {/* BUTTONS NAVIGATION */}
              <div className="flex justify-between items-center gap-3 pt-3 border-t border-brand-border">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-brand-surface text-slate-600 border border-brand-border hover:bg-slate-50 text-xs font-bold py-2 px-4 h-9 cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-brand-blue text-white hover:bg-brand-blue/90 text-xs font-bold py-2 px-4 h-9 cursor-pointer ml-auto flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="bg-brand-success text-white hover:bg-brand-success/90 text-xs font-bold py-2 px-6 h-9 cursor-pointer ml-auto flex items-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Revival Request</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Right: Success Stories */}
        <section className="lg:col-span-5 space-y-6">
          {/* How it works */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-xs font-black text-brand-navy uppercase tracking-wider border-b border-brand-border pb-2">
              How Revival Works
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">Submit Details</h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    Provide the expired coupon code or deal details. We cross-reference with our database.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">Outreach Automation</h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    We aggregate demand and present recovery insights directly to the brand dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">Enjoy Savings</h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    Once approved by the merchant, a renewed active offer code is dispatched to your email/WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Success Feed */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-xs font-black text-brand-navy uppercase tracking-wider border-b border-brand-border pb-2">
              Recent Successes
            </h3>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {successStories.map((story, idx) => (
                <div
                  key={idx}
                  className="bg-brand-surface border border-brand-border/40 rounded-lg p-3 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-brand-navy block">
                        {story.brand}
                      </span>
                      <span className="text-[10px] text-brand-success font-bold">
                        {story.offer}
                      </span>
                    </div>
                    <Badge className="bg-brand-success/10 text-brand-success border-0 px-2 py-0.5 text-[8px] font-bold">
                      {story.date}
                    </Badge>
                  </div>
                  <p className="text-brand-subtext leading-relaxed italic bg-white p-2.5 rounded border border-brand-border/30">
                    &ldquo;{story.text}&rdquo;
                  </p>
                  <span className="text-[10px] font-bold text-slate-500 block text-right">
                    — {story.user}
                  </span>
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
