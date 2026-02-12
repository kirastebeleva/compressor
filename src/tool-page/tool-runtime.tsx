"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ResultsSection } from "@/tool-page/results-section";
import { ToolBlock } from "@/tool-page/tool-block";
import type { ToolExecutionResult, ToolPageConfig } from "@/tool-page/types";

const LazyAdSlot = dynamic(
  () => import("@/tool-page/ad-slot").then((module) => module.AdSlot),
  { ssr: false }
);

type ToolRuntimeProps = {
  config: ToolPageConfig;
};

export function ToolRuntime({ config }: ToolRuntimeProps) {
  const [result, setResult] = useState<ToolExecutionResult | null>(null);

  return (
    <>
      <ToolBlock
        byteLabels={config.results.labels}
        config={config.tool}
        onResult={setResult}
      />
      <ResultsSection
        config={config.results}
        result={result}
        toolLabels={{ downloadButton: config.tool.labels.downloadButton }}
      />
      <LazyAdSlot config={config.adSlot} />
    </>
  );
}
