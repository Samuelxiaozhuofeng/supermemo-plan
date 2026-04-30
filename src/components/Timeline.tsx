import { computeSchedule, displayRange } from "../schedule";
import { formatTime, parseTime } from "../time";
import type { PlanDocument } from "../types";

export function Timeline({
  plan,
  rows,
  selectedId,
  onSelect,
}: {
  plan: PlanDocument;
  rows: ReturnType<typeof computeSchedule>;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const planStart = parseTime(plan.startTime);
  const duration = Math.max(1, plan.durationMinutes);

  return (
    <section className="timeline-panel">
      <div className="timeline-header">
        <strong>时间轴</strong>
        <span>
          {formatTime(planStart)} - {formatTime(planStart + duration)}
        </span>
      </div>
      <div className="timeline-track">
        {rows.map((row) => {
          const left = Math.max(0, ((row.startMinutes - planStart) / duration) * 100);
          const width = Math.max(0.7, (row.allocatedMinutes / duration) * 100);
          const className = [
            "timeline-block",
            row.id === selectedId ? "selected" : "",
            row.isStarted ? "started" : "",
            row.isFixed ? "fixed" : "",
            row.isFixedDuration ? "fixed-duration" : "",
            row.allocatedMinutes < row.optLenMinutes ? "compressed" : "",
          ].join(" ");
          return (
            <button
              key={row.id}
              className={className}
              style={{ left: `${Math.min(100, left)}%`, width: `${Math.min(100 - left, width)}%` }}
              title={`${row.title} ${displayRange(row)}`}
              type="button"
              onClick={() => onSelect?.(row.id)}
            >
              <span>{row.title}</span>
              <small>{row.allocatedMinutes} 分</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
