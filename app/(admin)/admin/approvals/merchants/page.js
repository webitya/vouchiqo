"use client";

import { Check, Eye, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/shared/data/DataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/toast";

import MerchantKycDialog from "./components/MerchantKycDialog";

export default function MerchantApprovals() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);

  const fetchPendingMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/merchants?status=pending");
      const json = await res.json();
      if ((json.success || json.status === "success") && json.data) {
        setMerchants(json.data.merchants || []);
      }
    } catch (err) {
      showError("Failed to load pending merchants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingMerchants();
  }, [fetchPendingMerchants]);

  const handleAction = async (merchantId, action) => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      const res = await fetch("/api/admin/merchants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, status }),
      });
      if (res.ok) {
        setMerchants((prev) => prev.filter((m) => m._id !== merchantId));
        setKycDialogOpen(false);
        showSuccess(
          action === "approve"
            ? "Merchant approved & activated!"
            : "Merchant application rejected.",
        );
      } else {
        const json = await res.json().catch(() => ({}));
        showError(json.message ?? "Action failed. Please try again.");
      }
    } catch (err) {
      showError("Network error. Please try again.");
    }
  };

  const handleOpenKyc = (merchant) => {
    setSelectedMerchant(merchant);
    setKycDialogOpen(true);
  };

  const columns = [
    {
      key: "businessName",
      header: "Brand Details",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">
            {row.businessName}
          </span>
          {row.website && (
            <a
              href={row.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-600 hover:underline font-semibold block"
            >
              {row.website.replace("https://", "").replace("http://", "")}
            </a>
          )}
        </div>
      ),
    },
    {
      key: "contactEmail",
      header: "Contact Info",
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">
            {row.contactEmail}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {row.contactPhone || "No Phone"}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Registered Location",
      cell: (row) => (
        <span className="font-medium text-slate-700">
          {row.location?.city
            ? `${row.location.city}, ${row.location.state}`
            : "Pan-India"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Submitted Date",
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN")
            : "Recent"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Moderation Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenKyc(row)}
            className="text-[10px] font-bold rounded-lg border-slate-200 shadow-none cursor-pointer h-8 px-2.5 gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" /> Audit KYC
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction(row._id, "approve")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer h-8 px-2.5 gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(row._id, "reject")}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 text-[10px] font-bold rounded-lg cursor-pointer h-8 px-2.5 gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Merchant Approvals"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Merchant Signup Review Queue
        </h2>

        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 text-left">
          <DataTable
            columns={columns}
            data={merchants}
            loading={loading}
            searchable={true}
            searchPlaceholder="Search pending merchants by name, email, city..."
            defaultPageSize={10}
            emptyState="No pending merchant applications in queue."
          />
        </Card>
      </div>

      <MerchantKycDialog
        open={kycDialogOpen}
        onOpenChange={setKycDialogOpen}
        merchant={selectedMerchant}
        onAction={handleAction}
      />
    </DashboardLayout>
  );
}
