import { processSteps } from "@/data/site";

export const Process = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden py-20 text-white lg:py-28"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.6), transparent 50%)",
        }}
      />
      <div className="container-tight relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-overline text-primary">Our Process</span>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            SIMPLE. CLEAR. FAST.
          </h2>
          <p className="mt-4 text-white/75">
            Our process is simple and only takes a few easy steps.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <div
              key={step.n}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.08]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 font-display text-6xl font-black text-primary/40 transition-smooth group-hover:text-primary">
                {step.n}
              </div>
              <h3 className="heading-display text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
