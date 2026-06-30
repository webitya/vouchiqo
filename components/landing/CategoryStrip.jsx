"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HOME_CATEGORIES } from "@/utils/home-data";

export const CategoryStrip = React.memo(function CategoryStrip() {
  const handleCategoryClick = (categoryName) => {
    const mapping = {
      "Food & Drink": "Food",
      "Fashion & Apparel": "Fashion",
      "Tech & SaaS": "SaaS",
      "Travel & Hotels": "Travel",
      "Health & Care": "Beauty",
    };
    const filterVal = mapping[categoryName] || categoryName;
    window.location.href = `/deals?search=&location=All&category=${filterVal}`;
  };

  return (
    <section className="bg-brand-bg border-b border-brand-border py-5 px-4 shadow-sm relative z-20 animate-fade-in-up stagger-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-1">
        <span className="text-xs font-bold text-brand-navy uppercase tracking-wider whitespace-nowrap mr-2">
          Trending Categories:
        </span>
        <div className="flex gap-3">
          {HOME_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-brand-border hover:border-brand-blue hover:bg-brand-surface transition-all text-xs font-bold text-brand-text bg-transparent h-auto cursor-pointer shadow-none category-card animate-fade-in-scale stagger-${idx + 1}`}
              >
                <div className={`p-1 rounded-md ${cat.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{cat.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
});
