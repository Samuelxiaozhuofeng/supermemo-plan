import { X } from "lucide-react";
import { AiSettingsPanel } from "./AiSettingsPanel";
import type { AiSettings } from "../types";

export function SettingsDialog({
  aiSettings,
  isLoadingModels,
  modelsError,
  onAiSettingsChange,
  onClose,
  onRefreshModels,
}: {
  aiSettings: AiSettings;
  isLoadingModels: boolean;
  modelsError?: string;
  onAiSettingsChange: (patch: Partial<AiSettings>) => void;
  onClose: () => void;
  onRefreshModels: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <section aria-label="设置" aria-modal="true" className="settings-dialog" role="dialog">
        <div className="settings-heading">
          <h2>设置</h2>
          <button aria-label="关闭设置" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>
        <div className="settings-tabs" role="tablist" aria-label="设置分类">
          <button aria-selected="true" className="active tab" role="tab" type="button">
            AI
          </button>
        </div>
        <AiSettingsPanel
          isLoadingModels={isLoadingModels}
          modelsError={modelsError}
          settings={aiSettings}
          onChange={onAiSettingsChange}
          onRefreshModels={onRefreshModels}
        />
      </section>
    </div>
  );
}
