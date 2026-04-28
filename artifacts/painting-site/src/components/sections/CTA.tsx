import { site } from "@/data/site";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 text-primary-foreground lg:py-28"
      style={{ background: "linear-gradient(135deg, hsl(358 78% 45%) 0%, hsl(358 80% 35%) 100%)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 10% 90%, #000000 0%, transparent 50%)" }}
      />
      <div className="container-tight relative text-center">
        <span className="text-overline text-yellow-300" data-reveal>Ready to Take the Next Step?</span>
        <h2 className="heading-display mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl" data-reveal style={{ transitionDelay: "60ms" }}>
          GET A FREE QUOTE TODAY!
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/90 sm:text-lg" data-reveal style={{ transitionDelay: "140ms" }}>
          One quick call and we'll get you a clear, honest estimate — no pressure, no surprises.
        </p>

        <div className="mx-auto mt-9 flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4" data-reveal style={{ transitionDelay: "220ms" }}>
          <Link
            to="/contact"
            aria-label="Visit the contact page to request a free painting estimate"
            className="btn-press cta-pulse-dark inline-flex items-center justify-center rounded-md bg-[#111] px-8 py-4 font-display font-black tracking-wide text-white shadow-elegant"
          >
            GET A FREE QUOTE
          </Link>
          <a
            href={site.phoneHref}
            aria-label={`Call Elite Painting Solutions at ${site.phone} for a quote`}
            className="btn-press inline-flex items-center justify-center gap-2 rounded-md border-2 border-white bg-transparent px-8 py-4 font-display font-black tracking-wide text-white hover:bg-white hover:text-primary"
          >
            <svg viewBox="0 0 24 24" className="phone-ring h-4 w-4 fill-current" aria-hidden="true">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
            </svg>
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
};
