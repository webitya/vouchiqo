"use client";

import { CheckCircle2, Plus, Save, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TickerManagement() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    "🚀 FLASH SALE: Zomato 50% Off — Code: ZOMATO50",
    "⚡ Stripe Integration Specials — Save Up To $200",
    "💼 Notion Plus for Teams: $50 Free Workspace Credits",
  ]);

  const [newItem, setNewItem] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // Simulate saving ticker values
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Homepage Ticker"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      {success && (
        <div className="flex gap-2.5 p-3.5 rounded-lg bg-brand-success/5 border border-brand-success/15 text-brand-success text-xs font-semibold items-center">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Homepage ticker text lists saved successfully!</span>
        </div>
      )}

      <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-blue" />
          <span>Configure Announcement Ticker</span>
        </h3>

        <p className="text-xs text-brand-subtext font-semibold">
          These announcement phrases scroll continuously at the very top of the
          public homepage.
        </p>

        {/* Add form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add new announcement phrase..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="bg-brand-surface border border-brand-border rounded-lg text-xs w-full h-10 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
            required
          />
          <Button
            type="submit"
            className="btn-primary text-xs flex items-center gap-1 py-2 px-4 shadow-none whitespace-nowrap border-0 h-auto cursor-pointer font-bold rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </form>

        {/* Lists */}
        <div className="space-y-2.5 pt-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-lg text-xs font-semibold text-brand-text"
            >
              <span>{item}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(idx)}
                className="text-brand-subtext hover:text-brand-error w-8 h-8 rounded-lg hover:bg-brand-bg transition-all cursor-pointer shadow-none"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 mt-4 border-0 h-auto cursor-pointer shadow-none"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Save Ticker Configurations"}</span>
        </Button>
      </div>
    </DashboardLayout>
  );
}
