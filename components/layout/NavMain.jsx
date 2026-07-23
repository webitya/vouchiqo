"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({ groups, isMerchant = false }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-0.5 font-sans text-left">
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="p-0">
          {!isCollapsed && group.title !== "Navigation" && (
            <SidebarGroupLabel
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider block h-auto ${
                isMerchant ? "text-slate-300" : "text-slate-400"
              }`}
            >
              {group.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const normalizedPath = pathname.replace(/\/$/, "");
                const normalizedUrl = item.url
                  ? item.url.replace(/\/$/, "")
                  : "";
                const hasSubItems = item.subItems && item.subItems.length > 0;

                let isParentActive = false;
                if (hasSubItems) {
                  isParentActive = item.subItems.some((sub) => {
                    const subBaseUrl = sub.url.split("?")[0].replace(/\/$/, "");
                    return normalizedPath === subBaseUrl;
                  });
                } else if (normalizedUrl) {
                  isParentActive =
                    normalizedPath === normalizedUrl ||
                    (normalizedUrl !== "" &&
                      normalizedUrl !== "/merchant/dashboard" &&
                      normalizedUrl !== "/admin/dashboard" &&
                      normalizedUrl !== "/customer/dashboard" &&
                      normalizedPath.startsWith(`${normalizedUrl}/`));
                }

                const isSubOpen =
                  openSubMenus[item.title] !== undefined
                    ? openSubMenus[item.title]
                    : isParentActive || item.defaultOpen === true;

                const Icon = item.icon;

                // CTA item (e.g. Post New Listing)
                if (item.isCta) {
                  const ctaClass = isParentActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-medium"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium bg-blue-50/80 shadow-2xs";

                  const ctaIconClass = isParentActive
                    ? "text-white"
                    : "text-blue-600";

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="my-0.5"
                      data-tour="tour-post-new"
                    >
                      <Link
                        href={item.url}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-all ${ctaClass} ${
                          isCollapsed ? "justify-center px-2" : "justify-start"
                        }`}
                      >
                        {Icon && (
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${ctaIconClass}`}
                          />
                        )}
                        {!isCollapsed && (
                          <span className="text-xs font-medium">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                }

                // Expandable sub-items menu (e.g. My Listings, Merchants)
                if (hasSubItems) {
                  const parentBtnClass = isParentActive
                    ? "!bg-blue-600 !text-white font-medium shadow-md shadow-blue-500/20 hover:!bg-blue-700 rounded-lg"
                    : "bg-transparent hover:bg-blue-50/80 text-slate-700 hover:text-blue-900 font-normal border-0 rounded-lg transition-all";

                  const parentIconClass = isParentActive
                    ? "!text-white"
                    : "text-blue-600/80 group-hover:text-blue-700";

                  const parentTextClass = isParentActive
                    ? "!text-white font-medium"
                    : "text-slate-700 font-normal";

                  const chevronClass = isParentActive
                    ? "text-white"
                    : "text-slate-500";

                  return (
                    <SidebarMenuItem key={item.title} data-tour={item.tourId} className="my-0">
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        isActive={false}
                        tooltip={isCollapsed ? item.title : undefined}
                        className={`w-full justify-between h-8 py-0.5 px-2 text-xs transition-all cursor-pointer ${parentBtnClass}`}
                      >
                        <div className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              className={`h-3.5 w-3.5 shrink-0 transition-colors ${parentIconClass}`}
                            />
                          )}
                          <span className={`text-xs ${parentTextClass}`}>
                            {item.title}
                          </span>
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            className={`h-3 w-3 shrink-0 transition-transform duration-200 ${chevronClass} ${
                              isSubOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </SidebarMenuButton>

                      {!isCollapsed && isSubOpen && (
                        <SidebarMenuSub
                          className="mt-0.5 space-y-0.5 pl-2.5 border-l border-blue-200"
                        >
                          {item.subItems.map((sub) => {
                            const isSubActive = (() => {
                              const [subPath, subQuery] = sub.url.split("?");
                              const normalizedSubPath = subPath.replace(
                                /\/$/,
                                "",
                              );
                              const normalizedCurrentPath = pathname.replace(
                                /\/$/,
                                "",
                              );

                              if (normalizedCurrentPath !== normalizedSubPath)
                                return false;

                              if (!subQuery) {
                                return (
                                  !searchParams?.get("type") &&
                                  !searchParams?.get("status")
                                );
                              }

                              const subParams = new URLSearchParams(subQuery);
                              for (const [key, value] of subParams.entries()) {
                                if (searchParams?.get(key) !== value)
                                  return false;
                              }
                              return true;
                            })();

                            const SubIcon = sub.icon;

                            const subBtnClass = isSubActive
                              ? "!bg-blue-600 !text-white font-medium shadow-xs rounded-md"
                              : "!bg-transparent hover:!bg-blue-50/60 !text-slate-600 hover:!text-blue-800 font-normal border-0 rounded-md";

                            const subIconClass = isSubActive
                              ? "!text-white"
                              : "!text-blue-600/80";

                            const subTextClass = isSubActive
                              ? "!text-white font-medium"
                              : "!text-slate-600 font-normal";

                            return (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={false}
                                  className={`h-6.5 py-0.5 px-2 text-[11px] transition-all ${subBtnClass}`}
                                >
                                  <Link
                                    href={sub.url}
                                    className="flex items-center gap-1.5 w-full min-w-0"
                                  >
                                    {SubIcon && (
                                      <SubIcon
                                        className={`h-3 w-3 shrink-0 ${subIconClass}`}
                                      />
                                    )}
                                    <span className={`text-[11px] ${subTextClass}`}>
                                      {sub.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                // Normal sidebar navigation item
                const singleBtnClass = isParentActive
                  ? "!bg-blue-600 !text-white font-medium shadow-md shadow-blue-500/20 hover:!bg-blue-700 rounded-lg"
                  : "bg-transparent hover:bg-blue-50/80 text-slate-700 hover:text-blue-900 font-normal border-0 rounded-lg transition-all";

                const singleIconClass = isParentActive
                  ? "!text-white"
                  : "text-blue-600/80 group-hover:text-blue-700";

                const singleTextClass = isParentActive
                  ? "!text-white font-medium"
                  : "text-slate-700 font-normal";

                const URL_TOUR_MAP = {
                  "/merchant/analytics": "tour-analytics",
                  "/merchant/billing": "tour-billing",
                  "/merchant/campaigns": "tour-campaigns",
                  "/merchant/notifications": "tour-notifications",
                  "/merchant/settings": "tour-settings",
                  "/faq": "sidebar-help",
                };

                const tourId = item.tourId || URL_TOUR_MAP[item.url];

                return (
                  <SidebarMenuItem key={item.title} data-tour={tourId} className="my-0">
                    <SidebarMenuButton
                      asChild
                      isActive={false}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`h-8 py-0.5 px-2 text-xs transition-all cursor-pointer group ${singleBtnClass}`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {Icon && (
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${singleIconClass}`}
                            />
                          )}
                          <span
                            className={`text-xs truncate ${singleTextClass}`}
                          >
                            {item.title}
                          </span>
                        </div>
                        {item.badge && !isCollapsed && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white px-1.5 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
