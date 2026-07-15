"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Topbar from "@/components/layout/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({ title, user, children }) {
  return (
    <TooltipProvider>
<<<<<<< HEAD
      <SidebarProvider style={{ "--sidebar-width": "220px" }}>
        <div className="min-h-screen flex bg-brand-surface text-brand-text w-full">
          <AppSidebar />
          <SidebarInset className="bg-brand-surface flex-1 flex flex-col min-w-0">
            <Topbar title={title} user={user} />
            <main className="p-6 space-y-6 w-full flex-grow">{children}</main>
          </SidebarInset>
        </div>
=======
      <SidebarProvider className="bg-brand-surface text-brand-text w-full">
        <AppSidebar />
        <SidebarInset className="bg-brand-surface flex-1 flex flex-col min-w-0">
          <Topbar title={title} user={user} />
          <main className="p-6 space-y-6 w-full flex-grow">{children}</main>
        </SidebarInset>
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
      </SidebarProvider>
    </TooltipProvider>
  );
}
