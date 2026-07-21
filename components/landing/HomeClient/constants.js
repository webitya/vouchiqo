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
      title:
        "Flat ₹3,000 OFF on Domestic Holiday Packages booked at retail outlets",
      discountValue: 3000,
      discountType: "flat",
      description:
        "Book customized holiday tours with SOTC Travel advisors at local stores.",
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
      description:
        "Visit any SRS Travels booking counter to get instant discounts.",
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
      description:
        "Save big on Adidas shoes, tracksuits and sport gear in-store.",
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
      description:
        "Dine in at Dominos Pizza outlets and claim this super deal.",
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
      title: "Save Up To 15% OFF on Galaxy Laptops & Smartwatches",
      discountValue: 15,
      discountType: "percentage",
      description:
        "Buy premium Galaxy devices directly at Samsung SmartPlazas.",
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
      description:
        "Get premium beauty & styling treatment at nearest Lakme Salons.",
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
      description:
        "Visit nearest Pepperfry Studios to explore and order premium furniture.",
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
      description:
        "Visit local Marbella showrooms to claim verified in-store discounts.",
      merchantId: {
        name: "Marbella Tiles",
        logo: "/brandlogos/10007.jpg",
      },
    },
  ],
  fitness: [
    {
      _id: "dummy-fit-1",
      title: "Flat 10% OFF on Annual Gym Memberships & personal training",
      discountValue: 10,
      discountType: "percentage",
      description: "Dine-in or workout at Gold's Gym local branches.",
      merchantId: {
        name: "Gold's Gym",
        logo: "/brandlogos/10025.jpg",
      },
    },
  ],
  education: [
    {
      _id: "dummy-edu-1",
      title:
        "Up to 25% OFF on Professional Coding & Data Science Certification Courses",
      discountValue: 25,
      discountType: "percentage",
      description: "Get discount at checkout when joining offline batches.",
      merchantId: {
        name: "Aptech Learning",
        logo: "/brandlogos/10007.jpg",
      },
    },
  ],
  "kids-baby": [
    {
      _id: "dummy-kids-1",
      title: "Flat ₹500 OFF on purchases of Baby Toys & apparel worth ₹2,500+",
      discountValue: 500,
      discountType: "flat",
      description: "Claim instant cashback at any local BabyHug outlet.",
      merchantId: {
        name: "BabyHug Store",
        logo: "/brandlogos/10021.jpg",
      },
    },
  ],
  jewellery: [
    {
      _id: "dummy-jewel-1",
      title: "Flat 20% OFF on making charges of Gold and Diamond Jewellery",
      discountValue: 20,
      discountType: "percentage",
      description:
        "Redeemable at local CaratLane and Tanishq partner showrooms.",
      merchantId: {
        name: "CaratLane",
        logo: "/brandlogos/10024.jpg",
      },
    },
  ],
  automotive: [
    {
      _id: "dummy-auto-1",
      title: "Flat ₹400 OFF on Full Car Detailing & Service Packages",
      discountValue: 400,
      discountType: "flat",
      description:
        "Visit any local GoMechanic workshop to claim your service discount.",
      merchantId: {
        name: "GoMechanic",
        logo: "/brandlogos/10022.jpg",
      },
    },
  ],
  entertainment: [
    {
      _id: "dummy-ent-1",
      title: "Get 15% OFF on Bowling & Arcade Gaming Packages at Zone",
      discountValue: 15,
      discountType: "percentage",
      description:
        "Enjoy gaming action at local Amoeba and Timezone entertainment hubs.",
      merchantId: {
        name: "Timezone",
        logo: "/brandlogos/10022.jpg",
      },
    },
  ],
  grocery: [
    {
      _id: "dummy-groc-1",
      title:
        "Flat ₹150 OFF on fresh Organic Fruits & Kirana essentials worth ₹999+",
      discountValue: 150,
      discountType: "flat",
      description:
        "Deduct discount at cashier checkout at local partner grocery stores.",
      merchantId: {
        name: "Kirana Digital",
        logo: "/brandlogos/10026.jpg",
      },
    },
  ],
  finance: [
    {
      _id: "dummy-fin-1",
      title: "Get Flat ₹1,000 Cashback on Lifetime Free Credit Card Approval",
      discountValue: 1000,
      discountType: "flat",
      description: "Apply in-store or online through partner banking agencies.",
      merchantId: {
        name: "HDFC Bank Agent",
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
  {
    title: "Apple iPad Air 10.9-inch Wi-Fi 64GB Space Grey",
    originalPrice: 59900,
    discountPrice: 54900,
    discountText: "8% OFF",
    merchantName: "Apple Authorised Store",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Nike Air Zoom Pegasus 40 Men's Running Shoes",
    originalPrice: 11995,
    discountPrice: 9495,
    discountText: "20% OFF",
    merchantName: "Nike Outlet",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    originalPrice: 34990,
    discountPrice: 27990,
    discountText: "20% OFF",
    merchantName: "Sony Center",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Puma Classic Suede Retro Unisex Sneakers",
    originalPrice: 7999,
    discountPrice: 4799,
    discountText: "40% OFF",
    merchantName: "Puma Store",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Bose QuietComfort Ultra Sound Wireless Earbuds",
    originalPrice: 25900,
    discountPrice: 21900,
    discountText: "15% OFF",
    merchantName: "Bose Premium Shop",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "OnePlus 12 5G (Flowy Emerald, 16GB RAM + 512GB)",
    originalPrice: 69999,
    discountPrice: 64999,
    discountText: "7% OFF",
    merchantName: "OnePlus Experience Store",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Titan Neo Workwear Blue Dial Men's Watch",
    originalPrice: 7995,
    discountPrice: 5995,
    discountText: "25% OFF",
    merchantName: "World of Titan",
    merchantLogo: "/brandlogos/10035.jpg",
    productImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "HP Pavilion 15.6-inch AMD Ryzen 5 Thin Laptop",
    originalPrice: 58450,
    discountPrice: 49990,
    discountText: "14% OFF",
    merchantName: "HP World Store",
    merchantLogo: "/brandlogos/10005.jpg",
    productImage:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Ray-Ban Classic Wayfarer Green UV Sunglasses",
    originalPrice: 9990,
    discountPrice: 8490,
    discountText: "15% OFF",
    merchantName: "Ray-Ban Sunglasses Shop",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Zara Water Resistant Heavyweight Bomber Jacket",
    originalPrice: 5990,
    discountPrice: 3990,
    discountText: "33% OFF",
    merchantName: "Zara Outlet",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "Philips Digital Essential Air Fryer 4.1 Litre",
    originalPrice: 8995,
    discountPrice: 6295,
    discountText: "30% OFF",
    merchantName: "Philips Smart Kitchen",
    merchantLogo: "/brandlogos/10007.jpg",
    productImage:
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=400&auto=format&fit=crop",
    href: "/deals",
  },
  {
    title: "H&M Denim Classic Regular Fit Blue Jacket",
    originalPrice: 2999,
    discountPrice: 1999,
    discountText: "33% OFF",
    merchantName: "H&M Store",
    merchantLogo: "/brandlogos/10012.jpg",
    productImage:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&auto=format&fit=crop",
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
