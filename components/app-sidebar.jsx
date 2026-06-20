"use client";

import {
  AlertCircle,
  Bookmark,
  CheckSquare,
  CreditCard,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Store,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useUser } from "@/hooks/use-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const { user: authUser, role: authRole } = useUser();

  // Dynamically resolve role from pathname or user session
  const role = authUser ? authRole : (pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/merchant")
      ? "merchant"
      : "customer");

  // User details based on the active session
  const user = authUser ? {
    name: authUser.name,
    email: authUser.email,
    avatar: authUser.image || `/avatars/${role}.jpg`,
  } : {
    name: "Loading...",
    email: "",
    avatar: `/avatars/${role}.jpg`,
  };

  // Brand Switcher items
  const getBrandDetails = () => {
    switch (role) {
      case "admin":
        return [
          {
            name: "Admin Console",
            logo: <CheckSquare className="size-4" />,
            plan: "Root Operations",
          },
        ];
      case "merchant":
        return [
          {
            name: "Zomato Partner",
            logo: <Store className="size-4" />,
            plan: "Merchant Growth Plan",
          },
          {
            name: "Uber Partner",
            logo: <Store className="size-4" />,
            plan: "Merchant Startup Plan",
          },
        ];
      default:
        return [
          {
            name: "Vouchiqo App",
            logo: <Tag className="size-4" />,
            plan: "Verified Savings",
          },
        ];
    }
  };

  // Navigation Items
  const getNavMain = () => {
    switch (role) {
      case "admin":
        return [
          {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: <LayoutDashboard className="size-4" />,
          },
          {
            title: "Merchant Approvals",
            url: "/admin/approvals/merchants",
            icon: <Store className="size-4" />,
          },
          {
            title: "Coupon Moderation",
            url: "/admin/approvals/coupons",
            icon: <CheckSquare className="size-4" />,
          },
          {
            title: "User Management",
            url: "/admin/users",
            icon: <Users className="size-4" />,
          },
          {
            title: "Featured Deals",
            url: "/admin/featured",
            icon: <Tag className="size-4" />,
          },
          {
            title: "Homepage Ticker",
            url: "/admin/ticker",
            icon: <TrendingUp className="size-4" />,
          },
          {
            title: "Revival Requests",
            url: "/admin/revivals",
            icon: <AlertCircle className="size-4" />,
          },
        ];
      case "merchant":
        return [
          {
            title: "Dashboard",
            url: "/merchant/dashboard",
            icon: <LayoutDashboard className="size-4" />,
          },
          {
            title: "My Coupons",
            url: "/merchant/coupons",
            icon: <Tag className="size-4" />,
          },
          {
            title: "Create Coupon",
            url: "/merchant/coupons/new",
            icon: <PlusCircle className="size-4" />,
          },
          {
            title: "Business Analytics",
            url: "/merchant/analytics",
            icon: <TrendingUp className="size-4" />,
          },
          {
            title: "Business Profile",
            url: "/merchant/profile",
            icon: <Store className="size-4" />,
          },
          {
            title: "Billing & Plans",
            url: "/merchant/billing",
            icon: <CreditCard className="size-4" />,
          },
        ];
      default:
        return [
          {
            title: "Dashboard",
            url: "/customer/dashboard",
            icon: <LayoutDashboard className="size-4" />,
          },
          {
            title: "Savings Dashboard",
            url: "/customer/savings",
            icon: <TrendingUp className="size-4" />,
          },
          {
            title: "Saved Coupons",
            url: "/customer/saved",
            icon: <Bookmark className="size-4" />,
          },
          {
            title: "Claimed Coupons",
            url: "/customer/claimed",
            icon: <History className="size-4" />,
          },
          {
            title: "Followed Brands",
            url: "/customer/brands",
            icon: <Store className="size-4" />,
          },
          {
            title: "Settings",
            url: "/profile/settings",
            icon: <Settings className="size-4" />,
          },
        ];
    }
  };

  const teams = getBrandDetails();
  const navMain = getNavMain();

  return (
    <Sidebar
      collapsible="icon"
      style={{
        "--sidebar": "var(--brand-navy)",
        "--sidebar-foreground": "#cbd5e1",
        "--sidebar-border": "rgba(255, 255, 255, 0.1)",
        "--sidebar-accent": "rgba(255, 255, 255, 0.05)",
        "--sidebar-accent-foreground": "#ffffff",
      }}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
