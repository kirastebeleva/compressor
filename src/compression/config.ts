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
    maxDimension: 2200,
    initialQuality: 0.82,
    minQuality: 0.72,
    qualityStep: 0.07,
    maxIterations: 2,
    pngMaxColors: 192,
    pngMinColors: 128,
    pngColorStep: 32,
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    maxDimension: 2000,
    initialQuality: 0.74,
    minQuality: 0.55,
    qualityStep: 0.06,
    maxIterations: 5,
    pngMaxColors: 128,
    pngMinColors: 64,
    pngColorStep: 16,
  },
  max: {
    id: "max",
    label: "Max",
    maxDimension: 1600,
    initialQuality: 0.6,
    minQuality: 0.35,
    qualityStep: 0.05,
    maxIterations: 8,
    pngMaxColors: 64,
    pngMinColors: 16,
    pngColorStep: 16,
  },
};

export const LIMITS: CompressionLimits = {
  maxFiles: 1,
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxTotalSizeBytes: 25 * 1024 * 1024,
};

export const SOFT_PIXEL_LIMIT = 30_000_000;
