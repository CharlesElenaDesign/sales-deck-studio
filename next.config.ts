import type { NextConfig } from "next";

/**
 * Two build modes:
 *  - default (local / any Node host): full app incl. the /api/brand-research server route.
 *  - GITHUB_PAGES=true: static export for GitHub Pages under /<repo>/ — no server route, so the
 *    live brand scan is off and the app relies on the curated client list (see page.tsx).
 */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "sales-deck-studio";
const basePath = isPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isPages ? "true" : "false",
  },
};

export default nextConfig;
