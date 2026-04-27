import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { navServices, navAreas, site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Header = ({ transparent = true }: { transparent?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSolid = !transparent || scrolled;

  const navItems: Array<{ label: string; href: string; menu?: { label: string; href: string }[] }> = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services", menu: navServices },
    { label: "Gallery", href: "/gallery" },
    {
      label: "Service Areas",
      href: "/#areas",
      menu: navAreas.map((a) => ({ label: a.name, href: `/areas/${a.slug}` })),
    },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-smooth",
        showSolid
          ? "bg-white/97 shadow-card backdrop-blur-md border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="container-tight flex h-24 items-center justify-between gap-4">
        <Logo variant={showSolid ? "dark" : "light"} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.menu && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                to={item.href}
                className={cn(
                  "group relative inline-flex items-center gap-1 whitespace-nowrap px-4 py-2 font-display text-sm font-bold tracking-wide transition-smooth",
                  showSolid ? "text-secondary hover:text-primary" : "text-white hover:text-primary-glow",
                )}
              >
                {item.label}
                {item.menu && (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                )}
                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-6" />
              </Link>

              {item.menu && openMenu === item.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 animate-slide-down">
                  <div className="min-w-[240px] overflow-hidden rounded-lg border border-border bg-popover shadow-elegant">
                    <div className="max-h-[60vh] overflow-y-auto py-2">
                      {item.menu.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          className="block px-4 py-2.5 text-sm font-medium text-popover-foreground transition-smooth hover:bg-muted hover:text-primary"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/contact#quote"
            aria-label="Open contact page and request a free painting quote"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-5 py-2.5 font-display text-sm font-black tracking-wide text-primary-foreground shadow-card transition-smooth hover:scale-[1.03] hover:shadow-glow"
          >
            GET FREE QUOTE
          </Link>
          <a
            href={site.phoneHref}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-md border-2 px-4 py-2 font-display text-sm font-black tracking-wide transition-smooth",
              showSolid
                ? "border-[#111] bg-background text-[#111] hover:bg-[#111] hover:text-white"
                : "border-white bg-transparent text-white hover:bg-white hover:text-secondary",
            )}
          >
            <Phone className="h-4 w-4 shrink-0" />
            {site.phone}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-md transition-smooth lg:hidden",
            showSolid ? "text-secondary hover:bg-muted" : "text-white hover:bg-white/10",
          )}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden animate-slide-down">
          <div className="container-tight max-h-[80vh] space-y-1 overflow-y-auto py-4">
            {navItems.map((item) => (
              <details key={item.label} className="group">
                <summary className="flex cursor-pointer items-center justify-between rounded-md px-3 py-3 font-display text-sm font-black tracking-wide text-secondary transition-smooth hover:bg-muted">
                  <Link to={item.href} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                  {item.menu && <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />}
                </summary>
                {item.menu && (
                  <div className="ml-3 max-h-64 overflow-y-auto border-l border-border pl-3 py-1">
                    {item.menu.map((s) => (
                      <Link
                        key={s.label}
                        to={s.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </details>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Link
                to="/contact#quote"
                onClick={() => setMobileOpen(false)}
                aria-label="Open contact page and request a free painting quote"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-display text-sm font-black tracking-wide text-primary-foreground shadow-card"
              >
                GET FREE QUOTE
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#111] bg-background px-4 py-3 font-display text-sm font-black tracking-wide text-[#111]"
              >
                <Phone className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
