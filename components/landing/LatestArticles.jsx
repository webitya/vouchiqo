"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

const ARTICLES = [
  {
    id: 1,
    type: "guide",
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
    type: "guide",
    category: "Fashion",
    title: "Best Myntra & AJIO Deals This Season — Up to 80% OFF",
    excerpt:
      "We curated the top fashion offers live right now on Myntra and AJIO so you don't have to hunt through listings.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min read",
    date: "Jul 10, 2025",
    href: "/blog/myntra-ajio-deals",
  },
  {
    id: 3,
    type: "review",
    category: "Reviews",
    title: "Swiggy vs Zomato: Detailed Service and Discount Review",
    excerpt:
      "A side-by-side comparison of promo codes, subscription perks, and delivery speeds from India's two biggest food apps.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Jul 8, 2025",
    href: "/blog/swiggy-vs-zomato-discounts",
  },
  {
    id: 4,
    type: "review",
    category: "Reviews",
    title: "Amazon vs Flipkart: Who Has the Real Deals on Electronics?",
    excerpt:
      "We tracked 50+ gadget prices for 30 days. Here's our comprehensive review of who actually saves you more money.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
    readTime: "7 min read",
    date: "Jul 5, 2025",
    href: "/blog/amazon-vs-flipkart-gadgets",
  },
  {
    id: 5,
    type: "guide",
    category: "Travel",
    title: "How to Book Flights 40% Cheaper Using These Hidden Tricks",
    excerpt:
      "From incognito mode myths to real airline coupon stacking, here's an honest guide to flying cheaper across India.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
    readTime: "8 min read",
    date: "Jul 2, 2025",
    href: "/blog/cheap-flight-booking-tricks",
  },
  {
    id: 6,
    type: "guide",
    category: "Beauty",
    title: "Nykaa Sale Guide: Best Skincare Deals Not to Miss",
    excerpt:
      "Beauty enthusiasts rejoice — we break down every Nykaa sale category, what to buy first, and coupons that work.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Jun 28, 2025",
    href: "/blog/nykaa-sale-guide",
  },
  {
    id: 7,
    type: "review",
    category: "Reviews",
    title: "Zara Winter Collection Review: Is it Worth the Luxury Price?",
    excerpt:
      "We review quality, sizing, and styling options from the latest winter drop to see if the prices are truly justified.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Jun 24, 2025",
    href: "/blog/zara-winter-review",
  },
  {
    id: 8,
    type: "review",
    category: "Reviews",
    title: "Samsung Galaxy S25 Review: Best Camera Value of the Year?",
    excerpt:
      "An in-depth review of Samsung's latest flagship. We test battery life, night photography, and processor performance.",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Jun 20, 2025",
    href: "/blog/samsung-s25-review",
  },
  {
    id: 9,
    type: "review",
    category: "Reviews",
    title: "Lenskart Gold Membership: Real Savings or Marketing Hype?",
    excerpt:
      "We read the fine print and tested the 'Buy 1 Get 1' benefit for 6 months. Here is our honest member review.",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Jun 15, 2025",
    href: "/blog/lenskart-gold-review",
  },
  {
    id: 10,
    type: "guide",
    category: "Finance",
    title: "Best Credit Cards for Shopping & Cashback Benefits in India",
    excerpt:
      "We compare the top 5 shopping credit cards side-by-side to find which offers the best reward points and cashback.",
    image:
      "https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Jun 10, 2025",
    href: "/blog/best-cashback-credit-cards",
  },
];

const CATEGORY_TEMPLATES = {
  "Shopping Tips": "from-amber-50/70 to-orange-100/30",
  Fashion: "from-pink-50/70 to-rose-100/30",
  Reviews: "from-blue-50/70 to-indigo-100/30",
  Travel: "from-sky-50/70 to-cyan-100/30",
  Beauty: "from-fuchsia-50/70 to-pink-100/30",
  Finance: "from-teal-50/70 to-green-100/30",
};

function getCategoryGradient(category) {
  return CATEGORY_TEMPLATES[category] || "from-slate-50/70 to-zinc-100/30";
}

function CompactArticleCard({ article }) {
  const gradient = getCategoryGradient(article.category);
  return (
    <Link
      href={article.href}
      className={`group block bg-gradient-to-br ${gradient} border border-slate-200 dark:border-zinc-800 rounded-[10px] overflow-hidden hover:border-blue-600 transition-colors duration-200 w-full shrink-0`}
    >
      <div className="flex flex-col h-full font-sans">
        <div className="h-32 sm:h-36 overflow-hidden relative rounded-t-[10px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-102"
          />
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-[10px] tracking-wider">
            {article.category}
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-1.5 text-left">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200/50 dark:border-zinc-800 text-[10px] text-slate-400 font-bold">
            <Clock className="w-3 h-3 text-slate-455 shrink-0" />
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span className="ml-auto text-blue-600 font-extrabold group-hover:translate-x-0.5 transition-transform">
              Read →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function LatestArticles() {
  const guideArticles = ARTICLES.filter((a) => a.type === "guide");
  const reviewArticles = ARTICLES.filter((a) => a.type === "review");

  return (
    <section className="w-full bg-[#f8fafc] dark:bg-zinc-950/40 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-zinc-900/60 select-none text-left">
      {/* Header Block */}
      <div className="w-full mb-8 font-sans">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Latest Articles &amp; Guides
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Tips, deals breakdowns &amp; shopping reviews
        </p>
      </div>

      {/* Two-Column layout (Left: Guides, Right: Reviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full">
        {/* COLUMN 1: GUIDES */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Guides &amp; Shopping Tips
          </h3>
          <div className="relative overflow-hidden rounded-[10px] border border-slate-300 bg-gradient-to-br from-blue-50/30 to-indigo-50/15 dark:from-zinc-900/10 dark:to-zinc-900/20 p-2.5 mx-0">
            <div className="flex gap-2.5 animate-marquee-horizontal-ltr hover:[animation-play-state:paused] w-max">
              {/* Loop 1 */}
              {guideArticles.map((article) => (
                <div
                  key={`g1-${article.id}`}
                  className="w-[270px] sm:w-[285px] shrink-0 animate-none"
                >
                  <CompactArticleCard article={article} />
                </div>
              ))}
              {/* Loop 2 */}
              {guideArticles.map((article) => (
                <div
                  key={`g2-${article.id}`}
                  className="w-[270px] sm:w-[285px] shrink-0 animate-none"
                >
                  <CompactArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: REVIEWS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Brand &amp; Product Reviews
          </h3>
          <div className="relative overflow-hidden rounded-[10px] border border-slate-300 bg-gradient-to-br from-amber-50/30 to-yellow-50/15 dark:from-zinc-900/10 dark:to-zinc-900/20 p-2.5 mx-0">
            <div className="flex gap-2.5 animate-marquee-horizontal-ltr hover:[animation-play-state:paused] w-max">
              {/* Loop 1 */}
              {reviewArticles.map((article) => (
                <div
                  key={`r1-${article.id}`}
                  className="w-[270px] sm:w-[285px] shrink-0 animate-none"
                >
                  <CompactArticleCard article={article} />
                </div>
              ))}
              {/* Loop 2 */}
              {reviewArticles.map((article) => (
                <div
                  key={`r2-${article.id}`}
                  className="w-[270px] sm:w-[285px] shrink-0 animate-none"
                >
                  <CompactArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes marquee-horizontal-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-horizontal-ltr {
          animation: marquee-horizontal-ltr 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default LatestArticles;
