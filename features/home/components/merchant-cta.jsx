import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MerchantCTA() {
  return (
    <section className="bg-brand-navy text-white py-16 px-4 border-t border-white/10 text-center relative overflow-hidden animate-fade-in-scale">
      <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
      <div className="max-w-2xl mx-auto space-y-6 relative z-10 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight leading-tight">
          Grow Your Business With Vouchiqo
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          Stop losing checkouts to broken discount boxes. List verified
          campaigns, manage subscription structures, and track real-time
          conversion rates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="btn-primary text-xs py-2.5 px-6 border-0 h-auto cursor-pointer shadow-none"
          >
            <Link href="/auth/register?role=merchant">
              Create Merchant Account
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="btn-tertiary border-white text-white hover:bg-white/10 text-xs py-2.5 px-6 cursor-pointer shadow-none h-auto bg-transparent"
          >
            <Link href="/merchant/dashboard">Learn Partner Benefits</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
