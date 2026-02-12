import type { CompressionPresetId, SupportedFormat } from "@/compression/types";

export type CompressWorkerRequest = {
  id: string;
  file: Blob;
  fileType: SupportedFormat;
  presetId?: CompressionPresetId;
  targetBytes?: number;
  keepFormat: true;
};

export type CompressWorkerSuccess = {
  id: string;
  ok: true;
  outputBlob: Blob;
  outputBytes: number;
};

export type CompressWorkerFailure = {
  id: string;
  ok: false;
  error: string;
};

export type CompressWorkerResponse = CompressWorkerSuccess | CompressWorkerFailure;
