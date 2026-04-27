import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

import painterBg from "@assets/stock_images/hero_painter_bg.webp";
import blogBg from "@assets/stock_images/hero_blog_bg.webp";
import contactBg from "@assets/stock_images/hero_contact_bg.webp";
import galleryBg from "@assets/stock_images/hero_gallery_bg.webp";
import areaBg from "@assets/stock_images/hero_area_bg.webp";
import reviewsBg from "@assets/stock_images/hero_reviews_bg.webp";

const bgMap: Record<string, string> = {
  service: painterBg,
  blog: blogBg,
  contact: contactBg,
  gallery: galleryBg,
  area: areaBg,
  reviews: reviewsBg,
  legal: blogBg,
};

export type PageHeroVariant = "service" | "blog" | "contact" | "gallery" | "area" | "reviews" | "legal";

export const PageHero = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [],
  variant = "service",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  variant?: PageHeroVariant;
  children?: ReactNode;
}) => {
  const bg = bgMap[variant] ?? painterBg;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24">
      {/* Background photo */}
      <div className="absolute inset-0 -z-20">
        <img
          src={bg}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Navy blue glass gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(125deg, hsl(222 60% 10% / 0.93) 0%, hsl(222 55% 18% / 0.87) 50%, hsl(222 60% 10% / 0.95) 100%)",
        }}
      />

      {/* Subtle red accent glow top-right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 15%, hsl(var(--primary) / 0.6), transparent 40%)",
        }}
      />

      <div className="container-tight text-white animate-fade-in-up">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs font-medium text-white/70">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-primary-glow">
              <Home className="h-3 w-3" /> Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? (
                  <Link to={b.href} className="hover:text-primary-glow">{b.label}</Link>
                ) : (
                  <span className="text-white">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="text-overline text-primary-glow">{eyebrow}</span>}
        <h1 className="heading-display mt-3 max-w-4xl text-3xl text-white sm:text-4xl md:text-5xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};
