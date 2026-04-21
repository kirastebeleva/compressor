import type { Metadata } from "next";
import { HomeHubPage } from "@/features/home-page/ui/HomeHubPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

export const metadata: Metadata = {
  title: "Use Free Online Image Tools for Web, Email, Social Fast",
  description:
    "Compress, convert, resize, crop, and optimize images in your browser. Choose a tool — no upload to our servers, no signup.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Use Free Online Image Tools for Web, Email, Social Fast",
    description:
      "Compress, convert, resize, crop, and optimize images in your browser. Choose a tool — no upload to our servers, no signup.",
    url: `${BASE_URL}/`,
    siteName: "imgloo",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeHubPage />;
}
