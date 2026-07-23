"use client";

import { Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LivePreviewCard({
  formData,
  merchant,
  selectedCategoryLabel,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Eye className="w-4 h-4 text-[#e85d04]" /> Live Offer Preview
        </span>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200/60 text-[10px] font-bold"
        >
          Live Preview
        </Badge>
      </div>

      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div
          className="h-32 bg-slate-900 relative flex items-end p-4 bg-cover bg-center"
          style={{
            backgroundImage: formData.image
              ? `url(${formData.image})`
              : "linear-gradient(to right, #0f172a, #1e293b)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="relative z-10 flex items-center justify-between w-full">
            <Badge className="bg-[#e85d04] text-white font-bold text-[9px] uppercase px-2 py-0.5 border-0">
              {formData.offerType.toUpperCase()}
            </Badge>
            <span className="text-white text-[10px] font-bold bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              {merchant?.businessName || "Store Name"}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3.5">
          <div>
            <h4 className="text-sm font-black text-slate-900 leading-snug">
              {formData.headline || "Flat 20% off on all Italian Marble Tiles"}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">
              {formData.shortDescription ||
                "Get 20% discount on total invoice amount for all premium tiles."}
            </p>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 font-semibold">
              Code:{" "}
              <span className="font-mono text-slate-900 font-bold uppercase">
                {formData.code || "SAVE20"}
              </span>
            </span>
            <span className="text-[#e85d04] font-black">
              {formData.discountValue
                ? `${formData.discountValue}% OFF`
                : "SPECIAL OFFER"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-100 pt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {merchant?.address?.city || "Ranchi"}
            </span>
            <span className="text-slate-600 font-bold">
              {selectedCategoryLabel}
            </span>
          </div>

          <Button className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs cursor-default">
            Get In-Store Claim Code
          </Button>
        </div>
      </div>
    </Card>
  );
}
