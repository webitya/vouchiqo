import { CUSTOMER_TESTIMONIALS } from "@/utils/home-data";

export function Testimonials() {
  return (
    <section className="py-16 bg-brand-surface px-4 text-center max-w-6xl mx-auto w-full animate-fade-in-up">
      <h2 className="text-2xl font-bold font-heading text-brand-navy tracking-tight mb-8">
        What Our Members Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CUSTOMER_TESTIMONIALS.map((item, idx) => (
          <div
            key={idx}
            className={`bg-brand-bg border border-brand-border rounded-lg p-6 space-y-4 text-left shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-scale stagger-${idx + 1}`}
          >
            <p className="text-xs text-brand-text italic leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div>
              <h4 className="font-bold text-brand-navy text-xs">
                {item.author}
              </h4>
              <span className="text-[10px] font-semibold text-brand-subtext">
                {item.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
