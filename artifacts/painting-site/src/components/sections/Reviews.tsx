import { reviews, site } from "@/data/site";
import { ArrowUpRight, Star } from "lucide-react";

const Stars = () => (
  <div className="flex items-center gap-0.5 text-[#F5C518]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
    ))}
  </div>
);

export const Reviews = () => {
  // Triple the list so the slider loops seamlessly (keyframe translates -33.3333%)
  const loop = [...reviews, ...reviews, ...reviews];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#0d0d0d] py-20 lg:py-24"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Header row — title left, CTA right */}
      <div className="container-tight">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="heading-display text-3xl leading-[1.05] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block">WHAT OUR</span>
            <span className="block text-primary">CLIENTS ARE SAYING</span>
          </h2>

          <a
            href={site.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-3 font-display text-xs font-black uppercase tracking-[0.14em] text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:brightness-110"
          >
            See All Google Reviews
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Sliding review cards */}
      <div className="eps-marquee-viewport relative mt-12">
        {/* edge fades to dissolve cards into the background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent sm:w-32" />

        <ul className="eps-reviews-track flex items-stretch gap-5 px-4 sm:gap-6 sm:px-8">
          {loop.map((r, i) => (
            <li
              key={i}
              className="w-[320px] shrink-0 sm:w-[380px] md:w-[420px]"
            >
              <a
                href={site.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${r.name}'s 5-star Google review of Elite Painting Solutions on Google`}
                className="group block h-full"
              >
                <article className="relative flex h-[280px] flex-col rounded-xl border border-white/10 bg-[#161616] p-6 transition-colors hover:border-primary/60 hover:bg-[#1a1a1a]">
                  <header className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-black uppercase tracking-wide text-white">
                      {r.name}
                    </h3>
                  </header>
                  <Stars />
                  <p className="mt-3 line-clamp-6 whitespace-normal text-[14px] leading-[1.65] text-white/65">
                    {r.text}
                  </p>
                  <div className="mt-auto flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-primary">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </article>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
