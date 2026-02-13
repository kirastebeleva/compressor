import type { Metadata } from "next";
import type { PageConfig } from "@/core/types";

export function buildToolPageMetadata(config: PageConfig): Metadata {
  return {
    title: config.meta.title,
    description: config.meta.description,
    alternates: {
      canonical: config.meta.canonical ?? `/${config.slug}`,
    },
  };
}
