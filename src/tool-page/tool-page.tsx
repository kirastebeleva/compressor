import Link from "next/link";
import type { ToolPageConfig } from "@/tool-page/types";
import { ToolRuntime } from "@/tool-page/tool-runtime";

type ToolPageProps = {
  config: ToolPageConfig;
};

export function ToolPage({ config }: ToolPageProps) {
  return (
    <main>
      <header className="card">
        <div className="row">
          <strong>{config.header.brandLabel}</strong>
          <nav aria-label={config.header.navAriaLabel} className="row">
            {config.header.links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="card">
        <h1>{config.hero.title}</h1>
        <p className="muted">{config.hero.subtitle}</p>
      </section>

      <ToolRuntime config={config} />

      {config.contentSections.map((section) => (
        <section className="card" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p className="muted" key={`${section.id}-${index}`}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section className="card">
        <h2>{config.faq.title}</h2>
        {config.faq.items.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p className="muted">{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="card">
        <h2>{config.relatedTools.title}</h2>
        <div className="related-list">
          {config.relatedTools.links.map((link) => (
            <Link className="related-link" href={link.href} key={link.href}>
              <strong>{link.label}</strong>
              <span className="muted">{link.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="card footer">
        <p className="muted">{config.footer.text}</p>
        <nav className="row" aria-label={config.footer.linksAriaLabel}>
          {config.footer.links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqSchema(config)),
        }}
        type="application/ld+json"
      />
    </main>
  );
}

function buildFaqSchema(config: ToolPageConfig): Record<string, unknown> {
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
