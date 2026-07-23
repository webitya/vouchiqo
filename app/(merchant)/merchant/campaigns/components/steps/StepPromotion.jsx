"use client";

import {
  Bell,
  Clock,
  FileText,
  Mail,
  Tag,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function StepPromotion({
  campaignData,
  setCampaignData,
  targetAudiences,
  onBack,
  onNext,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Schedule &amp; Add-On Promotion Services
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Define campaign schedule, pre-launch teasers &amp; optional push/email
          add-ons
        </p>
      </div>

      <div className="space-y-5">
        {/* Schedule dates using Shadcn DatePicker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Start Date *
            </Label>
            <DatePicker
              value={campaignData.startDate}
              onChange={(val) =>
                setCampaignData({ ...campaignData, startDate: val })
              }
              placeholder="Select start date"
              iconColor="text-blue-600"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Clock className="w-3.5 h-3.5 text-rose-600" /> End Date *
            </Label>
            <DatePicker
              value={campaignData.endDate}
              onChange={(val) =>
                setCampaignData({ ...campaignData, endDate: val })
              }
              placeholder="Select end date"
              iconColor="text-rose-600"
            />
          </div>
        </div>

        {/* Campaign Toggles: Countdown Timer & Pre-launch Teaser */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Countdown Timer
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Show live ticking countdown timer
              </span>
            </div>
            <Switch
              checked={campaignData.hasCountdownTimer}
              onCheckedChange={(val) =>
                setCampaignData({ ...campaignData, hasCountdownTimer: val })
              }
            />
          </div>

          <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Pre-Launch
                Teaser
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Show 48hr festival pre-teaser banner
              </span>
            </div>
            <Switch
              checked={campaignData.hasPreTeaser}
              onCheckedChange={(val) =>
                setCampaignData({ ...campaignData, hasPreTeaser: val })
              }
            />
          </div>
        </div>

        {/* Paid Add-On Promotions Section */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Optional Promotion Boost Add-Ons
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Amplify campaign reach with email blasts, push notifications &amp; ticker priority
              </p>
            </div>
          </div>

          {/* Add-on Cards */}
          <div className="space-y-3">
            {/* 1. Targeted Email Blast */}
            <div className="p-4 border border-slate-200/80 rounded-2xl space-y-3 bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-2">
                      Targeted Email Blast
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[9px]">
                        ₹1,499 / blast
                      </Badge>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Send dedicated html offer email to verified Ranchi subscribers
                    </span>
                  </div>
                </div>
                <Switch
                  checked={campaignData.hasEmailBlast}
                  onCheckedChange={(val) =>
                    setCampaignData({ ...campaignData, hasEmailBlast: val })
                  }
                />
              </div>

              {campaignData.hasEmailBlast && (
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-700">
                      Target Audience Segment
                    </Label>
                    <Select
                      value={campaignData.emailAudience}
                      onValueChange={(val) =>
                        setCampaignData({ ...campaignData, emailAudience: val })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select target segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((aud) => (
                          <SelectItem key={aud.value} value={aud.value}>
                            {aud.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Push Notification Alert */}
            <div className="p-4 border border-slate-200/80 rounded-2xl space-y-3 bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-2">
                      Push Notification Broadcast
                      <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[9px]">
                        ₹799 / broadcast
                      </Badge>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Instant mobile &amp; desktop web push alert to active users
                    </span>
                  </div>
                </div>
                <Switch
                  checked={campaignData.hasPushNotif}
                  onCheckedChange={(val) =>
                    setCampaignData({ ...campaignData, hasPushNotif: val })
                  }
                />
              </div>

              {campaignData.hasPushNotif && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-700">
                    Push Broadcast Time (TRAI Allowed: 9:00 AM – 9:00 PM IST) *
                  </Label>
                  <Select
                    value={campaignData.pushSendTime || "11:00 AM IST"}
                    onValueChange={(val) =>
                      setCampaignData({ ...campaignData, pushSendTime: val })
                    }
                  >
                    <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-9 px-3 font-bold text-slate-800">
                      <SelectValue placeholder="Select send time window" />
                    </SelectTrigger>
                    <SelectContent className="z-[300]">
                      <SelectItem value="09:30 AM IST">
                        09:30 AM IST (Morning Peak)
                      </SelectItem>
                      <SelectItem value="11:00 AM IST">
                        11:00 AM IST (Late Morning)
                      </SelectItem>
                      <SelectItem value="01:30 PM IST">
                        01:30 PM IST (Lunch Window)
                      </SelectItem>
                      <SelectItem value="05:00 PM IST">
                        05:00 PM IST (Evening Return)
                      </SelectItem>
                      <SelectItem value="07:30 PM IST">
                        07:30 PM IST (Prime Evening)
                      </SelectItem>
                      <SelectItem value="08:30 PM IST">
                        08:30 PM IST (Last Call Before 9 PM)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* 3. Homepage Ticker Priority */}
            <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-2">
                    Homepage Ticker Priority
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[9px]">
                      ₹999 / 3-day window
                    </Badge>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Top 3 priority slot on homepage ticker banner for 72 hours
                  </span>
                </div>
              </div>
              <Switch
                checked={campaignData.featuredSlot}
                onCheckedChange={(val) =>
                  setCampaignData({ ...campaignData, featuredSlot: val })
                }
              />
            </div>

            {/* 4. Festival Campaign Package - ₹2,999 */}
            <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-2">
                    Festival Campaign Package
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[9px]">
                      ₹2,999
                    </Badge>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Includes Ticker + Push + Email + Festival Hub placement
                  </span>
                </div>
              </div>
              <Switch
                checked={campaignData.festivalPackage || false}
                onCheckedChange={(val) =>
                  setCampaignData({ ...campaignData, festivalPackage: val })
                }
              />
            </div>

            {/* 5. Performance Analytics Report - ₹799 */}
            <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-2">
                    Performance Analytics Report
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[9px]">
                      ₹799
                    </Badge>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Post-campaign PDF attribution report with ROI breakdown
                  </span>
                </div>
              </div>
              <Switch
                checked={campaignData.analyticsReport || false}
                onCheckedChange={(val) =>
                  setCampaignData({ ...campaignData, analyticsReport: val })
                }
              />
            </div>
          </div>
        </div>

        {/* Target Audience Selector */}
        <div className="space-y-2 pt-2">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Users className="w-3.5 h-3.5 text-blue-600" /> Target Audience
            Selection *
          </Label>
          <Select
            value={campaignData.audience}
            onValueChange={(val) =>
              setCampaignData({ ...campaignData, audience: val })
            }
          >
            <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
              <SelectValue placeholder="Target audience" />
            </SelectTrigger>
            <SelectContent className="z-[300]">
              {targetAudiences.map((aud) => (
                <SelectItem key={aud.id} value={aud.id}>
                  {aud.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
        >
          Next &gt;
        </Button>
      </div>
    </Card>
  );
}
