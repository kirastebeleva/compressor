import type { ToolExecutionResult, ToolPageConfig } from "@/tool-page/types";

type ResultsSectionProps = {
  config: ToolPageConfig["results"];
  toolLabels: Pick<ToolPageConfig["tool"]["labels"], "downloadButton">;
  result: ToolExecutionResult | null;
};

export function ResultsSection({ config, toolLabels, result }: ResultsSectionProps) {
  if (!result) {
    return (
      <section className="card">
        <h2>{config.title}</h2>
        <p className="muted">{config.emptyState}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>{config.title}</h2>
      <p className="muted">
        {config.labels.input}: {formatBytes(result.stats.inputBytes, config.labels)}
      </p>
      <p className="muted">
        {config.labels.output}: {formatBytes(result.stats.outputBytes, config.labels)}
      </p>
      <p className="muted">
        {config.labels.ratio}: {(result.stats.ratio * 100).toFixed(1)}%
      </p>
      <p className="muted">
        {config.labels.elapsed}: {result.stats.elapsedMs} {config.labels.elapsedUnit}
      </p>
      <a download={result.downloadName} href={result.downloadUrl}>
        {toolLabels.downloadButton}
      </a>
    </section>
  );
}

function formatBytes(
  bytes: number,
  labels: ToolPageConfig["results"]["labels"]
): string {
  if (bytes < 1024) {
    return `${bytes} ${labels.byteUnit}`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} ${labels.kilobyteUnit}`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} ${labels.megabyteUnit}`;
}
