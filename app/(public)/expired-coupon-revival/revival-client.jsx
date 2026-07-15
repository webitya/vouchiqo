"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Send,
  Building2,
  Tag,
  Phone,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { INDIAN_CITIES } from "@/utils/cities";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import Step1Merchant from "./components/Step1Merchant";
import Step2Offer from "./components/Step2Offer";
import Step3Contact from "./components/Step3Contact";
import Step4Review from "./components/Step4Review";

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

const SOURCE_PLATFORMS = [
  "Vouchiqo",
  "Instagram",
  "WhatsApp Forward",
  "Google Search",
  "Another Coupon Website",
  "Physical Store or Flyer",
  "Friend or Family",
  "Other",
];

const DISCOUNT_TYPES = [
  { value: "percentage", label: "% Off" },
  { value: "fixed", label: "Flat ₹ Off" },
  { value: "bogo", label: "BOGO (Buy One Get One)" },
  { value: "freebie", label: "Free Gift with Purchase" },
  { value: "other", label: "Other" },
];

const CATEGORIES = [
  "Fashion & Clothing",
  "Food & Dining",
  "Electronics & Gadgets",
  "Beauty & Wellness",
  "Travel & Hospitality",
  "Home & Living",
  "Home Improvement",
  "Fitness & Healthcare",
  "Education & Courses",
  "Kids & Baby Products",
  "Jewellery & Accessories",
  "Automobile & Auto Services",
  "Gaming & Entertainment",
  "Grocery & Essentials",
  "Finance & Insurance",
];

export default function ExpiredCouponRevival() {
<<<<<<< HEAD
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brandName: "",
    merchantWebsite: "",
    merchantCity: "Ranchi",
    whereDidYouFindThisOffer: "Google Search",
    code: "",
    discountType: "percentage",
    discountValue: "",
    description: "",
    whenSeen: new Date().toISOString().split("T")[0],
    whatBuying: "",
    email: "",
    mobileNumber: "",
    consent: false,
  });

=======
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

<<<<<<< HEAD
=======
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

