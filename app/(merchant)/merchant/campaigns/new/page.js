"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Rocket,
  Sparkles,
  Tag,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardSkeleton from "@/components/shared/feedback/DashboardSkeleton";
import CampaignStepper from "../components/CampaignStepper";
import LiveCampaignPreview from "../components/LiveCampaignPreview";
import StepBasics from "../components/steps/StepBasics";
import StepListings from "../components/steps/StepListings";
import StepPromotion from "../components/steps/StepPromotion";
import StepReview from "../components/steps/StepReview";

const CAMPAIGN_TYPES = [
  {
    id: "flash",
    name: "Flash Sale",
    icon: Zap,
    badge: "2hrs – 48hrs",
    desc: "A deep discount for a very short window with a live countdown timer for maximum urgency.",
  },
  {
    id: "festival",
    name: "Festival Campaign",
    icon: Sparkles,
    badge: "3 – 7 days",
    desc: "Tied to Indian festivals (Diwali, Chhath, Holi, Navratri, Eid) with pre-launch teaser option.",
  },
  {
    id: "new-user",
    name: "New Customer Acquisition",
    icon: Target,
    badge: "3 – 14 days",
    desc: "Targets users who haven't visited your brand page before. Displays 'First-Time Offer' badge.",
  },
  {
    id: "seasonal",
    name: "Seasonal / Clearance",
    icon: Tag,
    badge: "7 – 21 days",
    desc: "Stock clearance or seasonal changes (Monsoon Sale, End-of-Summer, Back-to-School).",
  },
  {
    id: "loyalty",
    name: "Loyalty / Returning Customer",
    icon: Users,
    badge: "7 – 14 days",
    desc: "Targets users who previously redeemed your offers with a 'Welcome Back' alert.",
  },
  {
    id: "bundle",
    name: "Bundle / BOGO Campaign",
    icon: Trophy,
    badge: "3 – 14 days",
    desc: "Built around Buy 1 Get 1 Free, combo packages, or value-add free gifts.",
  },
  {
    id: "revival",
    name: "Revival Campaign",
    icon: Rocket,
    badge: "24 – 48hrs",
    desc: "Re-activates multiple expired offers at once ('Second Chance Sale') with a revival badge.",
  },
];

const OBJECTIVES = [
  "Maximize Sales",
  "Drive Traffic",
  "Collect Leads",
  "App Installs",
  "Brand Awareness",
];

const TARGET_AUDIENCES = [
  { id: "all", label: "All Vouchiqo Users" },
  { id: "new", label: "New Users" },
  { id: "category", label: "Category Interest" },
  { id: "city", label: "City-based" },
];

const WIZARD_STEPS = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Listings" },
  { number: 3, label: "Promotion" },
  { number: 4, label: "Review" },
];

