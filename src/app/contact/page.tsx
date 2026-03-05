import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { navSections, BRAND } from "@/core/config/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "Contact Imgloo",
  description:
    "Contact Imgloo for questions, feedback, bug reports, or feature requests.",
  alternates: {
    canonical: "/contact/",
  },
  openGraph: {
    title: "Contact Imgloo",
    description:
      "Contact Imgloo for questions, feedback, bug reports, or feature requests.",
    url: `${BASE_URL}/contact/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />
      <main className="static-page">
        <div className="static-page-content">
          <h1>Contact Imgloo</h1>

          <p>
            If you have questions, feedback, or suggestions about Imgloo tools,
            feel free to contact us.
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@imgloo.com">contact@imgloo.com</a>
          </p>

          <p>You can reach out for:</p>
          <ul>
            <li>bug reports</li>
            <li>feature requests</li>
            <li>questions about Imgloo tools</li>
            <li>partnership inquiries</li>
            <li>general feedback</li>
          </ul>

          <p>
            We welcome suggestions that help improve Imgloo and make our tools
            more useful.
          </p>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
