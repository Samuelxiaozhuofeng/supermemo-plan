import { useEffect, useRef } from "react";
import { toDateKey } from "../schedule";

export function useDateRollover(clock: Date, jumpToDate: (dateKey: string) => void): void {
  const currentDateKeyRef = useRef(toDateKey(clock));

  useEffect(() => {
    const nextDateKey = toDateKey(clock);
    if (nextDateKey === currentDateKeyRef.current) {
      return;
    }
    currentDateKeyRef.current = nextDateKey;
    jumpToDate(nextDateKey);
  }, [clock, jumpToDate]);
}
