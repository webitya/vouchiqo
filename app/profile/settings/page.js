"use client";

import { Bell, CheckCircle2, Heart, MapPin, Save, User } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export default function CustomerProfile() {
  const [formData, setFormData] = useState({
    name: "Sarah Jenkins",
    email: "sarah@gmail.com",
    phone: "+1 (555) 019-2834",
    location: "New York, USA",
    interests: ["Food", "SaaS"],
    emailNotifications: true,
    smsNotifications: false,
    expiryAlerts: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Simulate save profile
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return {
          ...prev,
          interests: prev.interests.filter((i) => i !== interest),
        };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  return (
    <DashboardLayout
      title="Profile Settings"
      user={{ name: formData.name, role: "customer" }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="flex gap-2.5 p-3.5 rounded-lg bg-brand-success/5 border border-brand-success/15 text-brand-success text-xs font-semibold items-center">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Personal Info Grid */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-blue" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Full Name
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Email Address
              </Label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 opacity-65 cursor-not-allowed text-brand-subtext shadow-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Phone Number
              </Label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-brand-text uppercase">
                Default Location
              </Label>
              <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                <InputGroupAddon>
                  <MapPin className="w-4 h-4 text-brand-subtext" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="text-xs placeholder-brand-subtext h-full"
                />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* Interest categories selection */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand-blue" />
            <span>Interests & Recommendations</span>
          </h3>
          <p className="text-xs text-brand-subtext">
            Select your preferred coupon categories to customize your Homepage
            featured feed layout.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["Food", "Travel", "SaaS", "Fashion", "Wellness"].map(
              (interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`text-xs font-bold py-1.5 px-4 rounded-full border transition-all ${
                      isSelected
                        ? "bg-brand-navy text-white border-brand-navy"
                        : "bg-brand-bg border-brand-border text-brand-subtext hover:border-brand-navy hover:text-brand-navy"
                    }`}
                  >
                    {interest}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Notification settings */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-blue" />
            <span>Notification Settings</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-bold text-brand-text block font-heading">
                  Email Alerts
                </span>
                <span className="text-[10px] text-brand-subtext block">
                  Receive weekly updates on active campaign discounts.
                </span>
              </div>
              <Checkbox
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    emailNotifications: !!checked,
                  })
                }
                className="border-brand-border text-brand-blue"
              />
            </div>
            <hr className="border-brand-border/60" />
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-bold text-brand-text block font-heading">
                  SMS Notifications
                </span>
                <span className="text-[10px] text-brand-subtext block">
                  Receive claims confirmation keys via SMS.
                </span>
              </div>
              <Checkbox
                checked={formData.smsNotifications}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    smsNotifications: !!checked,
                  })
                }
                className="border-brand-border text-brand-blue"
              />
            </div>
            <hr className="border-brand-border/60" />
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-bold text-brand-text block font-heading">
                  Coupon Expiry Warnings
                </span>
                <span className="text-[10px] text-brand-subtext block">
                  Get warned 24 hours before your claimed vouchers expire.
                </span>
              </div>
              <Checkbox
                checked={formData.expiryAlerts}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    expiryAlerts: !!checked,
                  })
                }
                className="border-brand-border text-brand-blue"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-0 h-auto cursor-pointer shadow-none"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving changes..." : "Save Settings"}</span>
        </Button>
      </form>
    </DashboardLayout>
  );
}
