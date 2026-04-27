import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { site } from "@/data/site";

const sections = [
  {
    h: "Information We Collect",
    p: "We collect information you provide directly — such as your name, phone number, email address, and project details — when you request a quote or contact us. We also collect basic usage data through standard web analytics.",
  },
  {
    h: "How We Use Your Information",
    p: "We use your information to respond to inquiries, provide quotes, schedule services, send appointment reminders, and follow up after your project. We never sell your information.",
  },
  {
    h: "Text Messaging",
    p: "If you provide your phone number, you agree to receive transactional and follow-up text messages from us. You can opt out at any time by replying STOP. Message and data rates may apply.",
  },
  {
    h: "Cookies & Analytics",
    p: "We use cookies and analytics tools to understand how visitors use our site. This helps us improve the experience. You can disable cookies in your browser settings.",
  },
  {
    h: "Data Sharing",
    p: "We do not sell, rent, or trade your personal information. We may share information with trusted service providers (e.g., scheduling, email) strictly to operate our business.",
  },
  {
    h: "Data Security",
    p: "We take reasonable technical and organizational measures to protect your information. No system is 100% secure, but we treat your data with the care we'd want for our own.",
  },
  {
    h: "Your Rights",
    p: "You can request access to, correction of, or deletion of your personal data at any time by contacting us.",
  },
  {
    h: "Contact",
    p: `Questions about this Privacy Policy? Reach us at ${site.email} or ${site.phone}.`,
  },
];

const Privacy = () => {
  return (
    <PageLayout>
      <SEO
        title={`Privacy Policy | ${site.name}`}
        description={`Privacy policy for ${site.name}. Learn how we collect, use, and protect your information.`}
        canonicalPath="/privacy"
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: January 2025"
        breadcrumbs={[{ label: "Privacy" }]}
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

export default Privacy;
