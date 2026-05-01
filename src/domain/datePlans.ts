import type { AppState, PlanDocument } from "../types";
import { createId } from "./ids";

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(dateKey: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function addDays(dateKey: string, days: number): string {
  const date = dateFromKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(dateFromKey(dateKey));
}

export function createBlankExecutionForDate(dateKey: string): PlanDocument {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: `${formatDateLabel(dateKey)} 空白日`,
    mode: "execution",
    startTime: "00:00",
    durationMinutes: 0,
    activities: [],
    dateKey,
    hasPlanWindow: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeExecutionDate(plan: PlanDocument, dateKey: string): PlanDocument {
  return {
    ...plan,
    mode: "execution",
    dateKey,
    hasPlanWindow: plan.hasPlanWindow ?? plan.durationMinutes > 0,
    activities: plan.activities ?? [],
  };
}

export function ensureDatePlan(state: AppState, dateKey: string): AppState {
  if (state.dailyPlans[dateKey]) {
    return state;
  }
  return {
    ...state,
    dailyPlans: {
      ...state.dailyPlans,
      [dateKey]: createBlankExecutionForDate(dateKey),
    },
  };
}
