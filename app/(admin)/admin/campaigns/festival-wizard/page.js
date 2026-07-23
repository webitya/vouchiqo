"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FESTIVAL_THEMES = [
  "🪔 Grand Diwali Celebration",
  "🌙 Royal Eid Festive Special",
  "🎄 Merry Christmas Shopping Carnival",
  "🪷 Durga Puja Sharadotsav",
  "🎉 Happy New Year Bonanza",
  "🎨 Festival of Colours — Holi Deals",
];

const WIZARD_STEPS = [
  { step: 1, title: "Festival Theme" },
  { step: 2, title: "3-Day Teaser" },
  { step: 3, title: "Email Blast" },
  { step: 4, title: "Push Notification" },
  { step: 5, title: "Ticker Priority" },
  { step: 6, title: "Confirm Full Package" },
];

export default function FestivalCampaignWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [festivalTheme, setFestivalTheme] = useState(FESTIVAL_THEMES[0]);
  const [teaserDate, setTeaserDate] = useState("2026-07-22");
  const [emailSubject, setEmailSubject] = useState(
    "🪔 Exclusive Diwali Offer — Flat 20% OFF Italian Marble!",
  );
  const [pushText, setPushText] = useState(
    "🪔 Diwali Festival Special: 20% OFF Italian Marble at Marbella Tiles Ranchi!",
  );
  const [tickerPin, setTickerPin] = useState(true);
  const [isActivated, setIsActivated] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleConfirmFullActivation = () => {
    setIsActivated(true);
    toast.success(
      "Festival Package (₹2,999) Activated! Email + Push + Ticker Priority + 3-Day Teaser + 7-Day Extension deployed!",
    );
  };

  return (
    <DashboardLayout
      title="Festival Campaign Package Wizard (₹2,999)"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="p-1.5 h-auto rounded-xl">
              <Link href="/admin/campaigns/queue">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Activate
                  Festival Package Wizard (₹2,999)
                </h1>
                <Badge className="bg-amber-100 text-amber-900 text-[9px] font-bold border-0">
                  Simultaneous Multi-Channel
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Simultaneous activation: Email Blast + Push + Ticker Priority +
                Festival Theme + 3-Day Teaser + 7-Day Duration
              </p>
            </div>
          </div>
        </div>

        {/* 6-Step Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {WIZARD_STEPS.map((s) => (
            <div
              key={s.step}
              className={`p-3 rounded-xl border text-center transition-all ${currentStep === s.step ? "bg-slate-900 text-white border-slate-900 font-bold" : currentStep > s.step ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-bold" : "bg-white border-slate-200 text-slate-400"}`}
            >
              <span className="text-[10px] block opacity-80 uppercase">
                Step {s.step}
              </span>
              <span className="text-xs font-bold truncate block">
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* WIZARD CONTENT CARD */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
          {/* Step 1: Festival Theme */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 1: Confirm Festival Theme
              </h3>
              <Select value={festivalTheme} onValueChange={setFestivalTheme}>
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 font-bold text-slate-800">
                  <SelectValue placeholder="Select festival theme" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  {FESTIVAL_THEMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 2: 3-Day Teaser */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 2: Set Pre-Launch Teaser Date
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configures 3-day pre-launch teaser banner on homepage
              </p>
              <Input
                type="date"
                value={teaserDate}
                onChange={(e) => setTeaserDate(e.target.value)}
                className="w-full sm:w-60 bg-white border-slate-200 rounded-xl text-xs h-10 font-bold"
              />
            </div>
          )}

          {/* Step 3: Build Email Blast */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 3: Build Email Blast (Template E-9)
              </h3>
              <Input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 font-bold"
              />
            </div>
          )}

          {/* Step 4: Schedule Push Notification */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 4: Schedule Push Notification (MSG91 Template 8)
              </h3>
              <Input
                type="text"
                maxLength={100}
                value={pushText}
                onChange={(e) => setPushText(e.target.value)}
                className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 font-bold"
              />
            </div>
          )}

          {/* Step 5: Activate Ticker Priority */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 5: Activate Ticker Priority Slot (3 Days)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pin campaign headline to Homepage Ticker Slot #1 for 3 days
              </p>
            </div>
          )}

          {/* Step 6: Confirm Full Activation */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Step 6: Confirm Simultaneous Full Package Activation
              </h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Simultaneous Multi-Channel Package Ready</span>
                </div>
                <ul className="space-y-1 list-disc pl-4 text-slate-700">
                  <li>
                    Email Blast + Push Notification + Ticker Priority
                    simultaneously deployed
                  </li>
                  <li>
                    Festival-themed card design activated:{" "}
                    <strong>{festivalTheme}</strong>
                  </li>
                  <li>
                    3-Day Pre-Launch Teaser starting{" "}
                    <strong>{teaserDate}</strong>
                  </li>
                  <li>
                    Campaign duration extended to minimum{" "}
                    <strong>7 Days</strong>
                  </li>
                </ul>
              </div>

              {!isActivated
                ? <Button
                    onClick={handleConfirmFullActivation}
                    className="bg-[#e85d04] hover:bg-orange-600 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer w-full shadow-xs"
                  >
                    Confirm &amp; Deploy Festival Package (₹2,999) Now →
                  </Button>
                : <div className="p-4 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl text-center">
                    ✅ Festival Campaign Package Fully Activated &amp; Deployed!
                  </div>}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-xs font-bold rounded-xl border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            {currentStep < 6 && (
              <Button
                onClick={nextStep}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
