export type SupportedFormat = "image/jpeg" | "image/png" | "image/webp";

export type CompressionPresetId = "fast" | "balanced" | "max";

export type CompressionPreset = {
  id: CompressionPresetId;
  label: string;
  maxDimension: number;
  initialQuality: number;
  minQuality: number;
  qualityStep: number;
  maxIterations: number;
  pngMaxColors: number;
  pngMinColors: number;
  pngColorStep: number;
};

export type CompressionLimits = {
  maxFiles: number;
  maxFileSizeBytes: number;
  maxTotalSizeBytes: number;
};

export type CompressOptions = {
  preset?: CompressionPresetId;
  targetBytes?: number;
  keepFormat: true;
};

export type CompressionStats = {
  inputBytes: number;
  outputBytes: number;
  ratio: number;
  elapsedMs: number;
};

export type CompressResult = {
  outputBlob: Blob;
  stats: CompressionStats;
};
