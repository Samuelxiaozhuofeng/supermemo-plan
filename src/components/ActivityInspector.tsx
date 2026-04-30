import type { Activity, ComputedActivity } from "../types";
import { formatTime } from "../time";

export function ActivityInspector({
  activity,
  readOnly,
  onChange,
}: {
  activity?: ComputedActivity;
  readOnly: boolean;
  onChange: (id: string, patch: Partial<Activity>) => void;
}) {
  if (!activity) {
    return (
      <section className="inspector-empty">
        <h2>活动详情</h2>
        <p>选择一个活动后编辑高级字段。</p>
      </section>
    );
  }

  const update = (patch: Partial<Activity>) => onChange(activity.id, patch);

  return (
    <section className="activity-inspector">
      <div className="inspector-heading">
        <p>活动详情</p>
        <h2>{activity.title}</h2>
        <span>
          {formatTime(activity.startMinutes)} - {formatTime(activity.endMinutes)}
        </span>
      </div>
      <label>
        统计 Key
        <input
          disabled={readOnly}
          value={activity.statsKey ?? ""}
          onChange={(event) => update({ statsKey: event.target.value || undefined })}
        />
      </label>
      <label className="inline-check">
        <input
          checked={Boolean(activity.fixed)}
          disabled={readOnly}
          type="checkbox"
          onChange={(event) => update({ fixed: event.target.checked })}
        />
        固定时长
      </label>
      <div className="field-grid">
        <label>
          固定开始
          <input
            disabled={readOnly}
            type="time"
            value={activity.fixedStart ?? ""}
            onChange={(event) => update({ fixedStart: event.target.value || undefined })}
          />
        </label>
        <label>
          实际开始
          <input
            disabled={readOnly}
            type="time"
            value={activity.actualStart ?? ""}
            onChange={(event) => update({ actualStart: event.target.value || undefined })}
          />
        </label>
      </div>
      <label>
        实际结束
        <input
          disabled={readOnly}
          type="time"
          value={activity.actualEnd ?? ""}
          onChange={(event) => update({ actualEnd: event.target.value || undefined })}
        />
      </label>
      <label>
        备注
        <textarea
          disabled={readOnly}
          value={activity.notes ?? ""}
          onChange={(event) => update({ notes: event.target.value })}
        />
      </label>
    </section>
  );
}
