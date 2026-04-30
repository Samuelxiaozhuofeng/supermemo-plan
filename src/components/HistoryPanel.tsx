import type { PlanDocument } from "../types";
import { formatDuration } from "../time";

export function HistoryPanel({
  history,
  selectedId,
  onSelect,
  onRestore,
  onDelete,
}: {
  history: PlanDocument[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="history-panel">
      <div className="panel-heading">
        <h2>历史记录</h2>
        <span>{history.length} 条</span>
      </div>
      {history.length === 0 ? (
        <p className="empty-note">Terminate 后会自动归档到这里。</p>
      ) : (
        <div className="history-list">
          {history.map((plan) => (
            <div
              key={plan.id}
              className={plan.id === selectedId ? "history-item active" : "history-item"}
              onClick={() => onSelect(plan.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onSelect(plan.id);
                }
              }}
            >
              <strong>{plan.name}</strong>
              <span>{formatDuration(plan.durationMinutes)}</span>
              <small>{plan.archivedAt ? new Date(plan.archivedAt).toLocaleString("zh-CN") : "未归档"}</small>
              <span className="history-actions">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onRestore(plan.id);
                  }}
                  type="button"
                >
                  复制为今日
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(plan.id);
                  }}
                  type="button"
                >
                  删除
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
