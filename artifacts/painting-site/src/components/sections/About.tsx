import { site } from "@/data/site";

const PaintingPhoto = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div className={`relative overflow-hidden rounded-2xl shadow-card ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover"
      style={{ filter: "saturate(1.25) contrast(1.08) brightness(1.04)" }}
    />
  </div>
);

export const About = () => {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="container-tight grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1 animate-fade-in-up">
          <span className="text-overline">About Us</span>
          <h2 className="heading-display mt-3 text-4xl text-secondary sm:text-5xl lg:text-6xl">
            BUILT ON TRUST.
            <br />
            <span className="text-[#111]">PAINTED TO PERFECTION.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {site.name} was founded with a passion for delivering high-quality painting work.
            With decades of combined experience and a deep commitment to the community we serve,
            we make sure every project is finished beautifully — the first time.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:max-w-md">
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="font-display text-4xl font-black text-primary">30+</div>
              <div className="text-sm font-medium text-muted-foreground">Years Experience</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="font-display text-4xl font-black text-[#111]">5★</div>
              <div className="text-sm font-medium text-muted-foreground">Customer Rated</div>
            </div>
          </div>
        </div>

        <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <PaintingPhoto
            src={`${import.meta.env.BASE_URL}gallery/transformation.webp`}
            alt="Beautiful interior repaint by Elite Painting Solutions"
            className="aspect-[3/4] translate-y-6"
          />
          <PaintingPhoto
            src={`${import.meta.env.BASE_URL}gallery/amazing.webp`}
            alt="Amazing room makeover with fresh, bright paint"
            className="aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  );
};
