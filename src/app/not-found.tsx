import Link from "next/link";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { navSections, BRAND } from "@/core/config/navigation";

export default function NotFound() {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />

      <main>
        <section className="hero">
          <h1 className="page-title">Page Not Found</h1>
          <p className="hero-subtitle">
            The page you are looking for does not exist or has been moved.
          </p>
        </section>

        <section className="card">
          <h2 className="section-title">Popular Tools</h2>
          <div className="related-list">
            <Link className="related-link" href="/compress-image">
              <strong>Compress Image</strong>
              <span className="muted">
                Compress JPG, PNG, and WebP images in your browser.
              </span>
            </Link>
            <Link className="related-link" href="/compress-jpg">
              <strong>Compress JPG</strong>
              <span className="muted">
                Make JPG photos smaller without visible quality loss.
              </span>
            </Link>
            <Link className="related-link" href="/compress-png">
              <strong>Compress PNG</strong>
              <span className="muted">
                Reduce PNG file size while keeping transparency.
              </span>
            </Link>
            <Link className="related-link" href="/compress-image-for-email">
              <strong>Compress for Email</strong>
              <span className="muted">
                Get images ready for email attachment limits.
              </span>
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
