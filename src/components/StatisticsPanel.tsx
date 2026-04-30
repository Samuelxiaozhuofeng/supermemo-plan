import { summarizeHistoryStats, summarizePlanStats } from "../schedule";
import { formatDuration } from "../time";
import type { PlanDocument } from "../types";

export function StatisticsPanel({ history, plan }: { history: PlanDocument[]; plan: PlanDocument }) {
  const planRows = summarizePlanStats(plan);
  const historyRows = summarizeHistoryStats(history);

  return (
    <section className="statistics-panel">
      <h2>活动统计</h2>
      <StatList empty="当前计划暂无统计" rows={planRows} title="当前计划" />
      <StatList empty="暂无历史累计" rows={historyRows} title="最近历史" />
    </section>
  );
}

function StatList({
  empty,
  rows,
  title,
}: {
  empty: string;
  rows: ReturnType<typeof summarizePlanStats>;
  title: string;
}) {
  return (
    <div className="stat-list">
      <strong>{title}</strong>
      {rows.length === 0 ? (
        <span className="empty-note">{empty}</span>
      ) : (
        rows.map((row) => (
          <div key={row.key} className="stat-row">
            <span>{row.key}</span>
            <strong>{formatDuration(row.minutes)}</strong>
          </div>
        ))
      )}
    </div>
  );
}
