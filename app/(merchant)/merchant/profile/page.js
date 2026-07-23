"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Shield,
  Store,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardSkeleton from "@/components/shared/feedback/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast";

import Step1Identity from "./components/Step1Identity";
import Step2Location from "./components/Step2Location";
import Step3KYC from "./components/Step3KYC";
import Step4Bank from "./components/Step4Bank";

const INITIAL_FORM = {
  businessName: "",
  slug: "",
  category: "food",
  description: "",
  contactEmail: "",
  address: "",
  pincode: "",
  city: "",
  state: "",
  country: "IN",
  contactPhone: "",
  constitution: "proprietorship",
  liaisonName: "",
  liaisonDesignation: "owner",
  liaisonPhone: "",
  gmapsLink: "",
  pan: "",
  gstin: "",
  isGstExempt: false,
  bankDetails: {
    holderName: "",
    accountType: "current",
    accountNumber: "",
    ifsc: "",
  },
  shopImage: "",
  logo: "",
  banner: "",
};

export default function MerchantBusinessProfile() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingShop, setUploadingShop] = useState(false);

  // Fetch current merchant profile
  const {
    data: merchant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) throw new Error("Failed to load profile");
      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (merchant) {
      setIsEditing(false);
      setFormData({
        businessName: merchant.businessName ?? "",
        slug: merchant.slug ?? "",
        category: merchant.category ?? "food",
        description: merchant.description ?? "",
        contactEmail: merchant.contactEmail ?? "",
        address: merchant.location?.address ?? "",
        pincode: merchant.location?.pincode ?? "",
        city: merchant.location?.city ?? "",
        state: merchant.location?.state ?? "",
        country: merchant.location?.country ?? "IN",
        contactPhone: merchant.contactPhone ?? "",
        constitution: merchant.constitution ?? "proprietorship",
        liaisonName: merchant.liaisonName ?? "",
        liaisonDesignation: merchant.liaisonDesignation ?? "owner",
        liaisonPhone: merchant.liaisonPhone ?? "",
        gmapsLink: merchant.gmapsLink ?? "",
        pan: merchant.pan ?? "",
        gstin: merchant.gstin ?? "",
        isGstExempt: merchant.isGstExempt ?? false,
        bankDetails: {
          holderName: merchant.bankDetails?.holderName ?? "",
          accountType: merchant.bankDetails?.accountType ?? "current",
          accountNumber: merchant.bankDetails?.accountNumber ?? "",
          ifsc: merchant.bankDetails?.ifsc ?? "",
        },
        shopImage: merchant.shopImage ?? "",
        logo: merchant.logo ?? "",
        banner: merchant.banner ?? "",
      });
    } else {
      setIsEditing(true);
    }
  }, [merchant]);

  const handleBusinessNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      businessName: val,
      slug: !merchant
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug,
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("folder", field);

    if (field === "logo") setUploadingLogo(true);
    if (field === "banner") setUploadingBanner(true);
    if (field === "shopImage") setUploadingShop(true);

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setFormData((prev) => ({ ...prev, [field]: json.data?.url }));
      showSuccess("Image uploaded successfully!");
    } catch (err) {
      showError(err.message || "Failed to upload file.");
    } finally {
      setUploadingLogo(false);
      setUploadingBanner(false);
      setUploadingShop(false);
    }
  };

  const validateStep = (currStep) => {
    if (currStep === 1) {
      if (!formData.businessName) return "Business name is required.";
      if (!formData.contactEmail) return "Contact email is required.";
    }
    if (currStep === 2) {
      if (!formData.address) return "Complete physical address is required.";
      if (!formData.city) return "Store city location is required.";
    }
    if (currStep === 3) {
      const panTrimmed = (formData.pan || "").trim().toUpperCase();
      if (!panTrimmed || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panTrimmed)) {
        return "Valid 10-character PAN is required (e.g. ABCDE1234F).";
      }
      if (!formData.isGstExempt && !formData.gstin) {
        return "GSTIN is required unless declared GST exempt.";
      }
    }
    if (currStep === 4) {
      if (!formData.bankDetails.holderName)
        return "Bank account holder name is required.";
      if (!formData.bankDetails.accountNumber)
        return "Account number is required.";
      if (!formData.bankDetails.ifsc) return "IFSC code is required.";
    }
    return null;
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
    const err = validateStep(step);
    if (err) return showError(err);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = (e) => {
    e?.preventDefault?.();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const url = merchant
        ? `/api/merchants/${merchant._id}`
        : "/api/merchants";
      const method = merchant ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message ?? "Failed to save profile");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
      showSuccess("Profile onboarding details submitted successfully!");
      setIsEditing(false);
    },
    onError: (err) => {
      showError(err.message ?? "Failed to save profile.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step !== 4) return;
    const err = validateStep(4);
    if (err) return showError(err);

    saveMutation.mutate({
      ...formData,
      pan: (formData.pan || "").trim().toUpperCase(),
      gstin: (formData.gstin || "").trim().toUpperCase(),
      location: {
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Business Profile" user={{ role: "merchant" }}>
        <DashboardSkeleton mode="settings" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Business Profile" user={{ role: "merchant" }}>
        <div className="text-center py-20 text-rose-600 font-semibold">
          Error loading profile. Please refresh the page.
        </div>
      </DashboardLayout>
    );
  }

  // Profile Status View
  if (!isEditing && merchant) {
    const statusMap = {
      pending: {
        icon: Clock,
        title: "Application Under Review",
        color: "amber",
        text: "Your profile is under review by our admin team.",
      },
      approved: {
        icon: CheckCircle2,
        title: "Account Verified & Active",
        color: "emerald",
        text: "Your account is fully verified. Start creating offers!",
      },
      rejected: {
        icon: X,
        title: "Application Rejected",
        color: "rose",
        text:
          merchant.rejectionReason ||
          "Please correct your details and resubmit.",
      },
    };

    const status = statusMap[merchant.status] || statusMap.pending;
    const StatusIcon = status.icon;

    return (
      <DashboardLayout
        title="Business Profile Onboarding"
        user={{ name: merchant.businessName, role: "merchant" }}
      >
        <div
          data-tour="profile-kyc"
          className="max-w-2xl mx-auto mt-8 text-left font-sans"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border bg-${status.color}-50 text-${status.color}-600 border-${status.color}-200`}
            >
              <StatusIcon className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-black text-slate-800 uppercase tracking-wide">
                {status.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {status.text}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-none"
              >
                Modify Profile Details
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const steps = [
    { number: 1, label: "Identity", icon: Store },
    { number: 2, label: "Location", icon: MapPin },
    { number: 3, label: "KYC Details", icon: Shield },
    { number: 4, label: "Bank Account", icon: CreditCard },
  ];

  return (
    <DashboardLayout
      title="Business Profile Onboarding"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="flex flex-col gap-6 text-left font-sans w-full">
        {/* Stepper Header */}
        <div className="w-full flex flex-col gap-3 py-1">
          {merchant && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Cancel Edit
              </button>
            </div>
          )}

          <div className="flex items-center w-full gap-3 sm:gap-6 pt-1">
            {steps.map((s, idx) => {
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              const isLast = idx === 3;
              const Icon = s.icon;
              return (
                <div
                  key={s.number}
                  className={`flex items-center gap-3 ${!isLast ? "flex-1" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (s.number < step) setStep(s.number);
                    }}
                    className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${isActive ? "text-slate-900" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${isActive ? "bg-[#e85d04] text-white" : isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}
                    >
                      {isCompleted
                        ? <Check className="w-4 h-4 stroke-[3]" />
                        : <Icon className="w-3.5 h-3.5" />}
                    </span>
                    <span>{s.label}</span>
                  </button>
                  {!isLast && (
                    <div
                      className={`h-0.5 flex-1 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <Step1Identity
              formData={formData}
              setFormData={setFormData}
              handleBusinessNameChange={handleBusinessNameChange}
            />
          )}
          {step === 2 && (
            <Step2Location
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              uploadingShop={uploadingShop}
              uploadingLogo={uploadingLogo}
              uploadingBanner={uploadingBanner}
            />
          )}
          {step === 3 && (
            <Step3KYC formData={formData} setFormData={setFormData} />
          )}
          {step === 4 && (
            <Step4Bank formData={formData} setFormData={setFormData} />
          )}

          {/* Action Controls */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="text-slate-700 border-slate-200 hover:bg-slate-50 text-xs h-10 px-5 flex items-center gap-1.5 font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </Button>

            {step < 4
              ? <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#e85d04] hover:bg-orange-600 text-white text-xs h-10 px-6 flex items-center gap-1.5 font-bold rounded-xl cursor-pointer border-0 ml-auto"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              : <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 px-8 flex items-center gap-2 font-bold rounded-xl cursor-pointer border-0 ml-auto"
                >
                  {saveMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>
                    {saveMutation.isPending
                      ? "Submitting..."
                      : "Submit Registration"}
                  </span>
                </Button>}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
