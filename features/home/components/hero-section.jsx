"use client";

import { useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All Locations");

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set("search", searchQuery);
    }
    if (location && location !== "All Locations") {
      queryParams.set("location", location);
    }
    window.location.href = `/deals?${queryParams.toString()}`;
  };

  return (
    <section className="bg-brand-navy text-white pt-16 pb-20 px-4 relative overflow-hidden animate-fade-in-scale">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-fade-in-up stagger-1">
        <Badge className="bg-white/10 text-brand-warning hover:bg-white/15 border border-white/10 rounded-full px-3 py-1 font-bold text-xs shadow-none gap-1.5 w-fit animate-float">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>100% Verified Deals & Merchant Platform</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight max-w-2xl mx-auto">
          Verified Savings.{" "}
          <span className="text-brand-gradient">Real-Time</span> Customer Growth.
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
          Discover verified discount codes from your favorite brands. Vouchiqo
          ensures zero expired codes through continuous merchant verification.
        </p>

        {/* Search Bar in Hero */}
        <div className="bg-brand-bg rounded-lg shadow-lg max-w-xl mx-auto p-1.5 flex flex-col sm:flex-row gap-2 border border-brand-border text-brand-text">
          <div className="flex items-center gap-2 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-brand-border flex-shrink-0 min-w-[140px] text-left">
            <MapPin className="w-4 h-4 text-brand-blue" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="border-0 bg-transparent text-xs font-semibold cursor-pointer text-brand-text p-0 h-auto focus:ring-0 focus:ring-offset-0 gap-1 shadow-none [&>svg]:opacity-100 w-full text-left justify-between">
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
          <div className="flex items-center gap-2 px-3 py-1.5 flex-grow">
            <Search className="w-4 h-4 text-brand-subtext" />
            <Input
              type="text"
              placeholder="Search brands, food, travel, saas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="bg-transparent border-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-brand-text placeholder-brand-subtext font-medium p-0 h-auto shadow-none"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="btn-primary py-2 px-6 text-xs whitespace-nowrap border-0 h-auto cursor-pointer shadow-none"
          >
            Search Deals
          </Button>
        </div>
      </div>
    </section>
  );
}
