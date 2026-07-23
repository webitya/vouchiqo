"use client";

import { CheckCircle2, MessageSquare, Package, Users } from "lucide-react";
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

export default function StepReview({
  campaignData,
  setCampaignData,
  calculateAddOnTotal,
  onSubmit,
  isPending,
  onBack,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left font-sans">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Review &amp; Submit Campaign for Review
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">
          Review staff readiness, stock confirmation &amp; mandatory compliance
          agreements
        </p>
      </div>

      <div className="space-y-5">
        {/* Summary Box */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Campaign Name:</span>
            <span className="font-bold text-slate-900">
              {campaignData.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Campaign Type:</span>
            <span className="font-bold text-slate-900 capitalize">
              {campaignData.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Promo Code:</span>
            <span className="font-mono font-bold text-[#e85d04]">
              {campaignData.code}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">
              Target Audience:
            </span>
            <span className="font-bold text-slate-900 capitalize">
              {campaignData.audience}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
            <span>Total Channel Add-Ons:</span>
            <span className="text-[#e85d04]">₹{calculateAddOnTotal()}</span>
          </div>
        </div>

        {/* Staff Readiness & Stock Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Users className="w-3.5 h-3.5 text-blue-600" /> Staff Readiness
              Check *
            </Label>
            <Select
              value={campaignData.staffReady}
              onValueChange={(val) =>
                setCampaignData({ ...campaignData, staffReady: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Select staff readiness" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="yes">
                  Yes — my team has been briefed and knows the offer code
                </SelectItem>
                <SelectItem value="partially">
                  Partially — I will brief them before launch
                </SelectItem>
                <SelectItem value="no">
                  No — I need to brief them first
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Package className="w-3.5 h-3.5 text-emerald-600" /> Stock /
              Capacity Confirmation *
            </Label>
            <Select
              value={campaignData.stockConfirmation || "yes"}
              onValueChange={(val) =>
                setCampaignData({ ...campaignData, stockConfirmation: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                <SelectValue placeholder="Select stock confirmation" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="yes">
                  Yes — sufficient stock &amp; capacity reserved
                </SelectItem>
                <SelectItem value="limited">
                  Limited stock — usage cap applied
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Internal Note to Campaign Team */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" /> Internal
            Note to Campaign Verification Team (Optional)
          </Label>
          <Textarea
            rows={2}
            placeholder="e.g. Please approve before Thursday 5 PM for pre-Diwali push broadcast."
            value={campaignData.internalNote || ""}
            onChange={(e) =>
              setCampaignData({ ...campaignData, internalNote: e.target.value })
            }
            className="bg-white border-slate-200 text-xs rounded-xl"
          />
        </div>

        {/* Mandatory Checkbox Agreements */}
        <div className="space-y-3 pt-2">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mandatory
            Compliance Confirmations
          </Label>
          <div className="space-y-2">
            {[
              {
                key: "agreed1",
                text: "My campaign offer is genuine, tested, and will work from the Start Date.",
              },
              {
                key: "agreed2",
                text: "All terms including minimum order, cap, and exclusions are fully disclosed.",
              },
              {
                key: "agreed3",
                text: "My counter team is briefed and ready to process campaign redemptions.",
              },
              {
                key: "agreed4",
                text: "I understand this campaign is actively promoted across Vouchiqo and will honor all redemptions.",
              },
              {
                key: "agreed5",
                text: "I understand selected add-ons are billed separately upon scheduling confirmation.",
              },
            ].map((chk) => {
              const isChecked = campaignData[chk.key];
              return (
                <label
                  key={chk.key}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold"
                      : "bg-slate-50/50 border-slate-200/80 text-slate-700 hover:border-slate-300 font-medium"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(val) =>
                      setCampaignData({ ...campaignData, [chk.key]: !!val })
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

      {/* Step 4 Actions */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-slate-700 border-slate-200 text-xs font-bold rounded-xl cursor-pointer"
        >
          &lt; Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="bg-[#e85d04] hover:bg-orange-600 text-white text-xs font-bold py-2.5 px-8 rounded-xl shadow-xs cursor-pointer"
        >
          {isPending ? "Submitting..." : "Submit Campaign for Review"}
        </Button>
      </div>
    </Card>
  );
}
