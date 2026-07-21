"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductOfferCard from "@/components/shared/ProductOfferCard";
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

  const itemsPerPage = isMobile ? 4 : 10;
  const totalSlides = Math.ceil(TODAY_PRODUCT_DEALS.length / itemsPerPage);

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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 md:gap-4">
                  {slideItems.map((product, idx) => (
                    <ProductOfferCard key={idx} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centered Pagination Next/Prev & Square Numbers block */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6 select-none font-sans">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors rounded-none cursor-pointer"
            >
              Prev
            </button>

            {/* Numbers */}
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-extrabold border transition-colors rounded-none cursor-pointer ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors rounded-none cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsOfTheDay;
