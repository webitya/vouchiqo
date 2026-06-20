import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & About */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
                <span className="bg-brand-gradient text-transparent bg-clip-text">
                  Vouchiqo
                </span>
                <CheckCircle2 className="w-5 h-5 text-brand-success fill-brand-success/10" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Verified Deals. Real Savings.
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Helping businesses turn promotional offers into recurring
              customers with 100% verified, reliable voucher codes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/deals"
                  className="hover:text-white transition-colors"
                >
                  Browse Verified Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/revival"
                  className="hover:text-white transition-colors"
                >
                  Expired Coupon Revival
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="hover:text-white transition-colors"
                >
                  Featured Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  Customer Help & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Merchant Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Merchants
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/auth/register?role=merchant"
                  className="hover:text-white transition-colors"
                >
                  List Your Business
                </Link>
              </li>
              <li>
                <Link
                  href="/merchant/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Merchant Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/merchant/billing"
                  className="hover:text-white transition-colors"
                >
                  Growth Subscriptions
                </Link>
              </li>
              <li>
                <Link
                  href="/merchant/analytics"
                  className="hover:text-white transition-colors"
                >
                  Merchant Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-400">
              Subscribe to get notified about verified flash sales and merchant
              campaigns.
            </p>
            <div className="flex bg-white/10 rounded-lg p-1.5 border border-white/20 focus-within:border-white/40">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-sm w-full focus:outline-none px-2 text-white placeholder-slate-400"
              />
              <button className="bg-brand-gradient text-white p-2 rounded-md hover:opacity-90 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Vouchiqo Corp. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-slate-300 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
