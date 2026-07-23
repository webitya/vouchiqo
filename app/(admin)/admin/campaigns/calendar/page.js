"use client";

import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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

const FESTIVAL_DATES = [
  {
    name: "Diwali Grand Fest",
    date: "2026-11-01",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    name: "Dussehra Mega Sale",
    date: "2026-10-12",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    name: "Holi Colours Offer",
    date: "2026-03-04",
    color: "bg-[#e85d04]/10 text-[#e85d04] border-orange-200",
  },
  {
    name: "Eid Festive Specials",
    date: "2026-03-20",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
];

const SCHEDULED_CAMPAIGNS = [
  {
    id: "sch-1",
    name: "Pre-Diwali Grand Renovation Sale",
    merchant: "Marbella Tiles & Sanitary",
    type: "festival",
    startDate: "2026-10-25T10:00",
    endDate: "2026-11-02T23:59",
    hasCountdownTimer: true,
    hasPreTeaser: true,
    teaserHeadline: "🔥 Pre-Diwali Booking Deals Unlocking Soon!",
    canAdjust: true, // Launch > 2 hours away
  },
  {
    id: "sch-2",
    name: "Summer Blast Flash Sale",
    merchant: "Burger House",
    type: "flash",
    startDate: "2026-07-25T12:00",
    endDate: "2026-07-28T23:59",
    hasCountdownTimer: true,
    hasPreTeaser: false,
    teaserHeadline: "",
    canAdjust: true,
  },
];

export default function AdminCampaignCalendarPage() {
  const [campaigns, setCampaigns] = useState(SCHEDULED_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Form states inside adjustment modal
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editCountdown, setEditCountdown] = useState(true);
  const [editTeaser, setEditTeaser] = useState(true);
  const [editTeaserHeadline, setEditTeaserHeadline] = useState("");

  const handleOpenAdjust = (cmp) => {
    setSelectedCampaign(cmp);
    setEditStartDate(cmp.startDate.split("T")[0]);
    setEditEndDate(cmp.endDate.split("T")[0]);
    setEditCountdown(cmp.hasCountdownTimer);
    setEditTeaser(cmp.hasPreTeaser);
    setEditTeaserHeadline(cmp.teaserHeadline || "");
    setIsAdjustModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === selectedCampaign.id
          ? {
              ...c,
              startDate: `${editStartDate}T10:00`,
              endDate: `${editEndDate}T23:59`,
              hasCountdownTimer: editCountdown,
              hasPreTeaser: editTeaser,
              teaserHeadline: editTeaserHeadline,
            }
          : c,
      ),
    );
    toast.success("Campaign schedule & teaser settings updated successfully!");
    setIsAdjustModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Campaign Calendar & Scheduling"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#e85d04]" /> Campaign
              Scheduling &amp; Calendar (/admin/campaigns/calendar)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Go-live date/time pickers, countdown timers, pre-launch teasers
              &amp; automatic cron scheduler.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 border-0">
              Cron Scheduler Active (Auto-Launch Enabled)
            </Badge>
          </div>
        </div>

        {/* Flagged Festival Dates Banner */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> Flagged National
            Festival Campaign Dates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FESTIVAL_DATES.map((fest) => (
              <div
                key={fest.name}
                className={`p-3 rounded-xl border text-xs font-bold ${fest.color} flex justify-between items-center`}
              >
                <span>{fest.name}</span>
                <span className="font-mono text-[11px]">{fest.date}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scheduled Campaigns List */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Scheduled Campaigns Queue
          </h3>
          <div className="space-y-4">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="p-4 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {c.name}
                    </h4>
                    <Badge className="bg-blue-100 text-blue-800 text-[9px] font-bold">
                      {c.merchant}
                    </Badge>
                    {c.hasCountdownTimer && (
                      <Badge className="bg-orange-100 text-orange-800 text-[9px] font-bold">
                        Countdown Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Go-Live:{" "}
                    <strong className="text-slate-900 font-mono">
                      {c.startDate}
                    </strong>{" "}
                    • End:{" "}
                    <strong className="text-slate-900 font-mono">
                      {c.endDate}
                    </strong>
                  </p>
                  {c.hasPreTeaser && (
                    <span className="text-[11px] font-semibold text-purple-700 block">
                      🔮 Pre-Teaser: &quot;{c.teaserHeadline}&quot;
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => handleOpenAdjust(c)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                >
                  Adjust Launch Schedule &amp; Teaser
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* ADJUST SCHEDULE MODAL */}
        <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold text-slate-900">
                Adjust Launch Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Adjust launch time up to 2 hours before automated launch.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveSchedule} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Go-Live Launch Date *
                </Label>
                <DatePicker
                  value={editStartDate}
                  onChange={setEditStartDate}
                  placeholder="Select launch date"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  End Expiry Date *
                </Label>
                <DatePicker
                  value={editEndDate}
                  onChange={setEditEndDate}
                  placeholder="Select end date"
                />
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCountdown}
                    onChange={(e) => setEditCountdown(e.target.checked)}
                    className="accent-[#e85d04]"
                  />
                  <span>Activate Countdown Timer on Offer Card</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editTeaser}
                    onChange={(e) => setEditTeaser(e.target.checked)}
                    className="accent-[#e85d04]"
                  />
                  <span>Activate Festival Pre-Launch Teaser Banner</span>
                </label>
              </div>

              {editTeaser && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Pre-Launch Teaser Headline (Max 60 Chars) *
                  </Label>
                  <Input
                    type="text"
                    maxLength={60}
                    value={editTeaserHeadline}
                    onChange={(e) => setEditTeaserHeadline(e.target.value)}
                    placeholder="e.g. 🔥 Pre-Diwali Deals Unlocking Soon!"
                    className="bg-white border-slate-200 text-xs h-10 rounded-xl"
                  />
                </div>
              )}

              <DialogFooter className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Save Schedule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
