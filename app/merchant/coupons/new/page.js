"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
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
import { COUPON_CATEGORIES } from "@/utils/constants";

export default function CreateCoupon() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    category: COUPON_CATEGORIES[0], // "food"
    discountType: "percentage",
    discountValue: "",
    expiresAt: "",
    usageLimit: "",
    integrationType: "static",
    apiEndpoint: "",
  });

  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch merchant profile for display
  const { data: merchant } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newCoupon) => {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCoupon),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to create coupon campaign.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setSuccess(true);
    },
    onError: (err) => {
      setFormError(err.message || "An unexpected error occurred.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Category is already a valid COUPON_CATEGORIES value (lowercase)
    const category = COUPON_CATEGORIES.includes(formData.category)
      ? formData.category
      : "other";

    // Validations & type conversion
    const expiresDate = new Date(formData.expiresAt);
    if (Number.isNaN(expiresDate.getTime())) {
      setFormError("Please enter a valid expiry date.");
      return;
    }

    if (expiresDate <= new Date()) {
      setFormError("Expiry date must be in the future.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      code: formData.code.toUpperCase(),
      category,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      expiresAt: expiresDate.toISOString(),
      maxClaims: formData.usageLimit
        ? parseInt(formData.usageLimit, 10)
        : undefined,
    };

    mutation.mutate(payload);
  };

  return (
    <DashboardLayout
      title="Create Coupon"
      user={{ name: merchant?.businessName || "Merchant", role: "merchant" }}
    >
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between bg-brand-bg border border-brand-border p-4 rounded-xl shadow-sm">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s
                  ? "bg-brand-navy text-white"
                  : step > s
                    ? "bg-brand-success text-white"
                    : "bg-brand-surface border border-brand-border text-brand-subtext"
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-xs font-bold ${step === s ? "text-brand-navy" : "text-brand-subtext"}`}
            >
              {s === 1 ? "Details" : s === 2 ? "Rules" : "Integration"}
            </span>
          </div>
        ))}
      </div>

      {/* Form Box */}
      <div className="bg-brand-bg border border-brand-border rounded-xl p-6 shadow-sm">
        {success
          ? <div className="text-center py-8 space-y-5">
              <div className="mx-auto w-12 h-12 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center border border-brand-success/20">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-brand-text">
                  Coupon Created Successfully!
                </h3>
                <p className="text-xs text-brand-subtext max-w-xs mx-auto leading-relaxed">
                  Your discount campaign has been submitted to the platform. It
                  is now active and ready for customers to claim.
                </p>
              </div>
              <Link
                href="/merchant/coupons"
                className="btn-primary text-xs py-2 px-6 rounded-lg inline-flex items-center justify-center font-bold border-0 cursor-pointer shadow-none h-auto"
              >
                Return to Coupons List
              </Link>
            </div>
          : <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="p-3.5 rounded-lg bg-brand-error/5 border border-brand-error/15 text-brand-error text-xs font-semibold text-center">
                  {formError}
                </div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
                    Step 1: Campaign Details
                  </h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-brand-text uppercase">
                      Offer Title / Heading
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. 50% Off your next dinner"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-brand-text uppercase">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          category: val,
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-brand-bg border border-brand-border">
                        {COUPON_CATEGORIES.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="text-xs font-semibold capitalize"
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-brand-text uppercase">
                      Terms / Description
                    </Label>
                    <Textarea
                      placeholder="Detail maximum discount caps, eligibility, and validation rules..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full min-h-[80px] p-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Rules */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
                    Step 2: Discount & Usage Rules
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-brand-text uppercase">
                        Type
                      </Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(val) =>
                          setFormData({
                            ...formData,
                            discountType: val,
                          })
                        }
                      >
                        <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-bg border border-brand-border">
                          <SelectItem
                            value="percentage"
                            className="text-xs font-semibold"
                          >
                            Percentage OFF
                          </SelectItem>
                          <SelectItem
                            value="fixed"
                            className="text-xs font-semibold"
                          >
                            Fixed Cash OFF
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-brand-text uppercase">
                        Value
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={formData.discountValue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountValue: e.target.value,
                          })
                        }
                        className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-brand-text uppercase">
                        Promo Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. ZOMATO50"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue font-mono uppercase"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-brand-text uppercase">
                        Expiry Date
                      </Label>
                      <Input
                        type="date"
                        value={formData.expiresAt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expiresAt: e.target.value,
                          })
                        }
                        className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-brand-text uppercase">
                      Usage Limit (Max Claims)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 500 claims (Optional)"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usageLimit: e.target.value,
                        })
                      }
                      className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Integration */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-navy font-heading uppercase tracking-wider border-b border-brand-border pb-3">
                    Step 3: Verification Integration
                  </h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-brand-text uppercase">
                      Integration Mode
                    </Label>
                    <Select
                      value={formData.integrationType}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          integrationType: val,
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-brand-surface border border-brand-border text-xs rounded-lg h-10 px-3 shadow-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select Integration Mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-brand-bg border border-brand-border">
                        <SelectItem
                          value="static"
                          className="text-xs font-semibold"
                        >
                          Static Vouchiqo Codes (No API required)
                        </SelectItem>
                        <SelectItem
                          value="api"
                          className="text-xs font-semibold"
                        >
                          Dynamic Webhook API validation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.integrationType === "api" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-brand-text uppercase">
                        Store Validation Webhook URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://mystore.com/api/vouchers/verify"
                        value={formData.apiEndpoint}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiEndpoint: e.target.value,
                          })
                        }
                        className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                        required
                      />
                    </div>
                  )}
                  <div className="flex gap-2.5 p-3.5 rounded-lg bg-brand-surface border border-brand-border text-xs text-brand-subtext leading-relaxed">
                    <Info className="w-4 h-4 text-brand-blue flex-shrink-0" />
                    <span>
                      By completing registration, you authorize Vouchiqo nodes
                      to run client validation checks. Stale or inactive
                      campaigns will be auto-flagged.
                    </span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-between border-t border-brand-border pt-4 mt-6">
                {step > 1
                  ? <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="btn-tertiary text-xs py-2 px-4 flex items-center gap-1.5 border border-brand-border rounded-lg cursor-pointer h-auto shadow-none hover:bg-brand-surface"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </Button>
                  : <div></div>}

                {step < 3
                  ? <Button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary text-xs py-2 px-6 flex items-center gap-1.5 border-0 h-auto cursor-pointer shadow-none animate-none"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  : <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="btn-primary text-xs py-2 px-6 border-0 h-auto cursor-pointer shadow-none animate-none"
                    >
                      {mutation.isPending ? "Creating..." : "Create Campaign"}
                    </Button>}
              </div>
            </form>}
      </div>
    </DashboardLayout>
  );
}
