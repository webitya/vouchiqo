"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOME_FAQS } from "@/utils/home-data";

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="faq-item rounded-xl overflow-hidden"
      style={{
        border: "1px solid #e2e8f0",
        background: "#fff",
        transition: "box-shadow 0.2s ease",
        boxShadow: open
          ? "0 4px 16px rgba(70,133,232,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
        style={{
          padding: "16px 20px",
          background: "transparent",
          border: "none",
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#191F2E",
            lineHeight: 1.4,
          }}
        >
          {faq.q}
        </span>
        <ChevronDown
          style={{
            width: "18px",
            height: "18px",
            color: "#4685E8",
            flexShrink: 0,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Answer — smooth expand */}
      <div
        style={{
          maxHeight: open ? "300px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p
          style={{
            fontSize: "12.5px",
            color: "#475569",
            lineHeight: 1.7,
            padding: "0 20px 16px",
            margin: 0,
            borderTop: "1px solid #f1f5f9",
            paddingTop: "12px",
          }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export function FaqSection() {
  // Split 10 FAQs into two columns of 5
  const col1 = HOME_FAQS.slice(0, 5);
  const col2 = HOME_FAQS.slice(5, 10);

  return (
    <section className="w-full text-center animate-fade-in-up stagger-1">
      <h2
        className="font-heading font-bold tracking-tight mb-8"
        style={{ fontSize: "clamp(20px,2.5vw,26px)", color: "#191F2E" }}
      >
        Frequently Asked Questions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "10px",
          alignItems: "start",
          textAlign: "left",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Column 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {col1.map((faq, idx) => (
            <FaqItem key={idx} faq={faq} index={idx} />
          ))}
        </div>

        {/* Column 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {col2.map((faq, idx) => (
            <FaqItem key={idx + 5} faq={faq} index={idx + 5} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
