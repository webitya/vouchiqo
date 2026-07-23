"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MerchantDetailPage({ params }) {
  const resolvedParams = use(params);
  const merchantId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState("profile");
  const [currentPlan, setCurrentPlan] = useState("Growth Partner");
  const [isSuspended, setIsSuspended] = useState(false);
  const [revivalCredits, setRevivalCredits] = useState(50);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState("Pro Partner");

  const merchantProfile = {
    id: merchantId,
    businessName: merchantId.includes("marbella")
      ? "Marbella Tiles & Sanitaryware"
      : "Marbella Tiles & Sanitaryware",
    tradingName: "Marbella Showroom Ranchi",
    category: "Home Improvement",
    constitution: "Proprietorship",
    email: "marbellaranchi11@gmail.com",
    phone: "+91 98351 23456",
    contactPerson: "Mr. Rajesh Agarwal (Owner)",
    address: "Plot 42, Main Road, Near Overbridge, Ranchi, Jharkhand 834001",
    joinedDate: "2026-07-01",
    status: isSuspended ? "Suspended" : "Active",
  };

  const listings = [
    {
      title: "20% OFF Mega Festive Sale",
      code: "FESTIVE20",
      clicks: 1420,
      redemptions: 340,
      status: "Active",
    },
    {
      title: "Flat ₹500 Cashback on Dining",
      code: "DINING500",
      clicks: 980,
      redemptions: 210,
      status: "Active",
    },
    {
      title: "Buy 1 Get 1 Appetizers",
      code: "BOGOAPP",
      clicks: 650,
      redemptions: 115,
      status: "Paused",
    },
  ];

  const subscriptions = [
    {
      date: "2026-07-01",
      plan: "Growth Partner",
      amount: "₹1,499.00",
      cycle: "Monthly",
      status: "Paid",
    },
    {
      date: "2026-06-01",
      plan: "Growth Partner",
      amount: "₹1,499.00",
      cycle: "Monthly",
      status: "Paid",
    },
  ];

  const commissions = [
    {
      id: "COMM-901",
      date: "2026-07-20",
      item: "20% OFF Mega Sale",
      model: "5% CPA",
      amount: "₹1,400.00",
      status: "Approved",
    },
    {
      id: "COMM-900",
      date: "2026-07-15",
      item: "Home Improvement CPL",
      model: "CPL ₹250",
      amount: "₹1,500.00",
      status: "Paid",
    },
  ];

  const tickets = [
    {
      id: "TKT-402",
      date: "2026-07-19",
      subject: "Request for Campaign Ticker Slot Approval",
      status: "Resolved",
      priority: "High",
    },
  ];

  const activityLog = [
    {
      time: "2026-07-21 14:30 IST",
      action: "Posted New Listing",
      details: "Flat 20% off on all Italian Marble Tiles",
    },
    {
      time: "2026-07-20 11:15 IST",
      action: "Submitted Campaign",
      details: "Pre-Diwali Grand Festival Campaign",
    },
    {
      time: "2026-07-01 09:00 IST",
      action: "Account Registered",
      details: "Onboarded under Founding Merchant Program",
    },
  ];

  const handleAddCredits = () => {
    setRevivalCredits((prev) => prev + 25);
    toast.success("Added +25 Revival Credits to merchant account!");
  };

  const handleToggleSuspend = () => {
    const nextState = !isSuspended;
    setIsSuspended(nextState);
    toast.success(
      `Merchant account ${nextState ? "suspended" : "reactivated"}.`,
    );
  };

  const handleChangePlan = () => {
    setCurrentPlan(newPlan);
    toast.success(`Merchant plan updated to ${newPlan}!`);
    setIsChangePlanOpen(false);
  };

  return (
    <DashboardLayout
      title="Merchant Detail Control"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-4 text-left font-sans w-full pb-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" asChild className="p-1 h-8 w-8 rounded-lg">
              <Link href="/admin/merchants">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900">
                  {merchantProfile.businessName}
                </h1>
                <Badge
                  className={`rounded px-2 py-0.5 text-[9px] font-medium border-0 ${isSuspended ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}
                >
                  {merchantProfile.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {merchantProfile.email} • {merchantProfile.address}
              </p>
            </div>
          </div>

          {/* ADMIN MANUAL CONTROL ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleAddCredits}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg h-8 px-3 cursor-pointer shadow-2xs"
            >
              + Add 25 Revival Credits ({revivalCredits})
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsChangePlanOpen(true)}
              className="text-xs font-medium rounded-lg border-slate-200 h-8 px-3 cursor-pointer bg-white"
            >
              Change Plan ({currentPlan})
            </Button>
            <Button
              onClick={handleToggleSuspend}
              className={`text-xs font-medium rounded-lg h-8 px-3 cursor-pointer ${isSuspended ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`}
            >
              {isSuspended ? "Reactivate Account" : "Suspend Account"}
            </Button>
          </div>
        </div>

        {/* 6 MASTER TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-3">
          <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 flex flex-wrap gap-1 justify-start h-auto w-full">
            <TabsTrigger
              value="profile"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Business Profile
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              All Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Subscription History
            </TabsTrigger>
            <TabsTrigger
              value="commissions"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Commission Transactions
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Support Tickets ({tickets.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-xs font-medium rounded-lg px-3 py-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs"
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BUSINESS PROFILE */}
          <TabsContent value="profile" className="pt-3">
            <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Full Business &amp; Contact Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Legal Entity Name
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.businessName}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Trading / Brand Name
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.tradingName}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Business Constitution
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.constitution}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Primary Category
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.category}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Authorized Liaison
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.contactPerson} ({merchantProfile.phone})
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px] block">
                    Physical Showroom Address
                  </span>
                  <span className="font-semibold text-slate-900">
                    {merchantProfile.address}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: LISTINGS */}
          <TabsContent value="listings" className="pt-3">
            <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Merchant Offer Listings
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-medium text-slate-600">Offer Title</TableHead>
                    <TableHead className="font-medium text-slate-600">Code</TableHead>
                    <TableHead className="font-medium text-slate-600">Clicks</TableHead>
                    <TableHead className="font-medium text-slate-600">Redemptions</TableHead>
                    <TableHead className="font-medium text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-slate-900">{l.title}</TableCell>
                      <TableCell className="font-mono text-slate-600">{l.code}</TableCell>
                      <TableCell className="text-slate-700">{l.clicks}</TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {l.redemptions}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium">{l.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TAB 3: SUBSCRIPTIONS */}
          <TabsContent value="subscriptions" className="pt-3">
            <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Subscription Billing History
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-medium text-slate-600">Billing Date</TableHead>
                    <TableHead className="font-medium text-slate-600">Plan Tier</TableHead>
                    <TableHead className="font-medium text-slate-600">Amount</TableHead>
                    <TableHead className="font-medium text-slate-600">Cycle</TableHead>
                    <TableHead className="font-medium text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-slate-700">{s.date}</TableCell>
                      <TableCell className="font-medium text-slate-900">{s.plan}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{s.amount}</TableCell>
                      <TableCell className="text-slate-700">{s.cycle}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TAB 4: COMMISSIONS */}
          <TabsContent value="commissions" className="pt-3">
            <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Commission Transactions
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-medium text-slate-600">ID</TableHead>
                    <TableHead className="font-medium text-slate-600">Date</TableHead>
                    <TableHead className="font-medium text-slate-600">Listing</TableHead>
                    <TableHead className="font-medium text-slate-600">Model</TableHead>
                    <TableHead className="font-medium text-slate-600">Amount</TableHead>
                    <TableHead className="font-medium text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-slate-600">{c.id}</TableCell>
                      <TableCell className="text-slate-700">{c.date}</TableCell>
                      <TableCell className="font-medium text-slate-900">{c.item}</TableCell>
                      <TableCell className="text-slate-700">{c.model}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{c.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium">
                          {c.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TAB 5: TICKETS */}
          <TabsContent value="tickets" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Support Tickets
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{t.id}</TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell className="font-bold">{t.subject}</TableCell>
                      <TableCell>{t.priority}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TAB 6: ACTIVITY LOG */}
          <TabsContent value="activity" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Merchant Activity Timeline
              </h3>
              <div className="space-y-3 pt-2">
                {activityLog.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {a.action}
                      </span>
                      <span className="text-slate-500">{a.details}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MANUALLY CHANGE PLAN DIALOG */}
        <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Manually Change Merchant Subscription Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Override subscription tier for {merchantProfile.businessName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold text-slate-800">
                Select Target Subscription Tier
              </Label>
              <Select value={newPlan} onValueChange={setNewPlan}>
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="Starter Free">
                    Starter Free (₹0)
                  </SelectItem>
                  <SelectItem value="Growth Partner">
                    Growth Partner (₹1,499/mo)
                  </SelectItem>
                  <SelectItem value="Pro Partner">
                    Pro Partner (₹3,999/mo)
                  </SelectItem>
                  <SelectItem value="Enterprise Partner">
                    Enterprise Partner (₹9,999/mo)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsChangePlanOpen(false)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePlan}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Save &amp; Apply Plan Override
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
