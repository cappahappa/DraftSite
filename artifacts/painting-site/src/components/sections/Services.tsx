import { ArrowRight } from "lucide-react";
import { services } from "@/data/site";
import { Link } from "react-router-dom";

const serviceImages: Record<string, string> = {
  "interior-painting": `${import.meta.env.BASE_URL}gallery/softening-color.webp`,
  "exterior-painting": `${import.meta.env.BASE_URL}gallery/beautiful-new-look.webp`,
  "cabinet-refinishing": `${import.meta.env.BASE_URL}gallery/cabinet-kitchen.png`,
  "commercial-painting": `${import.meta.env.BASE_URL}gallery/how-we-do-it.webp`,
  "pressure-washing": `${import.meta.env.BASE_URL}gallery/i-like-it.webp`,
  "ceiling-services": `${import.meta.env.BASE_URL}gallery/ceiling-popcorn.png`,
};

export const Services = () => {
  return (
    <section id="services" className="bg-background py-20 lg:py-28">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-overline" data-reveal>What We Are Best At</span>
          <h2 className="heading-display mt-3 text-3xl text-secondary sm:text-4xl md:text-5xl lg:text-6xl" data-reveal style={{ transitionDelay: "80ms" }}>
            OUR SERVICES
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group flex flex-col"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted lift-hover">
                <img
                  src={serviceImages[s.slug]}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: "saturate(1.25) contrast(1.08) brightness(1.04)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-70" />
              </div>
              <div className="pt-5">
                <h3 className="heading-display text-xl uppercase tracking-wide text-secondary transition-colors duration-300 group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <Link
                  to={s.href}
                  aria-label={`Learn more about ${s.title}`}
                  className="link-grow mt-4 inline-flex items-center gap-1.5 font-display text-sm font-black tracking-wide text-primary transition-smooth hover:gap-2.5"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
