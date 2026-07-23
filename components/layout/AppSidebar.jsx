"use client";

import {
  AlertCircle,
  BarChart2,
  Bell,
  Bookmark,
  Building2,
  CheckSquare,
  Clock,
  CreditCard,
  HelpCircle,
  History,
  Home,
  Layers,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  MapPin,
  Megaphone,
  PiggyBank,
  PlusCircle,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Store,
  Tag,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/layout/NavMain";
import { NavUser } from "@/components/layout/NavUser";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const { user: authUser, role: authRole } = useUser();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const role = authUser
    ? authRole
    : pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/merchant")
        ? "merchant"
        : "customer";

  const isMerchant = role === "merchant";

  const user = authUser
    ? {
        name: authUser.businessName || authUser.name,
        email: authUser.email,
        avatar: authUser.image || `/avatars/${role}.jpg`,
        image: authUser.image,
      }
    : {
        name: isMerchant ? "Marbella Tiles & Sanitary" : "Super Admin",
        email: isMerchant ? "owner@marbella.in" : "admin@vouchiqo.com",
        avatar: `/avatars/${role}.jpg`,
        image: null,
      };

  const getNavGroups = () => {
    switch (role) {
      case "admin":
        return [
          {
            title: "OVERVIEW",
            items: [
              {
                title: "Dashboard",
                url: "/admin/dashboard",
                icon: LayoutDashboard,
              },
            ],
          },
          {
            title: "PENDING & APPROVALS",
            items: [
              {
                title: "Pending Approvals",
                url: "/admin/approvals/merchants",
                icon: ShieldCheck,
                defaultOpen: true,
                subItems: [
                  {
                    title: "Merchant Approvals",
                    url: "/admin/approvals/merchants",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Coupon Moderation",
                    url: "/admin/approvals/coupons",
                    icon: Tag,
                  },
                  {
                    title: "Offer Verification",
                    url: "/admin/offers",
                    icon: CheckSquare,
                  },
                ],
              },
              {
                title: "User Management",
                url: "/admin/users",
                icon: Users,
              },
              {
                title: "Merchant Directory",
                url: "/admin/merchants",
                icon: Store,
              },
            ],
          },
          {
            title: "CAMPAIGN MANAGEMENT",
            items: [
              {
                title: "Campaign Hub",
                url: "/admin/campaigns/queue",
                icon: Megaphone,
                subItems: [
                  {
                    title: "Campaign Queue",
                    url: "/admin/campaigns/queue",
                    icon: Megaphone,
                  },
                  {
                    title: "Live Monitoring",
                    url: "/admin/campaigns/live",
                    icon: TrendingUp,
                  },
                  {
                    title: "Campaign Calendar",
                    url: "/admin/campaigns/calendar",
                    icon: Clock,
                  },
                  {
                    title: "Campaign Analytics",
                    url: "/admin/campaigns/analytics",
                    icon: BarChart2,
                  },
                ],
              },
            ],
          },
          {
            title: "CONTENT & MARKETING",
            items: [
              {
                title: "Banners & Highlights",
                url: "/admin/banners",
                icon: Sliders,
                subItems: [
                  {
                    title: "Homepage Banners",
                    url: "/admin/banners",
                    icon: Sliders,
                  },
                  {
                    title: "Featured Deals",
                    url: "/admin/featured",
                    icon: Tag,
                  },
                  {
                    title: "Ticker Priority",
                    url: "/admin/content/ticker",
                    icon: Zap,
                  },
                ],
              },
              {
                title: "Marketing Tools",
                url: "/admin/campaigns/festival-wizard",
                icon: Sparkles,
                subItems: [
                  {
                    title: "Festival Wizard",
                    url: "/admin/campaigns/festival-wizard",
                    icon: Sparkles,
                  },
                  {
                    title: "Email Blast Builder",
                    url: "/admin/campaigns/email-blast-builder",
                    icon: Mail,
                  },
                  {
                    title: "Push Builder",
                    url: "/admin/campaigns/push-builder",
                    icon: Bell,
                  },
                ],
              },
              {
                title: "Demand & Revivals",
                url: "/admin/merchant-demand",
                icon: Building2,
                subItems: [
                  {
                    title: "Merchant Demand",
                    url: "/admin/merchant-demand",
                    icon: Building2,
                  },
                  {
                    title: "Master Revivals",
                    url: "/admin/revivals",
                    icon: AlertCircle,
                  },
                ],
              },
            ],
          },
          {
            title: "FINANCIALS",
            items: [
              {
                title: "Revenue & Earnings",
                url: "/admin/revenue",
                icon: Wallet,
                subItems: [
                  {
                    title: "Platform Revenue",
                    url: "/admin/revenue",
                    icon: Wallet,
                  },
                  {
                    title: "Campaign Revenue",
                    url: "/admin/campaigns/revenue",
                    icon: CreditCard,
                  },
                ],
              },
            ],
          },
        ];
      case "merchant":
        return [
          {
            title: "NAVIGATION",
            items: [
              {
                title: "Dashboard Overview",
                url: "/merchant/dashboard",
                icon: Home,
              },
              {
                title: "My Listings",
                url: "/merchant/coupons",
                icon: Layers,
                tourId: "tour-my-listings",
                subItems: [
                  {
                    title: "All Listings",
                    url: "/merchant/coupons",
                    icon: Ticket,
                  },
                  {
                    title: "Active Offers",
                    url: "/merchant/coupons?status=active",
                    icon: CheckSquare,
                  },
                  {
                    title: "Expired Offers",
                    url: "/merchant/coupons?status=expired",
                    icon: Clock,
                  },
                ],
              },
              {
                title: "Post New Listing",
                url: "/merchant/coupons/new",
                icon: PlusCircle,
                isCta: true,
              },
              {
                title: "Analytics",
                url: "/merchant/analytics",
                icon: BarChart2,
              },
              {
                title: "Campaigns",
                url: "/merchant/campaigns",
                icon: Megaphone,
              },
              {
                title: "Notifications",
                url: "/merchant/notifications",
                icon: Bell,
                badge: "4",
              },
              {
                title: "Subscription & Billing",
                url: "/merchant/billing",
                icon: CreditCard,
              },
              {
                title: "Affiliate & Commission",
                url: "/merchant/affiliates",
                icon: LinkIcon,
              },
              {
                title: "Business Profile & KYC",
                url: "/merchant/profile",
                icon: Store,
              },
              {
                title: "Application Tracking",
                url: "/merchant/application-status",
                icon: ShieldCheck,
              },
              {
                title: "Account Settings",
                url: "/merchant/settings",
                icon: Settings,
              },
              { title: "Help & Support", url: "/faq", icon: HelpCircle },
            ],
          },
        ];
      default:
        return [
          {
            title: "MAIN",
            items: [
              {
                title: "Dashboard",
                url: "/customer/dashboard",
                icon: LayoutDashboard,
              },
              {
                title: "My Savings",
                url: "/profile?tab=savings",
                icon: PiggyBank,
              },
              {
                title: "Saved Deals",
                url: "/profile?tab=saved",
                icon: Bookmark,
              },
              {
                title: "Cashback Wallet",
                url: "/profile?tab=wallet",
                icon: Wallet,
              },
            ],
          },
          {
            title: "ACTIVITY & DISCOVERY",
            items: [
              {
                title: "My Activity",
                url: "/profile?tab=activity",
                icon: History,
              },
              {
                title: "Nearby Offers",
                url: "/profile?tab=nearby",
                icon: MapPin,
              },
              { title: "My Coupons", url: "/customer/claimed", icon: Ticket },
              {
                title: "Settings",
                url: "/profile?tab=settings",
                icon: Settings,
              },
              { title: "Homepage", url: "/", icon: Home },
            ],
          },
        ];
    }
  };

  const groups = getNavGroups();

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="bg-white text-slate-900 border-r border-slate-200 shadow-sm font-sans"
      {...props}
    >
      <SidebarHeader
        className="h-16 flex items-center justify-center border-b border-slate-200 bg-white px-3.5 py-0"
      >
        <div
          className={`flex items-center gap-2.5 w-full ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-black text-sm shadow-xs overflow-hidden border border-blue-100">
            <Image
              src="/favicon.ico"
              alt="VouchIQ Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left leading-tight min-w-0 flex-1">
              <span
                className="text-sm font-black tracking-tight truncate text-slate-900"
              >
                {role === "admin" ? "Super Admin" : user.name}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge
                  className="bg-blue-50 text-blue-700 border-blue-200 text-[8px] font-extrabold px-1.5 py-0"
                >
                  GROWTH PARTNER
                </Badge>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent
        className="px-2 py-3 bg-white text-slate-900"
      >
        <NavMain groups={groups} isMerchant={isMerchant} />
      </SidebarContent>
      <SidebarFooter
        className="border-t border-slate-200 bg-white"
      >
        <NavUser user={user} role={role} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
