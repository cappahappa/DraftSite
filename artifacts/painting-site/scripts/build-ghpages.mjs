// Single-entry GitHub Pages build pipeline.
//
// Sets the env vars vite + the postbuild scripts need (so they apply to
// every step), then runs vite build → SEO postbuild → GH Pages finishing
// (.nojekyll + 404.html).
//
// Override BASE_PATH if you're deploying to https://<user>.github.io/<repo>/
// instead of a custom domain or user/org root:
//   BASE_PATH=/your-repo-name/ pnpm --filter @workspace/painting-site run build:ghpages

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const env = {
  ...process.env,
  GH_PAGES: "1",
  BASE_PATH: process.env.BASE_PATH || "/",
  PORT: process.env.PORT || "5173",
  NODE_ENV: process.env.NODE_ENV || "production",
};

const run = (cmd, args, label) => {
  console.log(`\n[build:ghpages] → ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    env,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`[build:ghpages] step failed: ${label}`);
    process.exit(result.status ?? 1);
  }
};

run("npx", ["vite", "build", "--config", "vite.config.ts"], "vite build");
run("node", ["scripts/postbuild.mjs"], "SEO postbuild (sitemap + per-route HTML)");
run("node", ["scripts/ghpages.mjs"], "GitHub Pages finishing (.nojekyll + 404.html)");

console.log("\n[build:ghpages] all steps complete. Output: <repo-root>/docs");
