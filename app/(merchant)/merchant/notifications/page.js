"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Listing Approved & Live",
    message:
      "Your coupon listing 'Flat 20% OFF Italian Marble Tiles' has been verified and is live.",
    type: "Listing Approved",
    category: "system",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "Coupon Expiring Soon Warning",
    message:
      "Offer code 'DINING500' will expire in 48 hours. Consider extending or launching a revival campaign.",
    type: "Expiring Soon",
    category: "campaign",
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    title: "Billing & Subscription Confirmed",
    message:
      "Your monthly invoice INV-2026-1082 of ₹1,499.00 for Growth Partner plan has been paid via Razorpay.",
    type: "Billing confirmed",
    category: "billing",
    icon: CreditCard,
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "notif-4",
    title: "Listing Verification Rejected",
    message:
      "Listing 'Free Marble Slabs' requires update: Please specify minimum order value cap.",
    type: "Listing Rejected",
    category: "system",
    icon: XCircle,
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-5",
    title: "Weekly Performance Report Ready",
    message:
      "Your store generated 340 redemptions and ₹68,000 estimated revenue this week. Download PDF report.",
    type: "Weekly Report Ready",
    category: "campaign",
    icon: BarChart2,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    time: "2 days ago",
    read: true,
  },
  {
    id: "notif-6",
    title: "Flash Campaign Duration Ended",
    message:
      "Your Flash Sale 'Summer Blast' ended with 100% redemption rate across 50 claims.",
    type: "Campaign ended",
    category: "campaign",
    icon: Zap,
    iconColor: "text-orange-600 bg-orange-50 border-orange-200",
    time: "3 days ago",
    read: true,
  },
  {
    id: "notif-7",
    title: "1,000 Redemptions Milestone Reached!",
    message:
      "Congratulations! Your store crossed 1,000 customer redemptions on Vouchiqo.",
    type: "Milestone reached",
    category: "system",
    icon: Trophy,
    iconColor: "text-amber-500 bg-amber-50 border-amber-200",
    time: "5 days ago",
    read: true,
  },
  {
    id: "notif-8",
    title: "Action Required: Brief Counter Staff",
    message:
      "Please brief counter staff to accept Vouchiqo Smart Codes for upcoming weekend sale.",
    type: "Action Required",
    category: "system",
    icon: AlertTriangle,
    iconColor: "text-red-600 bg-red-50 border-red-200",
    time: "1 week ago",
    read: true,
  },
];

export default function MerchantNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const { data: merchant } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read!");
  };

  const handleMarkItemRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      title="Notifications & Alerts"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="space-y-4 text-left font-sans w-full max-w-[1100px] mx-auto">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Merchant Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-blue-600 text-white font-bold text-[9px] rounded-full px-2 py-0.5 border-0">
                    {unreadCount} Unread
                  </Badge>
                )}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Real-time alerts for approvals, campaigns, reports &amp; billing
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-xs h-8 font-bold rounded-xl border-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-slate-700 hover:bg-slate-50 shadow-none"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>Mark All as Read</span>
          </Button>
        </div>

        {/* 5 TABS: All, Unread, System, Campaign, Billing */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 flex flex-wrap gap-1 justify-start h-auto w-full sm:w-auto">
            <TabsTrigger
              value="all"
              className="text-[11px] font-bold rounded-lg px-3 py-1.5 cursor-pointer"
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-[11px] font-bold rounded-lg px-3 py-1.5 cursor-pointer"
            >
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="text-[11px] font-bold rounded-lg px-3 py-1.5 cursor-pointer"
            >
              System &amp; Verification
            </TabsTrigger>
            <TabsTrigger
              value="campaign"
              className="text-[11px] font-bold rounded-lg px-3 py-1.5 cursor-pointer"
            >
              Campaigns &amp; Reports
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="text-[11px] font-bold rounded-lg px-3 py-1.5 cursor-pointer"
            >
              Billing &amp; Invoices
            </TabsTrigger>
          </TabsList>

          <div className="pt-3">
            <Card className="border-slate-200/90 shadow-2xs rounded-2xl bg-white overflow-hidden divide-y divide-slate-100">
              {filteredNotifications.length > 0
                ? filteredNotifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleMarkItemRead(item.id)}
                        className={`p-3.5 sm:p-4 flex items-start gap-3 transition-all cursor-pointer hover:bg-blue-50/30 ${
                          !item.read ? "bg-blue-50/40" : "bg-white"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl border shrink-0 ${item.iconColor}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {item.title}
                              {!item.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                              )}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {item.time}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {item.message}
                          </p>

                          <div className="pt-0.5 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[9px] font-bold border-slate-200 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md"
                            >
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : <div className="p-10 text-center text-slate-400 font-medium space-y-2">
                    <Bell className="w-7 h-7 mx-auto text-slate-300" />
                    <p className="text-xs">No notifications found in this category.</p>
                  </div>}
            </Card>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
