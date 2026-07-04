"use client";

import Link from "next/link";

/**
 * Related brands carousel/footer section.
 */
export default function RelatedBrands({ relatedBrands, category }) {
  if (relatedBrands.length === 0) return null;

  return (
    <section className="bg-white border-t border-[#e2e8f0] py-10 px-4 mt-8 select-none">
      <div className="max-w-[1248px] mx-auto space-y-6">
        <h3 className="text-lg font-black text-[#191f2e] tracking-tight text-left">
          Related Brands in {category || "Same Category"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {relatedBrands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brand/${brand.slug}`}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 hover:border-[#3e80dd] flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#3e80dd] text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                {brand.businessName?.[0]}
              </div>
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-[#191f2e] truncate leading-none">
                  {brand.businessName}
                </h5>
                <span className="text-[9px] text-[#6b7280] font-bold block mt-1 uppercase tracking-wide">
                  {brand.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
