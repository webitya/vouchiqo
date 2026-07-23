"use client";

import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  FileText,
  Gift,
  Link2,
  Percent,
  RefreshCw,
  ShieldCheck,
  Tag,
  Ticket,
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

export default function SectionDiscount({
  formData,
  setFormData,
  generateRandomCode,
  onBack,
  onNext,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Section 3: Discount &amp; Code Mechanics
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure codes, discount values, caps &amp; pricing
        </p>
      </div>

      {formData.offerType === "code" && (
        <div className="space-y-4">
          {/* Uppercase Offer Code (No Spaces) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Ticket className="w-3.5 h-3.5 text-orange-600" /> Offer Code *
                (Uppercase, No Spaces)
              </Label>
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-[11px] font-bold text-[#e85d04] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Auto-generate Code
              </button>
            </div>
            <Input
              type="text"
              placeholder="e.g. MARBLE20"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase().replace(/\s/g, ""),
                })
              }
              className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          {/* Discount Type Dropdown & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Percent className="w-3.5 h-3.5 text-blue-600" /> Discount Type
                Dropdown *
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(val) =>
                  setFormData({ ...formData, discountType: val })
                }
              >
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                  <SelectValue placeholder="Discount format" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="% Off">
                    % Off (Percentage Discount)
                  </SelectItem>
                  <SelectItem value="Flat ₹ Off">
                    Flat ₹ Off (Fixed Amount)
                  </SelectItem>
                  <SelectItem value="Free Shipping">
                    Free Shipping / Delivery
                  </SelectItem>
                  <SelectItem value="BOGO">BOGO (Buy 1 Get 1)</SelectItem>
                  <SelectItem value="Free Gift">
                    Free Gift with Purchase
                  </SelectItem>
                  <SelectItem value="Other">Other Custom Format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Discount
                Value * (Number Only)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 20 (for 20%)"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Max Discount Cap & Min Order Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Maximum
                Discount Cap (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 2000"
                value={formData.maxCap}
                onChange={(e) =>
                  setFormData({ ...formData, maxCap: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Tag className="w-3.5 h-3.5 text-amber-600" /> Minimum Order
                Value (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={formData.minOrderValue}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderValue: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Deal / Direct Link Mode */}
      {formData.offerType === "deal" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Link2 className="w-3.5 h-3.5 text-orange-600" /> Direct Deal URL
              *
            </Label>
            <Input
              type="url"
              placeholder="https://yourstore.com/sale-page"
              value={formData.dealUrl}
              onChange={(e) =>
                setFormData({ ...formData, dealUrl: e.target.value })
              }
              className="bg-white border-slate-200 text-xs h-10 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-slate-600" /> Original
                Price (MRP ₹) *
              </Label>
              <Input
                type="number"
                placeholder="e.g. 2000"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Tag className="w-3.5 h-3.5 text-[#e85d04]" /> Sale Price (Deal
                ₹) *
              </Label>
              <Input
                type="number"
                placeholder="e.g. 1499"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: e.target.value })
                }
                className="bg-white border-slate-200 text-xs h-10 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Special Offer / Gift Mode */}
      {formData.offerType === "special" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Gift className="w-3.5 h-3.5 text-purple-600" /> Special Offer
                Format Dropdown *
              </Label>
              <Select
                value={formData.specialOfferType}
                onValueChange={(val) =>
                  setFormData({ ...formData, specialOfferType: val })
                }
              >
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                  <SelectValue placeholder="Select special format" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="BOGO (Buy 1 Get 1)">
                    BOGO (Buy 1 Get 1)
                  </SelectItem>
                  <SelectItem value="Free Gift with Purchase">
                    Free Gift with Purchase
                  </SelectItem>
                  <SelectItem value="Free Service Upgrade">
                    Free Service Upgrade
                  </SelectItem>
                  <SelectItem value="Bundle / Combo Price">
                    Bundle / Combo Price
                  </SelectItem>
                  <SelectItem value="Loyalty Reward">Loyalty Reward</SelectItem>
                  <SelectItem value="Referral Offer">Referral Offer</SelectItem>
                  <SelectItem value="Other Special Deal">
                    Other Special Deal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Ticket className="w-3.5 h-3.5 text-blue-600" /> Redemption
                Method *
              </Label>
              <Select
                value={formData.redemptionMethod}
                onValueChange={(val) =>
                  setFormData({ ...formData, redemptionMethod: val })
                }
              >
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl text-xs h-10 px-3.5 font-bold text-slate-800">
                  <SelectValue placeholder="Select redemption method" />
                </SelectTrigger>
                <SelectContent className="z-[300]">
                  <SelectItem value="Show Vouchiqo Smart Code at counter">
                    Show Vouchiqo Smart Code at counter
                  </SelectItem>
                  <SelectItem value="Apply code at online checkout">
                    Apply code at online checkout
                  </SelectItem>
                  <SelectItem value="Direct link redirection">
                    Direct link redirection
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <FileText className="w-3.5 h-3.5 text-slate-700" /> Full Special
              Offer Details Text *
            </Label>
            <Textarea
              rows={3}
              placeholder="e.g. Buy any 2 Marble Slabs and get 1 Grout Sealer packet completely FREE."
              value={formData.offerDetails}
              onChange={(e) =>
                setFormData({ ...formData, offerDetails: e.target.value })
              }
              className="bg-white border-slate-200 text-xs rounded-xl"
            />
          </div>
        </div>
      )}

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
          <span>Continue to Validity &amp; Limits</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
