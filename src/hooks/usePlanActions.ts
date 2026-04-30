import type { Dispatch, SetStateAction } from "react";
import {
  archiveExecution, beginActivity, completeCurrentActivity, copyHistoryToToday, createId, mergeWithNext,
  resetExecution, splitActivity, touch,
} from "../schedule";
import { nowAsTime } from "../time";
import type { Activity, AppState, ComputedActivity, PlanDocument, ViewMode } from "../types";

interface PlanActionArgs {
  activePlan: PlanDocument;
  readOnly: boolean;
  selected?: ComputedActivity;
  setAlarm: (value: undefined) => void;
  setMutedActivityId: (value: string | undefined) => void;
  setSelectedHistoryId: (value: string | undefined) => void;
  setSelectedId: (value: string | undefined) => void;
  setState: Dispatch<SetStateAction<AppState>>;
  setView: (value: ViewMode) => void;
  state: AppState;
  view: ViewMode;
}

export function usePlanActions(args: PlanActionArgs) {
  function updatePlan(nextPlan: PlanDocument): void {
    if (nextPlan.mode === "execution") {
      args.setState((current) => ({ ...current, today: touch(nextPlan) }));
      return;
    }
    if (nextPlan.mode === "history") {
      args.setState((current) => ({
        ...current,
        history: current.history.map((plan) => (plan.id === nextPlan.id ? touch(nextPlan) : plan)),
      }));
      return;
    }
    args.setState((current) => ({
      ...current,
      templates: current.templates.map((template) => (template.id === nextPlan.id ? touch(nextPlan) : template)),
      activeTemplateId: nextPlan.id,
    }));
  }

  function updateActivity(activityId: string, patch: Partial<Activity>): void {
    if (args.readOnly) return;
    updatePlan({
      ...args.activePlan,
      activities: args.activePlan.activities.map((activity) => (activity.id === activityId ? { ...activity, ...patch } : activity)),
    });
  }

  function addActivity(): void {
    if (args.readOnly) return;
    const index = args.selected
      ? args.activePlan.activities.findIndex((activity) => activity.id === args.selected?.id) + 1
      : 0;
    const activity: Activity = { id: createId(), title: "新活动", desiredMinutes: 25 };
    const activities = [...args.activePlan.activities];
    activities.splice(Math.max(0, index), 0, activity);
    updatePlan({ ...args.activePlan, activities });
    args.setSelectedId(activity.id);
  }

  function deleteActivity(): void {
    if (args.readOnly || !args.selected || args.activePlan.activities.length <= 1) return;
    updatePlan({
      ...args.activePlan,
      activities: args.activePlan.activities.filter((activity) => activity.id !== args.selected?.id),
    });
    args.setSelectedId(args.activePlan.activities[0]?.id);
  }

  function moveSelected(direction: -1 | 1): void {
    if (args.readOnly || !args.selected) return;
    const index = args.activePlan.activities.findIndex((activity) => activity.id === args.selected?.id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= args.activePlan.activities.length) return;
    const activities = [...args.activePlan.activities];
    [activities[index], activities[nextIndex]] = [activities[nextIndex], activities[index]];
    updatePlan({ ...args.activePlan, activities });
  }

  function reorderActivity(sourceId: string, targetId: string): void {
    if (args.readOnly || sourceId === targetId) return;
    const sourceIndex = args.activePlan.activities.findIndex((activity) => activity.id === sourceId);
    const targetIndex = args.activePlan.activities.findIndex((activity) => activity.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const activities = [...args.activePlan.activities];
    const [moved] = activities.splice(sourceIndex, 1);
    activities.splice(targetIndex, 0, moved);
    updatePlan({ ...args.activePlan, activities });
    args.setSelectedId(sourceId);
  }

  function beginSelected(): void {
    if (!args.state.today || args.view !== "execution" || !args.selected) return;
    args.setState((current) => ({
      ...current,
      today: beginActivity(current.today ?? args.state.today!, args.selected!.id, nowAsTime()),
    }));
    args.setMutedActivityId(undefined);
  }

  function completeCurrent(): void {
    if (!args.state.today) return;
    args.setState((current) => ({
      ...current,
      today: completeCurrentActivity(current.today ?? args.state.today!, nowAsTime()),
    }));
  }

  function terminateAndArchive(): void {
    if (!args.state.today) return;
    const archived = archiveExecution(args.state.today, nowAsTime());
    args.setState((current) => ({ ...current, today: undefined, history: [archived, ...current.history] }));
    args.setSelectedHistoryId(archived.id);
    args.setView("history");
    args.setAlarm(undefined);
  }

  function restoreHistoryAsToday(id: string): void {
    const plan = args.state.history.find((item) => item.id === id);
    if (!plan) return;
    const today = copyHistoryToToday(plan);
    args.setState((current) => ({ ...current, today }));
    args.setView("execution");
    args.setSelectedId(today.activities[0]?.id);
  }

  return {
    addActivity,
    beginSelected,
    completeCurrent,
    deleteActivity,
    deleteHistory: (id: string) =>
      args.setState((current) => ({ ...current, history: current.history.filter((plan) => plan.id !== id) })),
    mergeSelected: () => args.selected && updatePlan(mergeWithNext(args.activePlan, args.selected.id)),
    moveSelected,
    reorderActivity,
    resetPlan: () => updatePlan(resetExecution(args.activePlan, true)),
    restoreHistoryAsToday,
    splitSelected: () => args.selected && updatePlan(splitActivity(args.activePlan, args.selected.id)),
    terminateAndArchive,
    updateActivity,
    updatePlan,
  };
}
