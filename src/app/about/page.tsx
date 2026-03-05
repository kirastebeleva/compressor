import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { navSections, BRAND } from "@/core/config/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "About Imgloo",
  description:
    "Imgloo is a collection of simple online tools for working with images and documents directly in your browser.",
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "About Imgloo",
    description:
      "Imgloo is a collection of simple online tools for working with images and documents directly in your browser.",
    url: `${BASE_URL}/about/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header
        brandLabel={BRAND.label}
        brandHref={BRAND.href}
        navSections={navSections}
      />
      <main className="static-page">
        <div className="static-page-content">
          <h1>About Imgloo</h1>

          <p>
            Imgloo is a collection of simple online tools for working with
            images and documents directly in your browser.
          </p>
          <p>
            Our goal is to provide fast, private, and easy-to-use tools that
            help you process files without installing software or uploading data
            to external servers.
          </p>

          <h2>What you can do with Imgloo</h2>
          <p>Imgloo provides a growing set of tools including:</p>
          <ul>
            <li>Compress images</li>
            <li>Convert image formats</li>
            <li>Resize images</li>
            <li>Crop images</li>
            <li>Rotate and flip images</li>
            <li>Add watermarks</li>
            <li>Convert and optimize document files</li>
          </ul>
          <p>
            These tools are designed to help users quickly prepare files for
            websites, email, social media, and everyday use.
          </p>

          <h2>Browser-based processing</h2>
          <p>Imgloo focuses on privacy and simplicity.</p>
          <p>
            Whenever possible, files are processed directly in your browser.
            This means your images and documents stay on your device and are not
            uploaded to external servers.
          </p>
          <p>
            This approach helps improve privacy, security, and processing speed.
          </p>

          <h2>Our mission</h2>
          <p>
            Many online tools require users to upload files to remote servers.
            Imgloo aims to provide an alternative approach where file processing
            happens locally in the browser whenever possible.
          </p>
          <p>
            Our mission is to build a reliable collection of lightweight tools
            that help people work with images and documents quickly and safely.
          </p>

          <h2>Independent project</h2>
          <p>
            Imgloo is developed and maintained as an independent project focused
            on practical browser-based utilities.
          </p>
          <p>
            We continuously work on improving existing tools and adding new
            ones.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions, feedback, or suggestions, you can contact us
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
