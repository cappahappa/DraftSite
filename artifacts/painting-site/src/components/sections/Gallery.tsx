import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const photos = [
  { src: `${import.meta.env.BASE_URL}gallery/how-about-that.webp`, alt: "Bright, fresh interior repaint with crisp white walls" },
  { src: `${import.meta.env.BASE_URL}gallery/definite-improvement.webp`, alt: "A definite improvement — professional interior finish" },
  { src: `${import.meta.env.BASE_URL}gallery/looks-amazing.webp`, alt: "Looks amazing — Elite Painting Solutions craftsmanship" },
  { src: `${import.meta.env.BASE_URL}gallery/all-done.webp`, alt: "All done — finished room with a flawless wall finish" },
  { src: `${import.meta.env.BASE_URL}gallery/finished.webp`, alt: "Finished room — clean lines and crisp finish" },
  { src: `${import.meta.env.BASE_URL}gallery/bad-boy-new-look.webp`, alt: "Bold blue accent wall — brand new look" },
  { src: `${import.meta.env.BASE_URL}gallery/very-nice.webp`, alt: "Very nice finish on entryway and trim" },
  { src: `${import.meta.env.BASE_URL}gallery/on-the-edge.webp`, alt: "Detail work on a freshly painted porch railing" },
  { src: `${import.meta.env.BASE_URL}gallery/ready-to-spray.webp`, alt: "Prepped and masked, ready to spray for a flawless finish" },
  { src: `${import.meta.env.BASE_URL}gallery/brand-new.webp`, alt: "Brand new look on a refinished bathtub" },
];

export const Gallery = () => {
  return (
    <section id="gallery" className="bg-background py-20 lg:py-28">
      <div className="container-tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-overline">See Why Our Customers Love Us</span>
            <h2 className="heading-display mt-3 text-4xl text-secondary sm:text-5xl lg:text-6xl">
              SEE OUR WORK
            </h2>
          </div>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 font-display text-sm font-black tracking-wide text-[#111] hover:text-primary"
          >
            See All Photos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-card transition-smooth hover:shadow-elegant"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                style={{ filter: "saturate(1.25) contrast(1.08) brightness(1.04)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-smooth group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
