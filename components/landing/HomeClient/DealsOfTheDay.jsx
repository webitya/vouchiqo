"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductOfferCard from "@/components/shared/cards/ProductOfferCard";
import { TODAY_PRODUCT_DEALS } from "./constants";

export const DealsOfTheDay = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    setIsMobile(media.matches);
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const itemsPerPage = isMobile ? 2 : 4;
  const totalSlides = Math.ceil(TODAY_PRODUCT_DEALS.length / itemsPerPage);

  // Auto-scroll loop every 5 seconds
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
      TODAY_PRODUCT_DEALS.slice(i * itemsPerPage, (i + 1) * itemsPerPage),
    );
  }

  const handlePrev = (e) => {
    e?.preventDefault();
    setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.preventDefault();
    setSelectedIndex((prev) => (prev + 1) % totalSlides);
  };

  // Drag and swipe gestures
  const dragStart = useRef(0);
  const isDragging = useRef(false);

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
    <section className="text-left w-full overflow-hidden select-none px-4 md:px-0 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-2xl font-bold text-brand-text">
          Popular Brand Offers Near You
        </h2>
        <Link
          href="/deals"
          className="text-xs md:text-sm font-semibold text-brand-blue hover:underline transition-all"
        >
          View All →
        </Link>
      </div>

      {/* Slider Viewport Container */}
      <div className="relative w-full px-1 pb-4">
        {/* Left Chevron at corner */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Viewport */}
        <div
          className="vouchiqo-carousel-viewport w-full overflow-hidden cursor-grab active:cursor-grabbing py-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="vouchiqo-carousel-container w-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
          >
            {slides.map((slideItems, slideIdx) => (
              <div
                key={slideIdx}
                className="vouchiqo-carousel-slide w-full flex-shrink-0"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {slideItems.map((product, idx) => (
                    <ProductOfferCard key={idx} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chevron at corner */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default DealsOfTheDay;
