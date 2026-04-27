# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **painting-site** (`/`) — Elite Painting Solutions marketing site (React + Vite + wouter). Cloned from `cappahappa/pleaseworksite` and customized:
  - SEO + GEO optimized (per-page titles/meta in `scripts/postbuild.mjs`, JSON-LD via `lib/seo.ts`, FAQ + Service schema on blog posts and area pages)
  - Hero updated to "PROFESSIONAL PAINTING SERVICES IN VERO BEACH, FL."
  - Reviews replaced with 9 real Google reviews; cards link to the company's Google Maps reviews URL (`site.googleReviewsUrl` in `src/data/site.ts`)
  - Service Areas restricted to Indian River County: Sebastian, Vero Beach, Indian River Shores, Fellsmere, Wabasso, Roseland, Gifford, Florida Ridge, Vero Lake Estates, Winter Beach (defined as `Area[] = {name, slug}` in `src/data/site.ts`; consumed by `Areas.tsx`, `AreaPage.tsx`, `Header.tsx`, `lib/seo.ts`)
  - Areas map iframe centered on Vero Beach (`q=Vero+Beach,+FL&z=12`)
  - Blog posts have stock Unsplash hero images and full GEO-optimized long-form content (answer block, stats, FAQ + faqJsonLd)
