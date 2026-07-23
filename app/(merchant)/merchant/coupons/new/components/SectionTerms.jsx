"use client";

import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function SectionTerms({
  formData,
  setFormData,
  onSubmit,
  isPending,
  onBack,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Section 5: Terms, Combinability &amp; Verification Submission
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Rules, combinability, internal note to verification team &amp; submit
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms & Conditions Textarea */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileText className="w-3.5 h-3.5 text-slate-700" /> Full Terms &amp;
            Conditions (Numbered Textarea) *
          </Label>
          <Textarea
            rows={4}
            placeholder="1. Valid on bill ₹5,000+. 2. Max discount ₹2,000. 3. Cannot be combined with other offers."
            value={formData.termsAndConditions}
            onChange={(e) =>
              setFormData({ ...formData, termsAndConditions: e.target.value })
            }
            className="bg-white border-slate-200 text-xs leading-relaxed rounded-xl"
          />
        </div>

        {/* Combinability & Honoured All Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Lock className="w-3.5 h-3.5 text-purple-600" /> Combinability
              Selection
            </Label>
            <Select
              value={formData.combinability}
              onValueChange={(val) =>
                setFormData({ ...formData, combinability: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Combinability rule" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="No — cannot be combined with any other offer">
                  No — cannot be combined
                </SelectItem>
                <SelectItem value="Yes — stackable with store promotions">
                  Yes — stackable with store promotions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" /> Honoured
              All Days Selection
            </Label>
            <Select
              value={formData.honouredAllDays}
              onValueChange={(val) =>
                setFormData({ ...formData, honouredAllDays: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Honoured all days" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="Yes — every day during the validity period">
                  Yes — every day during validity
                </SelectItem>
                <SelectItem value="No — excluding public holidays/festivals">
                  No — excluding public holidays/festivals
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Internal Note to Verification Team */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Internal
            Note to Verification Team (Optional)
          </Label>
          <Textarea
            rows={2}
            placeholder="e.g. Please approve urgently before Friday 10 AM for weekend festival sale launch."
            value={formData.internalNote}
            onChange={(e) =>
              setFormData({ ...formData, internalNote: e.target.value })
            }
            className="bg-white border-slate-200 text-xs rounded-xl"
          />
        </div>

        {/* Mandatory Compliance Checkboxes */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mandatory
            Merchant Confirmation Checkboxes
          </Label>
          <div className="space-y-2">
            {[
              {
                key: "agreed1",
                text: "My offer is genuine, tested, and will be honored at counter.",
              },
              {
                key: "agreed2",
                text: "All terms including minimum order and max cap are accurately disclosed.",
              },
              {
                key: "agreed3",
                text: "My counter billing staff is briefed and ready to process Smart Codes.",
              },
              {
                key: "agreed4",
                text: "I understand Vouchiqo compliance checks and honor all customer redemptions.",
              },
            ].map((chk) => {
              const isChecked = formData[chk.key];
              return (
                <label
                  key={chk.key}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all",
                    isChecked
                      ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold"
                      : "bg-slate-50/50 border-slate-200/80 text-slate-700 hover:border-slate-300 font-medium",
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, [chk.key]: !!val })
                    }
                    className="mt-0.5 shrink-0"
                  />
                  <span className="leading-relaxed select-none">
                    {chk.text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-8 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          {isPending
            ? "Submitting for Verification..."
            : "Submit for Verification"}
        </Button>
      </div>
    </Card>
  );
}
