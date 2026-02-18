import type { NavSection, NavSectionId } from "@/core/types";
import { allPages } from "@/core/config/pages.config";

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

const SECTION_META: Record<NavSectionId, { label: string; order: number }> = {
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
