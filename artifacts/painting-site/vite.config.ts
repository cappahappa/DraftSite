import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";
const isGhPages = process.env.GH_PAGES === "1";
const outDir = isGhPages
  ? path.resolve(import.meta.dirname, "..", "..", "docs")
  : path.resolve(import.meta.dirname, "dist/public");

// Expose the Gemini key to the client bundle. Vite normally only forwards
// VITE_*-prefixed env vars; this lets the existing GEMINI_API_KEY secret flow
// through without requiring the user to rename it. The site is a 100% static
// build (GitHub Pages), so the chatbot has to call Gemini directly from the
// browser — there is no server in production to proxy through.
const geminiKey =
  process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

export default defineConfig({
  base: basePath,
  define: {
    "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(geminiKey),
  },
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router")) return "router";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-hook-form") || id.includes("@hookform")) return "forms";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("recharts")) return "charts";
          if (id.includes("embla-carousel")) return "carousel";
          if (id.includes("react-day-picker") || id.includes("date-fns")) return "date";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return "react";
          }
          return "vendor";
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
