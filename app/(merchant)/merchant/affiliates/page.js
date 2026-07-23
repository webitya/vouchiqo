"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Globe,
  Layers,
  Percent,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MerchantAffiliates() {
  const [isEditPayoutOpen, setIsEditPayoutOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "Marbella Sanitaryware Pvt Ltd",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50100234891234",
    ifscCode: "HDFC0000241",
    accountType: "Current Account",
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

  const earningsData = [
    {
      id: "EARN-1082",
      date: "2026-07-20",
      item: "20% OFF Mega Festive Sale",
      type: "CPA (Cost Per Action)",
      quantity: 14,
      rate: "5.0%",
      earnings: 1400,
      status: "Approved",
    },
    {
      id: "EARN-1081",
      date: "2026-07-18",
      item: "Flat ₹500 Cashback Dining",
      type: "CPA (Cost Per Action)",
      quantity: 8,
      rate: "3.5%",
      earnings: 840,
      status: "Approved",
    },
    {
      id: "EARN-1080",
      date: "2026-07-15",
      item: "Home Improvement Lead Gen",
      type: "CPL (Cost Per Lead)",
      quantity: 6,
      rate: "₹250 / lead",
      earnings: 1500,
      status: "Paid",
    },
    {
      id: "EARN-1079",
      date: "2026-07-10",
      item: "Buy 1 Get 1 Appetizers",
      type: "CPA (Cost Per Action)",
      quantity: 12,
      rate: "4.0%",
      earnings: 960,
      status: "Paid",
    },
    {
      id: "EARN-1078",
      date: "2026-07-05",
      item: "Summer Clearance Sale",
      type: "CPA (Cost Per Action)",
      quantity: 20,
      rate: "5.0%",
      earnings: 2100,
      status: "Paid",
    },
  ];

  const affiliateNetworks = [
    {
      name: "Vouchiqo Direct Partner Network",
      status: "Connected & Active",
      rate: "5% CPA Default",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      name: "CueLinks Affiliate Syndication",
      status: "Active Integration",
      rate: "4.2% Blended",
      icon: Globe,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      name: "Admitad Global Network",
      status: "Optional Add-On",
      rate: "3.8% Network Rate",
      icon: ExternalLink,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      name: "Impact.com Brand Partnership",
      status: "Connected (Enterprise)",
      rate: "Custom Tier",
      icon: Layers,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  const handleSavePayout = (e) => {
    e.preventDefault();
    toast.success("Bank payout details updated successfully!");
    setIsEditPayoutOpen(false);
  };

  return (
    <DashboardLayout
      title="Affiliate & Commission"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* TOP CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Current Commission Model */}
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Commission Model
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#e85d04] flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">
                5.0% CPA / Hybrid
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Cost Per Action (CPA) on confirmed redemptions
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>0% Commission for first 14 days</span>
              <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                Founding Rate
              </Badge>
            </div>
          </Card>

          {/* Card 2: Bank & Payout Details */}
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bank / Payout Account
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditPayoutOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-7 rounded-lg cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit Payout Details
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">
                {bankDetails.bankName}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                A/C: •••• •••• {bankDetails.accountNumber.slice(-4)} (
                {bankDetails.ifscCode})
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Holder: {bankDetails.accountHolder}</span>
              <span className="text-emerald-600 font-bold">KYC Verified ✓</span>
            </div>
          </Card>

          {/* Card 3: Payout Schedule */}
          <Card className="border-slate-200/80 shadow-xs rounded-2xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Payout Schedule
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">
                1st &amp; 15th Monthly
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Next Payout Date:{" "}
                <strong className="text-slate-900">August 1, 2026</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Pending Payout: ₹2,240.00</span>
              <span className="text-blue-600 font-bold">
                Auto-Transfer Active
              </span>
            </div>
          </Card>
        </div>

        {/* AFFILIATE NETWORK INTEGRATIONS ROW */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Affiliate Network Syndication Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {affiliateNetworks.map((net) => {
              const Icon = net.icon;
              return (
                <div
                  key={net.name}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`p-2 rounded-xl border ${net.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold border-slate-200"
                    >
                      {net.rate}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {net.name}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                      {net.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMMISSION EARNINGS TABLE */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden text-left">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                Commission Earnings &amp; Redemptions Breakdown
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Real-time commissions accrued across listings and campaign
                channels
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Exporting earnings report to CSV...")
              }
              className="text-xs font-bold rounded-xl border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#e85d04]" />
              <span>Export CSV</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="p-4 text-slate-500 font-bold uppercase">
                    Transaction ID
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase">
                    Date
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase">
                    Listing / Campaign
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase">
                    Model Type
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                    Quantity
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                    Rate
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase text-right">
                    Earnings (₹)
                  </TableHead>
                  <TableHead className="p-4 text-slate-500 font-bold uppercase text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {earningsData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="p-4 font-mono text-[10px] text-slate-600 font-bold">
                      {row.id}
                    </TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {row.date}
                    </TableCell>
                    <TableCell className="p-4 font-bold text-slate-900 max-w-[200px]">
                      <span className="truncate block">{row.item}</span>
                    </TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {row.type}
                    </TableCell>
                    <TableCell className="p-4 text-right font-mono">
                      {row.quantity}
                    </TableCell>
                    <TableCell className="p-4 text-right font-mono text-slate-600">
                      {row.rate}
                    </TableCell>
                    <TableCell className="p-4 text-right font-black text-slate-900">
                      ₹{row.earnings.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      <Badge
                        className={`rounded px-2.5 py-0.5 border-0 text-[9px] font-bold shadow-none ${
                          row.status === "Approved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* EDIT BANK PAYOUT MODAL */}
        <Dialog open={isEditPayoutOpen} onOpenChange={setIsEditPayoutOpen}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Edit Bank Payout Details
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update account details for direct bank transfer payouts.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePayout} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Account Holder
                  Name *
                </Label>
                <Input
                  type="text"
                  value={bankDetails.accountHolder}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountHolder: e.target.value,
                    })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" /> Bank
                  Name *
                </Label>
                <Input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                  className="bg-white border-slate-200 text-xs h-10 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />{" "}
                    Account Number *
                  </Label>
                  <Input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Banknote className="w-3.5 h-3.5 text-amber-600" /> IFSC
                    Code *
                  </Label>
                  <Input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value.toUpperCase(),
                      })
                    }
                    className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditPayoutOpen(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  Save Payout Details
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
