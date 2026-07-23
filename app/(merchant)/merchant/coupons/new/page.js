"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  FileText,
  ShieldCheck,
  Tag,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import LivePreviewCard from "./components/LivePreviewCard";
import SectionBasic from "./components/SectionBasic";
import SectionDiscount from "./components/SectionDiscount";
import SectionTerms from "./components/SectionTerms";
import SectionType from "./components/SectionType";
import SectionValidity from "./components/SectionValidity";

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

const SECTIONS = [
  { number: 1, key: "A", name: "Offer Type", icon: Tag },
  { number: 2, key: "B", name: "Basic Details", icon: FileText },
  { number: 3, key: "C", name: "Discount & Code", icon: Ticket },
  { number: 4, key: "D", name: "Validity & Limits", icon: CalendarIcon },
  { number: 5, key: "E", name: "Terms & Submit", icon: ShieldCheck },
];

export default function CreateCoupon() {
  const queryClient = useQueryClient();
  const track = useTrackEvent();
  const [activeSection, setActiveSection] = useState("A");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    offerType: "code",
    headline: "",
    shortDescription: "",
    category: "home-improvement",
    image: "",
    code: "",
    discountType: "% Off",
    discountValue: "",
    maxCap: "",
    minOrderValue: "",
    dealUrl: "",
    originalPrice: "",
    salePrice: "",
    specialOfferType: "BOGO (Buy 1 Get 1)",
    offerDetails: "",
    redemptionMethod: "Show Vouchiqo Smart Code at counter",
    startDate: "",
    endDate: "",
    usageLimit: "",
    perCustomerLimit: "1",
    targetAudience: "All Customers (Default)",
    geographicRestriction: "Ranchi only — in-store at my listed address",
    validDays: [],
    validHours: "",
    termsAndConditions: "",
    combinability: "No — cannot be combined with any other offer",
    honouredAllDays: "Yes — every day during the validity period",
    internalNote: "",
    agreed1: false,
    agreed2: false,
    agreed3: false,
    agreed4: false,
  });

  const { data: merchant } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "SAVE";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
    track("unique_code_gen", { source: "merchant_dashboard" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("folder", "coupons");

    setUploadingImage(true);
    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const imageUrl = json.data?.url;

      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Offer image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.validDays.includes(day);
      const updated = exists
        ? prev.validDays.filter((d) => d !== day)
        : [...prev.validDays, day];
      return { ...prev, validDays: updated };
    });
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to submit offer.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-coupons"] });
      toast.success("Offer submitted for verification! 4-hour SLA active.");
      window.location.href = "/merchant/coupons";
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  const handleSubmitOffer = () => {
    if (!formData.headline) {
      toast.error("Offer Headline is required");
      setActiveSection("B");
      return;
    }
    if (!formData.shortDescription) {
      toast.error("Short Description is required");
      setActiveSection("B");
      return;
    }

    if (formData.offerType === "code") {
      if (!formData.code) {
        toast.error("Offer Code is required");
        setActiveSection("C");
        return;
      }
      if (
        !formData.discountValue &&
        formData.discountType !== "Free Shipping"
      ) {
        toast.error("Discount Value is required");
        setActiveSection("C");
        return;
      }
    } else if (formData.offerType === "deal") {
      if (!formData.dealUrl) {
        toast.error("Direct Deal URL is required");
        setActiveSection("C");
        return;
      }
    } else if (formData.offerType === "special") {
      if (!formData.offerDetails) {
        toast.error("Offer Details text is required");
        setActiveSection("C");
        return;
      }
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start Date and End Date are required");
      setActiveSection("D");
      return;
    }

    if (!formData.termsAndConditions) {
      toast.error("Terms & Conditions are required");
      setActiveSection("E");
      return;
    }

    if (
      !formData.agreed1 ||
      !formData.agreed2 ||
      !formData.agreed3 ||
      !formData.agreed4
    ) {
      toast.error(
        "Please confirm all 4 mandatory checkboxes before submitting",
      );
      setActiveSection("E");
      return;
    }

    let backendDiscountType = "percentage";
    if (formData.offerType === "code") {
      if (formData.discountType.includes("Flat")) backendDiscountType = "fixed";
      else if (formData.discountType.includes("Free"))
        backendDiscountType = "freebie";
    } else if (formData.offerType === "special") {
      backendDiscountType = "freebie";
    }

    const payload = {
      title: formData.headline,
      description: formData.shortDescription,
      code: formData.code || "DEALOFFER",
      discountType: backendDiscountType,
      discountValue: Number(formData.discountValue) || 0,
      originalPrice: Number(formData.originalPrice) || undefined,
      salePrice: Number(formData.salePrice) || undefined,
      category: formData.category,
      image: formData.image,
      expiresAt: new Date(formData.endDate).toISOString(),
      maxClaims: Number(formData.usageLimit) || undefined,
      offerType: formData.offerType,
      headline: formData.headline,
      shortDescription: formData.shortDescription,
      maxCap: Number(formData.maxCap) || undefined,
      minOrderValue: Number(formData.minOrderValue) || undefined,
      dealUrl: formData.dealUrl,
      specialOfferType: formData.specialOfferType,
      offerDetails: formData.offerDetails,
      redemptionMethod: formData.redemptionMethod,
      startDate: formData.startDate,
      endDate: formData.endDate,
      perCustomerLimit: formData.perCustomerLimit,
      targetAudience: formData.targetAudience,
      geographicRestriction: formData.geographicRestriction,
      validDays: formData.validDays,
      validHours: formData.validHours,
      termsAndConditions: formData.termsAndConditions,
      combinability: formData.combinability,
      honouredAllDays: formData.honouredAllDays,
      internalNote: formData.internalNote,
      status: "active",
      location: {
        city: merchant?.address?.city || "Ranchi",
        state: merchant?.address?.state || "Jharkhand",
        isOnline: formData.geographicRestriction.includes("All India"),
      },
    };

    mutation.mutate(payload);
  };

  const currentSectionObj =
    SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];
  const selectedCategoryLabel =
    CATEGORIES.find((c) => c.id === formData.category)?.label ||
    "Home Improvement";

  return (
    <DashboardLayout
      title="Create New Offer"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="flex flex-col gap-4 text-left font-sans w-full">
        {/* STEPPER BAR */}
        <div className="w-full flex items-center gap-3 py-1 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs overflow-x-auto">
          <Button
            variant="ghost"
            asChild
            className="p-1 h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer shrink-0"
          >
            <Link href="/merchant/coupons">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-4">
            {SECTIONS.map((sec, idx) => {
              const isActive = activeSection === sec.key;
              const isPast = currentSectionObj.number > sec.number;
              const isLast = idx === SECTIONS.length - 1;
              return (
                <div
                  key={sec.key}
                  className={`flex items-center gap-2 ${!isLast ? "flex-1" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSection(sec.key)}
                    className={`flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "text-slate-900 font-extrabold"
                        : isPast
                          ? "text-emerald-600 font-bold"
                          : "text-slate-400 font-medium"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-2xs"
                          : isPast
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200/80 text-slate-500"
                      }`}
                    >
                      {isPast
                        ? <Check className="w-3 h-3 stroke-[3]" />
                        : sec.number}
                    </span>
                    <span className="hidden sm:inline whitespace-nowrap">
                      Section {sec.number}: {sec.name}
                    </span>
                    <span className="sm:hidden whitespace-nowrap">
                      S{sec.number}
                    </span>
                  </button>
                  {!isLast && (
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-colors min-w-[12px] ${isPast ? "bg-emerald-500" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 space-y-4">
            {activeSection === "A" && (
              <SectionType
                formData={formData}
                setFormData={setFormData}
                onNext={() => setActiveSection("B")}
              />
            )}
            {activeSection === "B" && (
              <SectionBasic
                formData={formData}
                setFormData={setFormData}
                uploadingImage={uploadingImage}
                handleImageUpload={handleImageUpload}
                onBack={() => setActiveSection("A")}
                onNext={() => setActiveSection("C")}
              />
            )}
            {activeSection === "C" && (
              <SectionDiscount
                formData={formData}
                setFormData={setFormData}
                generateRandomCode={generateRandomCode}
                onBack={() => setActiveSection("B")}
                onNext={() => setActiveSection("D")}
              />
            )}
            {activeSection === "D" && (
              <SectionValidity
                formData={formData}
                setFormData={setFormData}
                toggleDay={toggleDay}
                onBack={() => setActiveSection("C")}
                onNext={() => setActiveSection("E")}
              />
            )}
            {activeSection === "E" && (
              <SectionTerms
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmitOffer}
                isPending={mutation.isPending}
                onBack={() => setActiveSection("D")}
              />
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-3">
            <LivePreviewCard
              formData={formData}
              merchant={merchant}
              selectedCategoryLabel={selectedCategoryLabel}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
