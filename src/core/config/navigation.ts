import type { NavSection, NavSectionId, PageConfig } from "@/core/types";
import { allPages } from "@/core/config/pages.config";

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

export const SECTION_META: Record<NavSectionId, { label: string; order: number }> = {
  "image-tools": { label: "Compress Tools", order: 0 },
  "pdf-tools": { label: "PDF Tools", order: 1 },
  "converter-tools": { label: "Converter Tools", order: 2 },
};

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

export const BRAND = { label: "imgloo", href: "/" } as const;

// ---------------------------------------------------------------------------
// Sections visible in the header navigation.
// Add a section id here when it is ready to be shown publicly.
// ---------------------------------------------------------------------------

const VISIBLE_SECTIONS: readonly NavSectionId[] = ["image-tools"];

// ---------------------------------------------------------------------------
// Navigation sections built from page configs
// ---------------------------------------------------------------------------

export const navSections: readonly NavSection[] = buildNavSections();

function buildNavSections(): NavSection[] {
  const visibleSet = new Set<NavSectionId>(VISIBLE_SECTIONS);
  const grouped = new Map<NavSectionId, { href: string; label: string }[]>();

  for (const page of allPages) {
    if (!visibleSet.has(page.section)) continue;
    const items = grouped.get(page.section) ?? [];
    items.push({ href: `/${page.slug}`, label: page.navLabel });
    grouped.set(page.section, items);
  }

  return (
    Object.entries(SECTION_META) as [
      NavSectionId,
      (typeof SECTION_META)[NavSectionId],
    ][]
  )
    .sort(([, a], [, b]) => a.order - b.order)
    .filter(([id]) => grouped.has(id))
    .map(([id, meta]) => ({
      id,
      label: meta.label,
      items: grouped.get(id)!,
    }));
}

// ---------------------------------------------------------------------------
// Footer links — top pages per section for site-wide footer
// ---------------------------------------------------------------------------

export type FooterSection = {
  label: string;
  links: readonly { href: string; label: string }[];
};

const MAX_FOOTER_LINKS_PER_SECTION = 5;

/** Active (browser-compression) pages rank higher than stubs. */
function footerScore(page: PageConfig): number {
  let s = 0;
  if (page.intent === "base") s += 10;
  if (page.tool.mode === "browser-compression") s += 5;
  if (page.intent.startsWith("format")) s += 3;
  if (page.intent.startsWith("platform")) s += 2;
  return s;
}

export const footerSections: readonly FooterSection[] = buildFooterSections();

function buildFooterSections(): FooterSection[] {
  const grouped = new Map<NavSectionId, PageConfig[]>();

  for (const page of allPages) {
    const arr = grouped.get(page.section) ?? [];
    arr.push(page);
    grouped.set(page.section, arr);
  }

  return (
    Object.entries(SECTION_META) as [
      NavSectionId,
      (typeof SECTION_META)[NavSectionId],
    ][]
  )
    .sort(([, a], [, b]) => a.order - b.order)
    .filter(([id]) => grouped.has(id))
    .map(([id, meta]) => ({
      label: meta.label,
      links: grouped
        .get(id)!
        .sort((a, b) => footerScore(b) - footerScore(a))
        .slice(0, MAX_FOOTER_LINKS_PER_SECTION)
        .map((p) => ({ href: `/${p.slug}`, label: p.navLabel })),
    }));
}
