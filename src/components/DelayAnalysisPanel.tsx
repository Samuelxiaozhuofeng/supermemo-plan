import type { DelayAnalysis } from "../types";
import { formatDuration } from "../time";

export function DelayAnalysisPanel({ analysis }: { analysis: DelayAnalysis }) {
  return (
    <aside className="analysis-panel">
      <h2>延误分析</h2>
      <div className="metric-row">
        <Metric label="延误" value={formatDuration(analysis.totalDelayMinutes)} tone="warm" />
        <Metric label="损失" value={formatDuration(analysis.totalLostMinutes)} tone="danger" />
        <Metric label="压缩" value={formatDuration(analysis.totalCompressedMinutes)} tone="cool" />
      </div>
      <div className="delay-list">
        {analysis.rows.map((row) => (
          <div key={row.id} className={row.deltaMinutes > 0 ? "delay-row late" : "delay-row"}>
            <span>{row.title}</span>
            <strong>
              {row.deltaMinutes > 0 ? "+" : ""}
              {row.deltaMinutes} 分
            </strong>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
