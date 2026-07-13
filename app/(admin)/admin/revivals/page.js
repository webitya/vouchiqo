"use client";

import { Check, RefreshCw, X, Forward, Mail, Eye, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmptyState from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  adminFetchMerchantRevivals, 
  adminFetchCustomerRevivals, 
  adminReviewMerchantRevival, 
  adminReviewCustomerRevival 
} from "@/lib/api-helpers";

export default function RevivalManagement() {
  const [activeTab, setActiveTab] = useState("merchant"); // "merchant" | "customer"
  const [merchantRequests, setMerchantRequests] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOutreachReq, setSelectedOutreachReq] = useState(null);
  const [outreachMessage, setOutreachMessage] = useState("");

  const [selectedDeclineReq, setSelectedDeclineReq] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState(null);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const fetchAlternatives = async (req) => {
    setLoadingAlternatives(true);
    try {
      const res = await fetch(`/api/revivals/customer/alternatives?category=${encodeURIComponent(req.category)}&city=${encodeURIComponent(req.city)}&brandName=${encodeURIComponent(req.brandName)}&discountType=${encodeURIComponent(req.discountType)}&discountValue=${req.discountValue || 0}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setAlternatives(json.alternatives);
        }
      }
    } catch (err) {
      console.error("Error fetching alternatives:", err);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const handleCustomerDeclineSubmit = async () => {
    if (!selectedDeclineReq) return;
    if (declineReason.trim().length < 10) {
      alert("A decline reason of at least 10 characters is required.");
      return;
    }

    try {
      const status = "declined";
      await adminReviewCustomerRevival(selectedDeclineReq._id, status, {
        declineReason: declineReason.trim(),
        alternativeOfferId: selectedAlternativeId,
      });

      setCustomerRequests((prev) =>
        prev.map((r) => (r._id === selectedDeclineReq._id ? { ...r, status, declineReason, adminAlternativeOffers: selectedAlternativeId ? [selectedAlternativeId] : [] } : r))
      );

      setSelectedDeclineReq(null);
      setDeclineReason("");
      setAlternatives([]);
      setSelectedAlternativeId(null);
    } catch (err) {
      console.error("Error declining customer revival request:", err);
      alert("Failed to decline customer revival request.");
    }
  };

  const openOutreachModal = (req) => {
    setSelectedOutreachReq(req);
    const votes = req.votes || 1;
    const isCategoryB = req.routingCategory === "B";
    const msg = isCategoryB
      ? `Hi ${req.brandName}, we noticed your customers on Vouchiqo are trying to revive your expired offer '${req.description || "discount"}'. We have received ${votes} request(s) from buyers in ${req.city || "Ranchi"}. Would you like to reactivate your Starter listing and capture this ready-to-buy audience?`
      : `Hi ${req.brandName} team, we are Vouchiqo, Ranchi's #1 verified offers platform. Your customers have submitted ${votes} request(s) to revive your offer '${req.description || "discount"}' in ${req.city || "Ranchi"}. Let's get your business listed on Vouchiqo to claim these customers!`;
    setOutreachMessage(msg);
  };

  const fetchMerchantRequests = async () => {
    try {
      const data = await adminFetchMerchantRevivals();
      setMerchantRequests(data);
    } catch (err) {
      console.error("Error fetching merchant revivals:", err);
    }
  };

  const fetchCustomerRequests = async () => {
    try {
      const data = await adminFetchCustomerRevivals();
      setCustomerRequests(data);
    } catch (err) {
      console.error("Error fetching customer revivals:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMerchantRequests(), fetchCustomerRequests()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMerchantAction = async (revivalId, action) => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      await adminReviewMerchantRevival(revivalId, status);
      setMerchantRequests((prev) => prev.filter((r) => r._id !== revivalId));
    } catch (err) {
      console.error("Error reviewing merchant revival request:", err);
      alert("Failed to review merchant revival request.");
    }
  };

  const handleCustomerAction = async (revivalId, status) => {
    try {
      await adminReviewCustomerRevival(revivalId, status);
      setCustomerRequests((prev) =>
        prev.map((r) => (r._id === revivalId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error reviewing customer revival request:", err);
      alert("Failed to update customer revival request status.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "code_regenerated":
        return <Badge className="bg-brand-success/10 text-brand-success border-0 rounded-full font-bold text-[10px] px-2 py-0.5 shadow-none">Regenerated</Badge>;
      case "alternative_provided":
        return <Badge className="bg-[#3E80DD]/10 text-[#3E80DD] border-0 rounded-full font-bold text-[10px] px-2 py-0.5 shadow-none">Alternative Provided</Badge>;
      case "contacted":
        return <Badge className="bg-brand-blue/10 text-brand-blue border-0 rounded-full font-bold text-[10px] px-2 py-0.5 shadow-none">Contacted</Badge>;
      case "declined":
        return <Badge className="bg-brand-error/10 text-brand-error border-0 rounded-full font-bold text-[10px] px-2 py-0.5 shadow-none">Declined</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border-0 rounded-full font-bold text-[10px] px-2 py-0.5 shadow-none">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Revival Requests"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="flex flex-col gap-5">
        
        {/* Tab switcher */}
        <div className="flex border-b border-brand-border pb-px gap-4">
          <button
            onClick={() => setActiveTab("merchant")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-transparent border-0 border-b-2 px-1 ${
              activeTab === "merchant"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-brand-subtext hover:text-brand-text"
            }`}
          >
            Merchant Extensions ({merchantRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-transparent border-0 border-b-2 px-1 ${
              activeTab === "customer"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-brand-subtext hover:text-brand-text"
            }`}
          >
            Customer Requests ({customerRequests.length})
          </button>
        </div>

        {loading ? (
          <div className="bg-brand-bg border border-brand-border rounded-xl p-8 text-center text-brand-subtext font-semibold shadow-sm">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-blue" />
            <span>Loading revival queues...</span>
          </div>
        ) : activeTab === "merchant" ? (
          // MERCHANT EXTENSIONS TAB
          merchantRequests.length > 0 ? (
            <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto flex-1">
                <Table className="w-full text-xs">
                  <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                    <TableRow className="hover:bg-transparent border-b border-brand-border">
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Merchant / Brand
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Expired Coupon
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Requested Expiry
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Reason For Revival
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                    {merchantRequests.map((req) => (
                      <TableRow
                        key={req._id}
                        className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                      >
                        <TableCell className="p-4 font-bold text-brand-navy h-auto">
                          {req.merchantId?.businessName || "Unknown Merchant"}
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold">{req.couponId?.title || "Unknown Coupon"}</div>
                          <div className="text-[10px] text-brand-subtext mt-0.5">
                            Code: <code className="bg-brand-surface px-1.5 py-0.5 rounded">{req.couponId?.code || "—"}</code>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          {req.newExpiresAt ? new Date(req.newExpiresAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="p-4 text-brand-subtext">
                          {req.reason || "No reason provided"}
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="icon"
                              onClick={() => handleMerchantAction(req._id, "approve")}
                              className="bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                              title="Approve & Revive Coupon"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              onClick={() => handleMerchantAction(req._id, "reject")}
                              className="bg-brand-error/15 text-brand-error hover:bg-brand-error hover:text-white border-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                              title="Reject Request"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={RefreshCw}
              title="No pending merchant extensions"
              description="All merchant-submitted coupon extension requests have been processed."
            />
          )
        ) : (
          // CUSTOMER REVIVALS TAB
          customerRequests.length > 0 ? (
            <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto flex-1">
                <Table className="w-full text-xs">
                  <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
                    <TableRow className="hover:bg-transparent border-b border-brand-border">
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Brand / Store Name
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Expired Code
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Customer Submitter
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-center h-auto">
                        Votes
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                        Status
                      </TableHead>
                      <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                        Moderation Controls
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
                    {customerRequests.map((req) => (
                      <TableRow
                        key={req._id}
                        className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                      >
                        <TableCell className="p-4 font-bold text-brand-navy h-auto">
                          {req.brandName}
                        </TableCell>
                        <TableCell className="p-4 text-brand-blue font-bold">
                          {req.code}
                        </TableCell>
                        <TableCell className="p-4 text-brand-subtext">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-brand-subtext" />
                            {req.email}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-center h-auto">
                          <span className="bg-brand-surface border border-brand-border/40 rounded px-2 py-0.5 font-bold">
                            {req.votes || 1}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          {getStatusBadge(req.status)}
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {req.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleCustomerAction(req._id, "contacted")}
                                className="bg-brand-blue/15 text-brand-blue hover:bg-brand-blue hover:text-white border-0 py-1 px-2.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer h-7"
                                title="Forward/Notify Brand"
                              >
                                <Forward className="w-3.5 h-3.5" />
                                <span>Contact Brand</span>
                              </Button>
                            )}
                            
                            {req.status !== "code_regenerated" && (
                              <Button
                                size="icon"
                                onClick={() => handleCustomerAction(req._id, "code_regenerated")}
                                className="bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white border-0 w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                                title="Mark as Regenerated"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {req.status !== "alternative_provided" && (
                              <Button
                                size="icon"
                                onClick={() => handleCustomerAction(req._id, "alternative_provided")}
                                className="bg-[#3E80DD]/15 text-[#3E80DD] hover:bg-[#3E80DD] hover:text-white border-0 w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                                title="Provide Alternative Offer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {req.status !== "declined" && (
                              <Button
                                size="icon"
                                onClick={() => {
                                  setSelectedDeclineReq(req);
                                  fetchAlternatives(req);
                                }}
                                className="bg-brand-error/15 text-brand-error hover:bg-brand-error hover:text-white border-0 w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                                title="Decline Request"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {(req.routingCategory === "B" || req.routingCategory === "C") && (
                              <Button
                                size="icon"
                                onClick={() => openOutreachModal(req)}
                                className="bg-purple-500/15 text-purple-600 hover:bg-purple-600 hover:text-white border-0 w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-none"
                                title="Generate Win-Back Outreach"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={RefreshCw}
              title="No customer revival requests"
              description="No user restoration requests found in the database."
            />
          )
        )}
      </div>

      {selectedOutreachReq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-heading text-sm font-black text-slate-800 uppercase tracking-wider">
                Generate Win-Back Outreach
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOutreachReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1 border-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div>
                  <span className="text-slate-400 font-bold block">Business Contact Email:</span>
                  <span className="font-bold text-slate-700">{selectedOutreachReq.email}</span>
                </div>
                {selectedOutreachReq.mobile && (
                  <div>
                    <span className="text-slate-400 font-bold block">WhatsApp Mobile:</span>
                    <span className="font-bold text-slate-700">{selectedOutreachReq.mobile}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 font-bold block">Request Description:</span>
                  <span className="font-medium text-slate-600">{selectedOutreachReq.description}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Outreach Message
                </label>
                <Textarea
                  value={outreachMessage}
                  onChange={(e) => setOutreachMessage(e.target.value)}
                  rows={6}
                  className="bg-white text-xs border-slate-200 focus-visible:ring-brand-blue min-h-24 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedOutreachReq.mobile && (
                <Button
                  size="sm"
                  onClick={() => {
                    const cleanedMobile = selectedOutreachReq.mobile.replace(/\D/g, "");
                    const number = cleanedMobile.startsWith("91") ? cleanedMobile : `91${cleanedMobile}`;
                    window.open(`https://wa.me/${number}?text=${encodeURIComponent(outreachMessage)}`, "_blank");
                  }}
                  className="bg-brand-success hover:bg-brand-success/90 text-white text-xs font-bold px-4 py-2 border-0 h-auto cursor-pointer"
                >
                  Send via WhatsApp
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => {
                  window.open(`mailto:${selectedOutreachReq.email}?subject=Vouchiqo%20Revival%20Request&body=${encodeURIComponent(outreachMessage)}`, "_blank");
                }}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold px-4 py-2 border-0 h-auto cursor-pointer"
              >
                Send via Email
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedDeclineReq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-heading text-sm font-black text-slate-800 uppercase tracking-wider">
                Decline & Suggest Alternative Offer
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDeclineReq(null);
                  setDeclineReason("");
                  setAlternatives([]);
                  setSelectedAlternativeId(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 border-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Mandatory Reason */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Decline Reason (Min 10 characters) *
                </label>
                <Input
                  placeholder="e.g. Coupon is expired and brand refuses to regenerate terms."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="bg-white text-xs border-slate-200 focus-visible:ring-brand-blue h-9 w-full"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Suggested Alternative Active Offers (Select One)
                </label>
                
                {loadingAlternatives ? (
                  <div className="text-center py-4 text-slate-400 animate-pulse">Loading alternatives...</div>
                ) : alternatives.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {alternatives.map((alt) => (
                      <label
                        key={alt._id}
                        className={`flex justify-between items-start p-2.5 border rounded-lg cursor-pointer transition-colors ${
                          selectedAlternativeId === alt._id
                            ? "border-brand-blue bg-brand-blue/5"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            name="selectedAlternative"
                            value={alt._id}
                            checked={selectedAlternativeId === alt._id}
                            onChange={() => setSelectedAlternativeId(alt._id)}
                            className="mt-0.5 text-brand-blue focus:ring-brand-blue"
                          />
                          <div>
                            <span className="font-bold text-slate-700 block">{alt.brandName} - {alt.title}</span>
                            <span className="text-[10px] text-brand-success font-semibold">
                              Code: {alt.code} | {alt.city}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 font-semibold">
                    No alternatives available
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDeclineReq(null);
                  setDeclineReason("");
                  setAlternatives([]);
                  setSelectedAlternativeId(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 border-0 h-auto cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={declineReason.trim().length < 10}
                onClick={handleCustomerDeclineSubmit}
                className="bg-brand-error hover:bg-brand-error/90 text-white text-xs font-bold px-4 py-2 border-0 h-auto cursor-pointer disabled:opacity-50"
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
