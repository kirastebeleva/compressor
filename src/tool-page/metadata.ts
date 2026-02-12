import type { Metadata } from "next";
import type { ToolPageConfig } from "@/tool-page/types";

export function buildToolPageMetadata(config: ToolPageConfig): Metadata {
  return {
    title: config.seo.title,
    description: config.seo.description,
    alternates: {
      canonical: config.seo.canonical,
    },
  };
}
