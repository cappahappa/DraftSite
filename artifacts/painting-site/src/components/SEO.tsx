import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  ogType?: "website" | "article" | "profile";
}

const upsert = (
  selector: string,
  create: () => HTMLElement,
  set: (el: HTMLElement) => void,
) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
};

const setMetaName = (name: string, content: string) => {
  upsert(
    `meta[name="${name}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute("name", name);
      return m;
    },
    (el) => el.setAttribute("content", content),
  );
};

const setMetaProperty = (property: string, content: string) => {
  upsert(
    `meta[property="${property}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute("property", property);
      return m;
    },
    (el) => el.setAttribute("content", content),
  );
};

export const SEO = ({
  title,
  description,
  canonicalPath,
  image,
  jsonLd,
  noindex,
  ogType = "website",
}: SEOProps) => {
  const location = useLocation();
  const stableJsonLd = useMemo(() => jsonLd, [jsonLd]);

  useEffect(() => {
    document.title = title;

    setMetaName("description", description);
    setMetaName(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );

    const path = canonicalPath ?? location.pathname;
    const canonical = absoluteUrl(path);

    upsert(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      (el) => el.setAttribute("href", canonical),
    );

    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonical);
    setMetaProperty("og:type", ogType);
    setMetaProperty("og:site_name", "Elite Painting Solutions");
    setMetaProperty("og:locale", "en_US");
    setMetaProperty("og:image", ogImage);
    setMetaProperty("og:image:secure_url", ogImage);
    setMetaProperty("og:image:width", "1200");
    setMetaProperty("og:image:height", "630");
    setMetaProperty("og:image:alt", title);

    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", ogImage);
    setMetaName("twitter:image:alt", title);

    document
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((n) => n.remove());

    if (stableJsonLd) {
      const blocks = Array.isArray(stableJsonLd) ? stableJsonLd : [stableJsonLd];
      blocks.forEach((block) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.seoJsonld = "true";
        s.text = JSON.stringify(block);
        document.head.appendChild(s);
      });
    }

    void SITE_URL;
  }, [
    title,
    description,
    canonicalPath,
    image,
    stableJsonLd,
    noindex,
    ogType,
    location.pathname,
  ]);

  return null;
};
