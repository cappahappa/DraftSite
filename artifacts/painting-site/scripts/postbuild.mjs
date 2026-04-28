// Post-build SEO step:
//   1. Generates a sitemap.xml listing every static and dynamic route.
//   2. Prerenders per-route HTML files (copies of index.html) with route-specific
//      <title>, <meta description>, canonical, OG tags, and JSON-LD baked in,
//      so search engines and social crawlers see fully populated metadata
//      without needing to execute JavaScript.
//   3. Bakes a hidden, accessible text block into the static HTML for each
//      route so LLMs and crawlers that don't run JS can still read the page's
//      core content.

import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(ROOT, "..", "..");
// When building for GitHub Pages, vite outputs to <repo-root>/docs.
// Otherwise, it goes to <artifact>/dist/public.
const DIST =
  process.env.GH_PAGES === "1"
    ? resolve(REPO_ROOT, "docs")
    : resolve(ROOT, "dist/public");

const SITE_URL = (process.env.VITE_SITE_URL || "https://elitepaintingsolutions.com").replace(/\/$/, "");
const SITE_NAME = "Elite Painting Solutions";
const SITE_PHONE = "(772) 539-2115";
const SITE_PHONE_HREF = "tel:+17725392115";
const SITE_ADDRESS = "Vero Beach, FL 32960";
const DEFAULT_DESCRIPTION =
  "Top-rated Vero Beach painters serving all of Indian River County, FL. Interior painting, exterior painting, cabinet refinishing, commercial painting & pressure washing. Licensed, insured, 30+ years. Free same-day estimates — call (772) 539-2115.";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const services = [
  {
    slug: "interior-painting",
    title: "Interior Painting",
    description:
      "Professional interior painting in Vero Beach — walls, ceilings, trim, doors, and accent features. Premium finishes, meticulous prep, and free same-day quotes.",
    body: [
      "Our interior painting service covers every room in your Vero Beach home — living rooms, bedrooms, kitchens, bathrooms, hallways, ceilings, trim, doors, and built-ins.",
      "We start every project with thorough surface prep: patching nail holes and drywall imperfections, sanding glossy areas for adhesion, caulking trim, and protecting your floors and furniture with drop cloths.",
      "We use premium-grade interior paints from Sherwin-Williams and Benjamin Moore, including low-VOC and zero-VOC formulations safe for kids, pets, and sensitive family members.",
      "Most single-room interior repaints are completed in 1–2 days. Whole-home interiors typically run 4–7 days depending on size, prep, and color complexity.",
    ],
  },
  {
    slug: "exterior-painting",
    title: "Exterior Painting",
    description:
      "Long-lasting exterior painting in Vero Beach — siding, stucco, trim, doors, fences, and decks. Weather-resistant finishes built for Florida's sun and salt air.",
    body: [
      "Florida's sun, humidity, and salt air are brutal on exterior paint. Our exterior painting service uses 100% acrylic, UV-stable, mildew-resistant coatings designed to hold up in coastal Vero Beach conditions.",
      "Every exterior job starts with pressure washing, scraping, sanding, priming bare wood and bare metal, caulking gaps, and replacing rotted trim before a brush ever touches your home.",
      "We paint stucco, hardie board, wood siding, vinyl trim, doors, garage doors, soffits, fascia, fences, decks, and pool cages.",
      "A full exterior repaint typically takes 5–10 days depending on home size, prep, and weather. We schedule around the forecast and reschedule for rain at no charge.",
    ],
  },
  {
    slug: "cabinet-refinishing",
    title: "Cabinet Refinishing",
    description:
      "Factory-grade cabinet refinishing in Vero Beach at a fraction of replacement cost. Spray-applied enamel, typically completed in 4–6 days.",
    body: [
      "Cabinet refinishing transforms your kitchen or bathroom for 60–70% less than full replacement, and you keep your existing layout and storage.",
      "We remove all doors and drawer fronts, transport them to our shop for spray-finishing, and prep the cabinet boxes on site. The boxes are sanded, primed with adhesion-bonding primer, and finished with a durable urethane-acrylic enamel.",
      "Doors and drawers come back factory-smooth — no brush marks, no roller stipple — and we re-hang them with new bumpers and (optionally) new hardware.",
      "Most kitchens are completed in 4–6 working days. We can match any color or sheen and offer a workmanship warranty on every cabinet job.",
    ],
  },
  {
    slug: "commercial-painting",
    title: "Commercial Painting",
    description:
      "Commercial painting in Vero Beach for offices, retail, restaurants, and multi-unit properties. Night and weekend scheduling, licensed and insured.",
    body: [
      "Our commercial painting crew works on offices, retail spaces, restaurants, medical buildings, condo associations, HOAs, and multi-unit residential properties throughout Indian River County.",
      "We minimize downtime with night, early-morning, and weekend scheduling, low-odor and zero-VOC paints, and clean phased work that keeps your business open.",
      "We carry $2M general liability, full workers' comp, and can provide certificates of insurance to your facility manager or property manager on request.",
      "Common commercial work includes lobbies, corridors, exterior building repaints, line striping, parking garage soffits, and turn-key tenant-improvement painting.",
    ],
  },
  {
    slug: "pressure-washing",
    title: "Pressure Washing",
    description:
      "Safe, thorough pressure washing in Vero Beach for houses, decks, driveways, fences, and pool cages. Professional equipment, paired with painting or standalone.",
    body: [
      "Pressure washing removes the algae, mildew, salt, and grime that Florida humidity creates — and it's a required first step before any quality exterior paint job.",
      "We use commercial pressure washers with adjustable PSI and soft-wash chemistry where appropriate, so we never damage stucco, soft wood, screens, or window seals.",
      "Common surfaces: house exteriors, driveways, sidewalks, paver patios, pool decks and cages, fences, decks, and concrete block walls.",
      "Pressure washing is offered as a standalone service or bundled at a discount with any interior or exterior painting project.",
    ],
  },
  {
    slug: "ceiling-services",
    title: "Ceiling Services",
    description:
      "Popcorn ceiling removal, drywall repair, smooth-ceiling refinishing, and ceiling repaints in Vero Beach. Knock down dated textures and erase Florida-humidity stains.",
    body: [
      "Popcorn (acoustic) ceilings instantly date a Vero Beach home — and they trap dust, hide cracks, and make rooms feel smaller. We safely scrape and remove popcorn texture, contain the dust, and haul away the debris.",
      "After removal we skim-coat the drywall to a smooth Level-4 or Level-5 finish, prime, and repaint with a true flat ceiling-grade paint that hides roller marks and shadows.",
      "Florida humidity is brutal on ceilings — we also handle water-stain blocking with shellac-based primer, mildew treatment, and full ceiling repaints in kitchens, bathrooms, garages, and lanais.",
      "Prefer to keep some texture? We can re-apply knockdown or orange-peel finishes for a modern, easy-to-maintain look.",
    ],
  },
];

