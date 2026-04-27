import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { site } from "@/data/site";

const sections = [
  {
    h: "1. Acceptance of Terms",
    p: `By accessing or using the ${site.name} website or services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.`,
  },
  {
    h: "2. Services",
    p: `${site.name} provides residential and commercial painting services. All services are subject to a written estimate and signed agreement before work begins.`,
  },
  {
    h: "3. Estimates and Quotes",
    p: "All estimates are complimentary and valid for 30 days unless otherwise noted. Estimates may be adjusted if the scope of work changes or if site conditions differ from what was originally assessed.",
  },
  {
    h: "4. Payment",
    p: "A deposit may be required at the start of work, with the balance due upon satisfactory completion. We accept all major payment methods. Late payments may incur additional fees.",
  },
  {
    h: "5. Communications",
    p: "By providing your phone number, you agree to receive text messages from our business regarding your project, scheduling, and follow-up. Standard messaging rates may apply. You may opt out at any time by replying STOP.",
  },
  {
    h: "6. Warranty",
    p: "Our workmanship is backed by a written warranty provided at project completion. Manufacturer warranties for paint products apply separately.",
  },
  {
    h: "7. Limitation of Liability",
    p: `To the fullest extent permitted by law, ${site.name} shall not be liable for indirect, incidental, or consequential damages arising from the use of our services or website.`,
  },
  {
    h: "8. Changes to These Terms",
    p: "We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the revised Terms.",
  },
  {
    h: "9. Contact",
    p: `Questions about these Terms? Reach us at ${site.email} or ${site.phone}.`,
  },
];

const Terms = () => {
  return (
    <PageLayout>
      <SEO
        title={`Terms & Conditions | ${site.name}`}
        description={`Terms and conditions for ${site.name} services and website use.`}
        canonicalPath="/terms"
      />
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Last updated: January 2025"
        breadcrumbs={[{ label: "Terms" }]}
        variant="legal"
      />
      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight max-w-3xl space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="heading-display text-2xl text-secondary">{s.h}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Terms;
