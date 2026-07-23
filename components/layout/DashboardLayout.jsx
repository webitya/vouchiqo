"use client";

import { AlertTriangle, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Topbar from "@/components/layout/Topbar";
import MerchantTour from "@/components/merchant/tour/MerchantTour";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-user";

export default function DashboardLayout({ title, user, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isLoaded, isLoggedIn, user: authUser } = useUser();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      // Verify merchant access
      if (pathname.startsWith("/merchant")) {
        if (
          role !== "merchant" &&
          role !== "admin" &&
          pathname !== "/merchant/profile"
        ) {
          router.push("/merchant/profile");
        }
      }

      // Verify admin access
      if (pathname.startsWith("/admin")) {
        if (role !== "admin") {
          router.push("/");
        }
      }
    }
  }, [isLoaded, isLoggedIn, role, pathname, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface text-brand-text">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue" />
      </div>
    );
  }

  const isMerchant = pathname.startsWith("/merchant");

  return (
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar-width": "240px" }}>
        <div className="min-h-screen flex bg-white text-slate-900 font-sans w-full pb-14 md:pb-0">
          <AppSidebar />
          <SidebarInset className="bg-white flex-1 flex flex-col min-w-0 font-sans">
            <Topbar title={title} user={user} />

            {/* Plan Expiry / Notice Alert Banner for Merchants */}
            {isMerchant && showBanner && (
              <div className="bg-blue-50/80 border-b border-blue-200/60 px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-blue-900 font-sans">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 animate-pulse" />
                  <span>
                    <strong>Founding Merchant Program Active:</strong> Your
                    14-day free trial on Growth Partner plan is active.{" "}
                    <strong>11 days remaining</strong> — Rate lock guaranteed
                    for 6 months.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    onClick={() => router.push("/merchant/billing")}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-[10px] font-bold cursor-pointer px-2.5 py-0.5 shadow-xs"
                  >
                    Manage Subscription
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setShowBanner(false)}
                    className="text-blue-700 hover:text-blue-900 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <main className="p-4 space-y-6 w-full grow bg-white">{children}</main>
          </SidebarInset>
        </div>

        {/* Interactive Guided Tour for Merchants */}
        {isMerchant && <MerchantTour />}

        {/* Mobile Bottom Tab Bar (5 Tabs) */}
        <MobileBottomNav />
      </SidebarProvider>
    </TooltipProvider>
  );
}
