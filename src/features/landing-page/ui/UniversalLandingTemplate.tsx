import Link from "next/link";
import type { PageConfig } from "@/core/types";
import { navSections, BRAND, SECTION_META } from "@/core/config/navigation";
import { ToolRuntime } from "@/tool-page/tool-runtime";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

type Props = {
  config: PageConfig;
};

export function UniversalLandingTemplate({ config }: Props) {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />

      <main>
        <Breadcrumbs config={config} />

        {/* Hero */}
        <section className="hero">
          <h1 className="page-title">{config.h1}</h1>
          <p className="hero-subtitle">{config.hero.subtitle}</p>
          {config.hero.trustBadges && config.hero.trustBadges.length > 0 && (
            <p className="trust-line">
              {config.hero.trustBadges.map((badge, index) => (
                <span key={badge}>
                  {index > 0 && (
                    <span aria-hidden="true" className="trust-separator">
                      &bull;
                    </span>
                  )}
                  <span className="trust-badge">{badge}</span>
                </span>
              ))}
            </p>
          )}
        </section>

        {/* Tool + Results */}
        <ToolRuntime config={config} />

        {/* SEO content blocks */}
        {config.seoContent?.blocks.map((section) => (
          <section
            className="card content-section"
            id={section.id}
            key={section.id}
          >
            <h2 className="section-title">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p className="body-text" key={`${section.id}-${index}`}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {/* FAQ */}
        {config.faq && (
          <section className="card">
            <h2 className="section-title">{config.faq.title}</h2>
            {config.faq.items.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="faq-icon">
                    +
                  </span>
                </summary>
                <p className="body-text">{item.answer}</p>
              </details>
            ))}
          </section>
        )}

        {/* Related tools */}
        {config.related && (
          <section className="card">
            <h2 className="section-title">{config.related.title}</h2>
            <div className="related-list">
              {config.related.links.map((link) => (
                <Link
                  className="related-link"
                  href={link.href}
                  key={link.href}
                >
                  <strong>{link.label}</strong>
                  <span className="muted">{link.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SiteFooter />

        {/* FAQ structured data */}
        {config.faq && (
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildFaqSchema(config)),
            }}
            type="application/ld+json"
          />
        )}

        {/* BreadcrumbList structured data */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildBreadcrumbSchema(config)),
          }}
          type="application/ld+json"
        />

        {/* WebApplication structured data */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebAppSchema(config)),
          }}
          type="application/ld+json"
        />
      </main>
    </>
  );
}

function buildFaqSchema(config: PageConfig): Record<string, unknown> {
  if (!config.faq) return {};
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(config: PageConfig): Record<string, unknown> {
  const sectionLabel = SECTION_META[config.section]?.label ?? config.section;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionLabel,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.h1,
        item: `${BASE_URL}/${config.slug}`,
      },
    ],
  };
}

function buildWebAppSchema(config: PageConfig): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.tool.title,
    description: config.meta.description,
    url: `${BASE_URL}/${config.slug}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