export default function CreateNewCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [listingSearch, setListingSearch] = useState("");

  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "flash",
    festivalName: "Diwali Grand Festival",
    objective: "Maximize Sales",
    headline: "",
    subHeadline: "",
    description: "",
    bannerUrl: "",
    offerType: "Percentage Discount (% off)",
    discountValue: "",
    maxCap: "",
    minOrderValue: "",
    code: "",
    redemptionInstructions: "",
    termsAndConditions: "",
    couponIds: [],
    startDate: "",
    endDate: "",
    hasCountdownTimer: true,
    hasPreTeaser: false,
    preTeaserHeadline: "",
    featuredSlot: false,
    pushNotification: true,
    newsletterInclusion: false,
    socialSharing: true,
    pushSendTime: "",
    audience: "all",
    targetCity: "Ranchi",
    staffReady: "yes",
    stockConfirmation: "yes",
    internalNote: "",
    agreed1: false,
    agreed2: false,
    agreed3: false,
    agreed4: false,
    agreed5: false,
  });

  const { data: merchant, isLoading: loadingProfile } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    },
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ["merchant-coupons-for-campaign"],
    queryFn: async () => {
      if (!merchant) return [];
      const res = await fetch(`/api/coupons?limit=50`);
      if (!res.ok) return [];
      const json = await res.json();
      const list = json.data?.coupons || [];
      return list.filter(
        (c) =>
          c.merchantId?._id === merchant._id || c.merchantId === merchant._id,
      );
    },
    enabled: !!merchant,
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to submit campaign.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-campaigns"] });
      toast.success("Campaign submitted successfully for review!");
      router.push("/merchant/campaigns");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  if (loadingProfile) {
    return (
      <DashboardLayout title="Create Campaign" user={{ role: "merchant" }}>
        <DashboardSkeleton mode="dashboard" />
      </DashboardLayout>
    );
  }

  const isPro = merchant?.plan === "pro" || merchant?.plan === "enterprise";

  const toggleCouponAttachment = (couponId) => {
    setCampaignData((prev) => {
      const exists = prev.couponIds.includes(couponId);
      const updated = exists
        ? prev.couponIds.filter((id) => id !== couponId)
        : [...prev.couponIds, couponId];
      return { ...prev, couponIds: updated };
    });
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      c.code?.toLowerCase().includes(listingSearch.toLowerCase()),
  );

  const calculateAddOnTotal = () => {
    let total = 0;
    if (campaignData.featuredSlot) total += 999;
    if (campaignData.pushNotification && !isPro) total += 599;
    if (campaignData.newsletterInclusion && !isPro) total += 799;
    return total;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!campaignData.name.trim()) {
        toast.error("Please enter a Campaign Name");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!campaignData.code.trim()) {
        toast.error("Please enter a Promo Code for this campaign");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!campaignData.startDate || !campaignData.endDate) {
        toast.error("Please select Start and End Dates");
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleSubmitCampaign = () => {
    if (
      !campaignData.agreed1 ||
      !campaignData.agreed2 ||
      !campaignData.agreed3 ||
      !campaignData.agreed4 ||
      !campaignData.agreed5
    ) {
      toast.error("Please confirm all compliance checkmarks before submitting");
      return;
    }

    mutation.mutate({
      name: campaignData.name,
      type: campaignData.type,
      festivalName: campaignData.festivalName,
      objective: campaignData.objective,
      headline: campaignData.headline || campaignData.name,
      subHeadline: campaignData.subHeadline,
      description: campaignData.description,
      bannerUrl: campaignData.bannerUrl,
      offerDetails: {
        offerType: campaignData.offerType,
        discountValue: Number(campaignData.discountValue) || 0,
        maxCap: Number(campaignData.maxCap) || 0,
        minOrderValue: Number(campaignData.minOrderValue) || 0,
        code: campaignData.code,
        redemptionInstructions: campaignData.redemptionInstructions,
        termsAndConditions: campaignData.termsAndConditions,
      },
      timing: {
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        hasCountdownTimer: campaignData.hasCountdownTimer,
        hasPreTeaser: campaignData.hasPreTeaser,
        preTeaserHeadline: campaignData.preTeaserHeadline,
      },
      targeting: {
        audience: campaignData.audience,
        targetCity: campaignData.targetCity,
        addOns: [
          ...(campaignData.featuredSlot ? ["ticker_priority"] : []),
          ...(campaignData.pushNotification ? ["push"] : []),
          ...(campaignData.newsletterInclusion ? ["email"] : []),
        ],
        pushSendTime: campaignData.pushSendTime,
      },
      readiness: {
        staffReady: campaignData.staffReady,
        stockConfirmation: campaignData.stockConfirmation,
        internalNote: campaignData.internalNote,
        checkpointsConfirmed: true,
      },
      couponIds: campaignData.couponIds,
      status: "pending_review",
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
    });
  };

  return (
    <DashboardLayout
      title="Create New Campaign"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="flex flex-col gap-6 text-left font-sans w-full">
        <CampaignStepper
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onCancel={() => router.push("/merchant/campaigns")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            {currentStep === 1 && (
              <StepBasics
                campaignData={campaignData}
                setCampaignData={setCampaignData}
                campaignTypes={CAMPAIGN_TYPES}
                objectives={OBJECTIVES}
                onCancel={() => router.push("/merchant/campaigns")}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <StepListings
                campaignData={campaignData}
                setCampaignData={setCampaignData}
                filteredCoupons={filteredCoupons}
                listingSearch={listingSearch}
                setListingSearch={setListingSearch}
                toggleCouponAttachment={toggleCouponAttachment}
                onBack={() => setCurrentStep(1)}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <StepPromotion
                campaignData={campaignData}
                setCampaignData={setCampaignData}
                targetAudiences={TARGET_AUDIENCES}
                onBack={() => setCurrentStep(2)}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 4 && (
              <StepReview
                campaignData={campaignData}
                setCampaignData={setCampaignData}
                calculateAddOnTotal={calculateAddOnTotal}
                onSubmit={handleSubmitCampaign}
                isPending={mutation.isPending}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>

          <LiveCampaignPreview
            campaignData={campaignData}
            merchantName={merchant?.businessName}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
