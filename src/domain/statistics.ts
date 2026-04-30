import type { PlanDocument } from "../types";

export interface StatisticRow {
  key: string;
  minutes: number;
  count: number;
}

const KEY_SPLITTER = /[:：/｜|-]/u;

export function extractStatsKey(title: string): string {
  const [first] = title.split(KEY_SPLITTER);
  return (first || title).trim() || "未分类";
}

export function summarizePlanStats(plan: PlanDocument): StatisticRow[] {
  const totals = new Map<string, StatisticRow>();
  for (const activity of plan.activities) {
    const key = activity.statsKey?.trim() || extractStatsKey(activity.title);
    const current = totals.get(key) ?? { key, minutes: 0, count: 0 };
    totals.set(key, {
      key,
      minutes: current.minutes + Math.max(0, activity.desiredMinutes),
      count: current.count + 1,
    });
  }
  return [...totals.values()].sort((a, b) => b.minutes - a.minutes || a.key.localeCompare(b.key));
}

export function summarizeHistoryStats(history: PlanDocument[], limit = 10): StatisticRow[] {
  const seed: PlanDocument = {
    id: "history",
    name: "History",
    mode: "history",
    startTime: "00:00",
    durationMinutes: 0,
    createdAt: "",
    updatedAt: "",
    activities: history.slice(0, limit).flatMap((plan) => plan.activities),
  };
  return summarizePlanStats(seed);
}
