import type { Metadata } from "next";
import type { PageConfig } from "@/core/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

/** Matches `trailingSlash: true` in next.config — canonicals must match real URLs and sitemap. */
function normalizeCanonicalPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

export function buildToolPageMetadata(config: PageConfig): Metadata {
  const canonicalPath = normalizeCanonicalPath(
    config.meta.canonical ?? `/${config.slug}`,
  );
  const pageUrl = `${BASE_URL}${canonicalPath}`;

  return {
    title: config.meta.title,
    description: config.meta.description,
    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      url: pageUrl,
      siteName: "imgloo",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },

    twitter: {
      card: "summary_large_image",
      title: config.meta.title,
      description: config.meta.description,
      images: [DEFAULT_OG_IMAGE],
    },

    ...(config.tool.mode === "stub" && {
      robots: { index: false, follow: true },
    }),
  };
}
