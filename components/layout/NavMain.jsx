"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function NavMain({ groups }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openSubMenus, setOpenSubMenus] = useState({
    "My Listings": true,
  });

  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="p-0">
          {!isCollapsed && group.title !== "Navigation" && (
            <SidebarGroupLabel className="px-2 py-1 text-[11px] font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const normalizedPath = pathname.replace(/\/$/, "");
                const normalizedUrl = item.url.replace(/\/$/, "");
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubOpen = openSubMenus[item.title] !== false;

                const isParentActive =
                  normalizedPath === normalizedUrl ||
                  (normalizedUrl !== "" &&
                    normalizedUrl !== "/merchant/dashboard" &&
                    normalizedUrl !== "/admin/dashboard" &&
                    normalizedUrl !== "/customer/dashboard" &&
                    normalizedPath.startsWith(normalizedUrl + "/"));

                const Icon = item.icon;

                if (item.isCta) {
                  return (
                    <SidebarMenuItem key={item.title} className="my-1 px-0.5">
                      <Link
                        href={item.url}
                        className={`flex w-full items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold px-3.5 py-2.5 text-xs shadow-sm transition-all active:scale-[0.98] ${
                          isCollapsed ? "justify-center px-2" : "justify-start"
                        }`}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0 text-white" />}
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuItem>
                  );
                }

                if (hasSubItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        isActive={isParentActive}
                        tooltip={isCollapsed ? item.title : undefined}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          <span>{item.title}</span>
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-200 ${
                              isSubOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </SidebarMenuButton>

                      {!isCollapsed && isSubOpen && (
                        <SidebarMenuSub className="mt-1 space-y-0.5">
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.url;
                            return (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link href={sub.url}>
                                    <span>{sub.title}</span>
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

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isParentActive}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          <span>{item.title}</span>
                        </div>
                        {item.badge && !isCollapsed && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
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
