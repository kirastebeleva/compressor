import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { navSections, BRAND } from "@/core/config/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Imgloo handles your information. Files are processed in your browser and are not stored on our servers.",
  alternates: {
    canonical: "/privacy-policy/",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "Learn how Imgloo handles your information. Files are processed in your browser and are not stored on our servers.",
    url: `${BASE_URL}/privacy-policy/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />
      <main className="static-page">
        <div className="static-page-content">
          <h1>Privacy Policy</h1>
          <p className="static-page-updated">Last updated: March 2026</p>

          <p>
            This Privacy Policy explains how Imgloo handles information when you
            use our website.
          </p>

          <h2>File processing</h2>
          <p>
            Imgloo tools are designed to process files directly in your browser
            whenever possible.
          </p>
          <p>
            Images and documents that you upload for processing are not stored
            on our servers and are not permanently saved by Imgloo.
          </p>
          <p>
            This means your files typically remain on your device during
            processing.
          </p>

          <h2>Analytics</h2>
          <p>
            We may use analytics services to better understand how visitors use
            the website. These services may collect information such as:
          </p>
          <ul>
            <li>pages visited</li>
            <li>browser type</li>
            <li>device type</li>
            <li>general usage statistics</li>
          </ul>
          <p>
            This information is used only to improve the website and our tools.
          </p>
          <p>
            Analytics data does not include personal files processed through
            Imgloo tools.
          </p>

          <h2>Cookies</h2>
          <p>
            The website may use cookies or similar technologies to improve user
            experience and collect anonymous usage statistics.
          </p>
          <p>
            You can disable cookies in your browser settings if you prefer.
          </p>

          <h2>Third-party services</h2>
          <p>Imgloo may use third-party services such as:</p>
          <ul>
            <li>analytics providers</li>
            <li>website hosting services</li>
            <li>advertising services (such as Google AdSense)</li>
          </ul>
          <p>
            These services may collect limited technical information according
            to their own privacy policies.
          </p>

          <h2>Data security</h2>
          <p>
            We aim to minimize the amount of data collected and do not store
            user files used with our tools.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            This Privacy Policy may be updated from time to time. Updated
            versions will be published on this page.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy, you can contact us
            at:
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
