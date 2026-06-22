import PlatformSetting from "@/modules/admin/settings.model";

/**
 * Fetch all platform settings as a key-value object map.
 * Returns default objects if not yet configured in the database.
 */
export async function getPlatformSettings() {
  const settings = await PlatformSetting.find().lean();
  
  const settingsMap = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  // Provide system defaults for clean fallback
  if (!settingsMap.revival_stats) {
    settingsMap.revival_stats = {
      totalRequests: 5240,
      thisMonthRequests: 142,
      recoveredAmount: 1250000,
      successRate: 94.2
    };
  }
  
  if (!settingsMap.social_proof) {
    settingsMap.social_proof = [
      {
        user: "Anish S. from Ranchi",
        brand: "Marbella Tiles & Sanitary",
        offer: "Saved ₹5,400 on home flooring tiles",
        date: "2 days ago",
        text: "Vouchiqo helped reactivate the flat ₹5,000 discount. Marbella Ranchi approved it immediately after receiving the request batch."
      },
      {
        user: "Sarah J. from Delhi",
        brand: "Starbucks Coffee",
        offer: "Revived Buy 1 Get 1 Free Espresso",
        date: "5 days ago",
        text: "Requested Starbucks BOGO revival. Within 48 hours, Vouchiqo updated the code to active, and I redeemed it in-store."
      },
      {
        user: "Rohan D. from Bangalore",
        brand: "Notion Premium Team Plan",
        offer: "Recovered $100 SaaS Workspace Credits",
        date: "1 week ago",
        text: "Our team credits coupon had expired. Vouchiqo contacted Notion's merchant partnership team, and they re-enabled it for our domain!"
      }
    ];
  }

  if (!settingsMap.categories) {
    settingsMap.categories = [
      { id: "food", name: "Food & Dining", slug: "food", active: true },
      { id: "fashion", name: "Fashion & Apparel", slug: "fashion", active: true },
      { id: "electronics", name: "Electronics", slug: "electronics", active: true },
      { id: "beauty", name: "Beauty & Wellness", slug: "beauty", active: true },
      { id: "travel", name: "Travel & Hotels", slug: "travel", active: true },
      { id: "fitness", name: "Fitness & Gym", slug: "fitness", active: true },
      { id: "home", name: "Home decor", slug: "home", active: true },
      { id: "entertainment", name: "Entertainment", slug: "entertainment", active: true },
      { id: "services", name: "Local services", slug: "services", active: true },
      { id: "other", name: "Others", slug: "other", active: true }
    ];
  }

  return settingsMap;
}

/**
 * Save or update a single platform setting value.
 *
 * @param {string} key
 * @param {any} value
 */
export async function savePlatformSetting(key, value) {
  if (!key) throw new Error("Setting key is required");

  const setting = await PlatformSetting.findOneAndUpdate(
    { key },
    { $set: { value } },
    { new: true, upsert: true }
  );

  return setting;
}