>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
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
<<<<<<< HEAD
        const res = await fetch("/api/admin/settings?public=true");
        if (res.ok) {
          const json = await res.json();
          if (json.status === "success" && json.data?.settings) {
            const s = json.data.settings;
            if (s.revival_stats) setStats(s.revival_stats);
=======
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
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
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

<<<<<<< HEAD
  const nextStep = () => {
    if (step === 1) {
      if (!form.brandName || !form.merchantCity) {
        setError("Please enter a Brand Name and City.");
        return;
      }
    } else if (step === 2) {
      if (!form.discountType || !form.description) {
        setError("Please provide offer details (Type & Description).");
        return;
      }
    } else if (step === 3) {
      if (!form.email || !form.mobileNumber) {
        setError("Email and WhatsApp mobile number are required.");
        return;
      }
      if (!/^\d{10}$/.test(form.mobileNumber)) {
        setError("Please enter a valid 10-digit Indian WhatsApp number.");
        return;
      }
    }
=======
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

>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
<<<<<<< HEAD
    setStep((prev) => prev - 1);
=======
    if (isExpedited && step === 3) {
      // If expedited, going back drops you out of expedited view to step 1
      setIsExpedited(false);
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
<<<<<<< HEAD
      setError("You must check the expectation consent checkbox to proceed.");
=======
      setError("You must check the consent box to proceed.");
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
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
<<<<<<< HEAD
        body: JSON.stringify({
          ...form,
          discountValue: form.discountValue ? Number(form.discountValue) : null,
        }),
=======
        body: JSON.stringify(payload),
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
<<<<<<< HEAD
=======
        // Optimistically increment stats counters
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
        setStats((prev) => ({
          totalRequests: prev.totalRequests + 1,
          thisMonthRequests: prev.thisMonthRequests + 1,
        }));
      } else {
        setError(data.message || "Failed to submit revival request.");
      }
    } catch (err) {
      console.error(err);
<<<<<<< HEAD
      setError("Failed to submit request. Please try again.");
=======
      setError("An unexpected error occurred. Please try again.");
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-text">
      <Navbar />

<<<<<<< HEAD
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0c1a2c] via-[#11243b] to-[#0c1a2c] text-white py-16 px-4 text-center border-b border-white/5 relative">
=======
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0c1a2c] via-[#11243b] to-[#0c1a2c] text-white py-14 px-4 text-center border-b border-white/5 relative">
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          <Badge className="bg-orange-500/15 text-[#FF7A18] hover:bg-orange-500/20 border border-[#FF7A18]/20 rounded-full px-3.5 py-1 font-bold text-xs shadow-none gap-1.5 w-fit mx-auto">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tested Before It Reaches You</span>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white leading-tight">
            Expired Offer Revival
          </h1>
<<<<<<< HEAD

          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
            Submit your expired discount codes here. Vouchiqo contacts the
            merchant on your behalf and requests a fresh verified offer — free,
            within 48 hours.
          </p>

          <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md mx-auto">
=======
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Missed a discount? Submit the expired details. We will negotiate with the brand to get a new code issued for you.
          </p>

          <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 max-w-sm mx-auto">
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
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

<<<<<<< HEAD
      {/* Main split layout */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Revival Form (7 Cols) */}
        <section className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-xl p-6 md:p-8 shadow-sm">
=======
      {/* Main split sections */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 4-Step Form */}
        <section className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-xl p-5 md:p-7 shadow-sm">
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-14 h-14 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center mx-auto border border-brand-success/30">
                <CheckCircle2 className="w-7 h-7 fill-brand-success/10" />
              </div>
              <div className="space-y-2">
<<<<<<< HEAD
                <h3 className="font-heading text-xl font-bold text-brand-navy">
                  Submitted! We&apos;re on it.
                </h3>
                <p className="text-xs text-brand-subtext max-w-sm mx-auto leading-relaxed">
                  We&apos;ve received your request and will contact the merchant
                  on your behalf. You&apos;ll hear back within 48 hours — check
                  your email and WhatsApp.
=======
                <h3 className="font-heading text-lg font-bold text-brand-navy">Request Received!</h3>
                <p className="text-xs text-brand-subtext max-w-sm mx-auto leading-relaxed">
                  We've successfully logged your revival request. We will contact the merchant and notify you at <strong>{form.email}</strong> once a resolution (new code or alternative) is available.
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
                </p>
              </div>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
<<<<<<< HEAD
                  setForm({
                    brandName: "",
                    merchantWebsite: "",
                    merchantCity: "Ranchi",
                    whereDidYouFindThisOffer: "Google Search",
=======
                  setIsExpedited(false);
                  setForm({
                    brandName: "",
                    category: "",
                    foundWhere: "Vouchiqo",
                    foundWhereOther: "",
                    merchantWebsite: "",
                    city: "",
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
                    code: "",
                    discountType: "percentage",
                    discountValue: "",
                    description: "",
<<<<<<< HEAD
                    whenSeen: new Date().toISOString().split("T")[0],
                    whatBuying: "",
                    email: "",
                    mobileNumber: "",
                    consent: false,
                  });
                }}
                className="bg-brand-navy hover:bg-slate-800 text-white py-2.5 px-8 text-xs font-bold border-0 h-auto cursor-pointer shadow-none rounded-lg"
              >
                Submit Another Offer
=======
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
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
<<<<<<< HEAD
              {/* Wizard progress header */}
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h2 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider flex items-center gap-2">
                  {step === 1 && (
                    <Building2 className="w-4 h-4 text-brand-blue" />
                  )}
                  {step === 2 && <Tag className="w-4 h-4 text-brand-blue" />}
                  {step === 3 && <Phone className="w-4 h-4 text-brand-blue" />}
                  {step === 4 && (
                    <CheckSquare className="w-4 h-4 text-brand-blue" />
                  )}
                  <span>
                    Step {step} of 4:{" "}
                    {step === 1
                      ? "Merchant Details"
                      : step === 2
                        ? "Offer Details"
                        : step === 3
                          ? "Contact Information"
                          : "Confirm Consent"}
                  </span>
                </h2>
                <span className="text-[11px] font-bold text-brand-subtext">
                  {Math.round((step / 4) * 100)}% Complete
                </span>
=======
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
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
              </div>

              {error && (
                <div className="flex gap-2.5 p-3 rounded-lg bg-brand-error/5 border border-brand-error/15 text-brand-error text-xs items-center">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

<<<<<<< HEAD
              {/* Step 1: Merchant Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Brand or Business Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Marbella, Zomato, Starbucks"
                      value={form.brandName}
                      onChange={(e) =>
                        setForm({ ...form, brandName: e.target.value })
                      }
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Merchant Website or Instagram (If you know it)
                    </label>
                    <Input
                      placeholder="e.g. @marbellaranchi or https://brand.com"
                      value={form.merchantWebsite}
                      onChange={(e) =>
                        setForm({ ...form, merchantWebsite: e.target.value })
                      }
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Which city is this business in? *
                      </label>
                      <Input
                        required
                        placeholder="e.g. Ranchi"
                        value={form.merchantCity}
                        onChange={(e) =>
                          setForm({ ...form, merchantCity: e.target.value })
                        }
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Where did you find this offer? *
                      </label>
                      <select
                        value={form.whereDidYouFindThisOffer}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            whereDidYouFindThisOffer: e.target.value,
                          })
                        }
                        className="w-full bg-brand-surface border border-brand-border rounded-lg text-xs h-10 px-2 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      >
                        {SOURCE_PLATFORMS.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-brand-navy hover:bg-slate-800 text-white w-full py-2.5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none rounded-lg flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Continue to Offer Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Offer Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Expired Offer Code (If there was one)
                      </label>
                      <Input
                        placeholder="e.g. SAVE20, MARBELLA15"
                        value={form.code}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10 uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        What was the offer? *
                      </label>
                      <select
                        value={form.discountType}
                        onChange={(e) =>
                          setForm({ ...form, discountType: e.target.value })
                        }
                        className="w-full bg-brand-surface border border-brand-border rounded-lg text-xs h-10 px-2 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      >
                        {DISCOUNT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(form.discountType === "percentage" ||
                    form.discountType === "fixed") && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        How much off? (Numerical Value only)
                      </label>
                      <Input
                        type="number"
                        placeholder={
                          form.discountType === "percentage"
                            ? "e.g. 20 (for 20%)"
                            : "e.g. 500 (for ₹500)"
                        }
                        value={form.discountValue}
                        onChange={(e) =>
                          setForm({ ...form, discountValue: e.target.value })
                        }
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Offer description (Brief) *
                    </label>
                    <Input
                      placeholder="e.g. 20% off all bathroom tiles, BOGO coffee"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        When did you see/find this offer? *
                      </label>
                      <Input
                        type="date"
                        value={form.whenSeen}
                        onChange={(e) =>
                          setForm({ ...form, whenSeen: e.target.value })
                        }
                        max={new Date().toISOString().split("T")[0]}
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        What were you trying to buy? (optional)
                      </label>
                      <Input
                        placeholder="e.g. Espresso drinks, Tiles"
                        value={form.whatBuying}
                        onChange={(e) =>
                          setForm({ ...form, whatBuying: e.target.value })
                        }
                        className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="border border-brand-border bg-transparent text-brand-navy hover:bg-slate-50 w-fit px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer h-auto shadow-none flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-brand-navy hover:bg-slate-800 text-white flex-1 py-2.5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none rounded-lg flex items-center justify-center gap-2"
                    >
                      <span>Continue to Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your email — we&apos;ll send the fresh offer here *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your WhatsApp number — for faster delivery *
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={form.mobileNumber}
                      onChange={(e) =>
                        setForm({ ...form, mobileNumber: e.target.value })
                      }
                      className="bg-brand-surface text-xs focus:ring-brand-blue border-brand-border h-10"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="border border-brand-border bg-transparent text-brand-navy hover:bg-slate-50 w-fit px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer h-auto shadow-none flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-brand-navy hover:bg-slate-800 text-white flex-1 py-2.5 text-xs font-bold border-0 h-auto cursor-pointer shadow-none rounded-lg flex items-center justify-center gap-2"
                    >
                      <span>Continue to Consent</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Consent & Submit */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-4">
                    <h4 className="font-heading text-xs font-extrabold text-brand-navy uppercase tracking-widest">
                      Expectation-Setting Agreement
                    </h4>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={form.consent}
                        onChange={(e) =>
                          setForm({ ...form, consent: e.target.checked })
                        }
                        className="w-4 h-4 mt-0.5 border-brand-border text-brand-blue focus:ring-brand-blue rounded"
                      />
                      <span className="text-xs leading-relaxed text-slate-600 font-medium">
                        I understand Vouchiqo will try to get this offer
                        reactivated, but cannot guarantee a working code will be
                        available. If this isn&apos;t possible, I&apos;ll be
                        notified and may be offered a similar active offer from
                        this brand or category instead.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="border border-brand-border bg-transparent text-brand-navy hover:bg-slate-50 w-fit px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer h-auto shadow-none flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#0f172a] hover:bg-slate-800 text-white flex-1 py-3 text-xs font-bold border-0 h-auto cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Revival Request</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
=======
              {/* STEP 1: MERCHANT DETAILS */}
              {step === 1 && (
                <Step1Merchant
                  form={form}
                  setForm={setForm}
                  brandSuggestions={brandSuggestions}
                  handleBrandChange={handleBrandChange}
                  checkBrandOnBlur={checkBrandOnBlur}
                  selectBrand={selectBrand}
                  isCategoryLocked={isCategoryLocked}
                  VOUCHIQO_CATEGORIES={VOUCHIQO_CATEGORIES}
                  citySuggestions={citySuggestions}
                  handleCityChange={handleCityChange}
                  selectCity={selectCity}
                  FOUND_SOURCES={FOUND_SOURCES}
                />
              )}

              {/* STEP 2: OFFER DETAILS */}
              {step === 2 && (
                <Step2Offer
                  form={form}
                  setForm={setForm}
                />
              )}

              {/* STEP 3: CUSTOMER CONTACT */}
              {step === 3 && (
                <Step3Contact
                  form={form}
                  setForm={setForm}
                  isExpedited={isExpedited}
                  session={session}
                />
              )}

              {/* STEP 4: CONSENT & SUBMIT */}
              {step === 4 && (
                <Step4Review
                  form={form}
                  setForm={setForm}
                />
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
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
            </div>
          )}
        </section>

        {/* Right: Success Stories */}
        <section className="lg:col-span-5 space-y-6">
<<<<<<< HEAD
          {/* How it works visual */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              How Revival Works
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex gap-3.5 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">Submit Details</h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    Enter the expired code and brand name. Our system
                    cross-references it with the verified brand database.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">
                    Merchant Negotiation
                  </h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    Vouchiqo aggregates coupon demand and presents conversion
                    projections directly to the brand owner dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">
                    Approved Restorations
                  </h4>
                  <p className="text-brand-subtext leading-relaxed mt-0.5">
                    Once the merchant approves, the coupon code is refreshed
                    with a new expiry date, and you are notified.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Success Feed */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Recent Successful Revivals
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
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
                    <Badge className="bg-brand-success/10 text-brand-success hover:bg-brand-success/15 border-0 px-2 py-0.5 text-[8px] font-bold">
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
=======
          <HowItWorks />
          <SuccessStories successStories={successStories} />
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
        </section>
      </main>

      <Footer />
    </div>
  );
}
