"use client";

import { Flame, Home, LayoutGrid, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Paths where the mobile bottom navigation should be hidden
  const excludedPrefixes = [
    "/admin",
    "/merchant",
    "/login",
    "/register",
    "/reset-password",
  ];
  const isExcluded = excludedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isExcluded) return null;

  const navItems = [
    {
      href: "/brands",
      icon: Store,
      label: "Brands",
      isActive:
        pathname.startsWith("/brands") || pathname.startsWith("/brand/"),
    },
    {
      href: "/categories",
      icon: LayoutGrid,
      label: "Categories",
      isActive:
        pathname.startsWith("/categories") || pathname.startsWith("/category/"),
    },
    {
      href: "/",
      icon: Home,
      label: "Home",
      isActive: pathname === "/",
    },
    {
      href: "/campaigns",
      icon: Flame,
      label: "Trending",
      isActive: pathname.startsWith("/campaigns"),
    },
    {
      href: "/nearby-offers",
      icon: MapPin,
      label: "Nearby",
      isActive: pathname.startsWith("/nearby-offers"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full select-none transition-all duration-200 ${
                item.isActive
                  ? "text-slate-800 font-semibold"
                  : "text-slate-400 font-medium hover:text-slate-600"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-5 w-5 stroke-[1.8] transition-all duration-200 ${
                    item.isActive ? "scale-110" : ""
                  } ${item.label === "Trending" ? "animate-trending-glow" : ""}`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  item.label === "Trending" ? "animate-trending-glow" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
