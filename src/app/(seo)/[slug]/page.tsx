import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages, getPageBySlug } from "@/core/config/pages.config";
import { UniversalLandingTemplate } from "@/features/landing-page/ui/UniversalLandingTemplate";

/**
 * The "compress-image" slug is served by the static route
 * at app/compress-image/page.tsx (thin alias). Exclude it here
 * to avoid route conflicts.
 */
const STATIC_ROUTE_SLUGS = new Set(["compress-image"]);

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return allPages
    .filter((p) => !STATIC_ROUTE_SLUGS.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const config = getPageBySlug(slug);
  if (!config) return {};

  return {
    title: config.meta.title,
    description: config.meta.description,
    alternates: {
      canonical: config.meta.canonical ?? `/${config.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function SeoPage(props: PageProps) {
  const { slug } = await props.params;
  const config = getPageBySlug(slug);
  if (!config) notFound();

  return <UniversalLandingTemplate config={config} />;
}
