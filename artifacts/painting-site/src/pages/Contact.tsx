import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { SEO } from "@/components/SEO";
import { site } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";

const Contact = () => {
  return (
    <PageLayout>
      <SEO
        title="Contact Us | Elite Painting Solutions — Get a Free Painting Estimate"
        description={`Get in touch with Elite Painting Solutions for a free painting estimate. Call ${site.phone}, email us, or fill out our quick quote form. We respond fast.`}
        canonicalPath="/contact"
        jsonLd={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])}
      />

      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Ready for a free estimate? Reach out by phone, email, or fill out the form below and we'll get back to you fast."
        breadcrumbs={[{ label: "Contact" }]}
        variant="contact"
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <span className="text-overline">Get in Touch</span>
            <h2 className="heading-display mt-3 text-2xl text-secondary sm:text-3xl md:text-4xl">
              We'd Love to Hear From You
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you have a question about our services, want to schedule an estimate, or just want
              to talk through a project — we're here and happy to help.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-black text-secondary">Phone</p>
                  <a href={site.phoneHref} className="text-lg font-medium text-primary hover:underline">
                    {site.phone}
                  </a>
                  <p className="text-sm text-muted-foreground">Call or text anytime</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-black text-secondary">Email</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="block break-all text-base font-medium text-primary hover:underline sm:text-lg"
                  >
                    {site.email}
                  </a>
                  <p className="text-sm text-muted-foreground">We respond within a few hours</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-black text-secondary">Service Area</p>
                  <p className="text-lg font-medium text-foreground">{site.address}</p>
                  <p className="text-sm text-muted-foreground">We come to you — no showroom visits needed</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-black text-secondary">Hours</p>
                  <p className="text-lg font-medium text-foreground">Mon – Sat: 8 AM – 5 PM</p>
                  <p className="text-sm text-muted-foreground">Closed Sundays</p>
                </div>
              </li>
            </ul>
          </div>

          <div id="quote">
            <QuoteForm heading="Request a Free Quote" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
