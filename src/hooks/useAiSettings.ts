import { useCallback, useEffect, useRef, useState } from "react";
import { loadAiSettings, saveAiSettings } from "../aiSettingsStorage";
import { fetchOpenAiModels } from "../services/openAiCompatible";
import type { AiSettings } from "../types";

const AUTO_FETCH_DELAY_MS = 800;

interface UseAiSettingsOptions {
  autoFetch?: boolean;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "模型拉取失败";
}

function applyModels(current: AiSettings, models: string[]): AiSettings {
  return {
    ...current,
    model: models.includes(current.model) ? current.model : models[0] ?? "",
    models,
  };
}

export function useAiSettings({ autoFetch = true }: UseAiSettingsOptions = {}) {
  const [settings, setSettings] = useState<AiSettings>(() => loadAiSettings());
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string>();
  const lastAutoFetchKey = useRef("");

  useEffect(() => saveAiSettings(settings), [settings]);

  const updateSettings = useCallback((patch: Partial<AiSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const refreshModels = useCallback(async () => {
    setIsLoadingModels(true);
    setModelsError(undefined);
    try {
      const models = await fetchOpenAiModels({
        apiKey: settings.apiKey,
        apiUrl: settings.apiUrl,
      });
      setSettings((current) => applyModels(current, models));
    } catch (error) {
      setModelsError(errorMessage(error));
    } finally {
      setIsLoadingModels(false);
    }
  }, [settings.apiKey, settings.apiUrl]);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    const apiKey = settings.apiKey.trim();
    const apiUrl = settings.apiUrl.trim();
    if (!apiKey || !apiUrl) {
      return;
    }

    const fetchKey = `${apiUrl}|${apiKey}`;
    if (lastAutoFetchKey.current === fetchKey) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      lastAutoFetchKey.current = fetchKey;
      setIsLoadingModels(true);
      setModelsError(undefined);
      void fetchOpenAiModels({ apiKey, apiUrl, signal: controller.signal })
        .then((models) => setSettings((current) => applyModels(current, models)))
        .catch((error) => {
          if (!controller.signal.aborted) {
            setModelsError(errorMessage(error));
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoadingModels(false);
          }
        });
    }, AUTO_FETCH_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [autoFetch, settings.apiKey, settings.apiUrl]);

  return {
    isLoadingModels,
    modelsError,
    refreshModels,
    settings,
    updateSettings,
  };
}
