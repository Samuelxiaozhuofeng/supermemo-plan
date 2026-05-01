import type { AppState, PlanDocument } from "./types";
import { createSeedState } from "./sampleData";
import { ensureDatePlan, normalizeExecutionDate, toDateKey } from "./schedule";

const STORAGE_KEY = "supermemo-plan-core:v3";
const LEGACY_V2_STORAGE_KEY = "supermemo-plan-core:v2";
const LEGACY_STORAGE_KEY = "supermemo-plan-core:v1";

type LegacyState = Partial<Omit<AppState, "schemaVersion">> & {
  schemaVersion?: number;
  today?: PlanDocument;
};

function dateKeyForLegacyPlan(plan: PlanDocument | undefined, fallback: string): string {
  if (!plan) {
    return fallback;
  }
  if (plan.dateKey) {
    return plan.dateKey;
  }
  const source = plan.createdAt || plan.updatedAt;
  const date = source ? new Date(source) : undefined;
  return date && !Number.isNaN(date.getTime()) ? toDateKey(date) : fallback;
}

export function normalizeState(value: unknown, now = new Date()): AppState {
  const seed = createSeedState(now);
  const currentDateKey = toDateKey(now);
  if (!value || typeof value !== "object") {
    return ensureDatePlan(seed, currentDateKey);
  }

  const candidate = value as LegacyState;
  if (!Array.isArray(candidate.templates) || candidate.templates.length === 0) {
    return ensureDatePlan(seed, currentDateKey);
  }

  const activeTemplateId =
    candidate.activeTemplateId &&
    candidate.templates.some((template) => template.id === candidate.activeTemplateId)
      ? candidate.activeTemplateId
      : candidate.templates[0].id;
  const dailyPlans: Record<string, PlanDocument> = {};
  if (candidate.dailyPlans && typeof candidate.dailyPlans === "object") {
    for (const [dateKey, plan] of Object.entries(candidate.dailyPlans)) {
      if (plan) {
        dailyPlans[dateKey] = normalizeExecutionDate(plan, dateKey);
      }
    }
  }
  if (candidate.today) {
    const dateKey = dateKeyForLegacyPlan(candidate.today, currentDateKey);
    dailyPlans[dateKey] = normalizeExecutionDate(candidate.today, dateKey);
  }

  return ensureDatePlan({
    schemaVersion: 3,
    templates: candidate.templates.map((template) => ({
      ...template,
      mode: "template",
      activities: template.activities ?? [],
    })),
    activeTemplateId,
    dailyPlans,
    history: Array.isArray(candidate.history)
      ? candidate.history.map((plan) => ({ ...plan, mode: "history" }))
      : [],
  }, currentDateKey);
}

export function loadState(): AppState {
  if (typeof localStorage === "undefined") {
    return createSeedState();
  }

  const raw =
    localStorage.getItem(STORAGE_KEY) ??
    localStorage.getItem(LEGACY_V2_STORAGE_KEY) ??
    localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) {
    return ensureDatePlan(createSeedState(), toDateKey(new Date()));
  }

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return ensureDatePlan(createSeedState(), toDateKey(new Date()));
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
