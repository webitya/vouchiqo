"use client";

import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Menu,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar({ user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All Locations");

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold font-heading tracking-tight flex items-center gap-1.5">
                <span className="bg-brand-gradient text-transparent bg-clip-text">
                  Vouchiqo
                </span>
                <CheckCircle2 className="w-5 h-5 text-brand-success fill-brand-success/10" />
              </span>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide uppercase hidden sm:inline">
                Verified Deals. Real Savings.
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg items-center bg-white/10 border border-white/20 rounded-lg p-1.5 gap-2 transition-all focus-within:bg-white focus-within:border-white focus-within:ring-2 focus-within:ring-brand-blue/30 text-slate-200 focus-within:text-slate-800">
            <div className="flex items-center gap-1.5 pl-2 border-r border-white/20 pr-2 flex-shrink-0">
              <MapPin className="w-4 h-4 text-brand-warning" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-0 bg-transparent text-sm font-medium cursor-pointer text-inherit p-0 h-auto focus:ring-0 focus:ring-offset-0 gap-1 shadow-none [&>svg]:opacity-100">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-brand-bg text-brand-text border-brand-border">
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Remote">Online/Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center flex-1 pr-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Search verified deals & brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-sm w-full p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-slate-400 text-inherit shadow-none"
              />
            </div>
          </div>

          {/* Nav Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/deals"
              className="text-sm font-semibold hover:text-slate-300 transition-colors"
            >
              Browse Deals
            </Link>
            <Link
              href="/revival"
              className="text-sm font-semibold hover:text-slate-300 transition-colors"
            >
              Expired Revival
            </Link>
            <Link
              href="/merchant/dashboard"
              className="text-sm font-semibold text-brand-warning hover:text-yellow-300 transition-colors"
            >
              Merchant Portal
            </Link>
          </div>

          {/* Auth CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user
              ? <Button
                  asChild
                  className="btn-secondary text-sm flex items-center gap-2 px-4 py-2 bg-brand-blue border-0 cursor-pointer"
                >
                  <Link href={`/${user.role}/dashboard`}>
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
              : <>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-sm font-semibold hover:text-slate-300 text-white transition-colors px-3 py-2 cursor-pointer hover:bg-white/5"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="btn-primary text-sm flex items-center gap-1.5 px-4 py-2 border-0 cursor-pointer"
                  >
                    <Link href="/auth/register">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </>}
          </div>

          {/* Mobile Menu Trigger via Sheet */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-slate-300 focus:outline-none p-1.5 h-9 w-9 hover:bg-white/5 cursor-pointer"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-brand-navy border-l border-white/10 text-white p-6 space-y-6"
              >
                <SheetHeader className="text-left border-b border-white/10 pb-4">
                  <SheetTitle className="text-xl font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
                    <span className="bg-brand-gradient text-transparent bg-clip-text">
                      Vouchiqo
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-2 gap-2 text-slate-200 mt-4">
                  <MapPin className="w-4 h-4 text-brand-warning" />
                  <Input
                    type="text"
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-sm w-full p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-slate-400 text-white shadow-none"
                  />
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-4 pt-2">
                  <Link
                    href="/deals"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium hover:text-slate-300 transition-colors"
                  >
                    Browse Deals
                  </Link>
                  <Link
                    href="/revival"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium hover:text-slate-300 transition-colors"
                  >
                    Expired Revival
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

                <div className="flex flex-col gap-2 pt-2">
                  {user
                    ? <Button
                        asChild
                        className="btn-secondary w-full text-center py-2.5 bg-brand-blue border-0 cursor-pointer"
                      >
                        <Link
                          href={`/${user.role}/dashboard`}
                          onClick={() => setIsOpen(false)}
                        >
                          Go to Dashboard
                        </Link>
                      </Button>
                    : <>
                        <Button
                          asChild
                          variant="ghost"
                          className="text-center font-semibold text-white py-2.5 hover:bg-white/5 rounded-lg w-full cursor-pointer"
                        >
                          <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="btn-primary w-full text-center py-2.5 border-0 cursor-pointer"
                        >
                          <Link
                            href="/auth/register"
                            onClick={() => setIsOpen(false)}
                          >
                            Get Started
                          </Link>
                        </Button>
                      </>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
