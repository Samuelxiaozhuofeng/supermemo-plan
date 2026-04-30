import type { Activity, PlanDocument } from "../types";
import { createId, touch } from "./ids";

export function splitActivity(plan: PlanDocument, activityId: string): PlanDocument {
  const index = plan.activities.findIndex((activity) => activity.id === activityId);
  if (index < 0) {
    return plan;
  }

  const activity = plan.activities[index];
  const firstLength = Math.max(1, Math.floor(activity.desiredMinutes / 2));
  const secondLength = Math.max(1, activity.desiredMinutes - firstLength);
  const second: Activity = {
    id: createId(),
    title: `${activity.title}（续）`,
    desiredMinutes: secondLength,
  };

  return touch({
    ...plan,
    activities: [
      ...plan.activities.slice(0, index),
      { ...activity, desiredMinutes: firstLength },
      second,
      ...plan.activities.slice(index + 1),
    ],
  });
}

export function mergeWithNext(plan: PlanDocument, activityId: string): PlanDocument {
  const index = plan.activities.findIndex((activity) => activity.id === activityId);
  if (index < 0 || index >= plan.activities.length - 1) {
    return plan;
  }

  const activity = plan.activities[index];
  const next = plan.activities[index + 1];
  const merged: Activity = {
    ...activity,
    title: `${activity.title} / ${next.title}`,
    desiredMinutes: activity.desiredMinutes + next.desiredMinutes,
    actualEnd: next.actualEnd ?? activity.actualEnd,
  };

  return touch({
    ...plan,
    activities: [...plan.activities.slice(0, index), merged, ...plan.activities.slice(index + 2)],
  });
}

export function resetExecution(plan: PlanDocument, keepFixedStart = true): PlanDocument {
  return touch({
    ...plan,
    terminatedAt: undefined,
    archivedAt: undefined,
    activities: plan.activities.map((activity) => ({
      ...activity,
      fixedStart: keepFixedStart ? activity.fixedStart : undefined,
      actualStart: undefined,
      actualEnd: undefined,
    })),
  });
}
