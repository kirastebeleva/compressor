import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { navSections, BRAND } from "@/core/config/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the Terms of Use for Imgloo. By using Imgloo tools, you agree to these terms.",
  alternates: {
    canonical: "/terms/",
  },
  openGraph: {
    title: "Terms of Use",
    description:
      "Read the Terms of Use for Imgloo. By using Imgloo tools, you agree to these terms.",
    url: `${BASE_URL}/terms/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />
      <main className="static-page">
        <div className="static-page-content">
          <h1>Terms of Use</h1>
          <p className="static-page-updated">Last updated: March 2026</p>

          <p>
            By accessing or using Imgloo, you agree to the following terms.
          </p>

          <h2>Use of the service</h2>
          <p>
            Imgloo provides online tools for processing images and documents.
          </p>
          <p>
            The service is provided free of charge and may change or evolve over
            time.
          </p>
          <p>
            Users may use the tools for personal or professional purposes.
          </p>

          <h2>No warranty</h2>
          <p>
            Imgloo is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis.
          </p>
          <p>
            We do not guarantee that the service will always be available,
            error-free, or suitable for every purpose.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            Imgloo and its operators are not responsible for any loss, damage,
            or issues resulting from the use of the website or its tools.
          </p>
          <p>
            Users are responsible for verifying the results produced by the
            tools before using them in important workflows.
          </p>

          <h2>Changes to the service</h2>
          <p>
            We may modify, update, or discontinue parts of the service at any
            time without prior notice.
          </p>

          <h2>Changes to the terms</h2>
          <p>
            These Terms of Use may be updated periodically. Continued use of
            the website after changes means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms, you can contact us at:
          </p>
          <p>
            <a href="mailto:contact@imgloo.com">contact@imgloo.com</a>
          </p>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
