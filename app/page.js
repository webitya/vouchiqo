import { connectDB } from "@/lib/mongodb";
import { getFeaturedCoupons } from "@/modules/coupon/coupon.service";
import { HomeClient } from "@/features/home";

// Force Next.js to render this page dynamically (SSR) so database queries are fresh
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Connect to the database on the server
  await connectDB();

  // 2. Fetch active featured coupons from MongoDB
  const rawCoupons = await getFeaturedCoupons();

  // 3. Serialize MongoDB ObjectIds and Dates to plain JSON for client component props
  const featuredCoupons = JSON.parse(JSON.stringify(rawCoupons || []));

  // 4. Render the client-side component shell with hydrated database props
  return <HomeClient initialCoupons={featuredCoupons} />;
}