// Real Vero Beach FL service areas
const areas = [
  "Vero Beach",
  "Sebastian",
  "Indian River Shores",
  "Fellsmere",
  "Wabasso",
  "Roseland",
  "Winter Beach",
  "Gifford",
  "Florida Ridge",
  "Vero Lake Estates",
  "Orchid",
  "Indian River County",
];

// Per-area enrichment — kept in sync with src/data/site.ts areaDetails.
// Drives the unique, crawler-visible content baked into each /areas/* page.
const areaDetails = {
  "vero-beach": {
    blurb:
      "Vero Beach is the county seat of Indian River County and the heart of our service area. From historic downtown bungalows to oceanfront homes on the barrier island, we paint every style and era — and we know exactly how Florida sun, salt spray, and afternoon thunderstorms attack each one.",
    neighborhoods: ["Central Beach","Riomar","Old Riomar","Bermuda Bay","Grand Harbor","The Moorings","Vero Isles","McAnsh Park"],
    zips: ["32960","32962","32963","32966","32967","32968"],
    landmarks: ["Riverside Park","Vero Beach Museum of Art","Humiston Beach Park","Royal Palm Pointe"],
    climateNote: "Oceanfront and lagoon-side homes here take the brunt of salt air and UV. We use 100% acrylic, mildew-resistant exterior coatings rated for coastal Florida exposure.",
    bestSellingService: "Exterior Painting",
  },
  "sebastian": {
    blurb: "Sebastian is a working waterfront town along the Sebastian River and Indian River Lagoon. Most of our Sebastian work is exterior repaints on stucco and hardie-board single-family homes, plus dock and fence staining for the riverfront and inlet communities.",
    neighborhoods: ["Sebastian Highlands","Sebastian Lakes","Park Place","Vickers Grove","Roseland Road corridor"],
    zips: ["32958","32976"],
    landmarks: ["Sebastian Inlet State Park","Riverview Park","Sebastian Municipal Airport","Pelican Island National Wildlife Refuge"],
    climateNote: "The river breeze keeps homes cooler but adds humidity to north-facing walls — we treat mildew zones with shellac-based primer before topcoat.",
    bestSellingService: "Exterior Painting",
  },
  "indian-river-shores": {
    blurb: "Indian River Shores is a quiet barrier-island town between Vero Beach and Wabasso. Homes here range from gulf-style cottages to large oceanfront and riverfront estates, and the salt-air exposure is some of the harshest in the county.",
    neighborhoods: ["John's Island","The Estuary","Sea Oaks","Bermuda Club","Surf Club"],
    zips: ["32963"],
    landmarks: ["John's Island Club","Treasure Shores Park","Indian River Shores Public Safety Building"],
    climateNote: "Direct ocean exposure means peeling paint within 3–5 years on south- and east-facing walls if the prep skips spot-priming bare wood. We never skip it.",
    bestSellingService: "Exterior Painting",
  },
  "fellsmere": {
    blurb: "Fellsmere is the inland agricultural town in northwest Indian River County — sugar cane, citrus, and ranch land. We do a lot of farmhouse repaints, barn and outbuilding work, and interior repaints for new construction in the growing residential subdivisions.",
    neighborhoods: ["Downtown Fellsmere","Fellsmere Estates","Cypress Bend","Broadway corridor"],
    zips: ["32948"],
    landmarks: ["Marsh Landing Restaurant","Fellsmere Frog Leg Festival grounds","Stick Marsh / Headwaters Lake"],
    climateNote: "Inland Fellsmere is hotter and drier than the coast — UV is the main paint killer. We spec UV-stable acrylics and recommend lighter exterior colors for west-facing walls.",
    bestSellingService: "Interior Painting",
  },
  "wabasso": {
    blurb: "Wabasso is the small unincorporated community at the north end of the barrier island, just north of Indian River Shores. It's mostly residential — single-family homes and a handful of small condo communities — and our crews are out there several times a month.",
    neighborhoods: ["Wabasso Beach","Old Winter Beach Road","CR 510 corridor"],
    zips: ["32970"],
    landmarks: ["Wabasso Beach Park","Disney's Vero Beach Resort","Environmental Learning Center"],
    climateNote: "Barrier-island salt exposure plus afternoon sea breeze drives mildew on shaded north walls — we soft-wash and treat before painting.",
    bestSellingService: "Exterior Painting",
  },
  "roseland": {
    blurb: "Roseland is a small riverfront community wedged between Sebastian and the St. Sebastian River Preserve. Lots of mature oaks, screened lanais, and waterfront docks — exterior staining and trim work make up most of what we do here.",
    neighborhoods: ["Roseland Road","Pine Street","St. Sebastian River corridor"],
    zips: ["32957"],
    landmarks: ["St. Sebastian River Preserve State Park","Roseland Community Park"],
    climateNote: "Heavy tree cover means more shaded, mildew-prone surfaces and pollen buildup. We pressure-wash with mildewcide before any exterior repaint.",
    bestSellingService: "Exterior Painting",
  },
  "winter-beach": {
    blurb: "Winter Beach is a quiet residential community north of Vero Beach along US-1. We see a steady mix of interior repaints and full exterior jobs, plus cabinet refinishing for kitchens being modernized for resale.",
    neighborhoods: ["Old Winter Beach","65th Street corridor","US-1 frontage"],
    zips: ["32966","32967"],
    landmarks: ["Winter Beach Plaza","Sea Pines Boulevard area"],
    climateNote: "Inland-coastal mix — humid mornings, hot afternoons. We finish exterior work in the morning to avoid heat-related blistering.",
    bestSellingService: "Cabinet Refinishing",
  },
  "gifford": {
    blurb: "Gifford is a historic community just north of Vero Beach with strong roots and a tight-knit feel. We take pride in serving Gifford homeowners with the same prep, paint, and warranty we put behind every job in the rest of the county.",
    neighborhoods: ["45th Street corridor","43rd Avenue area","Gifford Park"],
    zips: ["32967"],
    landmarks: ["Gifford Park & Recreation Center","MacWilliam Park"],
    climateNote: "Mature oak canopies create shaded, damp surfaces that mildew quickly — we always pre-treat before painting.",
    bestSellingService: "Interior Painting",
  },
  "florida-ridge": {
    blurb: "Florida Ridge is the unincorporated suburban area just south of Vero Beach. Mostly single-family residential with a strong mix of 1970s–1990s ranch homes that benefit hugely from a refresh — exterior repaint plus cabinet refinishing is our most popular Florida Ridge package.",
    neighborhoods: ["Indian River Estates","Floralton Beach","Vista Plantation","Lakewood Park area"],
    zips: ["32968"],
    landmarks: ["South Beach Park","Round Island Riverside Park"],
    climateNote: "South-facing walls take heavy afternoon sun — we recommend lighter heat-reflective exterior colors here to extend repaint cycles.",
    bestSellingService: "Cabinet Refinishing",
  },
  "vero-lake-estates": {
    blurb: "Vero Lake Estates is one of the larger inland residential communities in Indian River County — wide streets, deep lots, and a lot of homes with detached garages and outbuildings. We do full-property work here, often combining interior, exterior, and pressure washing in one schedule.",
    neighborhoods: ["Lake Drive","98th Avenue corridor","85th Street corridor"],
    zips: ["32967"],
    landmarks: ["North County Aquatic Center","Indian River County Fairgrounds"],
    climateNote: "Inland heat plus shoreline humidity from the lakes — we spec mildew-inhibiting exterior paint and seal all wood trim.",
    bestSellingService: "Exterior Painting",
  },
  "orchid": {
    blurb: "Orchid is a small barrier-island town just south of the Sebastian Inlet, dominated by the Orchid Island Golf & Beach Club community. The salt and wind exposure is severe, and we treat every Orchid project as a high-end coastal repaint with marine-grade prep.",
    neighborhoods: ["Orchid Island Golf & Beach Club","A1A oceanfront"],
    zips: ["32963"],
    landmarks: ["Orchid Island Golf & Beach Club","Treasure Shores Park"],
    climateNote: "Pure oceanfront — salt fog every night. We spot-prime all bare wood and metal, and use elastomeric coatings on stucco walls facing the Atlantic.",
    bestSellingService: "Exterior Painting",
  },
  "indian-river-county": {
    blurb: "Indian River County covers about 503 square miles of east-central Florida with Vero Beach as the county seat. We serve the entire county — from the barrier island and the lagoon communities to the inland towns of Fellsmere and the suburban neighborhoods around US-1 and I-95.",
    neighborhoods: ["Vero Beach","Sebastian","Indian River Shores","Fellsmere","Wabasso","Gifford","Florida Ridge","Vero Lake Estates"],
    zips: ["32948","32957","32958","32960","32962","32963","32966","32967","32968","32970","32976"],
    landmarks: ["Sebastian Inlet State Park","Pelican Island National Wildlife Refuge","Riverside Park","Indian River Lagoon"],
    climateNote: "Indian River County's coastal-to-inland mix means we adapt prep and product per ZIP code — coastal homes get marine-grade systems, inland homes get heat-resistant UV-stable acrylics.",
    bestSellingService: "Exterior Painting",
  },
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Real, named Google reviews for the home prerender.
const realReviews = [
  { name: "Greg Jammel", text: "Had Elite Painting Solutions come to my home to look at a problem I was having with the paint on the exterior of my home. Michael knew exactly what to do to fix the problem once he saw what was happening. I hired him and his guys to correct what had been done by a previous painter & they came out & performed beyond my expectations! Very reasonably priced & extremely professional. Would recommend them to everyone!" },
  { name: "Edward G Slimak Jr", text: "Best, local contractor experience. Michael is quick to reply and show up for an estimate. He is knowledgeable and a great communicator detailing the work he will perform. He works hard and efficiently. He did exactly what I requested and more that was needed. When his work is completed you will know why they call him \"Superman\". I highly recommend his work and him personally." },
  { name: "Monica Rulo", text: "Fantastic service and great results. My house was in pretty rough shape, the T1-11 siding was dry and I have no clue when it was last painted. The team spent an entire day caulking and prepping the house for paint. They took their time to seal and prime the house, and painted with both a sprayer and a roller to ensure full penetration. My house looks new again and I couldn't be happier." },
  { name: "Robert Austill", text: "I had Michael and his guys with Elite Painting Solutions come by to paint the outside of my home and I was very impressed with how quickly they were able to complete the job and provide the quality that they did. They are definitely the team to call when you want it done right the first time." },
  { name: "Steve R", text: "Elite Painting Solutions did an amazing job on staining my fence. They were punctual and finished with the job quickly, while maintaining a high level of quality. They gave a very reasonable estimate, better than my other quotes. They were also so kind and upbeat. I'm definitely going to use them again." },
  { name: "Shawn", text: "So I contacted Elite Painting Solutions and they were very responsive and provided me with an excellent estimate. We agreed to terms and then they went to work transforming my home. Their ability to work together was amazing to watch and I would highly recommend them to anyone looking to have their home painted." },
  { name: "Joe St_Eggbenedictus", text: "Elite Painting Solutions did an amazing job on the exterior of our home, as well as several jobs on the interior. Michael was fair in his prices, and very honest. There were never any surprises, and he informed us of his intentions every step of the way, especially when there was extra work needed for repairs to rotten wood around the house." },
  { name: "sameet patel", text: "These guys did a great job, making my house look amazing and did it in a timely fashion. They are very knowledgeable and fixed so many things that the previous guy I hired missed and tried to cut corners with. I only wish I had called Elite first." },
];

const blogPosts = [
  { slug: "how-to-choose-paint-color", title: "How to Choose the Perfect Paint Color for Your Vero Beach Home", excerpt: "Picking a paint color can feel overwhelming. Here's our step-by-step process to landing on a shade you'll love for years.", date: "2025-03-12" },
  { slug: "interior-vs-exterior-paint", title: "Interior vs. Exterior Paint: What's the Real Difference?", excerpt: "Beyond the obvious, there are big differences in formulation, durability, and price. Here's what every Florida homeowner should know.", date: "2025-02-27" },
  { slug: "cabinet-refinishing-guide", title: "Cabinet Refinishing vs. Replacement — Which Saves More?", excerpt: "Cabinet refinishing can save you 60–70% over replacement. Here's how to decide which is right for your kitchen.", date: "2025-02-10" },
  { slug: "best-time-to-paint-exterior", title: "When Is the Best Time of Year to Paint a Vero Beach Exterior?", excerpt: "Florida heat, humidity, and rain all affect paint adhesion. Here's the ideal window for a flawless exterior finish in Vero Beach.", date: "2025-01-28" },
  { slug: "low-voc-paint-benefits", title: "Why We Use Low-VOC Paints (and Why You Should Care)", excerpt: "Low-VOC paints are healthier for your family, better for the environment, and the quality has caught up. Here's the breakdown.", date: "2025-01-14" },
  { slug: "prep-makes-the-paint-job", title: "Why Prep Work Is 80% of a Great Paint Job", excerpt: "The work you don't see is what makes the work you see last. Here's why we never skip the boring steps.", date: "2024-12-30" },
];

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const fileExists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

// ----- Build sitemap routes -----
const today = new Date().toISOString().slice(0, 10);
const staticRoutes = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/gallery", changefreq: "monthly", priority: "0.7" },
  { loc: "/blog", changefreq: "weekly", priority: "0.7" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/reviews", changefreq: "monthly", priority: "0.7" },
  { loc: "/terms", changefreq: "yearly", priority: "0.2" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.2" },
];

const serviceRoutes = services.map((s) => ({
  loc: `/services/${s.slug}`,
  changefreq: "monthly",
  priority: "0.9",
}));
const areaRoutes = areas.map((a) => ({
  loc: `/areas/${a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  changefreq: "monthly",
  priority: "0.8",
}));
const blogRoutes = blogPosts.map((p) => ({
  loc: `/blog/${p.slug}`,
  lastmod: p.date,
  changefreq: "monthly",
  priority: "0.6",
}));

const allSitemapEntries = [
  ...staticRoutes,
  ...serviceRoutes,
  ...areaRoutes,
  ...blogRoutes,
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapEntries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(SITE_URL + e.loc)}</loc>
    <lastmod>${e.lastmod || today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

// ----- Prerender helpers -----
const buildJsonLdForRoute = (route) => {
  const blocks = [];

  if (route.path === "/") {
    // Real Review nodes attached to the LocalBusiness — anchors AggregateRating.
    blocks.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${SITE_URL}/#reviews`,
      itemListElement: realReviews.map((r, i) => ({
        "@type": "Review",
        position: i + 1,
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5", worstRating: "1" },
        reviewBody: r.text,
        itemReviewed: { "@id": `${SITE_URL}/#business` },
      })),
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        ["Can you provide references from past clients?", "Absolutely. You can read reviews on our site, and we're happy to provide direct references for similar projects on request."],
        ["What sets you apart from other painting contractors in Vero Beach?", "Meticulous prep, premium paints, and clear communication from start to finish. We treat every Vero Beach home like it's our own."],
        ["What types of services do you offer?", "Full residential and commercial painting in Vero Beach and Indian River County — interior, exterior, cabinet refinishing, pressure washing, and specialty finishes."],
        ["Is there a fee for a consultation or estimate?", "No — Elite Painting Solutions offers complimentary in-home estimates throughout Vero Beach and surrounding areas."],
        ["What kind of paint do you use?", "Premium-grade paints from Sherwin-Williams and Benjamin Moore, including low-VOC and zero-VOC options that hold up to Florida sun and humidity."],
        ["Do you offer a warranty on your work?", "Yes. We stand behind our craftsmanship with a workmanship warranty, plus the manufacturer's paint warranty on all materials."],
        ["Are you licensed and insured?", "Yes. Elite Painting Solutions is fully licensed and insured to operate in Indian River County, Florida — certificates of insurance available on request."],
        ["What areas do you serve?", "Vero Beach, Sebastian, Fellsmere, Indian River Shores, Wabasso, Roseland, Gifford, Florida Ridge, Vero Lake Estates, and the rest of Indian River County, FL."],
      ].map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  if (route.kind === "service") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: route.title,
      serviceType: route.title,
      description: route.description,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: areas,
      url: `${SITE_URL}${route.path}`,
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Services", item: `${SITE_URL}/#services` },
        { "@type": "ListItem", position: 2, name: route.title, item: `${SITE_URL}${route.path}` },
      ],
    });
  }

  if (route.kind === "area") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Service Areas", item: `${SITE_URL}/#areas` },
        { "@type": "ListItem", position: 2, name: route.areaName, item: `${SITE_URL}${route.path}` },
      ],
    });
    const detail = areaDetails[slugify(route.areaName)];
    if (detail) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Painting Services in ${route.areaName}, FL`,
        serviceType: "Painting",
        description: detail.blurb,
        provider: { "@id": `${SITE_URL}/#business` },
        url: `${SITE_URL}${route.path}`,
        areaServed: {
          "@type": "City",
          name: route.areaName,
          address: {
            "@type": "PostalAddress",
            addressLocality: route.areaName,
            addressRegion: "FL",
            addressCountry: "US",
          },
        },
      });
    }
  }

  if (route.kind === "blog-post") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 2, name: route.title, item: `${SITE_URL}${route.path}` },
      ],
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: route.title,
      description: route.description,
      url: `${SITE_URL}${route.path}`,
      datePublished: route.datePublished,
      dateModified: route.datePublished,
      image: OG_IMAGE,
      author: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${route.path}` },
    });
  }

  return blocks;
};

// Visible-but-tiny breadcrumb HTML rendered above the SEO snapshot. Plain
// link text so crawlers see the navigation hierarchy.
const buildBreadcrumbHtml = (items) => {
  const parts = items
    .map((b, i) => {
      const sep = i === 0 ? "" : ' <span aria-hidden="true">›</span> ';
      const inner = b.href
        ? `<a href="${escapeHtml(b.href)}">${escapeHtml(b.label)}</a>`
        : `<span aria-current="page">${escapeHtml(b.label)}</span>`;
      return `${sep}${inner}`;
    })
    .join("");
  return `<nav aria-label="Breadcrumb"><p>${parts}</p></nav>`;
};

// Build hidden, crawlable text content for each route. Sits in the static HTML
// so LLMs and crawlers that don't run JavaScript still see real page content.
const buildSeoBlock = (route) => {
  const businessLine = `<p>${escapeHtml(SITE_NAME)} — ${escapeHtml(SITE_ADDRESS)} — Phone <a href="${SITE_PHONE_HREF}">${escapeHtml(SITE_PHONE)}</a>.</p>`;
  let inner = "";

  if (route.path === "/") {
    inner = `
      <h1>${escapeHtml("Professional Painting Services in Vero Beach, FL — Elite Painting Solutions")}</h1>
      <p>Elite Painting Solutions is a top-rated Vero Beach, Florida painting company offering interior painting, exterior painting, cabinet refinishing, commercial painting, and pressure washing. We are fully licensed and insured, with more than 30 years of professional painting experience serving Indian River County.</p>
      <h2>Painting Services in Vero Beach, FL</h2>
      <ul>
        ${services.map((s) => `<li><strong>${escapeHtml(s.title)}</strong> — ${escapeHtml(s.description)}</li>`).join("\n        ")}
      </ul>
      <h2>Service Area</h2>
      <p>We serve homeowners and businesses throughout Indian River County, including ${areas.map((a) => escapeHtml(a)).join(", ")}.</p>
      <h2>Why Choose Elite Painting Solutions</h2>
      <ul>
        <li>30+ years of professional painting experience.</li>
        <li>Licensed and insured in the state of Florida.</li>
        <li>Free same-day estimates — usually returned within hours.</li>
        <li>Premium Sherwin-Williams and Benjamin Moore paints.</li>
        <li>Workmanship warranty on every project.</li>
        <li>Hundreds of 5-star reviews from Vero Beach neighbors.</li>
      </ul>
      <h2>Contact</h2>
      ${businessLine}
      <p>Email: <a href="mailto:eps.paintingsolutions@gmail.com">eps.paintingsolutions@gmail.com</a></p>
      <h2>What Our Vero Beach Customers Say</h2>
      ${realReviews
        .map(
          (r) =>
            `<blockquote><p>"${escapeHtml(r.text)}"</p><footer>— ${escapeHtml(r.name)}, 5 stars on Google</footer></blockquote>`,
        )
        .join("\n      ")}
    `;
  } else if (route.kind === "service") {
    const breadcrumb = buildBreadcrumbHtml([
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: route.title },
    ]);
    inner = `
      ${breadcrumb}
      <h1>${escapeHtml(route.title)} in Vero Beach, FL</h1>
      <p>${escapeHtml(route.description)}</p>
      ${(route.body || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n      ")}
      <h2>Service Area</h2>
      <p>We provide ${escapeHtml(route.title.toLowerCase())} throughout Indian River County, including ${areas.map((a) => escapeHtml(a)).join(", ")}.</p>
      <h2>Free Estimate</h2>
      ${businessLine}
    `;
  } else if (route.kind === "area") {
    const detail = areaDetails[slugify(route.areaName)];
    const breadcrumb = buildBreadcrumbHtml([
      { label: "Home", href: "/" },
      { label: "Service Areas", href: "/#areas" },
      { label: route.areaName },
    ]);
    if (detail) {
      inner = `
        ${breadcrumb}
        <h1>Painters in ${escapeHtml(route.areaName)}, FL — Elite Painting Solutions</h1>
        <p>${escapeHtml(detail.blurb)}</p>
        <h2>${escapeHtml(route.areaName)} Neighborhoods We Paint</h2>
        <ul>
          ${detail.neighborhoods.map((n) => `<li>${escapeHtml(n)}</li>`).join("\n          ")}
        </ul>
        <h2>ZIP Codes Served in ${escapeHtml(route.areaName)}</h2>
        <p>${detail.zips.map((z) => escapeHtml(z)).join(", ")}</p>
        <h2>Local Landmarks Near Our ${escapeHtml(route.areaName)} Jobs</h2>
        <ul>
          ${detail.landmarks.map((l) => `<li>${escapeHtml(l)}</li>`).join("\n          ")}
        </ul>
        <h2>${escapeHtml(route.areaName)} Climate &amp; Paint Notes</h2>
        <p>${escapeHtml(detail.climateNote)}</p>
        <p>Most-requested service in ${escapeHtml(route.areaName)}: <strong>${escapeHtml(detail.bestSellingService)}</strong>.</p>
        <h2>Painting Services Available in ${escapeHtml(route.areaName)}</h2>
        <ul>
          ${services.map((s) => `<li><a href="${escapeHtml(`/services/${s.slug}`)}"><strong>${escapeHtml(s.title)}</strong></a> — ${escapeHtml(s.description)}</li>`).join("\n          ")}
        </ul>
        <h2>Free Estimate in ${escapeHtml(route.areaName)}</h2>
        <p>Call <a href="${SITE_PHONE_HREF}">${escapeHtml(SITE_PHONE)}</a> for a free same-day painting estimate anywhere in ${escapeHtml(route.areaName)} or surrounding Indian River County.</p>
        ${businessLine}
      `;
    } else {
      inner = `
        ${breadcrumb}
        <h1>Painters in ${escapeHtml(route.areaName)}, FL</h1>
        <p>Elite Painting Solutions provides expert interior, exterior, cabinet, and commercial painting in ${escapeHtml(route.areaName)}, Florida and the surrounding Indian River County area.</p>
        <h2>Local Painting Services</h2>
        <ul>
          ${services.map((s) => `<li><strong>${escapeHtml(s.title)}</strong> — ${escapeHtml(s.description)}</li>`).join("\n        ")}
        </ul>
        <p>Call ${escapeHtml(SITE_PHONE)} for a free same-day estimate in ${escapeHtml(route.areaName)}.</p>
        ${businessLine}
      `;
    }
  } else if (route.kind === "blog-post") {
    inner = `
      <article>
        <h1>${escapeHtml(route.title)}</h1>
        <p><em>Published ${escapeHtml(new Date(route.datePublished).toDateString())} by ${escapeHtml(SITE_NAME)}.</em></p>
        <p>${escapeHtml(route.description)}</p>
      </article>
      ${businessLine}
    `;
  } else {
    inner = `
      <h1>${escapeHtml(route.title)}</h1>
      <p>${escapeHtml(route.description)}</p>
      ${businessLine}
    `;
  }

  return `<div class="seo-prerender" aria-hidden="true">${inner}</div>`;
};

const renderHtmlFor = (template, route) => {
  const canonical = `${SITE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const ogType = route.ogType || "website";

  let html = template;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${description}" />`,
  );

  // canonical
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  // og:title
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" />`,
  );
  // og:description
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/,
    `<meta property="og:description" content="${description}" />`,
  );
  // og:url
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  // og:type
  html = html.replace(
    /<meta\s+property="og:type"[^>]*>/,
    `<meta property="og:type" content="${ogType}" />`,
  );

  // twitter:title / description
  html = html.replace(
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  // Per-route JSON-LD blocks: append before </head>
  const blocks = buildJsonLdForRoute(route);
  if (blocks.length > 0) {
    const scriptTags = blocks
      .map(
        (b) =>
          `    <script type="application/ld+json" data-route-jsonld="true">${JSON.stringify(
            b,
          ).replace(/</g, "\\u003c")}</script>`,
      )
      .join("\n");
    html = html.replace(/<\/head>/, `${scriptTags}\n  </head>`);
  }

  // Hidden SEO content block right before </body> for crawlers + LLMs
  const seoBlock = buildSeoBlock(route);
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"></div>\n    ${seoBlock}`,
  );

  return html;
};

