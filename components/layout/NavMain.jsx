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
    <div className="space-y-1.5">
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="p-0">
          {!isCollapsed && group.title !== "Navigation" && (
            <SidebarGroupLabel
              className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider block h-auto ${
                isMerchant ? "text-slate-300" : "text-slate-500"
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
                    ? "bg-[#e85d04] text-white shadow-md font-bold"
                    : isMerchant
                      ? "border border-[#e85d04] text-[#ff7d26] hover:bg-[#e85d04] hover:text-white font-bold bg-[#e85d04]/10"
                      : "border border-[#e85d04] text-[#e85d04] hover:bg-[#e85d04] hover:text-white font-bold bg-orange-50/50";

                  const ctaIconClass = isParentActive
                    ? "text-white"
                    : isMerchant
                      ? "text-[#ff7d26]"
                      : "text-[#e85d04]";

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
                          <span className="text-xs font-bold">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                }

                // Expandable sub-items menu (e.g. My Listings, Merchants)
                if (hasSubItems) {
                  const parentBtnClass = isMerchant
                    ? isParentActive
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-200 hover:bg-white/10 hover:text-white font-medium"
                    : isParentActive
                      ? "bg-orange-50/80 text-[#e85d04] font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium";

                  const parentIconClass = isParentActive
                    ? isMerchant
                      ? "text-white"
                      : "text-[#e85d04]"
                    : isMerchant
                      ? "text-slate-200"
                      : "text-slate-600";

                  const parentTextClass = isParentActive
                    ? isMerchant
                      ? "text-white font-bold"
                      : "text-[#e85d04] font-bold"
                    : isMerchant
                      ? "text-slate-200 font-medium"
                      : "text-slate-700 font-medium";

                  const chevronClass = isParentActive
                    ? isMerchant
                      ? "text-white"
                      : "text-[#e85d04]"
                    : isMerchant
                      ? "text-slate-300"
                      : "text-slate-500";

                  return (
                    <SidebarMenuItem key={item.title} data-tour={item.tourId}>
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        isActive={false}
                        tooltip={isCollapsed ? item.title : undefined}
                        className={`w-full justify-between h-8.5 py-1 px-2.5 text-xs transition-all rounded-lg cursor-pointer ${parentBtnClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && (
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${parentIconClass}`}
                            />
                          )}
                          <span className={`text-xs ${parentTextClass}`}>
                            {item.title}
                          </span>
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${chevronClass} ${
                              isSubOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </SidebarMenuButton>

                      {!isCollapsed && isSubOpen && (
                        <SidebarMenuSub
                          className={`mt-0.5 space-y-0.5 pl-3 border-l ${
                            isMerchant ? "border-white/20" : "border-slate-200"
                          }`}
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
                              ? "!bg-[#e85d04] !text-white font-bold shadow-xs"
                              : isMerchant
                                ? "!text-slate-200 hover:!bg-white/10 hover:!text-white font-medium"
                                : "!text-slate-700 hover:!bg-slate-100 hover:!text-slate-900 font-medium";

                            const subIconClass = isSubActive
                              ? "!text-white"
                              : isMerchant
                                ? "!text-slate-300"
                                : "!text-slate-500";

                            const subTextClass = isSubActive
                              ? "!text-white font-bold"
                              : isMerchant
                                ? "!text-slate-200 font-medium"
                                : "!text-slate-700 font-medium";

                            return (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={false}
                                  className={`h-7 py-0.5 px-2 text-xs transition-all rounded-md ${subBtnClass}`}
                                >
                                  <Link
                                    href={sub.url}
                                    className="flex items-center gap-2 w-full min-w-0"
                                  >
                                    {SubIcon && (
                                      <SubIcon
                                        className={`h-3.5 w-3.5 shrink-0 ${subIconClass}`}
                                      />
                                    )}
                                    <span className={`text-xs ${subTextClass}`}>
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
                  ? "!bg-[#e85d04] !text-white font-bold shadow-md hover:!bg-[#e85d04]"
                  : isMerchant
                    ? "text-slate-200 hover:bg-white/10 hover:text-white font-medium"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium";

                const singleIconClass = isParentActive
                  ? "!text-white"
                  : isMerchant
                    ? "text-slate-200 group-hover:text-white"
                    : "text-slate-600 group-hover:text-slate-900";

                const singleTextClass = isParentActive
                  ? "!text-white font-bold"
                  : isMerchant
                    ? "text-slate-200 font-medium"
                    : "text-slate-700 font-medium";

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
                  <SidebarMenuItem key={item.title} data-tour={tourId}>
                    <SidebarMenuButton
                      asChild
                      isActive={false}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`h-8.5 py-1 px-2.5 text-xs transition-all rounded-lg group ${singleBtnClass}`}
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
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff3b30] text-[11px] font-bold text-white px-1.5 shadow-xs shrink-0">
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
