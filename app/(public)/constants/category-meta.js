// Shared category metadata used by /categories and /category/[slug] pages

export const CATEGORY_META = {
  food: {
    title: "Food & Dining",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409648578/food.svg",
    slug: "food",
  },
  fashion: {
    title: "Fashion",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409648143/fashion.svg",
    slug: "fashion",
  },
  electronics: {
    title: "Electronics",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409647250/electronics.svg",
    slug: "electronics",
  },
  beauty: {
    title: "Beauty",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409643778/beauty.svg",
    slug: "beauty",
  },
  travel: {
    title: "Travel",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409656824/travel.svg",
    slug: "travel",
  },
  fitness: {
    title: "Health & Fitness",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773792964436/fitness.svg",
    slug: "fitness",
  },
  home: {
    title: "Home & Kitchen",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409649785/home-and-kitchen.svg",
    slug: "home",
  },
  entertainment: {
    title: "Entertainment",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409647335/entertainment.svg",
    slug: "entertainment",
  },
  services: {
    title: "Services",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409655353/services.svg",
    slug: "services",
  },
  other: {
    title: "Other Deals",
    icon: "https://cdn.grabon.in/gograbon/images/category/1773409656550/tickets.svg",
    slug: "other",
  },
};

// Extended metadata used by /category/[slug] page (includes banners, emojis, sub-categories)
export const CATEGORY_DETAIL_META = {
  food: {
    title: "Food & Dining",
    emoji: "🍔",
    banner: "bg-gradient-to-r from-amber-500 to-orange-500",
    subs: ["Fast Food", "Fine Dining", "Bakeries", "Beverages"],
  },
  fashion: {
    title: "Fashion & Apparel",
    emoji: "🛍️",
    banner: "bg-gradient-to-r from-pink-500 to-rose-500",
    subs: ["Footwear", "Apparel", "Watches", "Accessories"],
  },
  electronics: {
    title: "Electronics & Gadgets",
    emoji: "💻",
    banner: "bg-gradient-to-r from-blue-500 to-indigo-500",
    subs: ["Mobiles", "Laptops", "Accessories", "Smart Home"],
  },
  beauty: {
    title: "Beauty & Skincare",
    emoji: "💄",
    banner: "bg-gradient-to-r from-rose-400 to-pink-500",
    subs: ["Makeup", "Skincare", "Fragrance", "Hair Care"],
  },
  travel: {
    title: "Travel & Hotels",
    emoji: "✈️",
    banner: "bg-gradient-to-r from-emerald-500 to-teal-500",
    subs: ["Hotels", "Flights", "Cabs", "Luggage"],
  },
  fitness: {
    title: "Health & Fitness",
    emoji: "💪",
    banner: "bg-gradient-to-r from-red-500 to-orange-500",
    subs: ["Gyms", "Supplements", "Equipment", "Wearables"],
  },
  home: {
    title: "Home & Décor",
    emoji: "🏠",
    banner: "bg-gradient-to-r from-teal-500 to-emerald-600",
    subs: ["Furniture", "Sanitary Ware", "Tiles", "Lighting"],
  },
  entertainment: {
    title: "SaaS & Productivity",
    emoji: "💼",
    banner: "bg-gradient-to-r from-indigo-500 to-purple-600",
    subs: ["SaaS Tools", "Streaming", "Gaming", "Subscriptions"],
  },
  services: {
    title: "Local Services",
    emoji: "🛠️",
    banner: "bg-gradient-to-r from-violet-500 to-fuchsia-600",
    subs: ["Repairs", "Catering", "Spa", "On-Demand"],
  },
  other: {
    title: "Special & Other Deals",
    emoji: "🏷️",
    banner: "bg-gradient-to-r from-slate-500 to-slate-700",
    subs: ["Daily Deals", "Bundles", "Freebies", "Cashbacks"],
  },
};