const main = async () => {
  if (!(await fileExists(DIST))) {
    console.error(`[postbuild] dist directory not found at ${DIST}`);
    process.exitCode = 1;
    return;
  }

  // Sitemap + robots.txt
  await writeFile(resolve(DIST, "sitemap.xml"), sitemapXml, "utf8");
  console.log("[postbuild] sitemap.xml written");

  // Ensure robots.txt is in place
  const robotsSrc = resolve(ROOT, "public/robots.txt");
  const robotsDst = resolve(DIST, "robots.txt");
  if (!(await fileExists(robotsDst)) && (await fileExists(robotsSrc))) {
    await copyFile(robotsSrc, robotsDst);
  }

  // Prerender per-route HTML
  const indexPath = resolve(DIST, "index.html");
  const template = await readFile(indexPath, "utf8");

  const routes = [];

  // Home: rewrite the root index.html with FAQ JSON-LD baked in
  routes.push({
    path: "/",
    title: "Professional Painting Services in Vero Beach, FL | Elite Painting Solutions",
    description: DEFAULT_DESCRIPTION,
    kind: "home",
  });

  for (const s of services) {
    routes.push({
      ...s,
      path: `/services/${s.slug}`,
      title: `${s.title} in Vero Beach, FL | Elite Painting Solutions`,
      description: `${s.description} Free same-day estimates from licensed and insured Vero Beach painters. Call ${SITE_PHONE}.`,
      kind: "service",
    });
  }

  for (const a of areas) {
    const slug = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    routes.push({
      path: `/areas/${slug}`,
      title: `Painters in ${a}, FL | Elite Painting Solutions Vero Beach`,
      description: `Top-rated painters serving ${a}, Florida. Interior, exterior, cabinet, and commercial painting. Licensed & insured. Free same-day estimates — call ${SITE_PHONE}.`,
      kind: "area",
      areaName: a,
    });
  }

  for (const p of blogPosts) {
    routes.push({
      path: `/blog/${p.slug}`,
      title: `${p.title} | Elite Painting Solutions Blog`,
      description: p.excerpt,
      kind: "blog-post",
      ogType: "article",
      datePublished: new Date(p.date).toISOString(),
    });
  }

  routes.push({
    path: "/blog",
    title: "Painting Tips & Advice | Elite Painting Solutions Vero Beach FL Blog",
    description:
      "Expert painting tips, color selection guides, and home improvement advice from Elite Painting Solutions — Vero Beach's top-rated painting company with 30+ years of experience.",
    kind: "page",
  });
  routes.push({
    path: "/gallery",
    title: "Project Gallery | Vero Beach Painting Portfolio | Elite Painting Solutions",
    description:
      "Browse interior, exterior, and cabinet painting projects completed by Elite Painting Solutions in Vero Beach, FL. See the quality and craftsmanship that earned us 5-star reviews.",
    kind: "page",
  });
  routes.push({
    path: "/contact",
    title: "Contact Elite Painting Solutions | Free Quote | Vero Beach FL Painters",
    description: `Contact Elite Painting Solutions for a free same-day painting quote in Vero Beach, FL. Call ${SITE_PHONE} or send a message — we respond fast.`,
    kind: "page",
  });
  routes.push({
    path: "/reviews",
    title: "Customer Reviews | Elite Painting Solutions Vero Beach FL — 5-Star Painters",
    description:
      "Read what our Vero Beach customers say about Elite Painting Solutions. 5-star reviews for interior, exterior, and cabinet painting across Indian River County, FL.",
    kind: "page",
  });
  routes.push({
    path: "/terms",
    title: "Terms of Service | Elite Painting Solutions",
    description: "Terms of service for Elite Painting Solutions, Vero Beach FL.",
    kind: "page",
  });
  routes.push({
    path: "/privacy",
    title: "Privacy Policy | Elite Painting Solutions",
    description: "Privacy policy for Elite Painting Solutions, Vero Beach FL.",
    kind: "page",
  });

  let count = 0;
  for (const route of routes) {
    const html = renderHtmlFor(template, route);
    if (route.path === "/") {
      // Overwrite root index.html with home-tuned variant (FAQ JSON-LD baked in)
      await writeFile(indexPath, html, "utf8");
    } else {
      const target = resolve(DIST, route.path.replace(/^\//, ""), "index.html");
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, html, "utf8");
    }
    count++;
  }

  console.log(`[postbuild] prerendered ${count} routes`);
};

main().catch((err) => {
  console.error("[postbuild] failed:", err);
  process.exit(1);
});
