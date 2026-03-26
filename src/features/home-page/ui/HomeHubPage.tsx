import { BRAND, navSections } from "@/core/config/navigation";
import {
  getHomeHubTools,
  toHomeHubToolCards,
} from "@/core/config/home-hub";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHubToolsClient } from "@/features/home-page/ui/HomeHubToolsClient";

export function HomeHubPage() {
  const tools = toHomeHubToolCards(getHomeHubTools());

  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />

      <main className="home-hub">
        <section className="home-hub-hero">
          <h1 className="home-hub-headline">
            Every tool you need to{" "}
            <span className="home-hub-headline-em">work with images</span>
          </h1>
          <p className="home-hub-lead">
            Compress, convert, resize, and edit — pick a category or browse all
            tools below.
          </p>
          <p className="trust-line home-hub-trust">
            <span className="trust-badge">Private</span>
            <span aria-hidden="true" className="trust-separator">
              &bull;
            </span>
            <span className="trust-badge">No signup</span>
          </p>
        </section>

        <HomeHubToolsClient tools={tools} />

        <SiteFooter />
      </main>
    </>
  );
}
