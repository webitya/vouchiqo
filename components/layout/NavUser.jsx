"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";

export function NavUser({ user, role = "admin" }) {
  const { logout } = useUser();

  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const formattedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          tooltip={user.name || "Profile"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/profile" className="flex items-center gap-2">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            {/* Name + Role */}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-slate-800">
                {user.name || "User"}
              </span>
              {formattedRole !== "Customer" && (
                <span className="truncate text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  {formattedRole}
                </span>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Logout as separate item so it doesn't disappear on collapse */}
      <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
        <SidebarMenuButton
          size="sm"
          onClick={async () => {
            await logout();
          }}
          className="text-slate-500 hover:text-slate-700"
          tooltip="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

