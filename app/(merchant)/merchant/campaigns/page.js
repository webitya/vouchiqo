"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Rocket,
  Tag,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardSkeleton from "@/components/shared/feedback/DashboardSkeleton";
import DeleteConfirmDialog from "@/components/shared/modals/DeleteConfirmDialog";
import { showError, showSuccess } from "@/lib/toast";

import CampaignListGrid from "./components/CampaignListGrid";
import CampaignReportModal from "./components/CampaignReportModal";
import CampaignStepper from "./components/CampaignStepper";
import CampaignsHeader from "./components/CampaignsHeader";
import EditCampaignModal from "./components/EditCampaignModal";
import LiveCampaignPreview from "./components/LiveCampaignPreview";
import StepBasics from "./components/steps/StepBasics";
import StepListings from "./components/steps/StepListings";
import StepPromotion from "./components/steps/StepPromotion";
import StepReview from "./components/steps/StepReview";

const DEMO_CAMPAIGNS = [
  {
    _id: "demo-camp-1",
    name: "ffsf",
    type: "new-user",
    status: "pending_review",
    startDate: "2026-07-24",
    endDate: "2026-07-25",
    stats: { clicks: "12,840", redemptions: "1,820", revenue: "₹482K" },
  },
  {
    _id: "demo-camp-2",
    name: "tesing campaign",
    type: "festival",
    status: "pending_review",
    startDate: "2026-07-22",
    endDate: "2026-07-24",
    stats: { clicks: "12,840", redemptions: "1,820", revenue: "₹482K" },
  },
  {
    _id: "demo-camp-3",
    name: "fggg",
    type: "seasonal",
    status: "live",
    startDate: "2026-07-16",
    endDate: "2026-07-17",
    stats: { clicks: "12,840", redemptions: "1,820", revenue: "₹482K" },
  },
];

const CAMPAIGN_TYPES = [
  {
    id: "flash",
    name: "Flash Sale",
    icon: Zap,
    badge: "2hrs – 48hrs",
    desc: "Deep discount for a short window with live countdown timer.",
  },
  {
    id: "festival",
    name: "Festival Campaign",
    icon: Tag,
    badge: "3 – 7 days",
    desc: "Tied to Indian festivals with pre-launch teaser option.",
  },
  {
    id: "new-user",
    name: "New Customer Acquisition",
    icon: Target,
    badge: "3 – 14 days",
    desc: "Targets users who haven't visited your brand page before.",
  },
  {
    id: "seasonal",
    name: "Seasonal / Clearance",
    icon: Tag,
    badge: "7 – 21 days",
    desc: "Stock clearance or seasonal changes.",
  },
  {
    id: "loyalty",
    name: "Loyalty / Returning Customer",
    icon: Users,
    badge: "7 – 14 days",
    desc: "Targets users who previously redeemed your offers.",
  },
  {
    id: "bundle",
    name: "Bundle / BOGO Campaign",
    icon: Trophy,
    badge: "3 – 14 days",
    desc: "Built around Buy 1 Get 1 Free or combo packages.",
  },
  {
    id: "revival",
    name: "Revival Campaign",
    icon: Rocket,
    badge: "24 – 48hrs",
    desc: "Re-activates multiple expired offers at once.",
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

export default function MerchantCampaigns() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [listingSearch, setListingSearch] = useState("");

  // Modal States
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
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

  // Fetch merchant profile
  const { data: merchant, isLoading: loadingProfile } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch campaigns
  const { data: dbCampaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ["merchant-campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
  });

  // Display DB campaigns or fallback to demo list if DB is empty
  const displayCampaigns =
    dbCampaigns.length > 0 ? dbCampaigns : DEMO_CAMPAIGNS;

  // Fetch coupons for wizard
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
    enabled: !!merchant && isCreating,
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
      showSuccess("Campaign submitted for review successfully!");
      setIsCreating(false);
      setCurrentStep(1);
    },
    onError: (err) => {
      showError(err.message || "Something went wrong.");
    },
  });

  // Action Handlers
  const handleEditClick = (camp) => {
    setSelectedCampaign(camp);
    setEditModalOpen(true);
  };

  const handleReportClick = (camp) => {
    setSelectedCampaign(camp);
    setReportModalOpen(true);
  };

  const handleDeleteClick = (camp) => {
    setSelectedCampaign(camp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCampaign) return;
    try {
      setDeleting(true);
      if (selectedCampaign._id && !selectedCampaign._id.startsWith("demo-")) {
        await fetch(`/api/campaigns?id=${selectedCampaign._id}`, {
          method: "DELETE",
        });
        queryClient.invalidateQueries({ queryKey: ["merchant-campaigns"] });
      }
      showSuccess(`Campaign "${selectedCampaign.name}" deleted successfully!`);
      setDeleteModalOpen(false);
    } catch (err) {
      showError("Failed to delete campaign.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicateClick = async (camp) => {
    try {
      mutation.mutate({
        name: `${camp.name} (Copy)`,
        type: camp.type || "flash",
        objective: camp.objective || "Maximize Sales",
        headline: camp.headline || camp.name,
        status: "pending_review",
      });
      showSuccess(`Duplicated "${camp.name}"!`);
    } catch (err) {
      showError("Failed to duplicate campaign.");
    }
  };

  if (loadingProfile || loadingCampaigns) {
    return (
      <DashboardLayout title="Campaign Manager" user={{ role: "merchant" }}>
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
      if (!campaignData.name.trim())
        return toast.error("Please enter a Campaign Name");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!campaignData.code.trim())
        return toast.error("Please enter a Promo Code");
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!campaignData.startDate || !campaignData.endDate)
        return toast.error("Please select Start and End Dates");
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
      objective: campaignData.objective,
      headline: campaignData.headline || campaignData.name,
      subHeadline: campaignData.subHeadline,
      description: campaignData.description,
      status: "pending_review",
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
    });
  };

  return (
    <DashboardLayout
      title="Campaign Manager"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="flex flex-col gap-4 text-left font-sans w-full">
        {/* Top Header / Stepper Bar */}
        {!isCreating
          ? <CampaignsHeader
              campaignsCount={displayCampaigns.length}
              isPro={isPro}
              planName={merchant?.plan}
              onCreateClick={() => {
                setIsCreating(true);
                setCurrentStep(1);
              }}
            />
          : <CampaignStepper
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onCancel={() => setIsCreating(false)}
            />}

        {/* MAIN BODY CONTENT */}
        {!isCreating
          ? <div data-tour="campaigns-list">
              <CampaignListGrid
                campaigns={displayCampaigns}
                onCreateClick={() => {
                  setIsCreating(true);
                  setCurrentStep(1);
                }}
                onEdit={handleEditClick}
                onDuplicate={handleDuplicateClick}
                onReport={handleReportClick}
                onDelete={handleDeleteClick}
              />
            </div>
          : <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7 space-y-4">
                {currentStep === 1 && (
                  <StepBasics
                    campaignData={campaignData}
                    setCampaignData={setCampaignData}
                    campaignTypes={CAMPAIGN_TYPES}
                    objectives={OBJECTIVES}
                    onCancel={() => setIsCreating(false)}
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
            </div>}
      </div>

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        campaign={selectedCampaign}
        onSaveSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["merchant-campaigns"] });
        }}
      />

      {/* Campaign Analytics Report Modal */}
      <CampaignReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        campaign={selectedCampaign}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${selectedCampaign?.name}"? This action cannot be undone.`}
        isPending={deleting}
      />
    </DashboardLayout>
  );
}
