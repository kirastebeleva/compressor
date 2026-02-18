#!/usr/bin/env node

/**
 * Page config scaffolder — generates a PageConfig TypeScript export
 * from a minimal brief.
 *
 * Usage:
 *   node scripts/new-page.mjs \
 *     --slug compress-avif \
 *     --intent format-avif \
 *     --section image-tools \
 *     --label "Compress AVIF" \
 *     --h1 "Compress AVIF Images Online" \
 *     --mode stub \
 *     --defaults IMAGE_COMPRESS_TOOL_DEFAULTS
 *
 * Outputs a ready-to-paste TypeScript PageConfig to stdout.
 */

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    slug:     { type: "string" },
    intent:   { type: "string" },
    section:  { type: "string", default: "image-tools" },
    label:    { type: "string" },
    h1:       { type: "string" },
    mode:     { type: "string", default: "stub" },
    defaults: { type: "string", default: "IMAGE_COMPRESS_TOOL_DEFAULTS" },
    help:     { type: "boolean", default: false },
  },
  strict: true,
});

if (values.help || !values.slug || !values.intent || !values.label || !values.h1) {
  console.log(`
Page config scaffolder — generate a PageConfig from a brief.

Required flags:
  --slug        URL slug (e.g. "compress-avif")
  --intent      ToolIntent value (e.g. "format-avif")
  --label       Short nav label (e.g. "Compress AVIF")
  --h1          Page heading (e.g. "Compress AVIF Images Online")

Optional flags:
  --section     NavSectionId (default: "image-tools")
  --mode        ToolMode: "browser-compression" or "stub" (default: "stub")
  --defaults    Defaults constant name (default: "IMAGE_COMPRESS_TOOL_DEFAULTS")

Example:
  node scripts/new-page.mjs \\
    --slug compress-avif \\
    --intent format-avif \\
    --label "Compress AVIF" \\
    --h1 "Compress AVIF Images Online"
`);
  process.exit(0);
}

const { slug, intent, section, label, h1, mode, defaults } = values;

const varName = slug
  .split("-")
  .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
  .join("") + "Page";

const metaTitle = `${h1} - Free Tool`;
const metaDesc = `${h1.replace(" Online", "")} directly in your browser. Free, private, no signup required.`;

const output = `import type { PageConfig } from "@/core/types";
import {
  ${defaults},
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const ${varName}: PageConfig = {
  slug: "${slug}",
  intent: "${intent}",
  section: "${section}",
  navLabel: "${label}",
  h1: "${h1}",
  meta: {
    title: "${metaTitle}",
    description:
      "${metaDesc}",
  },
  hero: {
    subtitle:
      "TODO: Write a one-line subtitle for the hero section.",
    trustBadges: ["Free", "Browser-based", "Private", "No signup"],
  },
  tool: {
    ...${defaults},
    mode: "${mode}",
    title: "${label}",
    subtitle:
      "TODO: Write a short subtitle for the tool card.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "${slug}-why",
        title: "TODO: Why use this tool",
        paragraphs: [
          "TODO: First paragraph explaining the use case.",
          "TODO: Second paragraph with additional context.",
        ],
      },
      {
        id: "${slug}-how",
        title: "TODO: How it works",
        paragraphs: [
          "TODO: Explain the process briefly.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "TODO: First FAQ question?",
        answer: "TODO: Answer.",
      },
      {
        question: "TODO: Second FAQ question?",
        answer: "TODO: Answer.",
      },
      {
        question: "Is this tool free?",
        answer:
          "Yes. The tool is completely free with no account required. Processing happens locally in your browser.",
      },
    ],
  },
};
`;

console.log(output);
console.log(`// Don't forget to:`);
console.log(`// 1. Add ${varName} to the \`pages\` array in the appropriate file`);
console.log(`// 2. Replace all TODO placeholders with real content`);
console.log(`// 3. Run \`npx tsc --noEmit\` to verify`);
