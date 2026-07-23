"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";

export function NavUser({ user, role = "admin" }) {
  const { isMobile, state } = useSidebar();
  const { logout } = useUser();
  const isCollapsed = state === "collapsed";
  const isMerchant = role === "merchant";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CN";

  const profileLink = isMerchant
    ? "/merchant/profile"
    : role === "admin"
      ? "/admin/dashboard"
      : "/profile";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`w-full cursor-pointer transition-colors ${
                isMerchant
                  ? "hover:bg-white/10 text-white data-[state=open]:bg-white/15"
                  : "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              }`}
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage
                  src={user?.image || user?.avatar}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="rounded-lg font-extrabold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-semibold text-sm">
                      {user?.name || "User"}
                    </span>
                    <span className="truncate text-xs opacity-70">
                      {user?.email || "user@vouchiqo.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-60" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[240px] min-w-56 rounded-xl p-1.5 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-left text-xs">
                <Avatar className="h-8 w-8 rounded-lg shrink-0">
                  <AvatarImage
                    src={user?.image || user?.avatar}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                  <span className="truncate font-bold text-slate-900">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-[11px] text-slate-500 font-medium">
                    {user?.email || "user@vouchiqo.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            {isMerchant && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/merchant/billing"
                      className="flex items-center gap-2 text-xs font-bold text-amber-600 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Upgrade Plan
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={profileLink}
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <BadgeCheck className="h-4 w-4 text-slate-500" />
                  Account Profile
                </Link>
              </DropdownMenuItem>
              {isMerchant && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/merchant/billing"
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      Billing & Subscriptions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/merchant/notifications"
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <Bell className="h-4 w-4 text-slate-500" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logout();
              }}
              className="flex items-center gap-2 text-xs text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer font-semibold"
            >
              <LogOut className="h-4 w-4 text-rose-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
