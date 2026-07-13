"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Send,
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
            </div>
          )}
        </section>

        {/* Right: Success Stories */}
        <section className="lg:col-span-5 space-y-6">
          <HowItWorks />
          <SuccessStories successStories={successStories} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
