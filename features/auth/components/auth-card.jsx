import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * Shared auth page shell — brand header + card.
 * Pass `loading` to show a spinner while session is resolving
 * (prevents flash of form for already-logged-in users).
 */
export function AuthCard({ title, loading = false, children }) {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex flex-col items-center">
          <span className="text-2xl font-bold font-heading text-brand-navy tracking-tight flex items-center gap-1.5">
            <span className="bg-brand-gradient text-transparent bg-clip-text">
              Vouchiqo
            </span>
            <CheckCircle2 className="w-5.5 h-5.5 text-brand-success fill-brand-success/10" />
          </span>
          <span className="text-[10px] text-brand-subtext font-semibold tracking-wider uppercase">
            Verified Deals. Real Savings.
          </span>
        </Link>
        <h2 className="text-xl font-bold text-brand-text font-heading">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-bg py-8 px-4 border border-brand-border rounded-xl shadow-sm sm:px-10 space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-subtext" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
