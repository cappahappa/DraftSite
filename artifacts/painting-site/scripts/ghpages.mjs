// GitHub Pages finishing step.
//
// Runs AFTER vite build + the SEO postbuild step when GH_PAGES=1.
// Vite outputs to <repo-root>/docs in that mode (configured in vite.config.ts).
//
// This script:
//   1. Writes a `.nojekyll` file so GitHub Pages serves files starting with `_`
//      (Vite emits its assets under `/assets/` but underscores in chunk names
//      and other edge cases are common — `.nojekyll` is the safe default).
//   2. Writes a `404.html` that is a copy of the prerendered home `index.html`,
//      so any unknown URL on GitHub Pages still serves the SPA shell. The
//      client-side router (BrowserRouter) then renders the matching route, or
//      the in-app NotFound page if nothing matches.
//
// The user can serve <repo-root>/docs from GitHub Pages settings:
//   Settings → Pages → Source: "Deploy from a branch"
//   Branch: main   Folder: /docs

import { copyFile, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");
const DOCS = resolve(ROOT, "docs");

const fileExists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  if (!(await fileExists(DOCS))) {
    console.error(`[ghpages] docs/ directory not found at ${DOCS}`);
    process.exitCode = 1;
    return;
  }

  // .nojekyll
  await writeFile(resolve(DOCS, ".nojekyll"), "", "utf8");
  console.log("[ghpages] wrote .nojekyll");

  // 404.html — serves the SPA shell for unknown URLs so client routing works.
  const indexPath = resolve(DOCS, "index.html");
  if (await fileExists(indexPath)) {
    await copyFile(indexPath, resolve(DOCS, "404.html"));
    console.log("[ghpages] wrote 404.html (SPA fallback)");
  }

  console.log("[ghpages] done. Output ready at", DOCS);
};

main().catch((err) => {
  console.error("[ghpages] failed:", err);
  process.exit(1);
});
