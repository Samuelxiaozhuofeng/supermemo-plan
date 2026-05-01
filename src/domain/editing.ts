import type { Activity, PlanDocument } from "../types";
import { createId, touch } from "./ids";

type ScheduleSlotField = "fixedStart" | "actualStart" | "actualEnd";
type ScheduleSlot = Pick<Activity, ScheduleSlotField>;

const SCHEDULE_SLOT_FIELDS: ScheduleSlotField[] = ["fixedStart", "actualStart", "actualEnd"];

function scheduleSlot(activity: Activity): ScheduleSlot {
  return {
    fixedStart: activity.fixedStart,
    actualStart: activity.actualStart,
    actualEnd: activity.actualEnd,
  };
}

function withScheduleSlot(activity: Activity, slot: ScheduleSlot): Activity {
  const next: Activity = { ...activity };
  for (const field of SCHEDULE_SLOT_FIELDS) {
    if (slot[field]) {
      next[field] = slot[field];
    } else {
      delete next[field];
    }
  }
  return next;
}

export function reorderActivities(plan: PlanDocument, sourceId: string, targetId: string): PlanDocument {
  if (sourceId === targetId) {
    return plan;
  }
  const sourceIndex = plan.activities.findIndex((activity) => activity.id === sourceId);
  const targetIndex = plan.activities.findIndex((activity) => activity.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) {
    return plan;
  }

  const slots = plan.activities.map(scheduleSlot);
  const activities = [...plan.activities];
  const [moved] = activities.splice(sourceIndex, 1);
  activities.splice(targetIndex, 0, moved);

  return touch({
    ...plan,
    activities: activities.map((activity, index) => withScheduleSlot(activity, slots[index] ?? {})),
  });
}

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
