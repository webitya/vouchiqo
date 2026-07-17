"use client";

import { useEffect, useRef, useState } from "react";

const TRENDING_SLIDES = [
  {
    id: 0,
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1400&auto=format&fit=crop",
    label: "Klook Vietnam",
    badge: "🌴 Travel Deal",
    headline: "Vietnam Ha Long Bay Cruise",
    discount: "Up to 50% OFF",
    href: "/deals",
  },
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1400&auto=format&fit=crop",
    label: "Fashion Week",
    badge: "👗 Fashion",
    headline: "End of Season Mega Sale",
    discount: "Flat 40% OFF",
    href: "/deals",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1400&auto=format&fit=crop",
    label: "Tech Deals",
    badge: "💻 Electronics",
    headline: "Laptop & Gadgets Super Sale",
    discount: "Save up to ₹15,000",
    href: "/deals",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1400&auto=format&fit=crop",
    label: "Food & Dining",
    badge: "🍕 Dining",
    headline: "Restaurant Week Special Offers",
    discount: "Buy 1 Get 1 Free",
    href: "/deals",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1400&auto=format&fit=crop",
    label: "Fitness & Health",
    badge: "💪 Fitness",
    headline: "Gym Memberships & Wellness",
    discount: "3 Months for ₹999",
    href: "/deals",
  },
];

export const TrendingOffer = () => {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(0);
  const isDragging = useRef(false);
  const total = TRENDING_SLIDES.length;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const goTo = (idx) => setCurrent(idx);
  const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const goNext = () => setCurrent((prev) => (prev + 1) % total);

  // Touch/mouse swipe
  const handleTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    isDragging.current = false;
  };
  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
    isDragging.current = true;
  };
  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    isDragging.current = false;
  };

  const slide = TRENDING_SLIDES[current];

  return (
    <section className="text-left w-full select-none">
      {/* Compact heading */}
      <h2 className="text-base md:text-xl font-bold text-brand-text mb-3">
        Trending Offer
      </h2>

      {/* Carousel wrapper */}
      <div
        className="relative w-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: "200px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Slides */}
        {TRENDING_SLIDES.map((s, idx) => (
          <a
            key={s.id}
            href={s.href}
            draggable={false}
            className="absolute inset-0 block w-full h-full transition-opacity duration-700"
            style={{
              opacity: idx === current ? 1 : 0,
              pointerEvents: idx === current ? "auto" : "none",
            }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{
                backgroundImage: `url(${s.image})`,
                transform: idx === current ? "scale(1.03)" : "scale(1)",
              }}
            />
          </a>
        ))}

        {/* Dot navigation — inside image at bottom center */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {TRENDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goTo(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className="border-0 p-0 transition-all duration-300 cursor-pointer rounded-full"
              style={{
                width: idx === current ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  idx === current ? "#ffffff" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOffer;
