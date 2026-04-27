import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.webp";
import { site } from "@/data/site";

export const Logo = ({ className = "", variant = "auto" }: { className?: string; variant?: "auto" | "light" | "dark" }) => {
  return (
    <Link to="/" className={`group flex items-center ${className}`} aria-label={`${site.name} home`}>
      <img
        src={logoImg}
        alt={`${site.name} logo`}
        className="h-16 w-auto shrink-0 drop-shadow-md transition-transform group-hover:scale-105 sm:h-20"
        width={160}
        height={80}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
};
