import Merchant from "@/modules/merchant/merchant.model";
import PlatformSetting from "@/modules/admin/settings.model";

// Price mapping for MRR calculation
const PLAN_PRICES = {
  starter: 0,
  growth: 1499,
  pro: 3999,
  enterprise: 9999,
};

/**
 * Summarizes platform SaaS subscriptions, dynamic MRR calculations,
 * payout ledgers, and invoice records.
 */
export async function getRevenueSummary() {
  // 1. Fetch all merchants to aggregate plan statistics
  const merchants = await Merchant.find().lean();
  
  const planCounts = { starter: 0, growth: 0, pro: 0, enterprise: 0 };
  let paidSubscribers = 0;
  let mrr = 0;

  merchants.forEach((m) => {
    const plan = m.plan || "starter";
    if (planCounts[plan] !== undefined) {
      planCounts[plan]++;
    }
    const price = PLAN_PRICES[plan] || 0;
    if (price > 0) {
      paidSubscribers++;
      mrr += price;
    }
  });

  const avgPlanValue = paidSubscribers > 0 ? Math.round(mrr / paidSubscribers) : 0;

  // 2. Load or initialize payouts list from settings
  let payoutsSetting = await PlatformSetting.findOne({ key: "payouts" });
  let payouts = [];

  if (!payoutsSetting) {
    payouts = [
      {
        id: "pay-1",
        businessName: "Marbella Tiles & Sanitary",
        amount: 24500,
        status: "pending",
        period: "June 2026",
        bankDetails: "HDFC Bank - A/C: 501002345876 - IFSC: HDFC0000123",
        createdAt: "2026-06-15T10:00:00.000Z"
      },
      {
        id: "pay-2",
        businessName: "Starbucks Coffee",
        amount: 12800,
        status: "paid",
        period: "June 2026",
        bankDetails: "ICICI Bank - A/C: 001205009876 - IFSC: ICIC0000012",
        createdAt: "2026-06-14T09:30:00.000Z"
      },
      {
        id: "pay-3",
        businessName: "Zomato Partner Ranchi",
        amount: 32000,
        status: "pending",
        period: "June 2026",
        bankDetails: "SBI - A/C: 30456123987 - IFSC: SBIN0000183",
        createdAt: "2026-06-16T11:45:00.000Z"
      }
    ];

    payoutsSetting = await PlatformSetting.create({
      key: "payouts",
      value: payouts,
    });
  } else {
    payouts = payoutsSetting.value;
  }

  const pendingPayouts = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  // 3. Generate invoice history dynamically for active paid merchants
  const invoices = [];
  let invoiceCounter = 4920;
  
  const sortedPaidMerchants = merchants
    .filter((m) => m.plan && m.plan !== "starter")
    .sort((a, b) => b.createdAt - a.createdAt);

  sortedPaidMerchants.forEach((m, idx) => {
    const price = PLAN_PRICES[m.plan];
    const planName = m.plan.toUpperCase() + " Partner";
    
    invoices.push({
      id: `INV-${invoiceCounter++}`,
      businessName: m.businessName,
      date: "2026-06-15",
      amount: price,
      plan: planName,
      status: idx === 3 ? "Failed" : "Paid",
    });

    if (idx % 2 === 0) {
      invoices.push({
        id: `INV-${invoiceCounter++}`,
        businessName: m.businessName,
        date: "2026-05-15",
        amount: price,
        plan: planName,
        status: "Paid",
      });
    }
  });

  invoices.sort((a, b) => b.id.localeCompare(a.id));

  return {
    mrr,
    paidSubscribers,
    avgPlanValue,
    pendingPayouts,
    planCounts,
    invoices,
    payouts,
  };
}

/**
 * Updates the payout status of a specific merchant payout record.
 *
 * @param {string} payoutId
 * @param {string} status
 */
export async function updatePayoutStatus(payoutId, status) {
  const payoutsSetting = await PlatformSetting.findOne({ key: "payouts" });
  if (!payoutsSetting) throw new Error("Payouts settings not initialized");

  const payouts = payoutsSetting.value;
  const payoutIndex = payouts.findIndex((p) => p.id === payoutId);

  if (payoutIndex === -1) throw new Error("Payout not found");

  payouts[payoutIndex].status = status;
  payoutsSetting.markModified("value");
  await payoutsSetting.save();

  return payouts[payoutIndex];
}
