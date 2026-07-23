"use client";

import {
  AlertTriangle,
  PauseCircle,
  PlusCircle,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const INITIAL_LIVE_CAMPAIGNS = [
  {
    id: "live-1",
    name: "Pre-Diwali Grand Festival Sale",
    merchant: "JewelCraft Ranchi",
    type: "festival",
    timeRemaining: "4 days 12 hrs",
    impressions: 28400,
    clicks: 4120,
    redemptions: 3450,
    capLimit: 4000,
    conversionRate: "14.5%",
    successRate: "92.0%",
    alerts: ["80% Cap Reached (3,450 / 4,000)"],
    status: "Live",
  },
  {
    id: "live-2",
    name: "Flat 20% OFF Italian Marble Slabs",
    merchant: "Marbella Tiles & Sanitary",
    type: "flash",
    timeRemaining: "1 day 06 hrs",
    impressions: 14200,
    clicks: 1950,
    redemptions: 1240,
    capLimit: 2000,
    conversionRate: "13.7%",
    successRate: "76.4%",
    alerts: ["Success Rate below 80% (76.4%)"],
    status: "Live",
  },
  {
    id: "live-3",
    name: "Burger House BOGO Weekend",
    merchant: "Burger House",
    type: "bundle",
    timeRemaining: "2 days 18 hrs",
    impressions: 8200,
    clicks: 920,
    redemptions: 0,
    capLimit: 500,
    conversionRate: "0.0%",
    successRate: "0.0%",
    alerts: ["24 Hours With Zero Redemptions Alert"],
    status: "Live",
  },
];

export default function AdminLiveCampaignsPage() {
  const [liveCampaigns, setLiveCampaigns] = useState(INITIAL_LIVE_CAMPAIGNS);
  const [lastRefreshed, setLastRefreshed] = useState(
    new Date().toLocaleTimeString(),
  );

  // Pause Modal State
  const [pauseCampaign, setPauseCampaign] = useState(null);
  const [pauseReason, setPauseReason] = useState("");

  // Increase Cap Modal State
  const [capCampaign, setCapCampaign] = useState(null);
  const [newCapValue, setNewCapValue] = useState("");

  // 2-Minute Auto-Refresh simulation without reload
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      toast.success("Live campaign metrics auto-refreshed (2-min interval)", {
        id: "refresh-toast",
      });
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmPause = () => {
    if (!pauseReason.trim() || pauseReason.trim().length < 20) {
      toast.error(
        "Pause requires a mandatory reason of at least 20 characters!",
      );
      return;
    }
    setLiveCampaigns((prev) =>
      prev.map((c) =>
        c.id === pauseCampaign.id ? { ...c, status: "Paused" } : c,
      ),
    );
    toast.success("Campaign paused successfully.");
    setPauseCampaign(null);
    setPauseReason("");
  };

  const handleConfirmIncreaseCap = () => {
    if (!newCapValue || Number(newCapValue) <= capCampaign.capLimit) {
      toast.error("New cap must be greater than current cap!");
      return;
    }
    setLiveCampaigns((prev) =>
      prev.map((c) =>
        c.id === capCampaign.id ? { ...c, capLimit: Number(newCapValue) } : c,
      ),
    );
    toast.success(`Cap increased to ${newCapValue}!`);
    setCapCampaign(null);
    setNewCapValue("");
  };

  const handleEndNow = (id) => {
    setLiveCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Ended" } : c)),
    );
    toast.error("Campaign ended immediately.");
  };

  return (
    <DashboardLayout
      title="Live Campaign Monitoring"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#e85d04]" /> Live Campaign
              Monitoring (/admin/campaigns/live)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Auto-refreshes every 2 minutes • Real-time cap alerts, pause with
              20-char reason &amp; cap booster.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              Last Refreshed: {lastRefreshed}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLastRefreshed(new Date().toLocaleTimeString())}
              className="text-xs font-bold rounded-xl border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Live Campaign Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold">
          {liveCampaigns.map((c) => {
            const capPercent = Math.min(
              100,
              Math.round((c.redemptions / c.capLimit) * 100),
            );
            return (
              <Card
                key={c.id}
                className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold border-0 uppercase">
                        {c.status} • {c.type}
                      </Badge>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {c.merchant}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                      ⏳ {c.timeRemaining}
                    </span>
                  </div>

                  {/* Auto-Triggered System Alerts */}
                  {c.alerts.length > 0 && (
                    <div className="space-y-1">
                      {c.alerts.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* KPI Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-semibold block text-[10px]">
                        Impressions
                      </span>
                      <span className="font-black text-slate-900">
                        {c.impressions.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-semibold block text-[10px]">
                        Clicks
                      </span>
                      <span className="font-black text-slate-900">
                        {c.clicks.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-semibold block text-[10px]">
                        Redemptions
                      </span>
                      <span className="font-black text-slate-900">
                        {c.redemptions.toLocaleString()} / {c.capLimit}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-semibold block text-[10px]">
                        Conversion Rate
                      </span>
                      <span className="font-black text-emerald-600">
                        {c.conversionRate}
                      </span>
                    </div>
                  </div>

                  {/* Cap Status Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Cap Status</span>
                      <span>
                        {capPercent}% ({c.redemptions}/{c.capLimit})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#e85d04] h-full rounded-full transition-all"
                        style={{ width: `${capPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Control Actions: Pause, Increase Cap, End Now */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  {c.status === "Live" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPauseCampaign(c)}
                        className="text-xs font-bold text-amber-700 border-amber-300 hover:bg-amber-50 rounded-xl flex-1 cursor-pointer"
                      >
                        <PauseCircle className="w-3.5 h-3.5 mr-1" /> Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCapCampaign(c);
                          setNewCapValue(String(c.capLimit + 500));
                        }}
                        className="text-xs font-bold text-blue-700 border-blue-300 hover:bg-blue-50 rounded-xl flex-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1" /> + Cap
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEndNow(c.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        End Now
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* PAUSE CAMPAIGN MODAL (MANDATORY 20-CHAR REASON) */}
        <Dialog
          open={!!pauseCampaign}
          onOpenChange={() => setPauseCampaign(null)}
        >
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-amber-900">
                Pause Live Campaign
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Provide mandatory pause reason (min 20 characters).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-800">
                Pause Reason *
              </Label>
              <Textarea
                rows={3}
                placeholder="e.g. Paused temporarily due to counter billing queue overload."
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="bg-white border-slate-200 text-xs rounded-xl"
              />
              <span className="text-[10px] text-amber-700 font-medium block text-right">
                {pauseReason.length}/20 min chars required
              </span>
            </div>
            <DialogFooter className="pt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPauseCampaign(null)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPause}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Pause
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* INCREASE CAP MODAL */}
        <Dialog open={!!capCampaign} onOpenChange={() => setCapCampaign(null)}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Increase Campaign Redemption Cap
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Current Cap: {capCampaign?.capLimit} claims
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-800">
                New Total Cap Limit *
              </Label>
              <Input
                type="number"
                value={newCapValue}
                onChange={(e) => setNewCapValue(e.target.value)}
                className="bg-white border-slate-200 text-xs h-10 rounded-xl font-bold"
              />
            </div>
            <DialogFooter className="pt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCapCampaign(null)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmIncreaseCap}
                className="bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Update Cap Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
