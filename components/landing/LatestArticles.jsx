"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ARTICLES = [
  {
    id: 1,
    category: "Shopping Tips",
    title: "10 Proven Ways to Save More Using Coupon Codes in 2025",
    excerpt:
      "Discover insider tricks that seasoned bargain hunters use to stack discounts and maximize savings on every order.",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Jul 12, 2025",
    href: "/blog/save-more-coupon-codes",
  },
  {
    id: 2,
    category: "Fashion",
    title: "Best Myntra & AJIO Deals This Season — Up to 80% OFF",
    excerpt:
      "We curated the top fashion offers live right now on Myntra and AJIO so you don't have to hunt through thousands of listings.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min read",
    date: "Jul 10, 2025",
    href: "/blog/myntra-ajio-deals",
  },
  {
    id: 3,
    category: "Food & Dining",
    title: "Swiggy vs Zomato: Which App Gives Better Discounts in 2025?",
    excerpt:
      "A side-by-side comparison of promo codes, subscription perks, and cashback offers from India's two biggest food delivery apps.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Jul 8, 2025",
    href: "/blog/swiggy-vs-zomato-discounts",
  },
  {
    id: 4,
    category: "Electronics",
    title: "Amazon vs Flipkart: Who Has the Real Deals on Gadgets?",
    excerpt:
      "We tracked 50+ product prices across both platforms for 30 days. Here's who actually wins on laptops, phones, and accessories.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
    readTime: "7 min read",
    date: "Jul 5, 2025",
    href: "/blog/amazon-vs-flipkart-gadgets",
  },
  {
    id: 5,
    category: "Travel",
    title: "How to Book Flights 40% Cheaper Using These Hidden Tricks",
    excerpt:
      "From incognito mode myths to real airline coupon stacking, here's an honest guide to flying cheaper across India and abroad.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
    readTime: "8 min read",
    date: "Jul 2, 2025",
    href: "/blog/cheap-flight-booking-tricks",
  },
  {
    id: 6,
    category: "Beauty",
    title: "Nykaa Sale Guide: Best Skincare Deals Not to Miss",
    excerpt:
      "Beauty enthusiasts rejoice — we break down every Nykaa sale category, what to buy first, and coupons that actually work.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Jun 28, 2025",
    href: "/blog/nykaa-sale-guide",
  },
];

function ArticleCard({ article }) {
  return (
    <Link
      href={article.href}
      className="art-card group flex-shrink-0 no-underline cursor-pointer"
      style={{ width: "100%" }}
    >
      <div
        className="art-card__inner flex flex-col rounded-2xl overflow-hidden bg-white"
        style={{
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          transition:
            "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
          height: "100%",
        }}
      >
        {/* Cover image */}
        <div
          style={{
            height: "150px",
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            className="art-card__img"
          />
          {/* Category pill (unified brand blue color) */}
          <span
            className="bg-brand-blue"
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3
            className="line-clamp-2"
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {article.title}
          </h3>
          <p
            className="line-clamp-2"
            style={{
              fontSize: "12px",
              color: "#64748b",
              lineHeight: 1.6,
              margin: 0,
              flex: 1,
            }}
          >
            {article.excerpt}
          </p>

          {/* Meta row */}
          <div
            className="flex items-center gap-3 mt-auto pt-3"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <span
              className="flex items-center gap-1"
              style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}
            >
              <Clock style={{ width: "11px", height: "11px" }} />
              {article.readTime}
            </span>
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "#cbd5e1",
              }}
            />
            <span
              style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}
            >
              {article.date}
            </span>
            <span
              className="ml-auto flex items-center gap-1 text-brand-blue"
              style={{
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              Read →
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .art-card__inner:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.11) !important;
        }
        .art-card:hover .art-card__img {
          transform: scale(1.06);
        }
      `}</style>
    </Link>
  );
}

export function LatestArticles() {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const total = ARTICLES.length;
  const maxIndex = Math.max(0, total - Math.ceil(visibleCount));

  // Measure card width on mount & resize
  useEffect(() => {
    function measure() {
      if (trackRef.current) {
        const width = window.innerWidth;
        let visible = 4;
        if (width < 640) {
          visible = 1.15; // Peek next card
        } else if (width < 1024) {
          visible = 2.2;
        }
        setVisibleCount(visible);

        const gap = 20;
        const containerW = trackRef.current.parentElement.offsetWidth;
        setCardWidth((containerW - gap * (Math.ceil(visible) - 1)) / visible);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Auto-slide every 3.5s
  useEffect(() => {
    if (maxIndex <= 0) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(id);
  }, [maxIndex]);

  const goPrev = () => setCurrent((p) => (p <= 0 ? maxIndex : p - 1));
  const goNext = () => setCurrent((p) => (p >= maxIndex ? 0 : p + 1));

  // Touch & drag gestures
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
      goNext();
    } else if (diff < -50) {
      goPrev();
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
      goNext();
    } else if (diff < -50) {
      goPrev();
    }
    isDragging.current = false;
  };

  const gap = 20;
  const offset = current * (cardWidth + gap);

  return (
    <section className="text-left w-full overflow-hidden select-none px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(18px,2.5vw,22px)", color: "#0f172a" }}
          >
            Latest Articles &amp; Guides
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              fontWeight: 500,
              margin: "2px 0 0",
            }}
          >
            Tips, deals breakdowns &amp; shopping guides
          </p>
        </div>

        {/* Nav arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="art-nav-btn"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <ChevronLeft
              style={{ width: "18px", height: "18px", color: "#334155" }}
            />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="art-nav-btn"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <ChevronRight
              style={{ width: "18px", height: "18px", color: "#334155" }}
            />
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div
        className="cursor-grab active:cursor-grabbing"
        style={{ overflow: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: `${gap}px`,
            transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            transform: `translateX(-${offset}px)`,
          }}
        >
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              style={{
                width: cardWidth > 0 ? `${cardWidth}px` : "calc(25% - 15px)",
                flexShrink: 0,
              }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? "20px" : "7px",
              height: "7px",
              borderRadius: "999px",
              background: i === current ? "#2563eb" : "#cbd5e1",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        .art-nav-btn:hover {
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.10) !important;
        }
      `}</style>
    </section>
  );
}

export default LatestArticles;
