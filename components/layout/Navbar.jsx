"use client";

import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import LocationSelector from "./LocationSelector";
import UserDropdown from "./UserDropdown";

export default function Navbar({ user: propUser = null }) {
  const { data: session } = useSession();
  const user = propUser || session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSearch(e) {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px] gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold font-heading tracking-tight flex items-center gap-1.5">
                <span className="text-brand-gradient">Vouchiqo</span>
                <CheckCircle2 className="w-5 h-5 text-brand-success fill-brand-success/10" />
              </span>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide uppercase hidden sm:inline">
                Verified Deals. Real Savings.
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5.5">
            <Link
              href="/deals"
              className="text-sm font-semibold hover:text-slate-300 transition-colors"
            >
              Browse Deals
            </Link>
            <Link
              href="/expired-coupon-revival"
              className="text-sm font-semibold hover:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              Revive Coupon
            </Link>
            <Link
              href="/nearby-offers"
              className="text-sm font-semibold hover:text-slate-300 transition-colors"
            >
              Nearby Offers
            </Link>
            <Link
              href="/deals"
              className="text-sm font-semibold hover:text-slate-300 transition-colors"
            >
              Categories
            </Link>
          </div>

          {/* Right side: Search (non-home) + Location Badge + Auth */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5 xl:gap-3.5 flex-shrink-0">
            {/* Search Bar — hidden on homepage */}
            {pathname !== "/" && (
              <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-1.5 gap-2 transition-all focus-within:bg-brand-bg focus-within:border-brand-blue/50 focus-within:ring-2 focus-within:ring-brand-blue/30 text-slate-200 focus-within:text-brand-text w-40 lg:w-44 xl:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="border-0 bg-transparent text-sm w-full p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-brand-subtext text-inherit shadow-none"
                />
              </div>
            )}

            {/* Location Selector */}
            <LocationSelector />

            {/* Auth CTA / User Dropdown */}
            {!mounted || !user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-sm font-semibold hover:text-slate-300 text-white transition-colors px-3 py-1.5 cursor-pointer hover:bg-white/5"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="btn-primary text-sm flex items-center gap-1.5 px-3.5 py-1.5 border-0 cursor-pointer"
                >
                  <Link href="/auth/register">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <UserDropdown user={user} />
            )}
          </div>

          {/* Mobile Menu Trigger Row */}
          <div className="flex md:hidden items-center gap-2">
            <LocationSelector
              isMobile={true}
              onMobileSelect={() => setIsOpen(false)}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((v) => !v)}
              className="text-white hover:text-slate-300 focus:outline-none p-2 h-11 w-11 hover:bg-white/5 cursor-pointer flex flex-col justify-center items-center gap-1.5 relative z-[60]"
              aria-label="Toggle menu"
            >
              <span
                className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${
                  isOpen ? "rotate-45 translate-y-[8.5px]" : ""
                }`}
              />
              <span
                className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${
                  isOpen ? "-rotate-45 -translate-y-[8.5px]" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel (below navbar) */}
      {isOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10 px-4 py-6 space-y-6 shadow-xl z-[100] animate-fade-in-scale max-h-[calc(100vh-72px)] overflow-y-auto text-left">
          {/* Mobile Search */}
          {pathname !== "/" && (
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-2 gap-2 text-brand-text">
              <Search className="w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="border-0 bg-transparent text-sm w-full p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-brand-subtext text-white shadow-none"
              />
            </div>
          )}

          {/* Mobile Links */}
          <div className="flex flex-col gap-4">
            <Link
              href="/deals"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium hover:text-slate-300 transition-colors"
            >
              Browse Deals
            </Link>
            <Link
              href="/expired-coupon-revival"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium hover:text-slate-300 transition-colors flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              Revive Coupon
            </Link>
            <Link
              href="/nearby-offers"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium hover:text-slate-300 transition-colors"
            >
              Nearby Offers
            </Link>
            <Link
              href="/deals"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium hover:text-slate-300 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/merchant/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-brand-warning hover:text-yellow-300 transition-colors"
            >
              Merchant Portal
            </Link>
          </div>

          <hr className="border-white/10" />

          {/* Mobile Auth / User Profile */}
          <div className="flex flex-col gap-2 pt-2">
            {!mounted || !user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-center font-semibold text-white py-2.5 hover:bg-white/5 rounded-lg w-full cursor-pointer justify-center"
                >
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="btn-primary w-full text-center py-2.5 border-0 cursor-pointer justify-center"
                >
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            ) : (
              <UserDropdown
                user={user}
                isMobile={true}
                onMobileClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
