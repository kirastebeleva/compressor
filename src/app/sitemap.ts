import type { MetadataRoute } from "next";
import { allPages } from "@/core/config/pages.config";
import type { ToolIntent } from "@/core/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

const BUILD_DATE = new Date().toISOString();

function intentPriority(intent: ToolIntent, mode: string): number {
  if (mode === "stub") return 0.5;
  if (intent === "base") return 1.0;
  if (intent.startsWith("format")) return 0.9;
  if (intent.startsWith("size") || intent.startsWith("platform")) return 0.8;
  if (intent.startsWith("batch")) return 0.7;
  if (intent.startsWith("generic")) return 0.6;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages.map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: intentPriority(page.intent, page.tool.mode),
  }));
}
