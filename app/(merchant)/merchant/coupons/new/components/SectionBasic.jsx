"use client";

import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Upload,
} from "lucide-react";
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

const CATEGORIES = [
  { id: "fashion", label: "Fashion & Clothing" },
  { id: "food", label: "Food & Dining" },
  { id: "electronics", label: "Electronics & Gadgets" },
  { id: "beauty", label: "Beauty & Wellness" },
  { id: "travel", label: "Travel & Hospitality" },
  { id: "home", label: "Home & Living" },
  { id: "home-improvement", label: "Home Improvement" },
  { id: "fitness", label: "Fitness & Healthcare" },
  { id: "education", label: "Education & Courses" },
  { id: "kids-baby", label: "Kids & Baby Products" },
  { id: "jewellery", label: "Jewellery & Accessories" },
  { id: "automotive", label: "Automobile & Auto Services" },
  { id: "entertainment", label: "Gaming & Entertainment" },
  { id: "grocery", label: "Grocery & Essentials" },
  { id: "finance", label: "Finance & Insurance" },
];

export default function SectionBasic({
  formData,
  setFormData,
  uploadingImage,
  handleImageUpload,
  onBack,
  onNext,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Section 2: Basic Offer Details
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Headline, short description, category &amp; banner image
        </p>
      </div>

      <div className="space-y-4">
        {/* Headline with 80-char limit */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Offer Headline /
            Title * (Max 80 Characters)
          </Label>
          <Input
            type="text"
            maxLength={80}
            placeholder="e.g. Flat 20% off on all Italian Marble Tiles"
            value={formData.headline}
            onChange={(e) =>
              setFormData({ ...formData, headline: e.target.value })
            }
            className="bg-white border-slate-200 text-xs h-10 rounded-xl font-medium"
          />
          <span className="text-[10px] text-slate-400 block text-right font-medium">
            {formData.headline.length}/80 chars
          </span>
        </div>

        {/* Short Description with 200-char limit */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Short
            Description * (Max 200 Characters)
          </Label>
          <Textarea
            maxLength={200}
            rows={3}
            placeholder="e.g. Get 20% discount on total invoice amount for all premium tiles."
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="bg-white border-slate-200 text-xs leading-relaxed rounded-xl"
          />
          <span className="text-[10px] text-slate-400 block text-right font-medium">
            {formData.shortDescription.length}/200 chars
          </span>
        </div>

        {/* Category Dropdown (15 Categories) */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Layers className="w-3.5 h-3.5 text-purple-600" /> Primary Category
            * (All 15 Launch Categories)
          </Label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="z-[300]">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offer Image Upload with 800x400 Requirement */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <ImageIcon className="w-3.5 h-3.5 text-orange-600" /> Banner Image
            Upload (Min 800×400px Required)
          </Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="https://example.com/marble-tile-deal.jpg or upload below"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="bg-white border-slate-200 text-xs h-10 rounded-xl flex-1"
            />
            <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 rounded-xl cursor-pointer shrink-0 border border-slate-200">
              <Upload className="w-3.5 h-3.5 text-orange-600" />
              <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            📷 Preferred resolution: 800×400px horizontal landscape image
            (PNG/JPG, max 5MB).
          </span>
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
          <span>Continue to Discount &amp; Code</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
