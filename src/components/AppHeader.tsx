import { CheckCircle2, Play, Settings, Square } from "lucide-react";
import { formatDuration } from "../time";
import type { ComputedActivity } from "../types";

export function AppHeader({
  canBegin,
  canComplete,
  canTerminate,
  clock,
  dateLabel,
  isToday,
  planName,
  remainingSeconds,
  running,
  onBegin,
  onComplete,
  onOpenSettings,
  onTerminate,
}: {
  canBegin: boolean;
  canComplete: boolean;
  canTerminate: boolean;
  clock: Date;
  dateLabel: string;
  isToday: boolean;
  planName: string;
  remainingSeconds?: number;
  running?: ComputedActivity;
  onBegin: () => void;
  onComplete: () => void;
  onOpenSettings: () => void;
  onTerminate: () => void;
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{isToday ? "今日执行" : "日期执行"} · {dateLabel}</p>
        <h1>{planName}</h1>
        <p>
          当前 {clock.toLocaleTimeString("zh-CN", { hour12: false })}
          {running && remainingSeconds !== undefined ? (
            <strong> · {running.title} 剩余 {formatDuration(Math.ceil(remainingSeconds / 60))}</strong>
          ) : (
            <span> · 尚无运行中活动</span>
          )}
        </p>
      </div>
      <div className="top-actions">
        <button className="primary" disabled={!canBegin} onClick={onBegin} type="button">
          <Play size={16} /> Begin
        </button>
        <button disabled={!canComplete} onClick={onComplete} type="button">
          <CheckCircle2 size={16} /> 完成当前
        </button>
        <button disabled={!canTerminate} onClick={onTerminate} type="button">
          <Square size={16} /> 归档
        </button>
        <button aria-label="设置" onClick={onOpenSettings} type="button">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
