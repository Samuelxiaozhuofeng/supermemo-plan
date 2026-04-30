import type { AiSettings } from "./types";

const AI_SETTINGS_KEY = "supermemo-plan-core:ai-settings:v1";

export const defaultAiSettings: AiSettings = {
  apiKey: "",
  apiUrl: "https://api.openai.com/v1",
  model: "",
  models: [],
};

function normalizeSettings(value: unknown): AiSettings {
  const candidate = value && typeof value === "object" ? value as Partial<AiSettings> : {};
  return {
    apiKey: typeof candidate.apiKey === "string" ? candidate.apiKey : defaultAiSettings.apiKey,
    apiUrl: typeof candidate.apiUrl === "string" ? candidate.apiUrl : defaultAiSettings.apiUrl,
    model: typeof candidate.model === "string" ? candidate.model : defaultAiSettings.model,
    models: Array.isArray(candidate.models)
      ? candidate.models.filter((model): model is string => typeof model === "string")
      : defaultAiSettings.models,
  };
}

export function loadAiSettings(): AiSettings {
  if (typeof localStorage === "undefined") {
    return defaultAiSettings;
  }

  const raw = localStorage.getItem(AI_SETTINGS_KEY);
  if (!raw) {
    return defaultAiSettings;
  }

  try {
    return normalizeSettings(JSON.parse(raw));
  } catch {
    return defaultAiSettings;
  }
}

export function saveAiSettings(settings: AiSettings): void {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}
