import { allPages, getPageBySlug } from "@/core/config/pages.config";
import type { PageConfig } from "@/core/types";

export type SitemapEntryRow = {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
};

const HUB_SLUGS = new Set(["compress-image"]);
const CONVERT_PDF_SLUG = "convert-pdf";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";
}

export function buildDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getPriority(page: PageConfig): number {
  if (HUB_SLUGS.has(page.slug)) return 1.0;

  if (
    page.intent === "convert" ||
    page.intent === "batch" ||
    page.intent === "pdf-convert" ||
    page.intent.startsWith("pdf-convert-")
  ) {
    return 0.9;
  }

  const coreIntents = new Set(["resize", "crop", "rotate", "flip", "watermark"]);
  if (coreIntents.has(page.intent)) return 0.8;

  if (page.intent.startsWith("convert-")) return 0.8;

  if (page.intent === "size" || page.intent.startsWith("size-")) return 0.7;
  if (page.intent.startsWith("generic-") || page.intent.startsWith("batch-")) return 0.7;

  if (page.intent.startsWith("resize-platform-")) return 0.7;

  return 0.6;
}

function getChangeFrequency(page: PageConfig): string {
  if (HUB_SLUGS.has(page.slug)) return "weekly";
  if (page.section === "converter-tools") return "monthly";
  return "monthly";
}

function toolUrl(baseUrl: string, slug: string): string {
  return `${baseUrl}/${slug}/`;
}

function normalizeCanonicalPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

function hasSelfCanonical(page: PageConfig): boolean {
  const canonicalPath = normalizeCanonicalPath(
    page.meta.canonical ?? `/${page.slug}`,
  );
  return canonicalPath === `/${page.slug}/`;
}

function pageToRow(
  baseUrl: string,
  page: PageConfig,
  lastmod: string,
): SitemapEntryRow {
  return {
    url: toolUrl(baseUrl, page.slug),
    lastmod,
    changefreq: getChangeFrequency(page),
    priority: getPriority(page),
  };
}

/**
 * Same URL set and priorities as the former `app/sitemap.ts` (non-stub tools + static pages + home).
 * Used to generate `public/sitemap.xml` and keep it aligned with `pages.config`.
 */
export function getSitemapEntries(options?: {
  baseUrl?: string;
  lastmod?: string;
}): SitemapEntryRow[] {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const lastmod = options?.lastmod ?? buildDateString();

  const pages = allPages
    .filter((page) => page.tool.mode !== "stub" && hasSelfCanonical(page))
    .map((page) => pageToRow(baseUrl, page, lastmod));

  const convertPdf = getPageBySlug(CONVERT_PDF_SLUG);
  const convertPdfUrl = toolUrl(baseUrl, CONVERT_PDF_SLUG);
  if (
    convertPdf &&
    convertPdf.tool.mode !== "stub" &&
    !pages.some((entry) => entry.url === convertPdfUrl)
  ) {
    pages.push(pageToRow(baseUrl, convertPdf, lastmod));
  }

  const staticPages: SitemapEntryRow[] = [
    {
      url: `${baseUrl}/about/`,
      lastmod,
      changefreq: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastmod,
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/`,
      lastmod,
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact/`,
      lastmod,
      changefreq: "yearly",
      priority: 0.4,
    },
  ];

  return [
    {
      url: `${baseUrl}/`,
      lastmod,
      changefreq: "weekly",
      priority: 1.0,
    },
    ...pages,
    ...staticPages,
  ];
}
