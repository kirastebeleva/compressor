"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomeHubCategory, HomeHubToolCard } from "@/core/config/home-hub";
import { HomeHubToolIcon } from "@/features/home-page/ui/home-hub-icons";

type TabId = "all" | HomeHubCategory;

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "optimize", label: "Optimize" },
  { id: "pdf", label: "PDF" },
  { id: "convert", label: "Convert" },
];

type Props = {
  tools: HomeHubToolCard[];
};

export function HomeHubToolsClient({ tools }: Props) {
  const [tab, setTab] = useState<TabId>("all");

  const filtered =
    tab === "all"
      ? tools
      : tools.filter((t) => t.category === tab);

  return (
    <div className="home-hub-tools">
      <div
        className="home-hub-tabs"
        role="tablist"
        aria-label="Tool categories"
      >
        {TABS.map(({ id, label }) => {
          const selected = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={
                selected ? "home-hub-tab home-hub-tab-active" : "home-hub-tab"
              }
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        className="home-hub-product-grid"
        role="tabpanel"
        aria-live="polite"
      >
        {filtered.map((t) => (
          <Link
            className={`home-hub-product-card home-hub-product-card--${t.category}`}
            href={`/${t.slug}/`}
            key={t.slug}
          >
            <div className="home-hub-product-card-accent" aria-hidden />
            <div className="home-hub-product-card-body">
              <div
                className={`home-hub-product-icon-wrap home-hub-product-icon-wrap--${t.category}`}
              >
                <HomeHubToolIcon
                  className="home-hub-product-icon"
                  slug={t.slug}
                />
              </div>
              <h3 className="home-hub-product-title">{t.navLabel}</h3>
              <p className="home-hub-product-desc">{t.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
