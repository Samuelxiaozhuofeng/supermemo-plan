import { Bell, VolumeX } from "lucide-react";

export function ExecutionControls({
  canTerminate,
  onAdjustFromNow,
  onAdjustFromSelected,
  onMuteCurrent,
  onRequestNotification,
}: {
  canTerminate: boolean;
  onAdjustFromNow: () => void;
  onAdjustFromSelected: () => void;
  onMuteCurrent: () => void;
  onRequestNotification: () => void;
}) {
  return (
    <div className="execution-actions">
      <button disabled={!canTerminate} onClick={onAdjustFromNow} type="button">
        从现在 Adjust
      </button>
      <button disabled={!canTerminate} onClick={onAdjustFromSelected} type="button">
        从所选 Adjust
      </button>
      <button disabled={!canTerminate} onClick={onMuteCurrent} type="button">
        <VolumeX size={16} /> 静音当前活动
      </button>
      <button onClick={onRequestNotification} type="button">
        <Bell size={16} /> 通知权限
      </button>
    </div>
  );
}
