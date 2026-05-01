import { useCallback, useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "../storage";
import { ensureDatePlan, toDateKey } from "../schedule";
import type { AppState, ViewMode } from "../types";

export function usePlanState() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<ViewMode>("execution");
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
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
  const activeDayPlan = state.dailyPlans[selectedDateKey] ?? state.dailyPlans[toDateKey(new Date())] ?? activeTemplate;
  const activePlan = view === "history" && selectedHistory ? selectedHistory : activeDayPlan;

  const jumpToDate = useCallback((dateKey: string): void => {
    setState((current) => ensureDatePlan(current, dateKey));
    setSelectedDateKey(dateKey);
    setSelectedId(undefined);
    setView("execution");
  }, []);

  return {
    state,
    setState,
    view,
    setView,
    selectedDateKey,
    jumpToDate,
    selectedId,
    setSelectedId,
    selectedHistoryId,
    setSelectedHistoryId,
    activeTemplate,
    activeDayPlan,
    selectedHistory,
    activePlan,
    readOnly: view === "history",
  };
}
