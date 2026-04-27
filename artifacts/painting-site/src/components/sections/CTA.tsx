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
        <span className="text-overline text-yellow-300">Ready to Take the Next Step?</span>
        <h2 className="heading-display mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          GET A FREE QUOTE TODAY!
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/90 sm:text-lg">
          One quick call and we'll get you a clear, honest estimate — no pressure, no surprises.
        </p>

        <div className="mx-auto mt-9 flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            to="/contact"
            aria-label="Visit the contact page to request a free painting estimate"
            className="inline-flex items-center justify-center rounded-md bg-[#111] px-8 py-4 font-display font-black tracking-wide text-white shadow-elegant transition-smooth hover:scale-105"
          >
            GET A FREE QUOTE
          </Link>
          <a
            href={site.phoneHref}
            aria-label={`Call Elite Painting Solutions at ${site.phone} for a quote`}
            className="inline-flex items-center justify-center rounded-md border-2 border-white bg-transparent px-8 py-4 font-display font-black tracking-wide text-white transition-smooth hover:bg-white hover:text-primary"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
};
