import { QuoteForm } from "../QuoteForm";
import { site } from "@/data/site";

export const Hero = () => {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-secondary pt-20">
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(max-width: 768px)" srcSet={`${import.meta.env.BASE_URL}gallery/storefront-mobile.webp`} type="image/webp" />
          <source srcSet={`${import.meta.env.BASE_URL}gallery/storefront.webp`} type="image/webp" />
          <img
            src={`${import.meta.env.BASE_URL}gallery/storefront.webp`}
            alt="Beautifully painted home exterior — Elite Painting Solutions, Vero Beach Florida"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
            style={{ filter: "saturate(1.3) contrast(1.1) brightness(1.05)" }}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="container-tight grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-24">
        <div className="flex flex-col justify-center text-white animate-fade-in-up">
          <span className="text-overline mb-4 text-yellow-400">{site.tagline}</span>
          <h1 className="heading-display text-4xl text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">PROFESSIONAL PAINTING SERVICES</span>
            <span className="block text-primary">IN VERO BEACH, FL.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {site.description}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Serving Vero Beach, Sebastian, Indian River Shores, Fellsmere, Wabasso, Roseland,
            Gifford, Florida Ridge, and all of Indian River County, FL. Licensed, insured,
            and proudly local — with 30+ years of painting experience and a 5-star reputation
            backed by 47+ verified Google reviews.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#quote"
              aria-label="Scroll to the quick quote form on this page"
              className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3.5 font-display font-black tracking-wide text-primary-foreground shadow-glow transition-smooth hover:scale-105"
            >
              GET A FREE QUOTE
            </a>
            <a
              href={site.phoneHref}
              aria-label={`Call Elite Painting Solutions at ${site.phone}`}
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-7 py-3.5 font-display font-black tracking-wide text-white transition-smooth hover:bg-white hover:text-secondary"
            >
              Call {site.phone}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&q=80&auto=format&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&q=80&auto=format&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&q=80&auto=format&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&q=80&auto=format&fit=crop&crop=faces",
              ].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Happy customer ${i + 1}`}
                  loading="lazy"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <div className="flex" role="img" aria-label="4.9 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-yellow-400" aria-hidden="true">
                      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.76L10 14.77l-5.18 2.66.99-5.76L1.62 7.59l5.79-.84L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-white">4.9</span>
              </div>
              <span className="text-xs font-medium text-white/80">
                Trusted by <span className="font-bold text-white">500+</span> Vero Beach homeowners
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:gap-4">
            {["Licensed & Insured", "Free Estimates", "5-Star Rated"].map((b) => (
              <div key={b} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:px-4 sm:text-sm">
                <span className="text-yellow-400">✓</span> {b}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:200ms] [animation-fill-mode:both]">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
};
