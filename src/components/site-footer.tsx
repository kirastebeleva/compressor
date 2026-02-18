import Link from "next/link";
import { footerSections } from "@/core/config/navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer-v2">
      <div className="footer-sections">
        {footerSections.map((section) => (
          <div className="footer-section" key={section.label}>
            <h3 className="footer-section-title">{section.label}</h3>
            <ul className="footer-section-links">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link className="footer-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p className="muted">
          Browser-based tools for practical image and file optimization.
        </p>
        <nav className="footer-bottom-links" aria-label="Footer links">
          <Link className="footer-link" href="/">
            Home
          </Link>
          <Link className="footer-link" href="/compress-image">
            Compress Image
          </Link>
        </nav>
      </div>
    </footer>
  );
}
