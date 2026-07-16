"use client";

import {
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Copy,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SidebarSection({
  merchant,
  openStatus,
  faqs,
  copiedLink,
  handleShare,
}) {
  return (
    <div className="lg:col-span-4 space-y-6 text-left">
      {/* About store card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#191f2e] uppercase tracking-wider pb-2 border-b border-[#f1f5f9]">
          About {merchant.businessName}
        </h3>
        <p className="text-[13px] text-[#6b7280] leading-relaxed">
          {merchant.longDescription ||
            merchant.description ||
            "No description provided for this brand storefront."}
        </p>
        {merchant.website && (
          <a
            href={merchant.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs font-extrabold text-[#3e80dd] hover:underline flex items-center gap-1"
          >
            <span>Visit Official Store Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Operating Hours Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#f1f5f9]">
          <h3 className="text-xs font-extrabold text-[#191f2e] uppercase tracking-wider">
            Operating Hours
          </h3>
          <span className={`text-[11px] font-bold ${openStatus.color}`}>
            ● {openStatus.label}
          </span>
        </div>
        <div className="space-y-1.5 text-xs text-[#6b7280]">
          {merchant.operatingHours ? (
            Object.entries(merchant.operatingHours).map(([day, hrs]) => (
              <div key={day} className="flex justify-between font-semibold">
                <span className="capitalize">{day}</span>
                <span>
                  {hrs.closed ? "Closed" : `${hrs.open} - ${hrs.close}`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400">Not specified</p>
          )}
        </div>
      </div>

      {/* Store Location Map */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-[#191f2e] uppercase tracking-wider pb-2 border-b border-[#f1f5f9]">
          Interactive Map Proximity
        </h3>
        <div className="relative h-44 w-full bg-slate-100 rounded-lg overflow-hidden border border-[#e2e8f0] flex items-center justify-center">
          <iframe
            title="Store Map Location"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${merchant.location?.lat || 23.3441},${merchant.location?.lng || 85.3096}&z=15&output=embed`}
            allowFullScreen
          />
        </div>
      </div>

      {/* FAQ Accordion block using Shadcn Accordion */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#191f2e] uppercase tracking-wider pb-2 border-b border-[#f1f5f9]">
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border-b border-[#f1f5f9] last:border-0 pb-1"
            >
              <AccordionTrigger className="text-left font-bold text-[13px] text-[#191f2e] hover:text-[#3e80dd] hover:no-underline py-2">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-[#6b7280] leading-relaxed mt-1 pl-1 font-medium pb-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Details Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#191f2e] uppercase tracking-wider pb-2 border-b border-[#f1f5f9]">
          Store Location &amp; Contact
        </h3>
        <div className="space-y-3 text-xs text-[#4b5563] font-semibold">
          <div className="flex gap-2">
            <MapPin className="w-4 h-4 text-[#3e80dd] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[#6b7280]">
              {merchant.location?.address &&
                `${merchant.location.address}, `}
              {merchant.location?.city ? (
                <>
                  {merchant.location.city},{" "}
                  {merchant.location.state || "Jharkhand"}
                  {merchant.location?.pincode &&
                    `, ${merchant.location.pincode}`}
                </>
              ) : (
                "Ranchi, Jharkhand, India"
              )}
            </p>
          </div>

          {merchant.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#3e80dd] flex-shrink-0" />
              <span className="text-[#6b7280]">{merchant.contactPhone}</span>
            </div>
          )}

          {merchant.contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3e80dd] flex-shrink-0" />
              <span className="text-[#6b7280]">{merchant.contactEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Share widget */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#191f2e] uppercase tracking-wider pb-2 border-b border-[#f1f5f9]">
          Share {merchant.businessName} Offers
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            type="button"
            className="flex-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-colors"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#2f855a]" />
                <span className="text-[#2f855a]">Copied Link</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Page Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
