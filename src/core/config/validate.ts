import type { PageConfig } from "@/core/types";

/**
 * Slug must be lowercase, hyphen-separated, no leading/trailing slash.
 * Examples: "compress-image", "pdf-to-jpg", "heic-to-jpg"
 */
const SLUG_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/**
 * Words forbidden in slugs per PROJECT_RULES §2.3.
 * Synonyms of "compress" that would create near-duplicate pages.
 */
const FORBIDDEN_SLUG_WORDS: readonly string[] = [
  "reduce",
  "shrink",
  "optimize",
  "optimise",
  "minify",
  "minimize",
  "minimise",
  "photo",   // use "image" instead
  "picture", // use "image" instead
];

/**
 * Validates all page configs at import time.
 * Throws a descriptive error when any rule is violated
 * so the build fails immediately with a clear message.
 */
export function validatePageConfigs(pages: readonly PageConfig[]): void {
  const slugs = new Set<string>();
  const intents = new Set<string>();
  const errors: string[] = [];

  for (const page of pages) {
    // Slug format
    if (!SLUG_PATTERN.test(page.slug)) {
      errors.push(
        `Invalid slug "${page.slug}": must be lowercase, hyphen-separated, no leading slash.`
      );
    }

    // Forbidden synonym words (PROJECT_RULES §2.3)
    const slugWords = page.slug.split("-");
    for (const word of slugWords) {
      if (FORBIDDEN_SLUG_WORDS.includes(word)) {
        errors.push(
          `Forbidden word "${word}" in slug "${page.slug}". See PROJECT_RULES §2.3 (no synonyms).`
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
  }

  if (errors.length > 0) {
    throw new Error(
      `Page config validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}
