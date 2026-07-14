"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ groups }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="p-0">
          {group.title !== "Navigation" && (
            <SidebarGroupLabel className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {group.title}
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = (() => {
                const itemUrlPath = item.url.split("?")[0];
                if (pathname !== itemUrlPath) return false;
                if (item.url.includes("?")) {
                  const itemParams = new URLSearchParams(item.url.split("?")[1]);
                  for (const [key, value] of itemParams.entries()) {
                    if (searchParams.get(key) !== value) return false;
                  }
                  return true;
                }
                return Array.from(searchParams.keys()).length === 0;
              })();

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="rounded-lg"
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
