import type { KeyboardEvent } from "react";
import type { Activity, ComputedActivity } from "../types";
import { formatTime } from "../time";

export function ActivityList({
  rows,
  selectedId,
  readOnly = false,
  onSelect,
  onAddActivity,
  onChange,
  onReorder,
}: {
  rows: ComputedActivity[];
  selectedId?: string;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onAddActivity: () => void;
  onChange: (id: string, patch: Partial<Activity>) => void;
  onReorder: (sourceId: string, targetId: string) => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
    const target = event.target as HTMLElement;
    if (!readOnly && event.key === "Enter" && target.tagName !== "INPUT") {
      event.preventDefault();
      onAddActivity();
    }
  }

  return (
    <section
      aria-label="今日活动"
      className="activity-list"
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={handleKeyDown}
    >
      {rows.map((row) => (
        <article
          key={row.id}
          className={row.id === selectedId ? "activity-row selected" : "activity-row"}
          draggable={!readOnly}
          tabIndex={readOnly ? undefined : 0}
          onClick={() => onSelect(row.id)}
          onDragOver={(event) => {
            if (!readOnly) {
              event.preventDefault();
            }
          }}
          onDragStart={(event) => event.dataTransfer.setData("text/plain", row.id)}
          onDrop={(event) => {
            event.preventDefault();
            const sourceId = event.dataTransfer.getData("text/plain");
            if (sourceId && sourceId !== row.id) {
              onReorder(sourceId, row.id);
            }
          }}
        >
          <div className="activity-index">{row.index + 1}</div>
          <div className="activity-main">
            <input
              aria-label={`活动名 ${row.index + 1}`}
              disabled={readOnly}
              value={row.title}
              onChange={(event) => onChange(row.id, { title: event.target.value })}
            />
            <div className="activity-meta">
              <span>
                {formatTime(row.startMinutes)} - {formatTime(row.endMinutes)}
              </span>
              <span>计划 {row.desiredMinutes} 分</span>
              <span>分配 {row.allocatedMinutes} 分</span>
              {row.delayMinutes > 0 ? <strong>延误 +{row.delayMinutes} 分</strong> : null}
            </div>
          </div>
          <div className="activity-edit">
            <label>
              理想
              <input
                aria-label={`理想分钟 ${row.index + 1}`}
                disabled={readOnly}
                min={1}
                type="number"
                value={row.desiredMinutes}
                onChange={(event) => onChange(row.id, { desiredMinutes: Number(event.target.value) || 1 })}
              />
            </label>
          </div>
          <label className="fixed-toggle">
            <input
              aria-label={`固定 ${row.title}`}
              checked={Boolean(row.fixed)}
              disabled={readOnly}
              type="checkbox"
              onChange={(event) => onChange(row.id, { fixed: event.target.checked })}
            />
            固定
          </label>
        </article>
      ))}
    </section>
  );
}
