import type { Metadata } from "next";
import { getPageBySlug } from "@/core/config/pages.config";
import { buildToolPageMetadata } from "@/tool-page/metadata";
import { UniversalLandingTemplate } from "@/features/landing-page/ui/UniversalLandingTemplate";
import { LandingErrorBoundary } from "@/features/landing-page/ui/ErrorBoundary";

const config = getPageBySlug("compress-image")!;

export const metadata: Metadata = buildToolPageMetadata(config);

export default function HomePage() {
  return (
    <LandingErrorBoundary slug={config.slug}>
      <UniversalLandingTemplate config={config} />
    </LandingErrorBoundary>
  );
}
