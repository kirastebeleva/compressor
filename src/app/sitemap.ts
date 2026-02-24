import type { MetadataRoute } from "next";
import { allPages } from "@/core/config/pages.config";

export const dynamic = "force-static";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

const BUILD_DATE = new Date().toISOString().split("T")[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = allPages.map((page) => ({
    url: `${BASE_URL}/${page.slug}/`,
    lastModified: BUILD_DATE,
  }));

  return [{ url: `${BASE_URL}/`, lastModified: BUILD_DATE }, ...pages];
}
