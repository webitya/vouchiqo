"use client";

import {
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  MousePointerClick,
  Plus,
  RefreshCw,
  Sliders,
  Trash2,
  Type,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/shared/data/DataTable";
import StatusBadge from "@/components/shared/data/StatusBadge";
import { FormInput, FormSelect } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { showError, showSuccess } from "@/lib/toast";

const SLOT_OPTIONS = [
  { value: "left-hero", label: "Left Primary Hero Card" },
  { value: "top-right", label: "Top-Right Hero Banner" },
  { value: "bottom-right", label: "Bottom-Right Hero Banner" },
];

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "Explore",
    image: "",
    logo: "",
    link: "",
    slot: "left-hero",
    priority: 0,
    isPaid: false,
    status: "active",
  });

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/banners");
      const json = await res.json();
      if (json.success && json.data) setBanners(json.data);
    } catch (err) {
      showError("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.link || !form.slot) {
      return showError("Please fill in all required fields.");
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, priority: Number(form.priority) }),
      });

      if (res.ok) {
        showSuccess("Promo banner added successfully!");
        setForm({
          title: "",
          subtitle: "",
          buttonText: "Explore",
          image: "",
          logo: "",
          link: "",
          slot: "left-hero",
          priority: 0,
          isPaid: false,
          status: "active",
        });
        fetchBanners();
      } else {
        showError("Failed to create banner.");
      }
    } catch (err) {
      showError("An error occurred while creating the banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (bannerId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bannerId, status: nextStatus }),
      });
      if (res.ok) {
        showSuccess(`Banner set to ${nextStatus}`);
        setBanners((prev) =>
          prev.map((b) =>
            String(b._id) === String(bannerId)
              ? { ...b, status: nextStatus }
              : b,
          ),
        );
      } else {
        showError("Failed to toggle banner status.");
      }
    } catch (err) {
      showError("Failed to toggle banner status.");
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${bannerId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Banner deleted successfully!");
        setBanners((prev) => prev.filter((b) => b._id !== bannerId));
      }
    } catch (err) {
      showError("Failed to delete banner.");
    }
  };

  const columns = [
    {
      key: "title",
      header: "Banner & Preview",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          {r.image
            ? // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.image}
                alt={r.title}
                className="w-12 h-8 object-cover rounded-lg border border-slate-200"
              />
            : <div className="w-12 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>}
          <div>
            <span className="font-bold text-slate-900 block">{r.title}</span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {r.subtitle || "No Subtitle"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "slot",
      header: "Display Placement",
      cell: (r) => (
        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {r.slot}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority Weight",
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {r.priority || 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (r) => (
        <div className="flex justify-center">
          <StatusBadge status={r.status} size="sm" />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      cell: (r) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            size="sm"
            checked={r.status === "active"}
            onCheckedChange={() => handleToggleStatus(r._id, r.status)}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteBanner(r._id)}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 h-7 w-7 p-0 shadow-none cursor-pointer rounded-lg flex items-center justify-center shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Hero Banners & Ads"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" /> Hero Section Promotional
          Carousel Banners
        </h2>

        {/* Create Banner Form */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 text-left">
          <form onSubmit={handleCreateBanner} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Create New Promotional Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                name="title"
                label="Main Title Heading"
                icon={Type}
                placeholder="e.g. MEGA SUMMER SALE"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <FormInput
                name="subtitle"
                label="Subheading / Offer Text"
                icon={FileText}
                placeholder="e.g. Up to 50% Off Top Brands"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
              <FormInput
                name="buttonText"
                label="Button CTA Text"
                icon={MousePointerClick}
                placeholder="Explore"
                value={form.buttonText}
                onChange={(e) =>
                  setForm({ ...form, buttonText: e.target.value })
                }
              />
              <FormInput
                name="image"
                label="Banner Background Image URL"
                icon={ImageIcon}
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
              />
              <FormInput
                name="link"
                label="Redirect Target Link"
                icon={LinkIcon}
                placeholder="https://vouchiqo.com/deals/..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                required
              />
              <FormSelect
                name="slot"
                label="Target Display Placement"
                icon={LayoutGrid}
                options={SLOT_OPTIONS}
                value={form.slot}
                onValueChange={(val) => setForm({ ...form, slot: val })}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl h-10 px-6 cursor-pointer gap-1.5"
              >
                {saving
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <Plus className="w-4 h-4" />}
                <span>Add Banner Slot</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Existing Banners List */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white p-5 text-left">
          <DataTable
            columns={columns}
            data={banners}
            loading={loading}
            searchable={true}
            searchPlaceholder="Search promo banners..."
            defaultPageSize={10}
            emptyState="No promotional banners configured."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
