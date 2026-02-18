type ByteLabels = {
  byteUnit: string;
  kilobyteUnit: string;
  megabyteUnit: string;
};

const DEFAULT_LABELS: ByteLabels = {
  byteUnit: "B",
  kilobyteUnit: "KB",
  megabyteUnit: "MB",
};

export function formatBytes(bytes: number, labels?: ByteLabels): string {
  const l = labels ?? DEFAULT_LABELS;

  if (bytes < 1024) return `${bytes} ${l.byteUnit}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${l.kilobyteUnit}`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} ${l.megabyteUnit}`;
}

export function buildOutputName(
  originalName: string,
  suffix = "-compressed",
): string {
  const dotIndex = originalName.lastIndexOf(".");
  if (dotIndex === -1) return `${originalName}${suffix}`;

  const baseName = originalName.slice(0, dotIndex);
  const extension = originalName.slice(dotIndex);
  return `${baseName}${suffix}${extension}`;
}
