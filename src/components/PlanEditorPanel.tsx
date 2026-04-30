import { formatDuration, formatTime, normalizeIntoWindow, parseTime } from "../time";
import type { PlanDocument } from "../types";

function durationFromRange(startTime: string, endTime: string): number {
  const startMinutes = parseTime(startTime);
  return Math.max(1, normalizeIntoWindow(endTime, startMinutes) - startMinutes);
}

export function PlanEditorPanel({
  plan,
  readOnly,
  onChange,
}: {
  plan: PlanDocument;
  readOnly: boolean;
  onChange: (plan: PlanDocument) => void;
}) {
  const desiredTotal = plan.activities.reduce((sum, activity) => sum + activity.desiredMinutes, 0);
  const endTime = formatTime(parseTime(plan.startTime) + plan.durationMinutes);

  return (
    <>
      <label>
        计划名称
        <input
          disabled={readOnly}
          value={plan.name}
          onChange={(event) => onChange({ ...plan, name: event.target.value })}
        />
      </label>
      <div className="field-grid">
        <label>
          起点
          <input
            disabled={readOnly}
            type="time"
            value={plan.startTime}
            onChange={(event) => {
              const startTime = event.target.value;
              onChange({ ...plan, startTime, durationMinutes: durationFromRange(startTime, endTime) });
            }}
          />
        </label>
        <label>
          终点
          <input
            disabled={readOnly}
            type="time"
            value={endTime}
            onChange={(event) =>
              onChange({ ...plan, durationMinutes: durationFromRange(plan.startTime, event.target.value) })
            }
          />
        </label>
      </div>
      <div className="summary-card">
        <span>理想总量</span>
        <strong>{formatDuration(desiredTotal)}</strong>
        <span>可用时间</span>
        <strong>{formatDuration(plan.durationMinutes)}</strong>
      </div>
    </>
  );
}
