"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapPin,
  Navigation,
  RotateCcw,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/hooks/use-location";
import { useSession } from "@/lib/auth-client";

// 200+ Indian cities for the location search
const INDIAN_CITIES = [
  "Arrah", "Patna", "Ranchi", "Delhi", "Mumbai", "Bangalore", "Hyderabad",
  "Chennai", "Kolkata", "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Visakhapatnam", "Indore", "Thane", "Bhopal",
  "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali",
  "Vasai-Virar", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
  "Navi Mumbai", "Allahabad", "Howrah", "Gwalior", "Jabalpur", "Coimbatore",
  "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati",
  "Chandigarh", "Solapur", "Hubli-Dharwad", "Bareilly", "Moradabad",
  "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar",
  "Salem", "Warangal", "Mira-Bhayandar", "Thiruvananthapuram", "Bhiwandi",
  "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur",
  "Bhilai", "Cuttack", "Firozabad", "Kochi", "Bhavnagar", "Dehradun",
  "Durgapur", "Asansol", "Nanded", "Kolhapur", "Ajmer", "Akola",
  "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi",
  "Ulhasnagar", "Jammu", "Sangli-Miraj", "Mangalore", "Erode",
  "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya",
  "Jalgaon", "Udaipur", "Maheshtala", "Tiruppur", "Davanagere",
  "Kozhikode", "Bokaro", "South Dumdum", "Bellary", "Patiala",
  "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara",
  "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara",
  "Brahmapur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam",
  "Avadi", "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur",
  "Satara", "Bijapur", "Rampur", "Shambhajinagar", "Shimla", "Puducherry",
];

