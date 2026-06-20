"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Save,
  Store,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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

export default function MerchantBusinessProfile() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    businessName: "",
    slug: "",
    category: "food",
    description: "",
    contactEmail: "",
    website: "",
    city: "",
    state: "",
    country: "IN",
  });

  // Fetch the current merchant's profile
  const {
    data: merchant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) throw new Error("Failed to load business profile");
      const json = await res.json();
      return json.data;
    },
  });

  // Populate form fields when profile is fetched
  useEffect(() => {
    if (merchant) {
      setFormData({
        businessName: merchant.businessName ?? "",
        slug: merchant.slug ?? "",
        category: merchant.category ?? "food",
        description: merchant.description ?? "",
        contactEmail: merchant.contactEmail ?? "",
        website: merchant.website ?? "",
        city: merchant.location?.city ?? "",
        state: merchant.location?.state ?? "",
        country: merchant.location?.country ?? "IN",
      });
    }
  }, [merchant]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`/api/merchants/${merchant._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message ?? "Failed to save profile changes");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-analytics"] });
      toast.success("Business profile updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update profile. Try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.businessName) {
      toast.error("Business name is required.");
      return;
    }

    const payload = {
      businessName: formData.businessName,
      description: formData.description || undefined,
      category: formData.category,
      contactEmail: formData.contactEmail || undefined,
      website: formData.website || undefined,
      location: {
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || "IN",
      },
    };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Business Profile" user={{ role: "merchant" }}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-subtext" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Business Profile" user={{ role: "merchant" }}>
        <div className="text-center py-20 text-brand-error font-semibold">
          Error loading profile. Please refresh the page.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Business Profile"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {updateMutation.isSuccess && (
          <div className="flex gap-2.5 p-3.5 rounded-lg bg-brand-success/5 border border-brand-success/15 text-brand-success text-xs font-semibold items-center">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Business profile details updated successfully!</span>
          </div>
        )}

        {/* Profile Image Placeholders */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
            Profile Images
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 text-center md:text-left">
              <Label className="text-xs font-bold text-brand-text uppercase block">
                Store Logo
              </Label>
              <div className="flex flex-col items-center justify-center border border-dashed border-brand-border rounded-lg p-5 bg-brand-surface hover:bg-brand-surface/75 cursor-pointer relative group">
                <Upload className="w-5 h-5 text-brand-subtext group-hover:text-brand-blue transition-colors mb-2" />
                <span className="text-[10px] text-brand-subtext font-semibold">
                  Upload 1:1 image
                </span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-brand-text uppercase block">
                Cover Banner
              </Label>
              <div className="flex flex-col items-center justify-center border border-dashed border-brand-border rounded-lg p-5 bg-brand-surface hover:bg-brand-surface/75 cursor-pointer relative group h-24">
                <Upload className="w-5 h-5 text-brand-subtext group-hover:text-brand-blue transition-colors mb-1" />
                <span className="text-[10px] text-brand-subtext font-semibold">
                  Upload high-res banner (16:9 ratio)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form Grid */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-blue" />
            <span>Business Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Company/Brand Name
              </Label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Slug (Read-Only)
              </Label>
              <Input
                type="text"
                value={formData.slug}
                className="bg-brand-surface/50 border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none opacity-70 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Market Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
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

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Store Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full min-h-[80px] p-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location operational details */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
            Contact & Operational Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Store Web Site
              </Label>
              <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                <InputGroupAddon>
                  <Globe className="w-4 h-4 text-brand-subtext" />
                </InputGroupAddon>
                <InputGroupInput
                  type="url"
                  placeholder="https://mysite.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="text-xs placeholder-brand-subtext h-full"
                />
              </InputGroup>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Contact Email
              </Label>
              <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                <InputGroupAddon>
                  <Globe className="w-4 h-4 text-brand-subtext" />
                </InputGroupAddon>
                <InputGroupInput
                  type="email"
                  placeholder="partner@mystore.com"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="text-xs placeholder-brand-subtext h-full"
                />
              </InputGroup>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                City / Location
              </Label>
              <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                <InputGroupAddon>
                  <MapPin className="w-4 h-4 text-brand-subtext" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="e.g. New York"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="text-xs placeholder-brand-subtext h-full"
                />
              </InputGroup>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                State / Region
              </Label>
              <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                <InputGroupAddon>
                  <MapPin className="w-4 h-4 text-brand-subtext" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="e.g. NY"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="text-xs placeholder-brand-subtext h-full"
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-0 h-auto cursor-pointer shadow-none"
        >
          {updateMutation.isPending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />}
          <span>
            {updateMutation.isPending
              ? "Saving changes..."
              : "Save Store Details"}
          </span>
        </Button>
      </form>
    </DashboardLayout>
  );
}
