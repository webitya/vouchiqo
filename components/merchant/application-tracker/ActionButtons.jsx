"use client";

import { Mail, MessageCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showSuccess } from "@/lib/toast";

/**
 * ActionButtons — Action buttons bar matching website UI styling.
 */
export default function ActionButtons({
  onRefresh,
  onViewDetails,
  onOpenAdminModal,
  isLoading = false,
}) {
  const handleResendEmail = () => {
    showSuccess("Verification confirmation email resent to your inbox!");
  };

  const handleContactWhatsApp = () => {
    window.open(
      "https://wa.me/919876543210?text=Hi%20Vouchiqo%20Support%2C%20I%20am%20tracking%20my%20Merchant%20Application.",
      "_blank",
    );
  };

  return (
    <Card className="border-brand-border bg-brand-bg rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer shadow-none gap-1.5"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Track & Refresh Status
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer shadow-none"
        >
          View Submitted Details
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleResendEmail}
          className="text-xs font-bold text-brand-blue hover:text-blue-800 hover:bg-blue-50 rounded-xl cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 mr-1" /> Resend Confirmation Email
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleContactWhatsApp}
          className="text-xs font-bold text-emerald-700 bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80 rounded-xl cursor-pointer shadow-none gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" /> Contact Support
          (WhatsApp)
        </Button>

        {onOpenAdminModal && (
          <Button
            size="sm"
            onClick={onOpenAdminModal}
            className="text-xs font-bold bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl cursor-pointer shadow-none gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#e85d04]" /> Admin
            Simulator
          </Button>
        )}
      </div>
    </Card>
  );
}
