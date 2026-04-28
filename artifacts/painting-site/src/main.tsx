import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Global scroll-reveal: any element with [data-reveal] fades up when entering view.
// Uses a single shared IntersectionObserver and re-observes new nodes via MutationObserver
// so client-side route changes pick up freshly mounted elements automatically.
if (typeof window !== "undefined" && "IntersectionObserver" in window) {
  const seen = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  const observeAll = (root: ParentNode = document) => {
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      // If already in view on load, reveal immediately to avoid a flash.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });
  };

  const init = () => {
    observeAll();
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches?.("[data-reveal]")) observeAll(node.parentNode ?? document);
            observeAll(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
