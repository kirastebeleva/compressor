import type { PageConfig } from "@/core/types";

const MAX_RELATED = 5;

/**
 * Fills in `related` links for every page that doesn't already specify them.
 * Strategy: same section first (hub page + diverse intents), then cross-section.
 * Pages that already define `related` are left untouched.
 */
export function hydrateRelatedLinks(
  pages: readonly PageConfig[],
): PageConfig[] {
  return pages.map((page) => {
    if (page.related) return page as PageConfig;
    return { ...page, related: buildRelated(page, pages) };
  });
}

function buildRelated(
  current: PageConfig,
  all: readonly PageConfig[],
): PageConfig["related"] {
  const candidates = all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ page: p, score: score(current, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RELATED);

  return {
    title: "Related Tools",
    links: candidates.map((c) => ({
      href: `/${c.page.slug}`,
      label: c.page.navLabel,
      description: c.page.meta.description.slice(0, 80),
    })),
  };
}

function score(current: PageConfig, candidate: PageConfig): number {
  let s = 0;

  if (candidate.section === current.section) s += 10;
  if (candidate.intent === "base") s += 5;

  const curCat = current.intent.split("-")[0];
  const canCat = candidate.intent.split("-")[0];
  if (curCat === canCat && candidate.intent !== current.intent) s += 3;
  if (curCat !== canCat) s += 1;

  if (candidate.tool.mode === "browser-compression") s += 2;

  return s;
}
