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
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="p-1.5 h-auto rounded-xl">
              <Link href="/admin/merchants">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">
                  {merchantProfile.businessName}
                </h1>
                <Badge
                  className={`rounded px-2.5 py-0.5 text-[9px] font-bold border-0 ${isSuspended ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}
                >
                  {merchantProfile.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {merchantProfile.email} • {merchantProfile.address}
              </p>
            </div>
          </div>

          {/* ADMIN MANUAL CONTROL ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleAddCredits}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              + Add 25 Revival Credits (Current: {revivalCredits})
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsChangePlanOpen(true)}
              className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
            >
              Manually Change Plan ({currentPlan})
            </Button>
            <Button
              onClick={handleToggleSuspend}
              className={`text-xs font-bold rounded-xl cursor-pointer ${isSuspended ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}
            >
              {isSuspended ? "Reactivate Account" : "Suspend Account"}
            </Button>
          </div>
        </div>

        {/* 6 MASTER TABS: Full Business Profile, All Listings, Subscription History, Commission Transactions, Support Tickets, Activity Log */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1 justify-start h-auto w-full">
            <TabsTrigger
              value="profile"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              Business Profile
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              All Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              Subscription History
            </TabsTrigger>
            <TabsTrigger
              value="commissions"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              Commission Transactions
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              Support Tickets ({tickets.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BUSINESS PROFILE */}
          <TabsContent value="profile" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Full Business &amp; Contact Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Legal Entity Name
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.businessName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Trading / Brand Name
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.tradingName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Business Constitution
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.constitution}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Primary Category
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.category}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Authorized Liaison
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.contactPerson} ({merchantProfile.phone})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Physical Showroom Address
                  </span>
                  <span className="font-bold text-slate-900">
                    {merchantProfile.address}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: LISTINGS */}
          <TabsContent value="listings" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Merchant Offer Listings
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Offer Title</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-bold">{l.title}</TableCell>
                      <TableCell className="font-mono">{l.code}</TableCell>
                      <TableCell>{l.clicks}</TableCell>
                      <TableCell className="font-bold">
                        {l.redemptions}
                      </TableCell>
                      <TableCell>
                        <Badge>{l.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TAB 3: SUBSCRIPTIONS */}
          <TabsContent value="subscriptions" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Subscription Billing History
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Plan Tier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.date}</TableCell>
                      <TableCell className="font-bold">{s.plan}</TableCell>
                      <TableCell className="font-black">{s.amount}</TableCell>
                      <TableCell>{s.cycle}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-800">
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
          <TabsContent value="commissions" className="pt-4">
            <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Commission Transactions
              </h3>
              <Table className="w-full text-xs">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Listing</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{c.id}</TableCell>
                      <TableCell>{c.date}</TableCell>
                      <TableCell className="font-bold">{c.item}</TableCell>
                      <TableCell>{c.model}</TableCell>
                      <TableCell className="font-black">{c.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
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
