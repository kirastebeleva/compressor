import type { Metadata } from "next";
import { HomeHubPage } from "@/features/home-page/ui/HomeHubPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "Use Free Online Image Tools for Web, Email, Social Fast",
  description:
    "Use online image tools to compress, convert, resize, and edit files for web, email, and social uploads. No signup, instant results, and browser-side processing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Use Free Online Image Tools for Web, Email, Social Fast",
    description:
      "Use online image tools to compress, convert, resize, and edit files for web, email, and social uploads. No signup, instant results, and browser-side processing.",
    url: `${BASE_URL}/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeHubPage />;
}
