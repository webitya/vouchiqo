export const SYSTEM_CATEGORIES = [
  { name: "Fashion & Clothing", slug: "fashion", emoji: "🛍️" },
  { name: "Food & Dining", slug: "food", emoji: "🍔" },
  { name: "Electronics & Gadgets", slug: "electronics", emoji: "💻" },
  { name: "Beauty & Wellness", slug: "beauty", emoji: "💄" },
  { name: "Travel & Hospitality", slug: "travel", emoji: "✈️" },
  { name: "Home & Living", slug: "home", emoji: "🛋️" },
  { name: "Home Improvement", slug: "home-improvement", emoji: "🛠️" },
  { name: "Fitness & Healthcare", slug: "fitness", emoji: "💪" },
  { name: "Education & Courses", slug: "education", emoji: "🎓" },
  { name: "Kids & Baby Products", slug: "kids-baby", emoji: "🧸" },
  { name: "Jewellery & Accessories", slug: "jewellery", emoji: "💍" },
  { name: "Automobile & Auto Services", slug: "automotive", emoji: "🚗" },
  { name: "Gaming & Entertainment", slug: "entertainment", emoji: "🎮" },
  { name: "Grocery & Essentials", slug: "grocery", emoji: "🛒" },
  { name: "Finance & Insurance", slug: "finance", emoji: "🏦" },
];

export const DUMMY_TAB_COUPONS = {
  travel: [
    {
      _id: "dummy-travel-1",
      title: "Flat ₹3,000 OFF on Domestic Holiday Packages booked at retail outlets",
      discountValue: 3000,
      discountType: "flat",
      description: "Book customized holiday tours with SOTC Travel advisors at local stores.",
      merchantId: {
        name: "SOTC Travel",
        logo: "/brandlogos/10022.jpg",
      },
    },
    {
      _id: "dummy-travel-2",
      title: "Flat 10% OFF on Luxury Bus Ticket bookings at Counter",
      discountValue: 10,
      discountType: "percentage",
      description: "Visit any SRS Travels booking counter to get instant discounts.",
      merchantId: {
        name: "SRS Travels",
        logo: "/brandlogos/10022.jpg",
      },
    },
  ],
  fashion: [
    {
      _id: "dummy-fashion-1",
      title: "Buy 1 Get 1 Free on Select Eyewear at Lenskart stores",
      discountValue: 50,
      discountType: "percentage",
      description: "Step into Lenskart stores for instant BOGO offers.",
      merchantId: {
        name: "Lenskart",
        logo: "/brandlogos/10012.jpg",
      },
    },
    {
      _id: "dummy-fashion-2",
      title: "End of Season Sale: Get Flat 30% OFF at store checkouts",
      discountValue: 30,
      discountType: "percentage",
      description: "Save big on Adidas shoes, tracksuits and sport gear in-store.",
      merchantId: {
        name: "Adidas",
        logo: "/brandlogos/10012.jpg",
      },
    },
  ],
  food: [
    {
      _id: "dummy-food-1",
      title: "Get Flat ₹120 OFF on Dine-in Orders of ₹399 and Above",
      discountValue: 120,
      discountType: "flat",
      description: "Dine in at Dominos Pizza outlets and claim this super deal.",
      merchantId: {
        name: "Dominos Pizza",
        logo: "/brandlogos/10027.jpg",
      },
    },
    {
      _id: "dummy-food-2",
      title: "Flat 15% OFF on Brewed Beverages at Starbucks outlets",
      discountValue: 15,
      discountType: "percentage",
      description: "Claim flat 15% off at all Starbucks Coffee locations.",
      merchantId: {
        name: "Starbucks",
        logo: "/brandlogos/10026.jpg",
      },
    },
  ],
  electronics: [
    {
      _id: "dummy-elec-1",
      title: "Grab Up To 15% OFF on Galaxy Laptops & Smartwatches",
      discountValue: 15,
      discountType: "percentage",
      description: "Buy premium Galaxy devices directly at Samsung SmartPlazas.",
      merchantId: {
        name: "Samsung",
        logo: "/brandlogos/10005.jpg",
      },
    },
  ],
  beauty: [
    {
      _id: "dummy-beauty-1",
      title: "Flat 20% OFF on Hair Spa and Salon Services in-store",
      discountValue: 20,
      discountType: "percentage",
      description: "Get premium beauty & styling treatment at nearest Lakme Salons.",
      merchantId: {
        name: "Lakme Salon",
        logo: "/brandlogos/10025.jpg",
      },
    },
  ],
  home: [
    {
      _id: "dummy-home-1",
      title: "Flat ₹2,500 OFF on Solid Wood Dining Tables at Studios",
      discountValue: 2500,
      discountType: "flat",
      description: "Visit nearest Pepperfry Studios to explore and order premium furniture.",
      merchantId: {
        name: "Pepperfry",
        logo: "/brandlogos/10007.jpg",
      },
    },
  ],
  "home-improvement": [
    {
      _id: "dummy-home-imp-1",
      title: "Flat 15% OFF on Premium Tiles & Bathroom fittings in-showroom",
      discountValue: 15,
      discountType: "percentage",
      description: "Visit local Marbella showrooms to claim verified in-store discounts.",
      merchantId: {
        name: "Marbella Tiles",
        logo: "/brandlogos/10007.jpg",
      },
    },
  ],
};

export const TODAY_PRODUCT_DEALS = [
  {
    title: "Samsung Galaxy Watch 6 Classic LTE Smartwatch",
    originalPrice: 34999,
    discountPrice: 26999,
    discountText: "22% OFF",
    merchantName: "Samsung Store",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Lenskart John Jacobs Premium Aviator Eyewear",
    originalPrice: 3500,
    discountPrice: 1999,
    discountText: "42% OFF",
    merchantName: "Lenskart Store",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Sonata Poze Slim Quartz Metal Strap Watch",
    originalPrice: 1899,
    discountPrice: 1399,
    discountText: "26% OFF",
    merchantName: "Sonata Store",
    merchantLogo: "/brandlogos/10035.jpg",
    productImage:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Adidas Duramo Speed Breathable Running Shoes",
    originalPrice: 6999,
    discountPrice: 4199,
    discountText: "40% OFF",
    merchantName: "Adidas Store",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
];

export const COLLECTIONS_LIST = [
  {
    title: "Lenskart Eyewear",
    logo: "/brandlogos/10012.jpg",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Sonata Watches",
    logo: "/brandlogos/10035.jpg",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Starbucks Brews",
    logo: "/brandlogos/10026.jpg",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Adidas Sportswear",
    logo: "/brandlogos/10012.jpg",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
];
