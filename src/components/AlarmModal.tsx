import { AlarmClock, PauseCircle } from "lucide-react";

export function AlarmModal({
  kind,
  snoozeMinutes,
  title,
  onSnooze,
  onClose,
}: {
  kind: "pre" | "end";
  snoozeMinutes: number;
  title: string;
  onSnooze: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="alarm-modal">
        <AlarmClock size={30} />
        <h2>{kind === "end" ? "活动时间到了" : "活动即将结束"}</h2>
        <p>{title}</p>
        <div>
          <button onClick={onSnooze} type="button">
            <PauseCircle size={16} /> 贪睡 {snoozeMinutes} 分钟
          </button>
          <button className="primary" onClick={onClose} type="button">
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
