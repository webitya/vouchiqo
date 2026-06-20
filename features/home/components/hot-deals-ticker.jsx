export function HotDealsTicker() {
  return (
    <div className="bg-brand-blue text-white overflow-hidden text-xs py-1.5 font-semibold z-40 relative">
      <div className="flex whitespace-nowrap animate-ticker">
        <div className="flex gap-16 px-4">
          <span>🚀 FLASH SALE: Zomato 50% Off — Code: ZOMATO50</span>
          <span>⚡ Stripe Integration Specials — Save Up To $200</span>
          <span>💼 Notion Plus for Teams: $50 Free Workspace Credits</span>
          <span>✈️ Airbnb Verified: $20 Off Premium Bookings</span>
          <span>☕ Starbucks: Buy One Get One Free in all local outlets</span>
        </div>
        {/* Duplicate for infinite loop */}
        <div className="flex gap-16 px-4" aria-hidden="true">
          <span>🚀 FLASH SALE: Zomato 50% Off — Code: ZOMATO50</span>
          <span>⚡ Stripe Integration Specials — Save Up To $200</span>
          <span>💼 Notion Plus for Teams: $50 Free Workspace Credits</span>
          <span>✈️ Airbnb Verified: $20 Off Premium Bookings</span>
          <span>☕ Starbucks: Buy One Get One Free in all local outlets</span>
        </div>
      </div>
    </div>
  );
}
