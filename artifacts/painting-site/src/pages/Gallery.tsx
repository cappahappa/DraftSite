import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { breadcrumbJsonLd } from "@/lib/seo";

const photos = [
  { src: `${import.meta.env.BASE_URL}gallery/storefront.webp`, alt: "Freshly painted home exterior in Vero Beach" },
  { src: `${import.meta.env.BASE_URL}gallery/transformation.webp`, alt: "Beautiful interior painting transformation" },
  { src: `${import.meta.env.BASE_URL}gallery/beautiful-new-look.webp`, alt: "Beautiful new look — interior repaint" },
  { src: `${import.meta.env.BASE_URL}gallery/finished-product.webp`, alt: "Finished painting project — looking good" },
  { src: `${import.meta.env.BASE_URL}gallery/amazing.webp`, alt: "Amazing room makeover with fresh paint" },
  { src: `${import.meta.env.BASE_URL}gallery/how-about-that.webp`, alt: "Dramatic before-and-after color change" },
  { src: `${import.meta.env.BASE_URL}gallery/definite-improvement.webp`, alt: "A definite improvement — professional finish" },
  { src: `${import.meta.env.BASE_URL}gallery/brand-new.webp`, alt: "Looks brand new after repaint" },
  { src: `${import.meta.env.BASE_URL}gallery/looks-amazing.webp`, alt: "Looks amazing — Elite Painting Solutions craftsmanship" },
  { src: `${import.meta.env.BASE_URL}gallery/all-done.webp`, alt: "All done — finished room with fresh paint" },
  { src: `${import.meta.env.BASE_URL}gallery/how-we-do-it.webp`, alt: "This is how we do it — professional painting in progress" },
  { src: `${import.meta.env.BASE_URL}gallery/finished.webp`, alt: "Finished room — clean lines and crisp finish" },
  { src: `${import.meta.env.BASE_URL}gallery/very-nice.webp`, alt: "Very nice finish on cabinetry and trim" },
  { src: `${import.meta.env.BASE_URL}gallery/i-like-it.webp`, alt: "Sharp new color choice for a refreshed space" },
  { src: `${import.meta.env.BASE_URL}gallery/on-the-edge.webp`, alt: "Living on the edge — careful detail work" },
  { src: `${import.meta.env.BASE_URL}gallery/ready-to-spray.webp`, alt: "Prepped and ready to spray for a flawless finish" },
  { src: `${import.meta.env.BASE_URL}gallery/softening-color.webp`, alt: "Softening up wall color for a calmer feel" },
  { src: `${import.meta.env.BASE_URL}gallery/bad-boy-new-look.webp`, alt: "Giving this one a brand new look" },
  { src: `${import.meta.env.BASE_URL}gallery/transformation.webp`, alt: "Beautiful interior painting transformation" },
  { src: `${import.meta.env.BASE_URL}gallery/amazing.webp`, alt: "Amazing room makeover with fresh paint" },
  { src: `${import.meta.env.BASE_URL}gallery/beautiful-new-look.webp`, alt: "Beautiful new look — interior repaint" },
  { src: `${import.meta.env.BASE_URL}gallery/brand-new.webp`, alt: "Looks brand new after repaint" },
  { src: `${import.meta.env.BASE_URL}gallery/looks-amazing.webp`, alt: "Looks amazing — clean professional finish" },
  { src: `${import.meta.env.BASE_URL}gallery/definite-improvement.webp`, alt: "A definite improvement — professional finish" },
];

const Gallery = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <PageLayout>
      <SEO
        title="Project Gallery | Elite Painting Solutions — See Our Work"
        description="Browse photos of our recent interior, exterior, cabinet refinishing, and commercial painting projects. See the craftsmanship and attention to detail that makes Elite Painting Solutions stand out."
        canonicalPath="/gallery"
        jsonLd={breadcrumbJsonLd([{ name: "Gallery", path: "/gallery" }])}
      />

      <PageHero
        eyebrow="Project Gallery"
        title="See Our Work"
        subtitle="A selection of recent painting projects — interior, exterior, cabinets, and commercial. Real homes, real finishes, real results."
        breadcrumbs={[{ label: "Gallery" }]}
        variant="gallery"
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-card transition-smooth hover:shadow-elegant"
                aria-label={`View ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                  style={{ filter: "saturate(1.25) contrast(1.08) brightness(1.04)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-smooth group-hover:opacity-100" />
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Want to see even more? Check out the full photo collection on Yelp.
            </p>
            <a
              href="https://www.yelp.com/biz_photos/elite-painting-solutions-vero-beach-2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display text-sm font-black uppercase tracking-wide text-white shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-elegant"
            >
              View All Photos On Yelp
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary shadow-card hover:bg-primary hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[active].src}
              alt={photos[active].alt}
              className="h-auto max-h-[85vh] w-full object-contain"
              style={{ filter: "saturate(1.2) contrast(1.05) brightness(1.03)" }}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Gallery;
