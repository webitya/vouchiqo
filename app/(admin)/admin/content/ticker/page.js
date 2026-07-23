"use client";

import { ArrowDown, ArrowUp, GripVertical, Pin, Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const INITIAL_TICKER_ITEMS = [
  {
    id: "TICK-1",
    text: "🔥 Flat 20% OFF Italian Marble at Marbella Tiles Ranchi",
    type: "Priority Slot 1",
    isPriority: true,
    merchant: "Marbella Tiles",
    pinnedAt: "2026-07-21 10:00",
    expiresAt: "2026-07-24 10:00 (3 Days)",
  },
  {
    id: "TICK-2",
    text: "⚡ Buy 1 Get 1 Free Espresso at Starbucks Ranchi",
    type: "Priority Slot 2",
    isPriority: true,
    merchant: "Starbucks",
    pinnedAt: "2026-07-20 12:00",
    expiresAt: "2026-07-23 12:00 (3 Days)",
  },
  {
    id: "TICK-3",
    text: "🎁 Flat ₹500 Cashback on Dining at Yellow Sapphire",
    type: "Priority Slot 3",
    isPriority: true,
    merchant: "Yellow Sapphire",
    pinnedAt: "2026-07-19 16:00",
    expiresAt: "2026-07-22 16:00 (3 Days)",
  },
  {
    id: "TICK-4",
    text: "✨ Flat 15% off Teak Sofa Sets at Luxe Furnishings",
    type: "Standard Rotation",
    isPriority: false,
    merchant: "Luxe Furnishings",
  },
  {
    id: "TICK-5",
    text: "🏷️ Flat ₹200 off Gym Membership at Cult.fit Ranchi",
    type: "Standard Rotation",
    isPriority: false,
    merchant: "Cult.fit",
  },
];

export default function TickerManagementPage() {
  const [tickerItems, setTickerItems] = useState(INITIAL_TICKER_ITEMS);

  const moveUp = (index) => {
    if (index === 0) return;
    const items = [...tickerItems];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    setTickerItems(items);
    toast.success("Ticker item reordered!");
  };

  const moveDown = (index) => {
    if (index === tickerItems.length - 1) return;
    const items = [...tickerItems];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    setTickerItems(items);
    toast.success("Ticker item reordered!");
  };

  const handlePinPriority = (item) => {
    toast.success(
      `Pinned "${item.text.slice(0, 30)}..." to Ticker Priority Slot for 3 Days!`,
    );
  };

  return (
    <DashboardLayout
      title="Platform Content — Ticker Management"
      user={{ name: "Super Admin", role: "admin" }}
    >
      <div className="space-y-6 text-left font-sans w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Ticker Management
              (Admin → Platform Content → Ticker Management)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Priority slots 1–3 pinned for exactly 3 days from go-live,
              auto-releasing to standard rotation.
            </p>
          </div>

          <Button
            onClick={() => toast.success("Ticker slot ordering saved!")}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer shadow-xs"
          >
            Save Slot Ordering →
          </Button>
        </div>

        {/* Ticker Slot List */}
        <div className="space-y-3">
          {tickerItems.map((item, idx) => (
            <Card
              key={item.id}
              className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${item.isPriority ? "bg-amber-50/60 border-amber-200 shadow-xs" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveDown(idx)}
                    disabled={idx === tickerItems.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </div>

                <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {item.text}
                    </span>
                    <Badge
                      className={`rounded font-bold text-[9px] border-0 ${item.isPriority ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700"}`}
                    >
                      {item.isPriority
                        ? `Slot #${idx + 1} (Priority)`
                        : "Standard Rotation"}
                    </Badge>
                  </div>
                  {item.isPriority && (
                    <span className="text-[10px] text-amber-900 font-medium block">
                      Pinned: {item.pinnedAt} • Auto-Releases: {item.expiresAt}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!item.isPriority
                  ? <Button
                      size="sm"
                      onClick={() => handlePinPriority(item)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold h-7 px-3 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Pin className="w-3 h-3" /> Pin to Ticker Priority (3
                      Days)
                    </Button>
                  : <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Active Priority Pinned
                    </span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
