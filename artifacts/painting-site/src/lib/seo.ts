import { site, services, navAreas, reviews } from "@/data/site";

const ENV_SITE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL) ||
  "";

const FALLBACK_SITE_URL = "https://elitepaintingsolutions.com";

export const SITE_URL = (ENV_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");

export const absoluteUrl = (path: string): string => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
};

export const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph.jpg");

const ORG_ID = `${SITE_URL}/#organization`;
const BUSINESS_ID = `${SITE_URL}/#business`;

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  url: SITE_URL,
  logo: absoluteUrl("/favicon.png"),
  image: DEFAULT_OG_IMAGE,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  sameAs: [],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
});

// Real, verifiable review nodes built from the named Google reviews in
// data/site.ts. Schema.org/Google requires that every Review has an author
// and reviewBody, and that AggregateRating only appears alongside actual
// reviews — see https://developers.google.com/search/docs/appearance/structured-data/review-snippet
export const reviewSchemaItems = () =>
  reviews.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
    itemReviewed: { "@id": BUSINESS_ID },
  }));

export const localBusinessJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Painter", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: site.name,
  url: SITE_URL,
  telephone: site.phone,
  email: site.email,
  image: DEFAULT_OG_IMAGE,
  logo: absoluteUrl("/favicon.png"),
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
    addressRegion: "FL",
    addressLocality: "Vero Beach",
    postalCode: "32960",
  },
  areaServed: navAreas.map((a) => `${a.name}, FL`),
  description: site.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Painting Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        url: absoluteUrl(s.href),
      },
    })),
  },
  // Real Review nodes (named author + full text) anchor the AggregateRating.
  // Without these, Google may flag the AggregateRating as unsupported.
  review: reviewSchemaItems(),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: String(reviews.length),
    bestRating: "5",
    worstRating: "1",
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const serviceJsonLd = (title: string, description: string, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: title,
  serviceType: title,
  provider: { "@id": BUSINESS_ID },
  areaServed: navAreas.map((a) => `${a.name}, FL`),
  description,
  url: absoluteUrl(`/services/${slug}`),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const articleJsonLd = (args: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: args.title,
  description: args.description,
  url: absoluteUrl(`/blog/${args.slug}`),
  datePublished: args.datePublished,
  dateModified: args.datePublished,
  image: args.image ? absoluteUrl(args.image) : DEFAULT_OG_IMAGE,
  author: { "@type": "Organization", name: site.name, "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absoluteUrl(`/blog/${args.slug}`),
  },
});
