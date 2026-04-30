import type { AppState } from "./types";
import { createSeedState } from "./sampleData";
import { createExecutionFromTemplate } from "./schedule";

const STORAGE_KEY = "supermemo-plan-core:v2";
const LEGACY_STORAGE_KEY = "supermemo-plan-core:v1";

function normalizeState(value: unknown): AppState {
  const seed = createSeedState();
  if (!value || typeof value !== "object") {
    return ensureToday(seed);
  }

  const candidate = value as Partial<AppState>;
  if (!Array.isArray(candidate.templates) || candidate.templates.length === 0) {
    return ensureToday(seed);
  }

  const activeTemplateId =
    candidate.activeTemplateId &&
    candidate.templates.some((template) => template.id === candidate.activeTemplateId)
      ? candidate.activeTemplateId
      : candidate.templates[0].id;

  return ensureToday({
    schemaVersion: 2,
    templates: candidate.templates.map((template) => ({
      ...template,
      mode: "template",
      activities: template.activities ?? [],
    })),
    activeTemplateId,
    today: candidate.today
      ? { ...candidate.today, mode: "execution" }
      : undefined,
    history: Array.isArray(candidate.history)
      ? candidate.history.map((plan) => ({ ...plan, mode: "history" }))
      : [],
  });
}

export function ensureToday(state: AppState): AppState {
  if (state.today) {
    return state;
  }

  const template = state.templates.find((item) => item.id === state.activeTemplateId) ?? state.templates[0];
  return { ...state, today: createExecutionFromTemplate(template) };
}

export function loadState(): AppState {
  if (typeof localStorage === "undefined") {
    return createSeedState();
  }

  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) {
    return ensureToday(createSeedState());
  }

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return ensureToday(createSeedState());
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
