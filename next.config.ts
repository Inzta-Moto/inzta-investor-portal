import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is rendered by the SDD adapters (`npm run adapters:sync`); next dev must not append to it.
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The portal is view-only and confidential (Pasal 7 ayat 3): no embedding in other sites, no search indexing.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
