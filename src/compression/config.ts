import type {
  CompressionLimits,
  CompressionPreset,
  CompressionPresetId,
  SupportedFormat,
} from "@/compression/types";

export const SUPPORTED_FORMATS: readonly SupportedFormat[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const DEFAULT_PRESET: CompressionPresetId = "balanced";

export const PRESETS: Record<CompressionPresetId, CompressionPreset> = {
  fast: {
    id: "fast",
    label: "Fast",
    maxDimension: 4096,
    initialQuality: 0.9,
    minQuality: 0.82,
    qualityStep: 0.04,
    maxIterations: 2,
    pngMaxColors: 256,
    pngMinColors: 224,
    pngColorStep: 32,
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    maxDimension: 3200,
    initialQuality: 0.86,
    minQuality: 0.72,
    qualityStep: 0.04,
    maxIterations: 5,
    pngMaxColors: 256,
    pngMinColors: 160,
    pngColorStep: 16,
  },
  max: {
    id: "max",
    label: "Max",
    maxDimension: 2400,
    initialQuality: 0.78,
    minQuality: 0.6,
    qualityStep: 0.05,
    maxIterations: 8,
    pngMaxColors: 192,
    pngMinColors: 96,
    pngColorStep: 16,
  },
};

export const LIMITS: CompressionLimits = {
  maxFiles: 1,
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxTotalSizeBytes: 25 * 1024 * 1024,
};

export const SOFT_PIXEL_LIMIT = 30_000_000;
