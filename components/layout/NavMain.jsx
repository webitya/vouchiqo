"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function NavMain({ groups }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Keep track of which menu groups are expanded
  const [openGroups, setOpenGroups] = useState({
    Overview: true,
    Commerce: true,
    Apps: true,
    System: true,
  });

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isOpen = openGroups[group.title] !== false;

        return (
          <div key={group.title} className="space-y-0.5">
            {/* Group Label / Collapse Button */}
            {!isCollapsed && group.title !== "Navigation" && (
              <div className="flex w-full items-center gap-2 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex-1 text-start">{group.title}</span>
              </div>
            )}

            {/* Group Items container */}
            <div
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                isOpen || isCollapsed
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 h-0"
              }`}
            >
              <div className="mt-1 space-y-1 px-1">
                {group.items.map((item) => {
                  const normalizedPath = pathname.replace(/\/$/, "");
                  const normalizedUrl = item.url.replace(/\/$/, "");
                  const isActive =
                    normalizedPath === normalizedUrl ||
                    (normalizedUrl !== "" &&
                      normalizedUrl !== "/merchant/dashboard" &&
                      normalizedUrl !== "/admin/dashboard" &&
                      normalizedUrl !== "/customer/dashboard" &&
                      normalizedPath.startsWith(normalizedUrl + "/"));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`group relative flex items-center transition-all duration-200 border border-slate-200/50 dark:border-zinc-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.015)] ${
                        isCollapsed
                          ? "justify-center p-1.5 rounded-sm"
                          : "gap-2 rounded-sm px-2.5 py-1.5 text-[11px] font-semibold"
                      } ${
                        isActive
                          ? "bg-slate-50 dark:bg-zinc-900 text-slate-900 border-slate-200/80 dark:border-zinc-800 shadow-sm"
                          : "bg-white dark:bg-zinc-950 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                            isActive
                              ? "text-slate-900"
                              : "text-slate-400 group-hover:text-slate-500"
                          }`}
                        />
                      )}
                      {!isCollapsed && (
                        <span className="flex-1 text-left truncate">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
