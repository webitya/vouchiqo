import mongoose from "mongoose";
import CustomerRevival from "@/modules/revival/customer-revival.model";
import MerchantDemand from "@/modules/revival/merchant-demand.model";
import Merchant from "@/modules/merchant/merchant.model";
import Coupon from "@/modules/coupon/coupon.model";
import PlatformSetting from "@/modules/admin/settings.model";
import { escapeRegex } from "@/lib/security";
import { buildMeta, parsePagination } from "@/utils/pagination";

/**
 * Returns dynamic customer revival counts.
 */
export async function getCustomerRevivalStats() {
  const totalRequests = await CustomerRevival.countDocuments();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thisMonthRequests = await CustomerRevival.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  return {
    totalRequests: Math.max(totalRequests, 5240), // Base simulation offset
    thisMonthRequests: Math.max(thisMonthRequests, 142), // Base simulation offset
  };
}

/**
 * Lists all customer revival requests for administration with advanced filters & sorting.
 *
 * @param {URLSearchParams} searchParams
 */
export async function listAllCustomerRevivals(searchParams) {
  const { page, limit, skip } = parsePagination(searchParams);

  const filter = {};

  const category = searchParams.get("category"); // Category A, B or C
  if (category) filter.category = category;

  const status = searchParams.get("status"); // pending, contacted, approved, rejected
  if (status) filter.status = status;

  const outcomeStatus = searchParams.get("outcomeStatus");
  if (outcomeStatus) filter.outcomeStatus = outcomeStatus;

  const priority = searchParams.get("priority"); // high, medium, low
  if (priority) filter.priority = priority;

  const city = searchParams.get("city");
  if (city) filter.merchantCity = new RegExp(escapeRegex(city), "i");

  const businessCategory = searchParams.get("businessCategory");
  if (businessCategory) filter.discountType = businessCategory; // Map category filtering

  const possibleDuplicate = searchParams.get("possibleDuplicate");
  if (possibleDuplicate === "true") filter.possibleDuplicate = true;

  const search = searchParams.get("search");
  if (search) {
    filter.$or = [
      { brandName: new RegExp(escapeRegex(search), "i") },
      { code: new RegExp(escapeRegex(search), "i") },
      { email: new RegExp(escapeRegex(search), "i") },
    ];
  }

  const [revivals, total] = await Promise.all([
    CustomerRevival.find(filter)
      .sort({ priority: 1, createdAt: -1 }) // Priority sorting logic applied dynamically
      .skip(skip)
      .limit(limit)
      .lean(),
    CustomerRevival.countDocuments(filter),
  ]);

  // Adjust sorting order: High first, then Medium, then Low
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedRevivals = [...revivals].sort((a, b) => {
    const orderA = priorityOrder[a.priority] || 3;
    const orderB = priorityOrder[b.priority] || 3;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return { revivals: sortedRevivals, meta: buildMeta(total, page, limit) };
}

/**
<<<<<<< HEAD
 * Submits a new customer revival request, running the 3-Way Routing and priority logic.
 *
 * @param {object} data - Form data fields
 */
export async function createCustomerRevival(data) {
  // 1. Check for possible duplicate (same email + brand within 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const duplicateCheck = await CustomerRevival.findOne({
    email: data.email.trim().toLowerCase(),
    brandName: new RegExp(`^${escapeRegex(data.brandName.trim())}$`, "i"),
    createdAt: { $gte: sevenDaysAgo },
  }).lean();

  const possibleDuplicate = !!duplicateCheck;

  // 2. Three-Way Routing Logic lookup
  let category = "C";
  let merchantId = null;
  let merchantStatus = "never_listed";

  const matchedMerchant = await Merchant.findOne({
    businessName: new RegExp(`^${escapeRegex(data.brandName.trim())}$`, "i"),
  }).lean();

  if (matchedMerchant) {
    if (matchedMerchant.status === "approved") {
      category = "A";
      merchantId = matchedMerchant._id;
      merchantStatus = "active";
    } else {
      category = "B";
      merchantId = matchedMerchant._id;
      merchantStatus = "previously_listed";
    }
=======
 * Submits a new customer revival request.
 * Classifies under Category A/B/C routing and calculates priority dynamically.
 *
 * @param {object} data - Full verified request fields
 */
export async function createCustomerRevival(data) {
  // 1. Rate Limiting: max 5 requests per 30-day period
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyCount = await CustomerRevival.countDocuments({
    email: data.email.trim().toLowerCase(),
    createdAt: { $gte: thirtyDaysAgo },
  });
  if (monthlyCount >= 5) {
    throw new Error(
      "You've reached your monthly submission limit. Need help sooner? Contact support."
    );
  }

  // 2. Duplicate Detection: flag duplicate if same email + brand within 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const duplicateCheck = await CustomerRevival.findOne({
    email: data.email.trim().toLowerCase(),
    brandName: new RegExp(`^${escapeRegex(data.brandName.trim())}$`, "i"),
    createdAt: { $gte: sevenDaysAgo },
  });
  const isPossibleDuplicate = !!duplicateCheck;

  // 3. Three-Way Category Routing: A (active), B (churned), C (unlisted)
  const Merchant = mongoose.models.Merchant || mongoose.model("Merchant");
  const merchant = await Merchant.findOne({
    businessName: new RegExp(`^${escapeRegex(data.brandName.trim())}$`, "i"),
  });

  let routingCategory = "C";
  if (merchant) {
    routingCategory = merchant.status === "approved" ? "A" : "B";
  }

  // 4. Dynamic Priority Assignment (HIGH / MEDIUM / LOW)
  const PlatformSetting =
    mongoose.models.PlatformSetting || mongoose.model("PlatformSetting");
  const priorityCitiesSetting = await PlatformSetting.findOne({
    key: "revival_priority_cities",
  });
  const priorityCategoriesSetting = await PlatformSetting.findOne({
    key: "revival_priority_categories",
  });

  const priorityCities = priorityCitiesSetting?.value || [
    "ranchi",
    "jamshedpur",
    "dhanbad",
    "bokaro",
  ];
  const priorityCategories = priorityCategoriesSetting?.value || [
    "home-improvement",
    "fashion",
    "beauty",
  ];

  let priority = "LOW";
  const now = new Date();
  const diffTime = Math.abs(now - new Date(data.foundAtDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const priorSuccess = await CustomerRevival.findOne({
    email: data.email.trim().toLowerCase(),
    status: { $in: ["code_regenerated", "alternative_provided"] },
  });

  if (routingCategory === "A" || diffDays <= 14 || !!priorSuccess) {
    priority = "HIGH";
  } else if (
    routingCategory === "B" ||
    (routingCategory === "C" &&
      priorityCities.includes(data.city.trim().toLowerCase()) &&
      priorityCategories.includes(data.category.trim().toLowerCase()))
  ) {
    priority = "MEDIUM";
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
  }

  // 3. Priority Logic Calculation
  let priority = "low";

  // Fetch configs from database setting if exists
  const settingsObj = await PlatformSetting.findOne({
    key: "revival_priority_config",
  }).lean();
  const priorityCities = settingsObj?.value?.priorityCities || ["Ranchi"];
  const priorityCategories = settingsObj?.value?.priorityCategories || [
    "Home Improvement",
    "Fashion & Clothing",
    "Beauty & Wellness",
  ];

  const daysSinceSeen = data.whenSeen
    ? Math.floor((new Date() - new Date(data.whenSeen)) / (1000 * 60 * 60 * 24))
    : 999;

  // Check if customer had a prior successful resolved outcome
  const priorSuccess = await CustomerRevival.findOne({
    email: data.email.trim().toLowerCase(),
    outcomeStatus: { $in: ["resolved_regenerated", "resolved_alternative"] },
  }).lean();

  if (category === "A" || daysSinceSeen <= 14 || !!priorSuccess) {
    priority = "high";
  } else if (
    category === "B" ||
    (category === "C" &&
      priorityCities.some((c) =>
        new RegExp(`^${escapeRegex(c)}$`, "i").test(data.merchantCity),
      ) &&
      priorityCategories.some((cat) =>
        new RegExp(`^${escapeRegex(cat)}$`, "i").test(data.discountType),
      ))
  ) {
    priority = "medium";
  }

  // 4. Create the CustomerRevival record
  const revival = await CustomerRevival.create({
<<<<<<< HEAD
    code: data.code?.trim().toUpperCase() || "",
=======
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
    brandName: data.brandName.trim(),
    category: data.category.trim(),
    foundWhere: data.foundWhere.trim(),
    foundWhereOther: data.foundWhereOther?.trim() || undefined,
    merchantWebsite: data.merchantWebsite?.trim() || undefined,
    city: data.city.trim(),
    code: data.code?.trim().toUpperCase() || undefined,
    discountType: data.discountType,
    discountValue: data.discountValue || undefined,
    description: data.description.trim(),
    foundAtDate: data.foundAtDate,
    buyingIntent: data.buyingIntent?.trim() || undefined,
    email: data.email.trim().toLowerCase(),
<<<<<<< HEAD
    whereDidYouFindThisOffer: data.whereDidYouFindThisOffer,
    merchantWebsite: data.merchantWebsite,
    merchantCity: data.merchantCity,
    discountType: data.discountType,
    discountValue: data.discountValue,
    description: data.description,
    whenSeen: data.whenSeen ? new Date(data.whenSeen) : null,
    whatBuying: data.whatBuying,
    mobileNumber: data.mobileNumber,
    consent: !!data.consent,
    possibleDuplicate,
    category,
    priority,
=======
    mobile: data.mobile.trim(),
    routingCategory,
    priority,
    isPossibleDuplicate,
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
    status: "pending",
    outcomeStatus: "pending",
  });

  // 5. Upsert to Merchant Demand Intelligence Database (Category B & C only)
  if (category === "B" || category === "C") {
    const normalizedName = data.brandName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    const existingDemand = await MerchantDemand.findOne({
      businessName: new RegExp(`^${escapeRegex(normalizedName)}$`, "i"),
    });

    // Check if a different email has submitted for this brand name
    const priorSubmissionsWithEmail = await CustomerRevival.findOne({
      email: data.email.trim().toLowerCase(),
      brandName: new RegExp(`^${escapeRegex(data.brandName.trim())}$`, "i"),
      _id: { $ne: revival._id },
    }).lean();

    const isNewEmail = !priorSubmissionsWithEmail;

    const sourcePlatform = data.whereDidYouFindThisOffer || "Direct";
    const sampleOffer = {
      discountType: data.discountType,
      description: data.description || `${data.discountType} discount`,
    };

    if (existingDemand) {
      if (isNewEmail) {
        existingDemand.submissionCount += 1;
      }
      existingDemand.lastSeen = new Date();
      if (
        sourcePlatform &&
        !existingDemand.sourcePlatforms.includes(sourcePlatform)
      ) {
        existingDemand.sourcePlatforms.push(sourcePlatform);
      }
      existingDemand.sampleOffers.push(sampleOffer);
      await existingDemand.save();
    } else {
      await MerchantDemand.create({
        businessName: data.brandName.trim(),
        status: category === "B" ? "previously_listed" : "never_listed",
        category: data.discountType,
        city: data.merchantCity,
        submissionCount: 1,
        sourcePlatforms: [sourcePlatform],
        firstSeen: new Date(),
        lastSeen: new Date(),
        sampleOffers: [sampleOffer],
      });
    }
  }

  return { revival, message: "Revival request submitted successfully" };
}

/**
 * Updates a customer revival request status.
<<<<<<< HEAD
=======
 *
 * @param {string} revivalId
 * @param {string} status
 * @param {object} details - { declineReason, alternativeOfferId }
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
 */
export async function updateCustomerRevivalStatus(revivalId, status, details = {}) {
  const updateData = { status };
  if (details.declineReason) {
    updateData.declineReason = details.declineReason;
  }
  if (details.alternativeOfferId) {
    updateData.adminAlternativeOffers = [details.alternativeOfferId];
  }

  const revival = await CustomerRevival.findByIdAndUpdate(
    revivalId,
<<<<<<< HEAD
    { $set: { status } },
    { new: true },
=======
    { $set: updateData },
    { new: true }
>>>>>>> c074429ee4c2e20fc11ce347bcbd31c26b1ad1f6
  );

  if (!revival) throw new Error("Customer revival request not found");
  return revival;
}

/**
 * Resolves a customer revival request with specific outcome status.
 */
export async function resolveCustomerRevival(revivalId, data) {
  const {
    outcomeStatus,
    declineReason,
    alternativeOfferId,
    includeInPublicFeed,
  } = data;

  const updateFields = { outcomeStatus };

  if (declineReason) updateFields.declineReason = declineReason;
  if (alternativeOfferId) updateFields.alternativeOfferId = alternativeOfferId;
  if (typeof includeInPublicFeed === "boolean") {
    updateFields.includeInPublicFeed = includeInPublicFeed;
  }

  // Adjust status based on resolved state
  if (
    outcomeStatus === "resolved_regenerated" ||
    outcomeStatus === "resolved_alternative"
  ) {
    updateFields.status = "approved";
  } else if (outcomeStatus === "declined") {
    updateFields.status = "rejected";
  }

  const revival = await CustomerRevival.findByIdAndUpdate(
    revivalId,
    { $set: updateFields },
    { new: true },
  );

  if (!revival) throw new Error("Customer revival request not found");
  return revival;
}

/**
 * Get up to 3 suggested alternative active offers.
 *
 * @param {string} revivalId
 */
export async function getAlternativeSuggestions(revivalId) {
  const request = await CustomerRevival.findById(revivalId).lean();
  if (!request) throw new Error("Revival request not found");

  const category = request.discountType;
  const city = request.merchantCity;

  let merchantId = null;
  const matchedMerchant = await Merchant.findOne({
    businessName: new RegExp(`^${escapeRegex(request.brandName.trim())}$`, "i"),
    status: "approved",
  }).lean();
  if (matchedMerchant) merchantId = matchedMerchant._id;

  const suggestions = [];

  // Match 1: Same Merchant active offers
  if (merchantId) {
    const merchantOffers = await Coupon.find({
      merchantId,
      status: "active",
      isVerified: true,
    })
      .limit(3)
      .lean();
    suggestions.push(...merchantOffers);
  }

  // Match 2: Same category + same city
  if (suggestions.length < 3) {
    const categoryCityOffers = await Coupon.find({
      category,
      "location.city": new RegExp(`^${escapeRegex(city)}$`, "i"),
      status: "active",
      isVerified: true,
      _id: { $not: { $in: suggestions.map((s) => s._id) } },
    })
      .limit(3 - suggestions.length)
      .lean();
    suggestions.push(...categoryCityOffers);
  }

  // Match 3: Same category nationally
  if (suggestions.length < 3) {
    const categoryNationalOffers = await Coupon.find({
      category,
      status: "active",
      isVerified: true,
      _id: { $not: { $in: suggestions.map((s) => s._id) } },
    })
      .limit(3 - suggestions.length)
      .lean();
    suggestions.push(...categoryNationalOffers);
  }

  return suggestions;
}

/**
 * Lists de-duplicated unlisted/churned merchant demand intelligence leads.
 */
export async function listMerchantDemands(searchParams) {
  const { page, limit, skip } = parsePagination(searchParams);

  const filter = {};

  const status = searchParams.get("status"); // never_listed, previously_listed
  if (status) filter.status = status;

  const outreachStatus = searchParams.get("outreachStatus");
  if (outreachStatus) filter.outreachStatus = outreachStatus;

  const doNotContact = searchParams.get("doNotContact");
  if (doNotContact === "true") {
    filter.doNotContact = true;
  } else if (doNotContact === "false") {
    filter.doNotContact = false;
  }

  const city = searchParams.get("city");
  if (city) filter.city = new RegExp(escapeRegex(city), "i");

  const search = searchParams.get("search");
  if (search) {
    filter.businessName = new RegExp(escapeRegex(search), "i");
  }

  const [demands, total] = await Promise.all([
    MerchantDemand.find(filter)
      .sort({ submissionCount: -1, lastSeen: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    MerchantDemand.countDocuments(filter),
  ]);

  return { demands, meta: buildMeta(total, page, limit) };
}

/**
 * Update outreach settings for a merchant demand signal.
 */
export async function updateMerchantDemandOutreach(demandId, data) {
  const update = {};
  if (data.outreachStatus) update.outreachStatus = data.outreachStatus;
  if (typeof data.doNotContact === "boolean") {
    update.doNotContact = data.doNotContact;
  }

  const demand = await MerchantDemand.findByIdAndUpdate(
    demandId,
    { $set: update },
    { new: true },
  );

  if (!demand) throw new Error("Merchant demand record not found");
  return demand;
}
