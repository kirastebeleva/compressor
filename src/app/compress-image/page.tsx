import type { Metadata } from "next";
import { CompressionPlayground } from "@/components/compression-playground";

export const metadata: Metadata = {
  title: "Compress Image",
  description: "Compress JPG, PNG and WebP directly in your browser.",
  alternates: {
    canonical: "/compress-image",
  },
};

export default function CompressImagePage() {
  return <CompressionPlayground />;
}
