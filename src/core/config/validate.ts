import type { PageConfig } from "@/core/types";

const SLUG_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const FORBIDDEN_SLUG_WORDS: readonly string[] = [
  "reduce",
  "shrink",
  "optimize",
  "optimise",
  "minify",
  "minimize",
  "minimise",
  "photo",
  "picture",
];

const META_TITLE_MAX = 60;
const META_DESC_MAX = 160;

/**
 * Validates all page configs at import time.
 * Throws a descriptive error when any rule is violated
 * so the build fails immediately with a clear message.
 */
export function validatePageConfigs(pages: readonly PageConfig[]): void {
  const slugs = new Set<string>();
  const intents = new Set<string>();
  const h1s = new Set<string>();
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const page of pages) {
    // Slug format
    if (!SLUG_PATTERN.test(page.slug)) {
      errors.push(
        `Invalid slug "${page.slug}": must be lowercase, hyphen-separated, no leading slash.`
      );
    }

    // Forbidden synonym words (PROJECT_RULES §2.3)
    for (const word of page.slug.split("-")) {
      if (FORBIDDEN_SLUG_WORDS.includes(word)) {
        errors.push(
          `Forbidden word "${word}" in slug "${page.slug}". See PROJECT_RULES §2.3.`
        );
      }
    }

    // Unique slug
    if (slugs.has(page.slug)) {
      errors.push(`Duplicate slug: "${page.slug}".`);
    }
    slugs.add(page.slug);

    // Unique intent
    if (intents.has(page.intent)) {
      errors.push(
        `Duplicate intent: "${page.intent}" (slug "${page.slug}").`
      );
    }
    intents.add(page.intent);

    // Unique H1
    if (h1s.has(page.h1)) {
      errors.push(`Duplicate H1: "${page.h1}" (slug "${page.slug}").`);
    }
    h1s.add(page.h1);

    // Meta title length
    if (page.meta.title.length > META_TITLE_MAX) {
      warnings.push(
        `meta.title too long (${page.meta.title.length}/${META_TITLE_MAX}) on "${page.slug}".`
      );
    }

    // Meta description length
    if (page.meta.description.length > META_DESC_MAX) {
      warnings.push(
        `meta.description too long (${page.meta.description.length}/${META_DESC_MAX}) on "${page.slug}".`
      );
    }
  }

  // Related links: all hrefs must resolve to existing slugs
  const slugSet = new Set(pages.map((p) => p.slug));
  for (const page of pages) {
    if (!page.related) continue;
    for (const link of page.related.links) {
      const target = link.href.replace(/^\//, "");
      if (!slugSet.has(target)) {
        errors.push(
          `Broken related link "${link.href}" on "${page.slug}" — target slug not found.`
        );
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(
      `Page config warnings:\n${warnings.map((w) => `  ⚠ ${w}`).join("\n")}`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Page config validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}
