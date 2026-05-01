import { useEffect, useState } from "react";
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
  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");
  const desiredTotal = plan.activities.reduce((sum, activity) => sum + activity.desiredMinutes, 0);
  const endTime = formatTime(parseTime(plan.startTime) + plan.durationMinutes);
  const hasPlanWindow = plan.hasPlanWindow !== false;

  useEffect(() => {
    if (hasPlanWindow) {
      setDraftStart("");
      setDraftEnd("");
    }
  }, [hasPlanWindow]);

  function commitWindow(startTime: string, end: string): void {
    if (!startTime || !end) {
      return;
    }
    onChange({
      ...plan,
      startTime,
      durationMinutes: durationFromRange(startTime, end),
      hasPlanWindow: true,
    });
  }

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
      {hasPlanWindow ? (
        <>
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
      ) : (
        <>
          <div className="field-grid">
            <label>
              起点
              <input
                disabled={readOnly}
                type="time"
                value={draftStart}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftStart(value);
                  commitWindow(value, draftEnd);
                }}
              />
            </label>
            <label>
              终点
              <input
                disabled={readOnly}
                type="time"
                value={draftEnd}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftEnd(value);
                  commitWindow(draftStart, value);
                }}
              />
            </label>
          </div>
          <p className="empty-window-note">设置完整时间窗后开始安排活动。</p>
        </>
      )}
    </>
  );
}
