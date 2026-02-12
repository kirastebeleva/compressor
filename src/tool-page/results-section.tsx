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
        <h2 className="section-title">{config.title}</h2>
        <p className="muted">{config.emptyState}</p>
      </section>
    );
  }

  const savedBytes = Math.max(0, result.stats.inputBytes - result.stats.outputBytes);
  const savedPercent =
    result.stats.inputBytes > 0
      ? (savedBytes / result.stats.inputBytes) * 100
      : 0;

  return (
    <section className="card results-card">
      <h2 className="section-title">{config.title}</h2>
      <p className="result-highlight">
        Saved {savedPercent.toFixed(1)}% ({formatBytes(savedBytes, config.labels)})
      </p>
      <div aria-label={`Saved ${savedPercent.toFixed(1)} percent`} className="savings-visual">
        <div className="savings-track">
          <span
            className="savings-fill"
            style={{ width: `${Math.min(100, Math.max(0, savedPercent))}%` }}
          />
        </div>
      </div>
      <div className="results-grid">
        <p className="muted result-item">
          <span>{config.labels.input}</span>
          <strong>{formatBytes(result.stats.inputBytes, config.labels)}</strong>
        </p>
        <p className="muted result-item">
          <span>{config.labels.output}</span>
          <strong>{formatBytes(result.stats.outputBytes, config.labels)}</strong>
        </p>
      </div>
      <a className="btn btn-download" download={result.downloadName} href={result.downloadUrl}>
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
