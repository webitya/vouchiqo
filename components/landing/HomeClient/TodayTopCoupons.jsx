"use client";

import {
  Baby,
  Car,
  ChevronLeft,
  ChevronRight,
  Coins,
  Flower2,
  Gamepad2,
  Gem,
  GraduationCap,
  Headphones,
  HeartPulse,
  Home,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Utensils,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FlatCouponCard from "@/components/shared/FlatCouponCard";

export const TodayTopCoupons = ({
  couponTab,
  setCouponTab,
  filteredTabCoupons,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsRef = useRef(null);

  // Swipe/drag refs
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  const TABS = [
    { id: "most-used", label: "Most Used", IconComp: Ticket },
    { id: "fashion", label: "Fashion & Clothing", IconComp: ShoppingBag },
    { id: "food", label: "Food & Dining", IconComp: Utensils },
    { id: "electronics", label: "Electronics & Gadgets", IconComp: Headphones },
    { id: "beauty", label: "Beauty & Wellness", IconComp: Flower2 },
    { id: "travel", label: "Travel & Hospitality", IconComp: Plane },
    { id: "home", label: "Home & Living", IconComp: Home },
    { id: "home-improvement", label: "Home Improvement", IconComp: Wrench },
    { id: "fitness", label: "Fitness & Healthcare", IconComp: HeartPulse },
    { id: "education", label: "Education & Courses", IconComp: GraduationCap },
    { id: "kids-baby", label: "Kids & Baby Products", IconComp: Baby },
    { id: "jewellery", label: "Jewellery & Accessories", IconComp: Gem },
    { id: "automotive", label: "Automobile & Auto Services", IconComp: Car },
    {
      id: "entertainment",
      label: "Gaming & Entertainment",
      IconComp: Gamepad2,
    },
    { id: "grocery", label: "Grocery & Essentials", IconComp: ShoppingCart },
    { id: "finance", label: "Finance & Insurance", IconComp: Coins },
  ];

  // Group into pages of 6 (2 rows of 3 columns)
  const itemsPerPage = 6;
  const totalSlides = Math.ceil(
    (filteredTabCoupons?.length || 0) / itemsPerPage,
  );

  // Reset page whenever category tab changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset index when tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [couponTab]);

  // Auto-scroll effect (5 seconds interval, infinite loop)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const slides = [];
  for (let i = 0; i < totalSlides; i++) {
    slides.push(
      (filteredTabCoupons || []).slice(
        i * itemsPerPage,
        (i + 1) * itemsPerPage,
      ),
    );
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleTabClick = (tabId, event) => {
    setCouponTab(tabId);
    if (event.currentTarget) {
      event.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  // Drag and swipe gesture handlers
  const handleTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart.current - dragEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    isDragging.current = false;
  };

  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const dragEnd = e.clientX;
    const diff = dragStart.current - dragEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    isDragging.current = false;
  };

  return (
    <section className="text-left w-full overflow-hidden select-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-brand-text">
          Today's Top Offers
        </h2>
      </div>

      {/* Filter Tabs with navigation controls */}
      <div className="relative w-full mb-6">
        {/* Left Scroll Button (desktop only) */}
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm hidden md:flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          aria-label="Scroll Categories Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Badges */}
        <div
          ref={tabsRef}
          className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide scroll-smooth relative"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {TABS.map((tab) => {
            const isActive = couponTab === tab.id;
            const Icon = tab.IconComp;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isActive
                    ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                    : "bg-white border-[#e2e8f0] text-[#475569] hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? "text-white" : "text-[#64748b]"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button (desktop only) */}
        <button
          type="button"
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm hidden md:flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          aria-label="Scroll Categories Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Coupons Sliding Viewport */}
      <div
        className="vouchiqo-carousel-viewport overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="vouchiqo-carousel-container flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
        >
          {slides.map((slideCoupons, slideIdx) => (
            <div key={slideIdx} className="vouchiqo-carousel-slide min-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                {slideCoupons.map((coupon) => (
                  <FlatCouponCard key={coupon._id} coupon={coupon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Pagination controls */}
      {totalSlides > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 mb-4">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer animate-none"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-500 min-w-[70px] text-center">
            Page {selectedIndex + 1} of {totalSlides}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer animate-none"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default TodayTopCoupons;
