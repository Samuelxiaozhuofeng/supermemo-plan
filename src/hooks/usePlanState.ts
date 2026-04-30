import { useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "../storage";
import type { AppState, ViewMode } from "../types";

export function usePlanState() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<ViewMode>("execution");
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>();

  useEffect(() => saveState(state), [state]);

  const activeTemplate = useMemo(
    () => state.templates.find((template) => template.id === state.activeTemplateId) ?? state.templates[0],
    [state.activeTemplateId, state.templates],
  );
  const selectedHistory = useMemo(
    () => state.history.find((plan) => plan.id === selectedHistoryId) ?? state.history[0],
    [selectedHistoryId, state.history],
  );
  const activePlan = view === "history" && selectedHistory ? selectedHistory : state.today ?? activeTemplate;

  return {
    state,
    setState,
    view,
    setView,
    selectedId,
    setSelectedId,
    selectedHistoryId,
    setSelectedHistoryId,
    activeTemplate,
    selectedHistory,
    activePlan,
    readOnly: view === "history",
  };
}
