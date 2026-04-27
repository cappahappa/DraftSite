import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  return (
    <PageLayout>
      <SEO
        title="Page Not Found | Elite Painting Solutions"
        description="The page you're looking for doesn't exist."
        canonicalPath="/404"
        noindex
      />
      <section className="flex min-h-[80vh] items-center justify-center bg-background pt-28">
        <div className="container-tight text-center">
          <p className="text-overline">404</p>
          <h1 className="heading-display mt-3 text-6xl text-secondary sm:text-7xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
            The page you're looking for has wandered off. Let's get you back home.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#111] px-7 py-3.5 font-display font-black tracking-wide text-white shadow-card transition-smooth hover:bg-primary"
          >
            Return Home
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
