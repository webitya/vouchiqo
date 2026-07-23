"use client";

import { FileText, MessageSquare, Tag, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function StepBasics({
  campaignData,
  setCampaignData,
  campaignTypes,
  objectives,
  onCancel,
  onNext,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Campaign Basics</h3>
      </div>

      <div className="space-y-5">
        {/* Campaign Name */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Campaign Name *
          </Label>
          <Input
            type="text"
            placeholder="e.g. Summer Sale Blast"
            value={campaignData.name}
            onChange={(e) =>
              setCampaignData({ ...campaignData, name: e.target.value })
            }
            className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
          />
        </div>

        {/* Campaign Type Select */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Tag className="w-3.5 h-3.5 text-blue-600" /> Campaign Type *
          </Label>
          <Select
            value={campaignData.type}
            onValueChange={(val) =>
              setCampaignData({ ...campaignData, type: val })
            }
          >
            <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent className="z-[300]">
              {campaignTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.badge})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Festival Selector if type === 'festival' */}
        {campaignData.type === "festival" && (
          <div className="p-4 border border-purple-200 rounded-xl bg-purple-50/60 space-y-2">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
              <Tag className="w-3.5 h-3.5 text-purple-600" /> Target
              Festival Template *
            </Label>
            <Select
              value={campaignData.festivalName || "Diwali Grand Festival"}
              onValueChange={(val) =>
                setCampaignData({ ...campaignData, festivalName: val })
              }
            >
              <SelectTrigger className="w-full bg-white border-purple-200 rounded-xl text-xs h-10 px-3.5 font-bold text-purple-900">
                <SelectValue placeholder="Select festival..." />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="Diwali Grand Festival">
                  🪔 Diwali Grand Festival (5 Days)
                </SelectItem>
                <SelectItem value="Holi Festive Saver">
                  🎨 Holi Festive Saver (3 Days)
                </SelectItem>
                <SelectItem value="Durga Puja Special">
                  🌺 Durga Puja Special (4 Days)
                </SelectItem>
                <SelectItem value="Eid Special Offers">
                  🌙 Eid Special Offers (3 Days)
                </SelectItem>
                <SelectItem value="New Year Shopping Bash">
                  🎆 New Year Shopping Bash (2 Days)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Target Objective */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Target className="w-3.5 h-3.5 text-blue-600" /> Primary Campaign
            Objective *
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {objectives.map((obj) => {
              const isSelected = campaignData.objective === obj;
              return (
                <label
                  key={obj}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-600 text-slate-900 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="objective"
                    checked={isSelected}
                    onChange={() =>
                      setCampaignData({ ...campaignData, objective: obj })
                    }
                    className="accent-blue-600 w-3.5 h-3.5"
                  />
                  <span>{obj}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Public Headline */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Ticker Public
            Headline (Recommended)
          </Label>
          <Input
            type="text"
            maxLength={70}
            placeholder="e.g. 🔥 Flat 20% off all orders during Summer Sale Blast"
            value={campaignData.headline}
            onChange={(e) =>
              setCampaignData({ ...campaignData, headline: e.target.value })
            }
            className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />{" "}
              Description
            </Label>
            <span className="text-[10px] text-slate-400 font-medium">
              Internal note (not shown publicly)
            </span>
          </div>
          <Textarea
            rows={3}
            placeholder="Describe the scope and plan for this campaign..."
            value={campaignData.description}
            onChange={(e) =>
              setCampaignData({ ...campaignData, description: e.target.value })
            }
            className="bg-white border-slate-200 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Step 1 Actions */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-slate-700 border-slate-200 text-xs font-bold rounded-xl"
        >
          &lt; Cancel
        </Button>
        <Button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          Next &gt;
        </Button>
      </div>
    </Card>
  );
}
