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
<<<<<<< HEAD
    <div
      className={`flex items-center w-full ${isCollapsed ? "justify-center" : "gap-2"}`}
    >
      {/* Profile Card */}
      <Link
        href="/profile"
        className={`flex items-center transition-colors hover:bg-slate-50 overflow-hidden ${
          isCollapsed
            ? "justify-center p-1 rounded-full"
            : "flex-1 gap-3 rounded-lg px-2 py-2"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-bold text-white shadow-sm overflow-hidden">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User Avatar"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            initials
          )}
        </div>
        {!isCollapsed && (
          <div className="flex flex-1 flex-col text-left leading-tight min-w-0">
            <span className="text-sm font-semibold text-slate-800 truncate">
              {user.name || "Aigars S."}
            </span>
            {formattedRole !== "Customer" && (
              <span className="text-[11px] text-slate-400 font-medium truncate uppercase tracking-wider">
                {formattedRole}
=======
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
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
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
<<<<<<< HEAD
          aria-label="Log out"
          className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-750 transition-colors border-0 bg-transparent cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
=======
          className="text-slate-500 hover:text-slate-700"
          tooltip="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
  );
}

