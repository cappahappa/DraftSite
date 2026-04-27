import { useParams, Link, Navigate } from "react-router-dom";
import { Check, ArrowRight, Phone } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { SEO } from "@/components/SEO";
import { services, site } from "@/data/site";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const ServicePage = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) return <Navigate to="/404" replace />;

  return (
    <PageLayout>
      <SEO
        title={`${service.title} | Elite Painting Solutions — Licensed & Insured Painters`}
        description={`Professional ${service.title.toLowerCase()} from Elite Painting Solutions. ${service.description} Free estimates — fully licensed and insured. Call today.`}
        canonicalPath={service.href}
        jsonLd={[
          serviceJsonLd(service.title, service.description, service.slug),
          breadcrumbJsonLd([
            { name: "Services", path: "/#services" },
            { name: service.title, path: service.href },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Our Services"
        title={service.title}
        subtitle={service.description}
        breadcrumbs={[{ label: "Services", href: "/#services" }, { label: service.title }]}
        variant="service"
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <article>
            <h2 className="heading-display text-3xl text-secondary sm:text-4xl">
              Professional {service.title} You Can Count On
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{service.long}</p>

            <h3 className="heading-display mt-10 text-2xl text-secondary">What's Included</h3>
            <ul className="mt-5 space-y-3">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111] text-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border-l-4 border-[#111] bg-muted p-6">
              <p className="m-0 text-base leading-relaxed text-secondary">
                <strong>Ready to get started?</strong> Call{" "}
                <a href={site.phoneHref} className="font-bold text-primary">{site.phone}</a> for a free
                consultation, or fill out the form to get a same-day quote.
              </p>
            </div>

            <h3 className="heading-display mt-10 text-2xl text-secondary">Other Services We Offer</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.filter((s) => s.slug !== service.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={s.href}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-smooth hover:border-[#111] hover:shadow-card"
                >
                  <span className="font-display font-black text-secondary group-hover:text-[#111]">
                    {s.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <QuoteForm heading="Request This Service" />
            <a
              href={site.phoneHref}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-[#111] bg-background py-4 font-display font-black tracking-wide text-[#111] transition-smooth hover:bg-[#111] hover:text-white"
            >
              <Phone className="h-5 w-5" />
              Call {site.phone}
            </a>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServicePage;
