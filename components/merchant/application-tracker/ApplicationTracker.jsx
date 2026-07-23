"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DashboardSkeleton from "@/components/shared/feedback/DashboardSkeleton";
import ErrorState from "@/components/shared/feedback/ErrorState";
import { showSuccess } from "@/lib/toast";
import ActionButtons from "./ActionButtons";
import AdminIndicator from "./AdminIndicator";
import AdminReviewModal from "./AdminReviewModal";
import ApplicationSummary from "./ApplicationSummary";
import DocumentStatus from "./DocumentStatus";
import ProgressBar from "./ProgressBar";
import ProgressSteps from "./ProgressSteps";
import StatusCard from "./StatusCard";
import SuccessHero from "./SuccessHero";
import Timeline from "./Timeline";

/**
 * ApplicationTracker — Main merchant application tracking container component.
 * Features real-time React Query polling (30s interval), progress pipeline,
 * document verification list, activity log and admin review simulator.
 */
export default function ApplicationTracker({ initialData }) {
  const queryClient = useQueryClient();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Real-time React Query status polling every 30 seconds
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["merchant-application-status"],
    queryFn: async () => {
      const res = await fetch("/api/merchant/application/status");
      if (!res.ok) throw new Error("Failed to fetch application status");
      const json = await res.json();
      return json.data;
    },
    initialData: initialData,
    refetchInterval: 30000, // Real-time 30-second polling
    refetchOnWindowFocus: true,
  });

  const handleRefresh = async () => {
    await refetch();
    showSuccess("Application status refreshed in real-time!");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <ErrorState
          title="Could not load application status"
          description="We encountered an issue checking your submission status."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const {
    applicationId = "VQ-2026-89421",
    businessName = "Marbella Tiles & Sanitaryware",
    status = "under_review",
    progressPercentage = 66,
    adminIsReviewing = true,
    adminReviewerName = "Vouchiqo Verification Desk #4",
    estimatedCompletion = "Within 2-4 hours",
    submittedAt,
    lastUpdatedAt,
    documents = [],
    timeline = [],
  } = data;

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-left font-sans pb-8">
      {/* 1. Hero Banner */}
      <SuccessHero
        applicationId={applicationId}
        estimatedCompletion={estimatedCompletion}
        businessName={businessName}
      />

      {/* 2. Live Admin Indicator */}
      <AdminIndicator
        isReviewing={adminIsReviewing && status === "under_review"}
        reviewerName={adminReviewerName}
        lastUpdated={lastUpdatedAt}
      />

      {/* 3. Progress Bar */}
      <ProgressBar percentage={progressPercentage} status={status} />

      {/* 4. Progress Stepper Pipeline (3 Steps) */}
      <ProgressSteps status={status} submittedAt={submittedAt} />

      {/* 5. Application Status Card & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          {/* Main Status Summary Card */}
          <StatusCard
            application={data}
            onViewDetails={() => setSummaryModalOpen(true)}
            onContactSupport={() => {
              window.open(
                "https://wa.me/919876543210?text=Hi%20Vouchiqo%20Support%2C%20I%20am%20tracking%20my%20Merchant%20Application.",
                "_blank",
              );
            }}
          />

          {/* Verification Document Status List */}
          <DocumentStatus documents={documents} />

          {/* Action Buttons Toolbar */}
          <ActionButtons
            onRefresh={handleRefresh}
            onViewDetails={() => setSummaryModalOpen(true)}
            onOpenAdminModal={() => setAdminModalOpen(true)}
            isLoading={isRefetching}
          />
        </div>

        {/* Right Side: Timeline Log */}
        <div className="lg:col-span-4">
          <Timeline events={timeline} />
        </div>
      </div>

      {/* Submitted Details Modal */}
      <ApplicationSummary
        open={summaryModalOpen}
        onOpenChange={setSummaryModalOpen}
        application={data}
      />

      {/* Admin Simulator Modal */}
      <AdminReviewModal
        open={adminModalOpen}
        onOpenChange={setAdminModalOpen}
        applicationId={applicationId}
        onStatusUpdated={() => {
          queryClient.invalidateQueries({
            queryKey: ["merchant-application-status"],
          });
        }}
      />
    </div>
  );
}
