import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { faqs } from "@/data/site";

const FAQItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border border-border rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
        style={{
          backgroundColor: isOpen ? "var(--color-primary)" : "var(--color-muted)",
          color: isOpen ? "#ffffff" : "var(--color-secondary)",
        }}
        aria-expanded={isOpen}
      >
        <span className="font-display text-base font-black tracking-wide uppercase">
          {q}
        </span>
        <span className="flex-shrink-0 transition-transform duration-300" style={{ color: isOpen ? "#ffffff" : "var(--color-primary)" }}>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-5 text-base leading-relaxed text-muted-foreground bg-card border-t border-border">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="bg-background py-20 lg:py-28">
      <div className="container-tight">
        <h2 className="heading-display text-center text-3xl text-secondary sm:text-4xl md:text-5xl lg:text-6xl mb-12">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((f, i) => (
            <FAQItem
              key={i}
              q={f.q}
              a={f.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
