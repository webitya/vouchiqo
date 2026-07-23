"use client";

import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  Lock,
  MapPin,
  Target,
  Users,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SectionValidity({
  formData,
  setFormData,
  toggleDay,
  onBack,
  onNext,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Section 4: Validity, Limits &amp; Target Restrictions
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Dates, usage limits, audience targeting &amp; geographic scope
        </p>
      </div>

      <div className="space-y-4">
        {/* Start Date & End Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Start Date *
            </Label>
            <DatePicker
              value={formData.startDate}
              onChange={(val) => setFormData({ ...formData, startDate: val })}
              placeholder="Select start date"
              iconColor="text-blue-600"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Clock className="w-3.5 h-3.5 text-rose-600" /> End Date *
            </Label>
            <DatePicker
              value={formData.endDate}
              onChange={(val) => setFormData({ ...formData, endDate: val })}
              placeholder="Select end date"
              iconColor="text-rose-600"
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Users className="w-3.5 h-3.5 text-purple-600" /> Total Usage
              Limit (Optional)
            </Label>
            <Input
              type="number"
              placeholder="e.g. 100 total redemptions"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
              className="bg-white border-slate-200 text-xs h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Per Customer Limit
            </Label>
            <Select
              value={formData.perCustomerLimit}
              onValueChange={(val) =>
                setFormData({ ...formData, perCustomerLimit: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Limit per user" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="1">1 time per customer</SelectItem>
                <SelectItem value="2">2 times per customer</SelectItem>
                <SelectItem value="unlimited">
                  Unlimited per customer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target Audience & Geographic Restrictions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Target className="w-3.5 h-3.5 text-blue-600" /> Target Audience
              Selection
            </Label>
            <Select
              value={formData.targetAudience}
              onValueChange={(val) =>
                setFormData({ ...formData, targetAudience: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Target audience" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="All Customers (Default)">
                  All Customers (Default)
                </SelectItem>
                <SelectItem value="New Customers Only">
                  New Customers Only
                </SelectItem>
                <SelectItem value="Returning Customers Only">
                  Returning Customers Only
                </SelectItem>
                <SelectItem value="Specific Demographic">
                  Specific Demographic
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> Geographic
              Restriction
            </Label>
            <Select
              value={formData.geographicRestriction}
              onValueChange={(val) =>
                setFormData({ ...formData, geographicRestriction: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Geographic scope" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="All India (Online Delivery)">
                  All India (Online Delivery)
                </SelectItem>
                <SelectItem value="Ranchi only — in-store at my listed address">
                  Ranchi only (In-Store)
                </SelectItem>
                <SelectItem value="Jharkhand only (Regional)">
                  Jharkhand only (Regional)
                </SelectItem>
                <SelectItem value="Multiple Cities">
                  Multiple Select Cities
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Valid Days & Hours Restrictions */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" /> Day
            Restrictions (Optional)
          </Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = formData.validDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                  )}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-600" /> Time Restrictions
            (e.g. 11:00 AM – 4:00 PM)
          </Label>
          <Input
            type="text"
            placeholder="e.g. Valid only 12:00 PM to 04:00 PM"
            value={formData.validHours}
            onChange={(e) =>
              setFormData({ ...formData, validHours: e.target.value })
            }
            className="bg-white border-slate-200 text-xs h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Terms &amp; Submit</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
