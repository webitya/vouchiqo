"use client";

import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Globe,
  HelpCircle,
  IndianRupee,
  Info,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Percent,
  Phone,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Upload,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
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
  { id: "others", label: "Others / Special Category" },
];

const BUSINESS_CONSTITUTIONS = [
  { id: "proprietorship", label: "Proprietorship" },
  { id: "partnership", label: "Partnership" },
  { id: "llp", label: "Limited Liability Partnership (LLP)" },
  { id: "pvt_ltd", label: "Private Limited Company (Pvt Ltd)" },
  { id: "others", label: "Others" },
];

const DESIGNATIONS = [
  { id: "owner", label: "Owner / Proprietor" },
  { id: "partner", label: "Managing Partner" },
  { id: "manager", label: "General Manager / Operations Head" },
  { id: "others", label: "Others / Authorized Liaison" },
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

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  // Tag Chips State for Sub-categories
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategoryTags, setSubCategoryTags] = useState([
    "Dine-in Offers",
    "Special Combos",
    "Weekend Deals",
  ]);

  const [formData, setFormData] = useState({
    // Section A: Business Identity
    registeredName: "",
    tradingName: "",
    constitution: "proprietorship",
    category: "food",
    customCategoryNotes: "",
    businessType: "Physical Store / Retail Shop",
    address: "",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "834001",
    additionalLocation: "",

    // Section B: Contact Details & Account Setup
    contactName: "",
    designation: "owner",
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

  // Grouped Master 3-Step Wizard Navigation
  const MASTER_STEPS = [
    {
      stepNum: 1,
      title: "Business & Contact",
      subsections: "Sections A & B",
      icon: Building,
    },
    {
      stepNum: 2,
      title: "Documents & Plan",
      subsections: "Sections C & D",
      icon: Award,
    },
    {
      stepNum: 3,
      title: "Hours & Declarations",
      subsections: "Sections E & F",
      icon: ShieldCheck,
    },
  ];

  const handleAddTag = (e) => {
    if (e.key === "Enter" && subCategoryInput.trim()) {
      e.preventDefault();
      if (!subCategoryTags.includes(subCategoryInput.trim())) {
        setSubCategoryTags([...subCategoryTags, subCategoryInput.trim()]);
      }
      setSubCategoryInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSubCategoryTags(subCategoryTags.filter((t) => t !== tagToRemove));
  };

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number first.");
      return;
    }
    setOtpSent(true);
    toast.success(`OTP code sent to +91 ${formData.mobile}! (Demo code: 1234)`);
  };

  const handleVerifyOtp = () => {
    if (otpInput === "1234" || otpInput.length === 4) {
      setIsMobileVerified(true);
      toast.success("Mobile number verified successfully! ✓");
    } else {
      toast.error("Invalid OTP code. Please enter 1234 for demo verification.");
    }
  };

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
      // Documents step optional
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
      const { data, error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.tradingName || formData.registeredName,
        data: {
          role: "merchant",
          phoneNumber: formData.mobile,
        },
      });

      if (error) {
        throw new Error(error.message || "Registration failed.");
      }

      toast.success(
        "Merchant application submitted! Your profile is under review.",
      );
      router.push("/merchant/application-status");
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine Master Step (1..3) from section currentStep (1..6)
  const activeMasterStep = currentStep <= 2 ? 1 : currentStep <= 4 ? 2 : 3;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6 text-left font-sans">
      {/* Header Banner & Title */}
      <div className="text-center space-y-2.5">
        <Badge
          variant="outline"
          className="bg-orange-50 text-[#e85d04] border-orange-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          ⭐ Founding Merchant Program Active — First 100 Approved Businesses
          (Rates Locked for 6 Months &amp; Day 1 Commission Applies)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Vouchiqo Merchant Onboarding Application
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
          ⏱ 5 minutes to complete &nbsp;•&nbsp; ✅ 24–48 hrs approval
          &nbsp;•&nbsp; ₹0 Starter plan available
        </p>
      </div>

      {/* 3-Step Progress Indicator Header */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MASTER_STEPS.map((m) => {
            const Icon = m.icon;
            const isActive = activeMasterStep === m.stepNum;
            const isCompleted = activeMasterStep > m.stepNum;
            return (
              <div
                key={m.stepNum}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive
                    ? "border-[#e85d04] bg-orange-50/50 shadow-2xs"
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-100 bg-slate-50/40"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isActive
                      ? "bg-[#e85d04] text-white"
                      : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Step {m.stepNum}: {m.subsections}
                  </span>
                  <span
                    className={`text-xs font-bold block ${isActive ? "text-[#e85d04]" : "text-slate-800"}`}
                  >
                    {m.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* SECTION 1: BUSINESS IDENTITY */}
      {currentStep === 1 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#e85d04]" /> Section A:
                Business Identity
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Who you are and what business entity you operate
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 1 of 6
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Legal Entity & Trading Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Building className="w-3.5 h-3.5 text-blue-600 mr-0.5" />{" "}
                  Registered Business Name
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Marbella Tiles & Sanitary Pvt Ltd"
                  value={formData.registeredName}
                  onChange={(e) =>
                    setFormData({ ...formData, registeredName: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Store className="w-3.5 h-3.5 text-orange-600 mr-0.5" />{" "}
                  Consumer Trade Brand Name
                  <span className="text-slate-400 font-normal text-[11px] ml-1">
                    (Optional)
                  </span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Marbella"
                  value={formData.tradingName}
                  onChange={(e) =>
                    setFormData({ ...formData, tradingName: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Business Constitution Dropdown & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Building className="w-3.5 h-3.5 text-purple-600 mr-0.5" />{" "}
                  Business Constitution Type
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Select
                  value={formData.constitution}
                  onValueChange={(val) =>
                    setFormData({ ...formData, constitution: val })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                    <SelectValue placeholder="Select constitution type" />
                  </SelectTrigger>
                  <SelectContent className="z-[300]">
                    {BUSINESS_CONSTITUTIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />{" "}
                  Primary Launch Category (15 Options)
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
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
            </div>

            {/* Others Category Assurance Message */}
            {formData.category === "others" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  ✨ <strong>Assurance Note:</strong> Selecting
                  &lsquo;Others&rsquo; enables manual category mapping by the
                  Vouchiqo admin team during verification without any approval
                  delay.
                </span>
              </div>
            )}

            {/* Sub-Category Tags Chips Input Component */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Tag className="w-3.5 h-3.5 text-blue-600 mr-0.5" />{" "}
                Sub-Category Tags Chips (Press Enter to Add)
              </Label>
              <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
                {subCategoryTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white text-slate-800 border-slate-200 text-xs font-semibold py-1 px-2.5 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  placeholder="Type tag (e.g. Ethnic Wear) & press Enter..."
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-transparent text-xs outline-none flex-1 min-w-[150px] font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Address with Pan-India Lookup */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-rose-600 mr-0.5" /> Full
                Operating Business Address
                <span className="text-rose-500 font-bold ml-0.5">*</span>
              </Label>
              <Textarea
                rows={2}
                placeholder="Shop No. 14, Lalpur Chowk, Main Road, Ranchi, Jharkhand – 834001"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="bg-white border-slate-200 text-xs rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-slate-800">
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
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <Label className="font-bold text-xs text-slate-800">
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
                  <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3 font-bold text-slate-800">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="z-[300]">
                    {INDIAN_CITIES.map((c) => (
                      <SelectItem key={`${c.city}-${c.state}`} value={c.city}>
                        {c.city} ({c.state})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-slate-800">
                  State (Auto-detected) *
                </Label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="bg-slate-50 border-slate-200 text-xs h-10 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              onClick={handleNext}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Next &gt;
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 2: CONTACT DETAILS & ACCOUNT SETUP */}
      {currentStep === 2 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#e85d04]" /> Section B: Contact
                Details &amp; Management Liaison
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Verification contact, real-time OTP &amp; login credentials
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 2 of 6
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-blue-600 mr-0.5" />{" "}
                  Authorized Liaison Name
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Rajan Kumar Singh"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Tag className="w-3.5 h-3.5 text-slate-600 mr-0.5" />{" "}
                  Designation Dropdown
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Select
                  value={formData.designation}
                  onValueChange={(val) =>
                    setFormData({ ...formData, designation: val })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent className="z-[300]">
                    {DESIGNATIONS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile with Real-time OTP Validation */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />{" "}
                    Primary Mobile Number
                    <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                      disabled={isMobileVerified}
                    />
                    {!isMobileVerified ? (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-3 rounded-xl cursor-pointer shrink-0"
                      >
                        {otpSent ? "Resend" : "Send OTP"}
                      </Button>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-0 font-bold text-xs px-3 flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />{" "}
                    WhatsApp Number
                  </Label>
                  <Input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* OTP Input Field */}
              {otpSent && !isMobileVerified && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <Input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP (e.g. 1234)"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-mono font-bold max-w-[200px]"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Verify OTP
                  </Button>
                </div>
              )}
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-blue-600 mr-0.5" /> Business
                  Email (Login ID)
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="info@marbella.in"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Lock className="w-3.5 h-3.5 text-slate-600 mr-0.5" /> Create
                  Password
                  <span className="text-rose-500 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Social Media &amp; Web Presence (Optional)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <Globe className="w-3 h-3 text-blue-600" /> Website URL
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://www.marbella.in"
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, websiteUrl: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <Camera className="w-3 h-3 text-pink-600" /> Instagram
                    Handle
                  </Label>
                  <Input
                    type="text"
                    placeholder="@marbellatiles"
                    value={formData.instagramHandle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instagramHandle: e.target.value,
                      })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <Globe className="w-3 h-3 text-blue-700" /> Facebook Page
                    URL
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://facebook.com/marbellatiles"
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, facebookUrl: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" /> Google
                    Business Profile Link
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://g.co/kgs/..."
                    value={formData.googleUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, googleUrl: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="text-slate-700 text-xs font-bold rounded-xl"
            >
              &lt; Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Next &gt;
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 3: BUSINESS VERIFICATION DOCUMENTS */}
      {currentStep === 3 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#e85d04]" /> Section C:
                Business Verification Documents
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Document proof for Verified Merchant Badge &amp; Storefront
                Media
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 3 of 6
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <FileCheck className="w-3.5 h-3.5 text-blue-600 mr-0.5" />{" "}
                Primary Identity Document Type
                <span className="text-rose-500 font-bold ml-0.5">*</span>
              </Label>
              <Select
                value={formData.docType}
                onValueChange={(val) =>
                  setFormData({ ...formData, docType: val })
                }
              >
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
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
                  <SelectItem value="Owner PAN Card">Owner PAN Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Upload className="w-3.5 h-3.5 text-orange-600 mr-0.5" />{" "}
                Document File URL / Image Link
              </Label>
              <Input
                type="text"
                placeholder="https://drive.google.com/... or file link"
                value={formData.docFileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, docFileUrl: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Upload className="w-3.5 h-3.5 text-blue-600 mr-0.5" /> Shop
                  Front Photo URL
                </Label>
                <Input
                  type="text"
                  placeholder="https://..."
                  value={formData.shopPhotoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, shopPhotoUrl: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Upload className="w-3.5 h-3.5 text-purple-600 mr-0.5" />{" "}
                  Store Logo URL
                  <span className="text-slate-400 font-normal text-[11px] ml-1">
                    (PNG format preferred)
                  </span>
                </Label>
                <Input
                  type="text"
                  placeholder="https://... (PNG/SVG transparent logo)"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="text-slate-700 text-xs font-bold rounded-xl"
            >
              &lt; Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Next &gt;
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 4: PLAN SELECTION & PRICING */}
      {currentStep === 4 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#e85d04]" /> Section D: Choose
                Your Merchant Plan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Select a subscription plan matching your scale (14-day free
                trial on paid plans)
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 4 of 6
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: "starter",
                name: "STARTER FREE",
                price: "₹0 / Free",
                stdPrice: "₹0 / Free",
                trial: "Free Forever",
                desc: "Up to 3 active listings, CPA performance commission applies from Day 1",
                badge: "Popular",
              },
              {
                id: "growth",
                name: "GROWTH PARTNER",
                price: "₹999/mo",
                stdPrice: "₹1,499/mo Standard",
                trial: "14-Day Free Trial",
                desc: "Up to 15 active listings, 4 campaigns/yr, 14-day free trial, founding rate locked for 6 mos",
                badge: "Founding Rate (-33%)",
              },
              {
                id: "pro",
                name: "PRO PARTNER",
                price: "₹2,999/mo",
                stdPrice: "₹3,999/mo Standard",
                trial: "14-Day Free Trial",
                desc: "Unlimited listings, 50 revivals/mo, push sends included, founding rate locked for 6 mos",
                badge: "Best Value (-25%)",
              },
              {
                id: "enterprise",
                name: "ENTERPRISE",
                price: "Custom Pricing",
                stdPrice: "Contact Sales",
                trial: "Custom SLA",
                desc: "Unlimited listings & campaigns + dedicated account manager & API access",
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
                      ? "border-[#e85d04] bg-orange-50/50 shadow-2xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-slate-900">
                      {plan.name}
                    </span>
                    <Badge className="text-[9px] bg-slate-100 text-slate-700 font-bold border-0">
                      {plan.badge}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-[#e85d04] block">
                      {plan.price}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium line-through">
                      {plan.stdPrice}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[9px] font-bold text-emerald-700 bg-emerald-50 mt-1"
                  >
                    🎁 {plan.trial}
                  </Badge>
                  <p className="text-[11px] text-slate-500 font-medium mt-1.5">
                    {plan.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <Label className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Tag className="w-3.5 h-3.5 text-blue-600 mr-0.5" /> Referral Code
              (Optional)
            </Label>
            <Input
              type="text"
              placeholder="e.g. FOUNDING100"
              value={formData.referralCode}
              onChange={(e) =>
                setFormData({ ...formData, referralCode: e.target.value })
              }
              className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(3)}
              className="text-slate-700 text-xs font-bold rounded-xl"
            >
              &lt; Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Next &gt;
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 5: COMMISSION & HOURS */}
      {currentStep === 5 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#e85d04]" /> Section E: Category
                Commission &amp; Business Hours
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Category-wise commission rates (Applies from Day 1) &amp; store
                opening timings
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 5 of 6
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Category Performance Commission Structure (Day 1 Applicable)
              </Label>
              <div className="text-[11px] text-slate-600 space-y-1.5">
                {COMMISSION_TABLE.map((c) => (
                  <div
                    key={c.category}
                    className="flex justify-between border-b border-slate-200/60 pb-1"
                  >
                    <span className="font-semibold">{c.category}:</span>
                    <span className="font-mono text-[#e85d04] font-bold">
                      {c.rate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-3.5 bg-orange-50/50 border border-orange-200 rounded-xl cursor-pointer">
              <Checkbox
                checked={formData.commissionAgreed}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, commissionAgreed: !!val })
                }
              />
              <span className="text-xs font-bold text-slate-900">
                I acknowledge and accept the Vouchiqo performance commission
                structure for my primary category (Applies from Day 1 across all
                plans).
              </span>
            </label>

            {/* Business Operating Hours Automation */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Store Operating Hours &amp; Working Days Automation
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Opening Time
                  </Label>
                  <Input
                    type="text"
                    placeholder="10:00 AM"
                    value={formData.openingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, openingTime: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Closing Time
                  </Label>
                  <Input
                    type="text"
                    placeholder="08:00 PM"
                    value={formData.closingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, closingTime: e.target.value })
                    }
                    className="bg-white border-slate-200 text-xs h-9 rounded-xl font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(4)}
              className="text-slate-700 text-xs font-bold rounded-xl"
            >
              &lt; Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
            >
              Next &gt;
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 6: DECLARATIONS & SUBMIT */}
      {currentStep === 6 && (
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#e85d04]" /> Section F:
                Declarations, Agreements &amp; Submission
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Final merchant commitments, policies &amp; digital signature
              </p>
            </div>
            <Badge className="bg-orange-100 text-[#e85d04] border-0 text-[10px] font-bold">
              Section 6 of 6
            </Badge>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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
                className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs cursor-pointer"
              >
                <Checkbox
                  checked={formData[c.key]}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, [c.key]: !!val })
                  }
                  className="mt-0.5"
                />
                <span className="font-semibold text-slate-800">{c.text}</span>
              </label>
            ))}

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
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
                <Label className="font-bold text-xs text-slate-800">
                  Authorised Signatory Full Name *
                </Label>
                <Input
                  type="text"
                  placeholder="Rajan Kumar Singh"
                  value={formData.signatoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, signatoryName: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-slate-800">
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
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono uppercase font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(5)}
              className="text-slate-700 text-xs font-bold rounded-xl"
            >
              &lt; Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#e85d04] hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-8 rounded-xl shadow-xs cursor-pointer"
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
  );
}
