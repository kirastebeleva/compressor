import type { ToolExecutionResult, PageConfig } from "@/tool-page/types";
import type { ToolKind } from "@/core/types";
import { formatBytes } from "@/lib/format";
import { trackDownloadResult, bytesToMb } from "@/lib/analytics";

type ResultsSectionProps = {
  config: PageConfig["results"];
  toolKind: ToolKind;
  toolLabels: Pick<PageConfig["tool"]["labels"], "downloadButton">;
  result: ToolExecutionResult | null;
  onReset: () => void;
};

export function ResultsSection({
  config,
  toolKind,
  toolLabels,
  result,
  onReset,
}: ResultsSectionProps) {
  if (!result) {
    return (
      <section className="card results-empty">
        <h2 className="section-title">{config.title}</h2>
        <p className="body-text">{config.emptyState}</p>
      </section>
    );
  }

  const savedBytes = Math.max(
    0,
    result.stats.inputBytes - result.stats.outputBytes
  );
  const savedPercent =
    result.stats.inputBytes > 0
      ? (savedBytes / result.stats.inputBytes) * 100
      : 0;

  return (
    <section className="card results-card results-appear">
      <h2 className="section-title">{config.title}</h2>

      <div className="savings-banner">
        <span className="savings-percent">{savedPercent.toFixed(1)}%</span>
        <span className="savings-label">
          smaller &mdash; saved {formatBytes(savedBytes, config.labels)}
        </span>
      </div>

      <div
        aria-label={`Saved ${savedPercent.toFixed(1)} percent`}
        className="savings-visual"
      >
        <div className="savings-track">
          <span
            className="savings-fill savings-fill-animate"
            style={{
              "--savings-width": `${Math.min(100, Math.max(0, savedPercent))}%`,
            } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="results-grid">
        <div className="result-item">
          <span className="result-item-label">{config.labels.input}</span>
          <strong className="result-item-value">
            {formatBytes(result.stats.inputBytes, config.labels)}
          </strong>
        </div>
        <div className="result-item result-item-after">
          <span className="result-item-label">{config.labels.output}</span>
          <strong className="result-item-value">
            {formatBytes(result.stats.outputBytes, config.labels)}
          </strong>
        </div>
      </div>

      <div className="results-actions">
        <a
          className="btn btn-download"
          download={result.downloadName}
          href={result.downloadUrl}
          onClick={() =>
            trackDownloadResult({
              tool: toolKind,
              file_type: result.downloadName.split(".").pop() ?? "unknown",
              file_size_mb: bytesToMb(result.stats.outputBytes),
              output_size_mb: bytesToMb(result.stats.outputBytes),
            })
          }
        >
          {toolLabels.downloadButton}
        </a>
        <button
          className="btn btn-secondary"
          onClick={onReset}
          type="button"
        >
          Compress another image
        </button>
      </div>
    </section>
  );
}