export default function Navbar({ user: propUser = null }) {
  const { data: session } = useSession();
  const user = propUser || session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const locationPanelRef = useRef(null);
  const { city, setCity, status, detect } = useLocation();
  const [mounted, setMounted] = useState(false);

  const filteredCities = citySearch.length > 0
    ? INDIAN_CITIES.filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase())
      ).slice(0, 8)
    : INDIAN_CITIES.slice(0, 8);

  const isDetecting = status === "detecting";

  // Close location panel on outside click & track client mount
  useEffect(() => {
    setMounted(true);
    function handleClickOutside(e) {
      if (locationPanelRef.current && !locationPanelRef.current.contains(e.target)) {
        setShowLocationPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCitySelect(selectedCity) {
    setCity(selectedCity);
    setShowLocationPanel(false);
    setCitySearch("");
  }

  function handleDetect() {
    detect();
    setShowLocationPanel(false);
  }

  function handleSearch(e) {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function clearLocation() {
    setCity(null);
    setShowLocationPanel(false);
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
            {/* Revive Coupon — with orange badge */}
            <Link
              href="/expired-coupon-revival"
              className="text-sm font-semibold hover:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
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

            {/* Location Badge */}
            <div className="relative" ref={locationPanelRef}>
              <button
                type="button"
                onClick={() => setShowLocationPanel((v) => !v)}
                className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-slate-300 transition-colors bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/15"
                aria-label="Set location"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-warning flex-shrink-0" />
                <span className="max-w-[90px] truncate">
                  {city || "Set Location"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLocationPanel ? "rotate-180" : ""}`} />
              </button>

              {/* Location Dropdown Panel */}
              {showLocationPanel && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-brand-bg rounded-xl shadow-2xl border border-brand-border z-[100] overflow-hidden animate-fade-in-scale">
                  {/* Header */}
                  <div className="bg-brand-navy px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Set Your Location</span>
                    <button
                      type="button"
                      onClick={() => setShowLocationPanel(false)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* GPS Button */}
                    <button
                      type="button"
                      onClick={handleDetect}
                      disabled={isDetecting}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-brand-blue/10 border border-brand-blue/20 rounded-lg text-sm font-semibold text-brand-blue hover:bg-brand-blue/15 transition-colors disabled:opacity-60"
                    >
                      {isDetecting
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Navigation className="w-4 h-4" />
                      }
                      {isDetecting ? "Detecting..." : "Use My Current Location"}
                    </button>

                    {/* City Search Input */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-subtext" />
                      <Input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="pl-8 text-sm h-9 border-brand-border bg-brand-surface text-brand-text"
                        autoFocus
                      />
                    </div>

                    {/* City List */}
                    <div className="space-y-0.5 max-h-48 overflow-y-auto">
                      {filteredCities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleCitySelect(c)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                            city === c
                              ? "bg-brand-blue text-white font-semibold"
                              : "hover:bg-brand-surface text-brand-text"
                          }`}
                        >
                          <span>{c}</span>
                          {city === c && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>

                    {/* Clear location */}
                    {city && (
                      <button
                        type="button"
                        onClick={clearLocation}
                        className="w-full text-xs text-brand-subtext hover:text-brand-error transition-colors text-center"
                      >
                        Clear location — Show All India deals
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth CTA */}
            {(!mounted || !user)
              ? <>
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
              : <Button
                  asChild
                  className="btn-secondary text-sm flex items-center gap-2 px-3.5 py-1.5 bg-brand-blue border-0 cursor-pointer"
                >
                  <Link href={`/${user.role}/dashboard`}>
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
            }
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile location badge */}
            <button
              type="button"
              onClick={() => {
                setShowLocationPanel((v) => !v);
                setIsOpen(false);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-md px-2 py-1.5 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-brand-warning" />
              <span className="max-w-[60px] truncate">{city || "Location"}</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen((v) => !v);
                setShowLocationPanel(false);
              }}
              className="text-white hover:text-slate-300 focus:outline-none p-2 h-11 w-11 hover:bg-white/5 cursor-pointer flex flex-col justify-center items-center gap-1.5 relative z-[60]"
              aria-label="Toggle menu"
            >
              <span className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${isOpen ? "rotate-45 translate-y-[8.5px]" : ""}`} />
              <span className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${isOpen ? "opacity-0" : ""}`} />
              <span className={`w-7 h-[2.5px] bg-white transition-all duration-300 rounded-full ${isOpen ? "-rotate-45 -translate-y-[8.5px]" : ""}`} />
            </Button>
          </div>

          {/* Mobile location panel overlay */}
          {showLocationPanel && (
            <div
              className="fixed inset-0 z-[99] bg-black/20 md:hidden"
              onClick={() => setShowLocationPanel(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile Location Panel (below navbar) */}
      {showLocationPanel && (
        <div className="md:hidden bg-brand-bg border-t border-brand-border shadow-xl z-[100] px-4 py-4 space-y-3">
          <button
            type="button"
            onClick={handleDetect}
            disabled={isDetecting}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-brand-blue/10 border border-brand-blue/20 rounded-lg text-sm font-semibold text-brand-blue hover:bg-brand-blue/15 transition-colors"
          >
            {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {isDetecting ? "Detecting..." : "Use My Current Location"}
          </button>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-subtext" />
            <Input
              type="text"
              placeholder="Search Indian cities..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="pl-8 text-sm h-9 border-brand-border bg-brand-surface text-brand-text"
            />
          </div>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
            {filteredCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { handleCitySelect(c); setShowLocationPanel(false); }}
                className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                  city === c
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "border-brand-border text-brand-text hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {city && (
            <button
              type="button"
              onClick={() => { clearLocation(); setShowLocationPanel(false); }}
              className="w-full text-xs text-brand-subtext hover:text-brand-error"
            >
              ✕ Clear — Show All India
            </button>
          )}
        </div>
      )}

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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
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

          {/* Mobile location */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Your Location</p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-warning" />
              <span>{city || "Not set"}</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="text-xs h-8 bg-white/10 border-white/20 text-white placeholder-slate-400 flex-1"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (citySearch.trim()) {
                    handleCitySelect(citySearch.trim());
                    setIsOpen(false);
                  }
                }}
                className="h-8 text-xs bg-brand-blue border-0 cursor-pointer"
              >
                Set
              </Button>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="flex flex-col gap-2 pt-2">
            {(!mounted || !user) ? (
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
              <Button
                asChild
                className="btn-secondary w-full text-center py-2.5 bg-brand-blue border-0 cursor-pointer justify-center"
              >
                <Link
                  href={`/${user.role}/dashboard`}
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
