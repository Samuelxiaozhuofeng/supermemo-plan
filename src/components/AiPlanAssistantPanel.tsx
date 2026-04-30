import { Sparkles } from "lucide-react";
import type { AiPlanDraft } from "../types";

export function AiPlanAssistantPanel({
  draft,
  error,
  input,
  isConfigured,
  isGenerating,
  readOnly,
  onApplyDraft,
  onGenerateDraft,
  onInputChange,
  onOpenSettings,
}: {
  draft?: AiPlanDraft;
  error?: string;
  input: string;
  isConfigured: boolean;
  isGenerating: boolean;
  readOnly: boolean;
  onApplyDraft: () => void;
  onGenerateDraft: () => void;
  onInputChange: (value: string) => void;
  onOpenSettings: () => void;
}) {
  const canGenerate = !readOnly && isConfigured && input.trim().length > 0 && !isGenerating;

  return (
    <section className="ai-plan-panel">
      <div className="ai-plan-heading">
        <strong>AI 计划助手</strong>
        <button onClick={onOpenSettings} type="button">
          AI 设置
        </button>
      </div>
      <textarea
        disabled={readOnly}
        placeholder="例如：明天上午 9 点到 12 点，安排复习、写作和运动，写作至少 90 分钟。"
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
      />
      <div className="ai-plan-actions">
        <button disabled={!canGenerate} onClick={onGenerateDraft} type="button">
          <Sparkles size={16} /> {isGenerating ? "生成中" : "生成草稿"}
        </button>
        {!isConfigured ? <span>先在 AI 设置中配置 API Key、API URL 和 Model。</span> : null}
      </div>
      {error ? <p className="settings-error">{error}</p> : null}
      {draft ? (
        <div className="ai-draft">
          <div className="ai-draft-heading">
            <strong>草稿</strong>
            <button className="primary" onClick={onApplyDraft} type="button">
              应用到当前计划
            </button>
          </div>
          <div className="ai-draft-list">
            {draft.activities.map((activity, index) => (
              <div className="ai-draft-row" key={`${activity.title}-${index}`}>
                <span>{index + 1}</span>
                <strong>{activity.title}</strong>
                <small>
                  {activity.desiredMinutes} 分
                  {activity.fixedStart ? ` · ${activity.fixedStart}` : ""}
                  {activity.fixed ? " · 固定" : ""}
                </small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
