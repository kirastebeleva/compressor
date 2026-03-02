export type ConvertOptions = {
  /** Canonical output format key, e.g. "jpg", "png", "webp", "avif". */
  toFormat: string;
  /** Output quality 0–1 for lossy formats. Defaults to 0.92. */
  quality?: number;
};

export type ConvertResult = {
  outputBlob: Blob;
  outputMime: string;
  inputBytes: number;
  outputBytes: number;
  elapsedMs: number;
};
