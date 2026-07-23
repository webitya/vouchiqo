"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bell,
  Building,
  Camera,
  Code,
  Globe,
  Key,
  Laptop,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Store,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FormActions,
  FormInput,
  FormSection,
  FormTextarea,
} from "@/components/shared/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showError, showSuccess } from "@/lib/toast";

// ─── Notification rows config ──────────────────────────────────────────────
const NOTIF_ROWS = [
  {
    key: "couponClaimEmail",
    label: "Coupon Claims & Redemptions",
    desc: "Real-time notification when a user claims your code",
  },
  {
    key: "campaignApprovalEmail",
    label: "Campaign Approvals & Status",
    desc: "Status updates when your campaign is approved by Vouchiqo",
  },
  {
    key: "weeklyReportEmail",
    label: "Weekly Performance Reports",
    desc: "Weekly analytics PDF delivered to your inbox every Monday",
  },
  {
    key: "billingAlertEmail",
    label: "Billing & Subscription Invoices",
    desc: "Invoice PDFs and renewal reminders",
  },
];

export default function MerchantAccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const { data: merchant } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const res = await fetch("/api/merchants/me");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  });

  const [logoUrl, setLogoUrl] = useState(
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
  );
  const [businessDesc, setBusinessDesc] = useState(
    "Marbella Tiles & Sanitaryware is Ranchi's leading showroom for premium Italian marble, bath fittings, and porcelain tiles.",
  );
  const [socials, setSocials] = useState({
    instagram: "https://instagram.com/marbella_tiles",
    facebook: "https://facebook.com/marbellaranchi",
    twitter: "https://twitter.com/marbellatiles",
    linkedin: "https://linkedin.com/company/marbella-tiles",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Chrome 126 on Windows 11 (This Device)",
      location: "Ranchi, Jharkhand",
      ip: "103.24.182.14",
      current: true,
    },
    {
      id: "sess-2",
      device: "Safari on iPhone 15 Pro",
      location: "Patna, Bihar",
      ip: "49.36.192.88",
      current: false,
    },
    {
      id: "sess-3",
      device: "Chrome on macOS Sonoma",
      location: "Kolkata, West Bengal",
      ip: "182.72.99.10",
      current: false,
    },
  ]);
  const [notifMatrix, setNotifMatrix] = useState({
    couponClaimEmail: true,
    couponClaimSms: false,
    campaignApprovalEmail: true,
    campaignApprovalPush: true,
    weeklyReportEmail: true,
    billingAlertEmail: true,
    billingAlertSms: true,
  });

  const handleRevokeSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showSuccess("Session revoked successfully.");
  };

  return (
    <DashboardLayout
      title="Account Settings"
      user={{
        name: merchant?.businessName || "Merchant Partner",
        role: "merchant",
      }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-brand-surface p-1.5 rounded-2xl border border-brand-border flex flex-wrap gap-1 justify-start h-auto w-full">
            <TabsTrigger
              value="profile"
              className="text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-brand-blue" /> Business Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account &
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" /> Notification
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-purple-600" /> API Access
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-1.5 text-brand-error"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-brand-error" /> Danger
              Zone
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: BUSINESS PROFILE ─────────────────────────────────── */}
          <TabsContent value="profile" className="pt-4">
            <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showSuccess("Business profile & logo saved successfully!");
                }}
                className="space-y-6"
              >
                <FormSection
                  title="Business Profile & Branding"
                  icon={Building}
                  description="Store logo, description, and official social media profiles"
                  noBorder
                >
                  {/* Logo Upload */}
                  <div className="flex items-center gap-6 p-4 bg-brand-surface rounded-2xl border border-brand-border">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-border shadow-sm bg-brand-surface shrink-0">
                      {/* biome-ignore lint/performance/noImgElement: logo preview blob/url */}
                      <img
                        src={logoUrl}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <FormInput
                        name="logoUrl"
                        label="Store Logo URL"
                        icon={Upload}
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        hint="Recommended: 300×300px square PNG/JPG with transparent background."
                      />
                      <label className="inline-flex items-center gap-1.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer">
                        <Upload className="w-3 h-3" /> Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLogoUrl(URL.createObjectURL(file));
                              showSuccess("Logo preview updated!");
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Business Description */}
                  <FormTextarea
                    name="businessDesc"
                    label="Business Description"
                    icon={MessageSquare}
                    rows={3}
                    maxLength={300}
                    showCounter
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                  />

                  {/* Social Links */}
                  <FormSection title="Official Social Media Profiles" noBorder>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        name="instagram"
                        label="Instagram Profile URL"
                        icon={Camera}
                        type="url"
                        value={socials.instagram}
                        onChange={(e) =>
                          setSocials({ ...socials, instagram: e.target.value })
                        }
                      />
                      <FormInput
                        name="facebook"
                        label="Facebook Page URL"
                        icon={Share2}
                        type="url"
                        value={socials.facebook}
                        onChange={(e) =>
                          setSocials({ ...socials, facebook: e.target.value })
                        }
                      />
                      <FormInput
                        name="twitter"
                        label="Twitter / X Profile URL"
                        icon={Send}
                        type="url"
                        value={socials.twitter}
                        onChange={(e) =>
                          setSocials({ ...socials, twitter: e.target.value })
                        }
                      />
                      <FormInput
                        name="linkedin"
                        label="LinkedIn Company URL"
                        icon={Globe}
                        type="url"
                        value={socials.linkedin}
                        onChange={(e) =>
                          setSocials({ ...socials, linkedin: e.target.value })
                        }
                      />
                    </div>
                  </FormSection>

                  <FormActions submitText="Save Business Profile" align="end" />
                </FormSection>
              </form>
            </Card>
          </TabsContent>

          {/* ── TAB 2: ACCOUNT & SECURITY ────────────────────────────────── */}
          <TabsContent value="security" className="pt-4">
            <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-6">
              <FormSection
                title="Account & Security Settings"
                icon={ShieldCheck}
                description="Two-factor authentication and active login session management"
                noBorder
              >
                {/* 2FA Toggle */}
                <div className="p-4 border border-brand-border rounded-2xl flex items-center justify-between bg-brand-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-text flex items-center gap-2">
                        Two-Factor Authentication (2FA)
                        <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                          Recommended
                        </Badge>
                      </span>
                      <span className="text-[11px] text-brand-subtext font-medium">
                        Require SMS / Authenticator app OTP code on every login
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={(val) => {
                      setTwoFactorEnabled(val);
                      showSuccess(`2FA ${val ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>

                {/* Active Sessions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-text uppercase tracking-wider">
                      Active Login Sessions ({sessions.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSessions((p) => p.filter((s) => s.current));
                        showSuccess("Revoked all other active sessions.");
                      }}
                      className="text-[11px] font-bold text-brand-error hover:bg-red-50 h-7 cursor-pointer"
                    >
                      Revoke All Other Sessions
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {sessions.map((sess) => (
                      <div
                        key={sess.id}
                        className="p-4 border border-brand-border rounded-2xl flex items-center justify-between bg-brand-bg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-surface text-brand-subtext flex items-center justify-center shrink-0">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-brand-text flex items-center gap-2">
                              {sess.device}
                              {sess.current && (
                                <Badge className="bg-blue-100 text-blue-800 text-[9px] font-bold">
                                  This Session
                                </Badge>
                              )}
                            </span>
                            <span className="text-[11px] text-brand-subtext font-medium">
                              {sess.location} • IP: {sess.ip}
                            </span>
                          </div>
                        </div>
                        {!sess.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeSession(sess.id)}
                            className="text-xs font-bold text-brand-error border-red-200 hover:bg-red-50 h-8 rounded-xl cursor-pointer shadow-none"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FormSection>
            </Card>
          </TabsContent>

          {/* ── TAB 3: NOTIFICATIONS ─────────────────────────────────────── */}
          <TabsContent value="notifications" className="pt-4 space-y-4">
            <Card
              data-tour="settings-notifications"
              className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-6"
            >
              <FormSection
                title="Notification Preferences"
                icon={Bell}
                description="Configure alert channels across email, SMS, and push notifications"
                noBorder
              >
                <div className="space-y-3">
                  {NOTIF_ROWS.map((row) => (
                    <div
                      key={row.key}
                      className="p-4 border border-brand-border rounded-2xl flex items-center justify-between bg-brand-bg"
                    >
                      <div>
                        <span className="text-xs font-bold text-brand-text block">
                          {row.label}
                        </span>
                        <span className="text-[11px] text-brand-subtext font-medium">
                          {row.desc}
                        </span>
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold text-brand-text cursor-pointer">
                        <Switch
                          checked={notifMatrix[row.key]}
                          onCheckedChange={(val) =>
                            setNotifMatrix({ ...notifMatrix, [row.key]: val })
                          }
                        />
                        <span>Email</span>
                      </label>
                    </div>
                  ))}
                </div>
              </FormSection>
            </Card>

            {/* Guided Tour Reset Card */}
            <Card className="border-blue-200 bg-blue-50/40 shadow-sm rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 block font-heading">
                    Interactive Dashboard Tour
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Revisit the 12-step guided walkthrough to explore all
                    features of your merchant dashboard.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("vouchiqo_merchant_tour_seen");
                      window.location.href = "/merchant/dashboard";
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
                >
                  Restart Tour →
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ── TAB 4: API ACCESS ─────────────────────────────────────────── */}
          <TabsContent value="api" className="pt-4">
            <Card className="border-brand-border shadow-sm rounded-2xl bg-brand-bg p-6 space-y-4">
              <FormSection
                title="API Access & Webhooks"
                icon={Code}
                description="Integrate Vouchiqo Smart Code validation directly with your POS counter billing software"
                noBorder
              >
                <div className="p-4 bg-brand-surface border border-brand-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-text">
                      Live API Key
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 font-mono text-[9px] font-bold">
                      Pro Partner Feature
                    </Badge>
                  </div>
                  <FormInput
                    name="apiKey"
                    label=""
                    icon={Key}
                    value="vouch_live_9f82a10b4c81e92d8471"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    onClick={() => showSuccess("API key copied to clipboard!")}
                    className="text-xs font-bold rounded-xl border-brand-border cursor-pointer shadow-none"
                  >
                    Copy Key
                  </Button>
                </div>
              </FormSection>
            </Card>
          </TabsContent>

          {/* ── TAB 5: DANGER ZONE ────────────────────────────────────────── */}
          <TabsContent value="danger" className="pt-4">
            <Card className="border-red-200 bg-red-50/40 shadow-sm rounded-2xl p-6 space-y-4 text-left">
              <FormSection
                title="Danger Zone — Deactivate Account"
                icon={AlertTriangle}
                description="Permanently disable your merchant profile and remove all active listings"
                noBorder
              >
                <div className="pt-2">
                  <Button
                    onClick={() =>
                      showError(
                        "Account deactivation requires super admin approval.",
                      )
                    }
                    className="bg-brand-error hover:bg-red-700 text-white text-xs font-bold rounded-xl py-2.5 px-6 cursor-pointer shadow-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Deactivate Merchant Account
                  </Button>
                </div>
              </FormSection>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
