import type { Metadata } from "next";
import { getPageBySlug } from "@/core/config/pages.config";
import { buildToolPageMetadata } from "@/tool-page/metadata";
import { UniversalLandingTemplate } from "@/features/landing-page/ui/UniversalLandingTemplate";

const config = getPageBySlug("compress-image")!;

export const metadata: Metadata = buildToolPageMetadata(config);

export default function CompressImagePage() {
  return <UniversalLandingTemplate config={config} />;
}
