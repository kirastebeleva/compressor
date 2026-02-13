"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ResultsSection } from "@/tool-page/results-section";
import { ToolBlock } from "@/tool-page/tool-block";
import type { ToolExecutionResult, PageConfig } from "@/tool-page/types";

/**
 * Feature flag: advertising slot.
 * Currently disabled — the ad placeholder adds visual noise with no revenue.
 * Flip to `true` (or wire to NEXT_PUBLIC_ADS_ENABLED) when traffic
 * justifies enabling ad placements.
 */
const ADS_ENABLED = false;

const LazyAdSlot = dynamic(
  () => import("@/tool-page/ad-slot").then((module) => module.AdSlot),
  { ssr: false }
);

type ToolRuntimeProps = {
  config: PageConfig;
};

export function ToolRuntime({ config }: ToolRuntimeProps) {
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [toolKey, setToolKey] = useState(0);

  const handleReset = useCallback(() => {
    setResult(null);
    setToolKey((k) => k + 1);
  }, []);

  return (
    <>
      <ToolBlock
        key={toolKey}
        byteLabels={config.results.labels}
        config={config.tool}
        onResult={setResult}
      />
      <ResultsSection
        config={config.results}
        result={result}
        toolLabels={{ downloadButton: config.tool.labels.downloadButton }}
        onReset={handleReset}
      />
      {ADS_ENABLED && <LazyAdSlot config={config.adSlot} />}
    </>
  );
}
