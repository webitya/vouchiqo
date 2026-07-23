"use client";

import { FileCheck, FileText, Shield } from "lucide-react";
import { FormInput, FormSelect } from "@/components/shared/form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const DOC_TYPES = [
  {
    value: "GST Registration Certificate",
    label: "GST Registration Certificate (Preferred)",
  },
  {
    value: "Udyam / MSME Certificate",
    label: "Udyam / MSME Registration Certificate",
  },
  { value: "Trade Licence", label: "Trade Licence (Municipal Corporation)" },
  {
    value: "Shop & Establishment Act",
    label: "Shop & Establishment Act Registration",
  },
  { value: "Owner PAN Card", label: "PAN Card of Business Owner" },
];

export default function Step3KYC({ formData, setFormData }) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5 text-left font-sans">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>3. Financial Accounting &amp; Statutory KYC</span>
        </h3>
        <Badge
          variant="outline"
          className="text-[10px] font-bold bg-purple-50 text-purple-700 border-purple-200"
        >
          Step 3 of 4
        </Badge>
      </div>

      <div className="space-y-4">
        <FormSelect
          name="docType"
          label="Primary Identity Document Type"
          icon={FileCheck}
          options={DOC_TYPES}
          value={formData.docType || "GST Registration Certificate"}
          onValueChange={(val) => setFormData({ ...formData, docType: val })}
          required
        />

        <FormInput
          name="pan"
          label="Permanent Account Number (PAN)"
          icon={FileText}
          maxLength={10}
          placeholder="10-digit alphanumeric (e.g. ABCDE1234F)"
          value={formData.pan}
          onChange={(e) =>
            setFormData({ ...formData, pan: e.target.value.toUpperCase() })
          }
          className="font-mono uppercase font-bold"
          required
        />

        <div className="space-y-3">
          <FormInput
            name="gstin"
            label="GST Identification Number (GSTIN)"
            icon={FileText}
            maxLength={15}
            placeholder="15-digit alphanumeric (e.g. 22AAAAA1111A1Z1)"
            value={formData.gstin}
            onChange={(e) =>
              setFormData({ ...formData, gstin: e.target.value.toUpperCase() })
            }
            disabled={formData.isGstExempt}
            className="font-mono uppercase font-bold"
          />

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer select-none">
            <Checkbox
              id="gst-exempt"
              checked={formData.isGstExempt}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isGstExempt: !!checked,
                  gstin: checked ? "" : formData.gstin,
                })
              }
            />
            <span className="text-xs text-slate-700 font-semibold leading-relaxed">
              I certify that my commercial enterprise is currently unregistered
              under the Indian GST regime as an exempt micro-merchant (turnover
              under ₹40 Lakhs).
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
}
