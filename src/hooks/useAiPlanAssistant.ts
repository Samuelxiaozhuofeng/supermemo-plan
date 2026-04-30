import { useCallback, useState } from "react";
import { createId } from "../schedule";
import { generatePlanDraft } from "../services/openAiCompatible";
import type { Activity, AiPlanDraft, AiSettings, PlanDocument } from "../types";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "计划生成失败";
}

function draftToActivities(draft: AiPlanDraft): Activity[] {
  return draft.activities.map((activity) => ({
    id: createId(),
    title: activity.title,
    desiredMinutes: activity.desiredMinutes,
    fixedStart: activity.fixedStart,
    fixed: activity.fixed,
  }));
}

export function useAiPlanAssistant({
  plan,
  settings,
  updatePlan,
  setSelectedId,
}: {
  plan: PlanDocument;
  settings: AiSettings;
  updatePlan: (plan: PlanDocument) => void;
  setSelectedId: (id: string | undefined) => void;
}) {
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<AiPlanDraft>();
  const [error, setError] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraft = useCallback(async () => {
    setIsGenerating(true);
    setError(undefined);
    try {
      setDraft(await generatePlanDraft({ input, plan, settings }));
    } catch (nextError) {
      setError(errorMessage(nextError));
    } finally {
      setIsGenerating(false);
    }
  }, [input, plan, settings]);

  const applyDraft = useCallback(() => {
    if (!draft) {
      return;
    }

    const activities = draftToActivities(draft);
    updatePlan({ ...plan, activities });
    setSelectedId(activities[0]?.id);
    setDraft(undefined);
  }, [draft, plan, setSelectedId, updatePlan]);

  return {
    applyDraft,
    draft,
    error,
    generateDraft,
    input,
    isGenerating,
    setInput,
  };
}
