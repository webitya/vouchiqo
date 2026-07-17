"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Zomato Added New Code",
    message: "Get flat 50% OFF using ZOMATO50 on your next order.",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: 2,
    title: "Coupon Expiring",
    message: "Your claimed code SAVENEW15 expires in 2 hours.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Points Earned!",
    message: "Congratulations! You earned 10 points for your submission.",
    time: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "Air India Deal Live",
    message: "The new Air India flight coupon is now approved and live.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 5,
    title: "New Exclusive Adidas Code",
    message: "Adidas offers 20% off on winter arrivals with code ADI20.",
    time: "2 days ago",
    unread: false,
  },
];

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-1 text-gray-700 hover:text-brand-blue hover:bg-[#eff6ff] rounded-full transition-colors cursor-pointer bg-transparent border-0 outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-[22px] w-[22px]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] rounded-xl bg-white p-0 border border-slate-100 shadow-xl z-50 mr-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 bg-[#f8fafc] rounded-t-xl shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12.5px] font-semibold text-slate-800">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-50 text-blue-600 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Notifications List */}
        <ScrollArea className="h-64 w-full flex-grow">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-[12px] font-medium text-slate-600">
                All caught up!
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                No new notifications at this time.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`px-3.5 py-2.5 flex flex-col gap-0.5 text-left transition-colors cursor-pointer select-none ${
                    notif.unread
                      ? "bg-blue-50/20 hover:bg-blue-50/40"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <span className="text-[12px] font-medium text-slate-700">
                      {notif.title}
                    </span>
                    {notif.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal">
                    {notif.message}
                  </p>
                  <span className="text-[9.5px] text-slate-400 font-normal">
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer (Read All & Clear in Bottom Right) */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-end gap-3 px-3.5 py-2 border-t border-slate-100 bg-[#f8fafc] rounded-b-xl shrink-0">
            <button
              onClick={markAllRead}
              type="button"
              className="text-[10px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-0.5 border-0 bg-transparent py-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3 h-3" />
              Read All
            </button>
            <button
              onClick={clearAll}
              type="button"
              className="text-[10px] font-medium text-slate-500 hover:text-red-500 cursor-pointer flex items-center gap-0.5 border-0 bg-transparent py-1"
              title="Clear all"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
