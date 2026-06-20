import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POPULAR_REVIVAL_REQUESTS } from "@/utils/home-data";

export function RevivalPromo() {
  return (
    <section className="bg-brand-navy text-white py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 animate-fade-in-up stagger-1">
          <Badge className="bg-white/10 text-brand-warning border-0 hover:bg-white/15 px-3 py-1 rounded-full text-xs font-bold shadow-none gap-1 w-fit animate-float">
            <RotateCcw className="w-3 h-3" />
            <span>REVIVAL SYSTEM</span>
          </Badge>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight leading-tight">
            Missed a great deal? <br />
            <span className="text-brand-gradient">Revive it!</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            We track expired coupons. If enough customers request a revival,
            our platform contacts the merchant to re-activate the deal.
          </p>
          <div className="flex flex-col gap-3 py-2 text-sm font-semibold">
            <div className="flex gap-2.5 items-center list-item-interactive">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                1
              </div>
              <span>Search for your favorite expired deal</span>
            </div>
            <div className="flex gap-2.5 items-center list-item-interactive">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                2
              </div>
              <span>Submit a Quick Revival request</span>
            </div>
            <div className="flex gap-2.5 items-center list-item-interactive">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-brand-warning">
                3
              </div>
              <span>Get notified when the brand activates it</span>
            </div>
          </div>
          <Button
            asChild
            className="btn-primary text-xs py-2.5 px-6 inline-flex mt-2 border-0 h-auto cursor-pointer shadow-none"
          >
            <Link href="/revival">Request a Coupon Revival</Link>
          </Button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 animate-fade-in-scale stagger-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Popular Revival Requests
          </h3>
          <div className="space-y-3">
            {POPULAR_REVIVAL_REQUESTS.map((req, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/5 rounded-lg p-3.5 space-y-2.5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{req.brand}</span>
                  <span className="text-brand-warning font-semibold">
                    {req.votes} requests
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-gradient h-full rounded-full"
                    style={{ width: `${req.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
