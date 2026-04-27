import { reviews, site } from "@/data/site";
import { ArrowUpRight, Star } from "lucide-react";

const Stars = () => (
  <div className="flex items-center gap-0.5 text-[#F5C518]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
    ))}
  </div>
);

const GoogleG = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
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
                  <span
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform group-hover:scale-110"
                    title="View this review on Google"
                  >
                    <GoogleG className="h-4 w-4" />
                  </span>
                  <header className="flex items-start justify-between gap-3 pr-10">
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
