import type { AdjustPreviewRow } from "../types";

export function AdjustPanel({
  rows,
  selectedIds,
  onToggle,
  onApply,
  onCancel,
}: {
  rows: AdjustPreviewRow[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onApply: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="adjust-panel">
      <div className="panel-heading">
        <h2>Adjust 预览</h2>
        <button onClick={onCancel} type="button">
          关闭
        </button>
      </div>
      <div className="adjust-list">
        {rows.map((row) => (
          <label key={row.activityId} className={row.status === "matched" ? "adjust-row" : "adjust-row muted"}>
            <input
              checked={selectedIds.has(row.activityId)}
              disabled={row.status !== "matched"}
              type="checkbox"
              onChange={() => onToggle(row.activityId)}
            />
            <span>{row.title}</span>
            <strong>
              {row.oldMinutes} → {row.newMinutes} 分
            </strong>
            <small>
              {row.status === "matched"
                ? `${row.deltaMinutes > 0 ? "+" : ""}${row.deltaMinutes} 分`
                : "未匹配"}
            </small>
          </label>
        ))}
      </div>
      <button className="primary" onClick={onApply} type="button">
        应用调整
      </button>
    </section>
  );
}
