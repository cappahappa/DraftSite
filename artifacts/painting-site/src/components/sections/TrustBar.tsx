type Brand = {
  name: string;
  href: string;
  Wordmark: () => React.ReactElement;
};

const GoogleMark = () => (
  <span className="font-sans text-3xl font-medium leading-none tracking-tight">
    Google
  </span>
);

const FacebookMark = () => (
  <span className="flex items-center gap-2 font-sans text-3xl font-extrabold italic leading-none tracking-tight">
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.79-4.685 4.532-4.685 1.313 0 2.686.235 2.686.235v2.97h-1.514c-1.49 0-1.955.93-1.955 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
    facebook
  </span>
);

const YelpMark = () => (
  <span className="flex items-baseline gap-1 font-sans text-3xl font-extrabold leading-none tracking-tight">
    yelp
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
      <circle cx="12" cy="12" r="12" />
    </svg>
  </span>
);

const NextdoorMark = () => (
  <span className="flex items-center gap-2 font-sans text-3xl font-extrabold leading-none tracking-tight">
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
      <path d="M12 2 2 11h3v9h5v-6h4v6h5v-9h3z" />
    </svg>
    nextdoor
  </span>
);

const brands: Brand[] = [
  {
    name: "Google",
    href: "https://share.google/DRW7z7hFTI5CgQYNr",
    Wordmark: GoogleMark,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/p/Elite-Painting-Solutions-LLC-100089082444461/",
    Wordmark: FacebookMark,
  },
  {
    name: "Yelp",
    href: "https://www.yelp.com/biz/elite-painting-solutions-vero-beach-2",
    Wordmark: YelpMark,
  },
  {
    name: "Nextdoor",
    href: "https://nextdoor.com/pages/elite-painting-solutions-llc-vero-beach-fl/",
    Wordmark: NextdoorMark,
  },
];

export const TrustBar = () => {
  // Triple the list so the marquee loops seamlessly on wide screens
  // (keyframe translates by -33.3333% which equals exactly one copy width)
  const loop = [...brands, ...brands, ...brands];
  return (
    <section
      aria-label="As reviewed and trusted on"
      className="border-y border-border bg-white py-8"
    >
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        Reviewed &amp; trusted on
      </p>
      <div className="eps-marquee-viewport relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <ul className="eps-marquee-track gap-16 whitespace-nowrap sm:gap-24">
          {loop.map((b, i) => {
            const Mark = b.Wordmark;
            return (
              <li key={`${b.name}-${i}`} className="flex shrink-0 items-center">
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Elite Painting Solutions on ${b.name}`}
                  className="text-gray-300 transition-colors duration-200 hover:text-gray-600 focus-visible:text-gray-700 focus-visible:outline-none"
                >
                  <Mark />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
