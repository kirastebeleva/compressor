import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Synonym verbs and noun variants that must 301-redirect to canonical slugs.
 * See PROJECT_RULES §2.3 and §2.4.
 */
const SYNONYM_VERBS = [
  "reduce",
  "shrink",
  "optimize",
  "optimise",
  "minify",
  "minimize",
  "minimise",
];

const SYNONYM_NOUNS = ["photo", "picture", "pic"];

function buildSynonymRedirects() {
  const redirects: {
    source: string;
    destination: string;
    permanent: boolean;
  }[] = [];

  for (const verb of SYNONYM_VERBS) {
    redirects.push({
      source: `/${verb}-image`,
      destination: "/compress-image",
      permanent: true,
    });
    for (const noun of SYNONYM_NOUNS) {
      redirects.push({
        source: `/${verb}-${noun}`,
        destination: "/compress-image",
        permanent: true,
      });
    }
  }

  for (const noun of SYNONYM_NOUNS) {
    redirects.push({
      source: `/compress-${noun}`,
      destination: "/compress-image",
      permanent: true,
    });
  }

  return redirects;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      ...buildSynonymRedirects(),

      // Cannibalization merges (Phase 7)
      {
        source: "/compress-image-for-web",
        destination: "/compress-image-for-website",
        permanent: true,
      },

      // Common misspellings / alternative patterns
      {
        source: "/image-compressor",
        destination: "/compress-image",
        permanent: true,
      },
      {
        source: "/image-compression",
        destination: "/compress-image",
        permanent: true,
      },
      {
        source: "/jpg-compressor",
        destination: "/compress-jpg",
        permanent: true,
      },
      {
        source: "/png-compressor",
        destination: "/compress-png",
        permanent: true,
      },
      {
        source: "/webp-compressor",
        destination: "/compress-webp",
        permanent: true,
      },
    ];
  },
};

const sentryConfig = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});

// Keep local DX stable: Sentry's webpack integration can break dev HMR/cache.
export default process.env.NODE_ENV === "production" ? sentryConfig : nextConfig;
