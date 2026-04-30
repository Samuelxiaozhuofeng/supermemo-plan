import { RefreshCw } from "lucide-react";
import type { AiSettings } from "../types";

export function AiSettingsPanel({
  isLoadingModels,
  modelsError,
  settings,
  onChange,
  onRefreshModels,
}: {
  isLoadingModels: boolean;
  modelsError?: string;
  settings: AiSettings;
  onChange: (patch: Partial<AiSettings>) => void;
  onRefreshModels: () => void;
}) {
  const canRefresh = settings.apiKey.trim().length > 0 && settings.apiUrl.trim().length > 0 && !isLoadingModels;

  return (
    <section className="ai-settings-panel">
      <label>
        API URL
        <input
          placeholder="https://api.openai.com/v1"
          value={settings.apiUrl}
          onChange={(event) => onChange({ apiUrl: event.target.value })}
        />
      </label>
      <label>
        API Key
        <input
          autoComplete="off"
          type="password"
          value={settings.apiKey}
          onChange={(event) => onChange({ apiKey: event.target.value })}
        />
      </label>
      <div className="model-row">
        <label>
          Model
          <select
            disabled={settings.models.length === 0}
            value={settings.model}
            onChange={(event) => onChange({ model: event.target.value })}
          >
            {settings.models.length === 0 ? <option value="">暂无模型</option> : null}
            {settings.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>
        <button disabled={!canRefresh} onClick={onRefreshModels} type="button">
          <RefreshCw size={16} /> {isLoadingModels ? "拉取中" : "刷新"}
        </button>
      </div>
      {modelsError ? <p className="settings-error">{modelsError}</p> : null}
    </section>
  );
}
