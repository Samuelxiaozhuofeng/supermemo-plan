import type { NotificationStatus, ReminderSettings } from "../types";

const SNOOZE_CHOICES = [3, 5, 10];

export function ReminderSettings({
  notificationStatus,
  settings,
  onChange,
}: {
  notificationStatus: NotificationStatus;
  settings: ReminderSettings;
  onChange: (settings: ReminderSettings) => void;
}) {
  return (
    <section className="settings-panel">
      <h2>提醒</h2>
      <label>
        预提醒
        <input
          min={0}
          type="number"
          value={settings.preAlertMinutes}
          onChange={(event) =>
            onChange({ ...settings, preAlertMinutes: Number(event.target.value) || 0 })
          }
        />
      </label>
      <div className="segmented">
        {SNOOZE_CHOICES.map((minutes) => (
          <button
            key={minutes}
            className={settings.snoozeMinutes === minutes ? "active tab" : "tab"}
            onClick={() => onChange({ ...settings, snoozeMinutes: minutes })}
            type="button"
          >
            {minutes}m
          </button>
        ))}
      </div>
      <label>
        贪睡分钟
        <input
          min={1}
          type="number"
          value={settings.snoozeMinutes}
          onChange={(event) => onChange({ ...settings, snoozeMinutes: Number(event.target.value) || 1 })}
        />
      </label>
      <span className="status-note">通知：{notificationStatus}</span>
    </section>
  );
}
