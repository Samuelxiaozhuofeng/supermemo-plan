import type { ViewMode } from "../types";

export function StatusStrip({
  hasHistory,
  view,
  onViewChange,
}: {
  hasHistory: boolean;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  return (
    <section className="status-strip" aria-label="主视图">
      <button
        className={view === "execution" ? "active tab" : "tab"}
        onClick={() => onViewChange("execution")}
        type="button"
      >
        今日执行
      </button>
      <button
        className={view === "insights" ? "active tab" : "tab"}
        onClick={() => onViewChange("insights")}
        type="button"
      >
        洞察
      </button>
      <button
        className={view === "history" ? "active tab" : "tab"}
        disabled={!hasHistory}
        onClick={() => onViewChange("history")}
        type="button"
      >
        历史
      </button>
    </section>
  );
}
