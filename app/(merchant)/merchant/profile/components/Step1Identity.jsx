"use client";

import { Briefcase, Link2, Mail, Phone, Store, User } from "lucide-react";
import { FormInput, FormSelect } from "@/components/shared/form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  { value: "fashion", label: "Fashion & Clothing" },
  { value: "food", label: "Food & Dining" },
  { value: "electronics", label: "Electronics & Gadgets" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "home", label: "Home & Living" },
  { value: "home-improvement", label: "Home Improvement" },
  { value: "fitness", label: "Fitness & Healthcare" },
  { value: "education", label: "Education & Courses" },
  { value: "kids-baby", label: "Kids & Baby Products" },
  { value: "jewellery", label: "Jewellery & Accessories" },
  { value: "automotive", label: "Automobile & Auto Services" },
  { value: "entertainment", label: "Gaming & Entertainment" },
  { value: "grocery", label: "Grocery & Essentials" },
  { value: "finance", label: "Finance & Insurance" },
];

const CONSTITUTIONS = [
  { value: "proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "private_limited", label: "Private Limited Company (Pvt Ltd)" },
  { value: "public_limited", label: "Public Limited Company" },
];

const DESIGNATIONS = [
  { value: "owner", label: "Proprietor / Managing Partner" },
  { value: "director", label: "Company Director" },
  { value: "manager", label: "Authorized Signatory / General Manager" },
];

export default function Step1Identity({
  formData,
  setFormData,
  handleBusinessNameChange,
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-6 space-y-5 text-left font-sans">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Store className="w-4 h-4 text-blue-600" />
          <span>1. Business Logical Identity &amp; Categorization</span>
        </h3>
        <Badge
          variant="outline"
          className="text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-200"
        >
          Required Step 1 of 4
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          name="businessName"
          label="Legal Entity Corporate Name"
          icon={Store}
          placeholder="e.g. Burger House Pvt Ltd"
          value={formData.businessName}
          onChange={handleBusinessNameChange}
          required
        />

        <FormInput
          name="slug"
          label="Consumer Trade Brand Name"
          icon={Link2}
          placeholder="e.g. Burger House"
          value={formData.slug}
          onChange={(e) =>
            setFormData({
              ...formData,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
            })
          }
          hint="Sub-domain slug for your offer page"
        />

        <FormSelect
          name="constitution"
          label="Business Constitution Type"
          icon={Briefcase}
          options={CONSTITUTIONS}
          value={formData.constitution || "proprietorship"}
          onValueChange={(val) =>
            setFormData({ ...formData, constitution: val })
          }
          required
        />

        <FormSelect
          name="category"
          label="Primary Industry Vertical"
          icon={Store}
          options={CATEGORIES}
          value={formData.category || "food"}
          onValueChange={(val) => setFormData({ ...formData, category: val })}
          required
        />

        <FormInput
          name="contactEmail"
          label="Official Contact Email"
          icon={Mail}
          type="email"
          placeholder="contact@business.com"
          value={formData.contactEmail}
          onChange={(e) =>
            setFormData({ ...formData, contactEmail: e.target.value })
          }
          required
        />

        <FormInput
          name="contactPhone"
          label="Primary Phone Number"
          icon={Phone}
          type="tel"
          placeholder="10-digit mobile number"
          value={formData.contactPhone}
          onChange={(e) =>
            setFormData({ ...formData, contactPhone: e.target.value })
          }
          required
        />

        <FormInput
          name="liaisonName"
          label="Primary Contact Representative"
          icon={User}
          placeholder="Full Name"
          value={formData.liaisonName}
          onChange={(e) =>
            setFormData({ ...formData, liaisonName: e.target.value })
          }
        />

        <FormSelect
          name="liaisonDesignation"
          label="Representative Position"
          icon={Briefcase}
          options={DESIGNATIONS}
          value={formData.liaisonDesignation || "owner"}
          onValueChange={(val) =>
            setFormData({ ...formData, liaisonDesignation: val })
          }
        />
      </div>
    </Card>
  );
}
