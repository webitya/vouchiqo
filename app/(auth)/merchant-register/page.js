import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar";
import { MerchantOnboardingWizard } from "@/features/auth/components/merchant-onboarding-wizard";

export const metadata = {
  title: "Merchant Onboarding | Vouchiqo",
  description:
    "Complete 6-section merchant onboarding application for Ranchi and Jharkhand.",
};

export default function MerchantRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-2 pb-8 px-4 sm:px-6">
        <MerchantOnboardingWizard />
      </main>
      <Footer />
    </div>
  );
}
