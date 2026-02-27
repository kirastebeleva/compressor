"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResultsSection } from "@/tool-page/results-section";
import { ToolBlock } from "@/tool-page/tool-block";
import type { ToolExecutionResult, PageConfig } from "@/tool-page/types";
import {
  trackPageMeta,
  trackCompressionCompleted,
  trackToolOpen,
} from "@/lib/analytics";

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

const LazyResizeTool = dynamic(
  () =>
    import("@/components/resize-tool").then((module) => ({
      default: module.ResizeTool,
    })),
  { ssr: false },
);

const LazyBatchCompressTool = dynamic(
  () =>
    import("@/components/batch-compress-tool").then((module) => ({
      default: module.BatchCompressTool,
    })),
  { ssr: false },
);

const LazyCropTool = dynamic(
  () =>
    import("@/components/crop-tool").then((module) => ({
      default: module.CropTool,
    })),
  { ssr: false },
);

const LazyRotateTool = dynamic(
  () =>
    import("@/components/rotate-tool").then((module) => ({
      default: module.RotateTool,
    })),
  { ssr: false },
);

const LazyFlipTool = dynamic(
  () =>
    import("@/components/flip-tool").then((module) => ({
      default: module.FlipTool,
    })),
  { ssr: false },
);

const LazyWatermarkTool = dynamic(
  () =>
    import("@/components/watermark-tool").then((module) => ({
      default: module.WatermarkTool,
    })),
  { ssr: false },
);

type ToolRuntimeProps = {
  config: PageConfig;
};

function isBatchIntent(intent: string): boolean {
  return intent === "batch" || intent.startsWith("batch-");
}

export function ToolRuntime({ config }: ToolRuntimeProps) {
  if (config.tool.kind === "image-crop") {
    return <CropToolRuntime config={config} />;
  }

  if (config.tool.kind === "image-rotate") {
    return <RotateToolRuntime config={config} />;
  }

  if (config.tool.kind === "image-flip") {
    return <FlipToolRuntime config={config} />;
  }

  if (config.tool.kind === "image-watermark") {
    return <WatermarkToolRuntime config={config} />;
  }

  if (config.tool.kind === "image-resize") {
    return <ResizeToolRuntime config={config} />;
  }

  if (isBatchIntent(config.intent)) {
    return <BatchCompressRuntime config={config} />;
  }

  return <CompressionToolRuntime config={config} />;
}

function CropToolRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyCropTool config={config} />;
}

function RotateToolRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyRotateTool config={config} />;
}

function FlipToolRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyFlipTool config={config} />;
}

function WatermarkToolRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyWatermarkTool config={config} />;
}

function ResizeToolRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyResizeTool config={config} />;
}

function BatchCompressRuntime({ config }: { config: PageConfig }) {
  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  return <LazyBatchCompressTool config={config} />;
}

function CompressionToolRuntime({ config }: { config: PageConfig }) {
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [toolKey, setToolKey] = useState(0);
  const trackedRef = useRef(false);

  useEffect(() => {
    trackPageMeta({
      pageSlug: config.slug,
      intent: config.intent,
      toolMode: config.tool.mode,
    });
    trackToolOpen(config.tool.kind);
  }, [config.slug, config.intent, config.tool.mode, config.tool.kind]);

  useEffect(() => {
    if (result && !trackedRef.current) {
      trackedRef.current = true;
      trackCompressionCompleted({
        pageSlug: config.slug,
        intent: config.intent,
        toolMode: config.tool.mode,
        preset: result.preset,
        inputBytes: result.stats.inputBytes,
        outputBytes: result.stats.outputBytes,
        ratio: result.stats.ratio,
        elapsedMs: result.stats.elapsedMs,
      });
    }
    if (!result) {
      trackedRef.current = false;
    }
  }, [result, config.slug, config.intent, config.tool.mode]);

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
        toolKind={config.tool.kind}
        onResult={setResult}
      />
      <ResultsSection
        config={config.results}
        result={result}
        toolKind={config.tool.kind}
        toolLabels={{ downloadButton: config.tool.labels.downloadButton }}
        onReset={handleReset}
      />
      {ADS_ENABLED && <LazyAdSlot config={config.adSlot} />}
    </>
  );
}
