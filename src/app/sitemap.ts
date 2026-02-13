import type { MetadataRoute } from "next";
import { allPages } from "@/core/config/pages.config";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://compressor.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages.map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.intent === "base" ? 1.0 : 0.8,
  }));
}
