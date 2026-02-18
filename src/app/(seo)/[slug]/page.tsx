import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages, getPageBySlug } from "@/core/config/pages.config";
import { buildToolPageMetadata } from "@/tool-page/metadata";
import { UniversalLandingTemplate } from "@/features/landing-page/ui/UniversalLandingTemplate";
import { LandingErrorBoundary } from "@/features/landing-page/ui/ErrorBoundary";

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

export const dynamicParams = false;

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

  return buildToolPageMetadata(config);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function SeoPage(props: PageProps) {
  const { slug } = await props.params;
  const config = getPageBySlug(slug);
  if (!config) notFound();

  return (
    <LandingErrorBoundary slug={config.slug}>
      <UniversalLandingTemplate config={config} />
    </LandingErrorBoundary>
  );
}
