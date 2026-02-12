import type { Metadata } from "next";
import {
  buildToolPageMetadata,
  compressImagePageConfig,
  ToolPage,
} from "@/tool-page";

export const metadata: Metadata = buildToolPageMetadata(compressImagePageConfig);

export default function CompressImagePage() {
  return <ToolPage config={compressImagePageConfig} />;
}
