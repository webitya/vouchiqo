"use client";

import { ArrowRight, Check, CreditCard, FileText } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MerchantSubscription() {
  const [currentPlan, setCurrentPlan] = useState("growth");

  const plans = [
    {
      id: "starter",
      name: "Starter Merchant",
      price: "$29",
      desc: "For small local businesses testing discount campaigns.",
      features: [
        "Up to 3 active coupons",
        "Standard Vouchiqo verification badges",
        "Basic campaign metrics dashboard",
        "Email support (48 hr response)",
      ],
    },
    {
      id: "growth",
      name: "Growth Partner",
      price: "$79",
      desc: "For growing brands optimization checkout conversion rates.",
      features: [
        "Unlimited active coupons",
        "Merchant verification badge credentials",
        "Full Webhook API validation",
        "Advanced Analytics & CSV exports",
        "Community revival queue access",
        "Priority Slack support",
      ],
    },
  ];

  const invoices = [
    { id: "INV-0849", date: "2026-06-01", amount: "$79.00", status: "Paid" },
    { id: "INV-0723", date: "2026-05-01", amount: "$79.00", status: "Paid" },
  ];

  return (
    <DashboardLayout
      title="Billing & Plans"
      user={{ name: "Zomato Partner", role: "merchant" }}
    >
      {/* Active subscription card banner */}
      <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-full border border-brand-blue/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-bold text-brand-navy">
                Growth Partner Plan
              </h3>
              <Badge className="bg-brand-success/15 text-brand-success rounded-full border-0 font-bold text-[10px] py-0.5 px-2 hover:bg-brand-success/15 shadow-none">
                Active
              </Badge>
            </div>
            <p className="text-xs text-brand-subtext mt-0.5 font-semibold">
              Your next billing date is July 1st, 2026. Auto-renew is enabled.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="btn-tertiary text-xs py-2 px-5 border-brand-border rounded-lg cursor-pointer h-auto shadow-none hover:bg-brand-surface font-bold"
        >
          Manage Payments
        </Button>
      </div>

      {/* Pricing tiers grid */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
          Change Pricing Tier
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-brand-bg border rounded-xl p-6 flex flex-col justify-between h-full relative transition-all ${
                currentPlan === plan.id
                  ? "border-brand-navy ring-1 ring-brand-navy shadow-md"
                  : "border-brand-border hover:shadow-sm"
              }`}
            >
              {currentPlan === plan.id && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-brand-navy text-white text-[10px] font-bold uppercase rounded-full tracking-wider border border-white/20">
                  Your Current Plan
                </span>
              )}

              <div className="space-y-4 font-semibold">
                <div>
                  <h4 className="font-heading text-lg font-bold text-brand-navy">
                    {plan.name}
                  </h4>
                  <p className="text-xs text-brand-subtext mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-y border-brand-surface">
                  <span className="text-3xl font-extrabold text-brand-text font-heading">
                    {plan.price}
                  </span>
                  <span className="text-xs text-brand-subtext">/ month</span>
                </div>

                <ul className="space-y-2 text-xs">
                  {plan.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 items-center text-brand-text"
                    >
                      <Check className="w-4 h-4 text-brand-success flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                disabled={currentPlan === plan.id}
                onClick={() => setCurrentPlan(plan.id)}
                className={`btn-primary w-full text-xs py-2 mt-6 shadow-none flex items-center justify-center gap-1.5 border-0 h-auto cursor-pointer ${
                  currentPlan === plan.id
                    ? "opacity-50 cursor-not-allowed bg-brand-subtext hover:bg-brand-subtext"
                    : ""
                }`}
              >
                <span>
                  {currentPlan === plan.id ? "Plan Active" : "Upgrade Plan"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing history table */}
      <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-brand-navy tracking-tight uppercase">
            Invoice & Billing History
          </h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <Table className="w-full text-xs">
            <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
              <TableRow className="hover:bg-transparent border-b border-brand-border">
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Invoice ID
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Billing Date
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Amount
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Status
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                  Download
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
              {invoices.map((inv, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                >
                  <TableCell className="p-4 font-bold text-brand-navy h-auto">
                    {inv.id}
                  </TableCell>
                  <TableCell className="p-4">{inv.date}</TableCell>
                  <TableCell className="p-4">{inv.amount}</TableCell>
                  <TableCell className="p-4">
                    <Badge className="bg-brand-success/15 text-brand-success rounded-full border-0 font-bold text-[10px] py-0.5 px-2 hover:bg-brand-success/15 shadow-none">
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg text-brand-subtext hover:text-brand-blue hover:bg-brand-surface cursor-pointer shadow-none"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
