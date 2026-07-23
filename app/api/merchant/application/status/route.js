import mongoose from "mongoose";
import { NextResponse } from "next/server";
import MerchantApplication from "@/modules/merchant/merchant-application.model";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
}

// Demo initial application payload if DB item doesn't exist yet
const DEMO_APPLICATION = {
  applicationId: "VQ-2026-89421",
  businessName: "Marbella Tiles & Sanitaryware",
  ownerName: "Rahul Sharma",
  email: "rahul@marbellatiles.com",
  phone: "+91 98765 43210",
  category: "Home Improvement & Marble",
  city: "Ranchi",
  state: "Jharkhand",
  gstin: "20AAAAA0000A1Z5",
  panNumber: "ABCDE1234F",
  status: "under_review", // "pending" | "under_review" | "document_verified" | "approved" | "rejected"
  progressPercentage: 66,
  adminIsReviewing: true,
  adminReviewerName: "Vouchiqo Verification Desk #4",
  estimatedCompletion: "27 Oct 2026, 2:30 PM",
  activationWindow: "Within 2 hours after verification",
  rejectionReason: "",
  submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  lastUpdatedAt: new Date(Date.now() - 1800000).toISOString(),
  documents: [
    {
      name: "GST Certificate (Form REG-06)",
      type: "GST Registration",
      status: "verified",
      verifiedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      name: "Business PAN Card",
      type: "Tax Identity",
      status: "verified",
      verifiedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      name: "Trade License / Municipality Permis",
      type: "Commercial License",
      status: "under_review",
      verifiedAt: null,
    },
    {
      name: "Cancelled Bank Cheque / Passbook",
      type: "Banking Verification",
      status: "under_review",
      verifiedAt: null,
    },
  ],
  timeline: [
    {
      title: "Application Submitted Successfully",
      detail:
        "Merchant profile submitted with 4 business verification documents",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      type: "success",
    },
    {
      title: "Confirmation Email Sent",
      detail: "Sent acknowledgment letter to rahul@marbellatiles.com",
      timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
      type: "info",
    },
    {
      title: "Admin Officer Assigned",
      detail: "Assigned to Vouchiqo Compliance Officer Desk #4",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: "info",
    },
    {
      title: "GST & Tax Credentials Verified",
      detail: "GSTIN 20AAAAA0000A1Z5 verified via Govt Portal",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      type: "success",
    },
    {
      title: "Document Verification In Progress",
      detail: "Admin is reviewing Trade License and Bank passbook details",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "warning",
    },
  ],
};

export async function GET(req) {
  try {
    await connectDB();

    // Check if an application exists in DB
    let appData = null;
    if (mongoose.connection.readyState >= 1) {
      appData = await MerchantApplication.findOne()
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!appData) {
      appData = DEMO_APPLICATION;
    }

    return NextResponse.json({
      success: true,
      data: appData,
    });
  } catch (error) {
    console.error("[application-status] Error fetching status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch status" },
      { status: 500 },
    );
  }
}
