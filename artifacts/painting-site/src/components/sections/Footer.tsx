import { Logo } from "../Logo";
import { navServices, site } from "@/data/site";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Service Areas", href: "/#areas" },
  { label: "Contact", href: "/contact" },
];

const hours = [
  { day: "Mon – Sat", time: "8:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export const Footer = () => {
  return (
    <footer style={{ background: "#0d0d0d" }} className="text-white">

      {/* Top banner — Logo + Hours | GET A FREE QUOTE */}
      <div className="border-b border-white/10">
        <div className="container-tight grid gap-10 py-14 lg:grid-cols-2 lg:gap-16">
          {/* Left: brand + hours */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              {site.name} — your trusted local painting professionals. Quality finishes,
              fair prices, and decades of expertise behind every project.
            </p>
            <div className="mt-8">
              <p className="font-display text-sm font-black uppercase tracking-widest text-primary">
                Working Hours
              </p>
              <ul className="mt-3 space-y-2">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between gap-6 border-b border-white/[0.06] py-2 text-sm">
                    <span className="flex items-center gap-2 text-white/70">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {h.day}
                    </span>
                    <span className="font-medium text-white/90">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: GET A FREE QUOTE CTA */}
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-primary">
              Ready to Transform Your Space?
            </p>
            <h3 className="heading-display mt-3 text-3xl text-white sm:text-4xl lg:text-5xl">
              GET A FREE QUOTE TODAY
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              No pressure, no hidden fees. Just a clear, honest estimate from a team
              that takes pride in every project.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                aria-label="Go to contact page to request a free painting quote"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-display text-sm font-black tracking-wide text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
              >
                GET FREE QUOTE <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={site.phoneHref}
                aria-label={`Call Elite Painting Solutions at ${site.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 font-display text-sm font-black tracking-wide text-white transition-smooth hover:border-primary hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Middle — 3 info columns */}
      <div className="border-b border-white/10">
        <div className="container-tight grid gap-10 py-12 sm:grid-cols-3">
          {/* Contact Us */}
          <div>
            <h4 className="footer-col-heading">
              <span className="block h-0.5 w-8 bg-primary" />
              CONTACT US
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href={site.phoneHref} className="flex items-start gap-3 text-white/75 transition-smooth hover:text-primary">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3 break-all text-white/75 transition-smooth hover:text-primary"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  Vero Beach, FL 32960
                  <br />
                  <span className="text-white/60">Serving Indian River County, FL</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-heading">
              <span className="block h-0.5 w-8 bg-primary" />
              QUICK LINKS
            </h4>
            <ul className="mt-5 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="group flex items-center gap-2 text-sm text-white/75 transition-smooth hover:text-primary"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-primary/50 transition-transform group-hover:translate-x-0.5" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="footer-col-heading">
              <span className="block h-0.5 w-8 bg-primary" />
              POPULAR SERVICES
            </h4>
            <ul className="mt-5 space-y-2.5">
              {navServices.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.href}
                    className="group flex items-center gap-2 text-sm text-white/75 transition-smooth hover:text-primary"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-primary/50 transition-transform group-hover:translate-x-0.5" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-tight flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="text-xs text-white/75">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>

        <div className="flex items-center gap-5 text-xs text-white/75">
          <Link to="/terms" className="hover:text-primary transition-smooth">Terms &amp; Conditions</Link>
          <Link to="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link>
        </div>

        {/* Social / review icons */}
        <div className="flex items-center gap-3">
          {/* Google */}
          <a
            href="https://share.google/DRW7z7hFTI5CgQYNr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on Google"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#4285F4]/60 hover:bg-[#4285F4]/15 hover:text-[#4285F4]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M21.35 11.1h-9.17v2.97h5.27c-.23 1.4-1.6 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.84 3.74 14.7 2.8 12.18 2.8 6.96 2.8 2.78 6.98 2.78 12.2s4.18 9.4 9.4 9.4c5.43 0 9.02-3.81 9.02-9.18 0-.62-.07-1.09-.15-1.32z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/p/Elite-Painting-Solutions-LLC-100089082444461/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on Facebook"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#1877F2]/60 hover:bg-[#1877F2]/15 hover:text-[#1877F2]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Yelp */}
          <a
            href="https://www.yelp.com/biz/elite-painting-solutions-vero-beach-2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on Yelp"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#D32323]/60 hover:bg-[#D32323]/15 hover:text-[#D32323]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M20.16 12.594l-4.995 1.433c-.96.275-1.766-.8-1.216-1.649l2.795-4.342c.547-.85 1.8-.653 2.073.32l1.283 4.648c.194.703-.29 1.39-.94 1.59zM11.364 15.77l-4.64 1.4c-.37.11-.74-.18-.72-.56.03-.36.3-.66.66-.71l4.81-.75c.72-.11 1.15.77.71 1.32l-.82.3zM12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5zm.78 13.53v3.24c0 .74-.84 1.17-1.44.73l-5.4-3.96c-.56-.41-.47-1.27.16-1.56l5.4-2.52c.66-.31 1.44.16 1.44.87v3.2z"/>
            </svg>
          </a>

          {/* Nextdoor */}
          <a
            href="https://nextdoor.com/pages/elite-painting-solutions-llc-vero-beach-fl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on Nextdoor"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#00B246]/60 hover:bg-[#00B246]/15 hover:text-[#00B246]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12 2L2 7l1.5 1.5L12 4.5l8.5 4 1.5-1.5L12 2zm0 3.5L5 9v11h4v-6h6v6h4V9l-7-3.5zm-1 8.5h2v4h-2v-4z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@elitepaintingsolutions"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on YouTube"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15 hover:text-[#FF0000]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/elitepaintingfl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elite Painting Solutions on X"
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-white/15 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
