import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { FAQ } from "@/components/sections/FAQ";
import { Areas } from "@/components/sections/Areas";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { site, faqs } from "@/data/site";
import { localBusinessJsonLd, faqJsonLd } from "@/lib/seo";

const ChatBubble = lazy(() =>
  import("@/components/ChatBubble").then((m) => ({ default: m.ChatBubble }))
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Elite Painting Solutions | Vero Beach FL Painters"
        description="Vero Beach FL painters for interior, exterior, cabinet & commercial work. Licensed, insured, 30+ years. Free same-day estimate — call today."
        canonicalPath="/"
        jsonLd={[localBusinessJsonLd(), faqJsonLd(faqs)]}
      />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Process />
        <Gallery />
        <Reviews />
        <FAQ />
        <Areas />
        <CTA />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>
    </div>
  );
};

export default Index;
