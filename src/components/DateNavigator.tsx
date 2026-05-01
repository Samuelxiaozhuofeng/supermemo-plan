import { CalendarDays } from "lucide-react";
import { addDays, formatDateLabel, toDateKey } from "../schedule";

export function DateNavigator({
  selectedDateKey,
  onDateChange,
}: {
  selectedDateKey: string;
  onDateChange: (dateKey: string) => void;
}) {
  const todayKey = toDateKey(new Date());
  const days = Array.from({ length: 7 }, (_, index) => addDays(selectedDateKey, index - 3));

  return (
    <section className="date-navigator" aria-label="日期">
      <div className="date-strip">
        {days.map((dateKey) => (
          <button
            className={dateKey === selectedDateKey ? "date-tab active" : "date-tab"}
            key={dateKey}
            onClick={() => onDateChange(dateKey)}
            type="button"
          >
            <span>{dateKey === todayKey ? "今天" : formatDateLabel(dateKey)}</span>
          </button>
        ))}
      </div>
      <label className="date-picker">
        <CalendarDays size={16} />
        <input
          aria-label="跳转日期"
          type="date"
          value={selectedDateKey}
          onChange={(event) => {
            if (event.target.value) {
              onDateChange(event.target.value);
            }
          }}
        />
      </label>
    </section>
  );
}
