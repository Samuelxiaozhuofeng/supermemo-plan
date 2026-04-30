import type { Activity, PlanDocument } from "../types";
import { touch } from "./ids";

export function beginActivity(plan: PlanDocument, activityId: string, startTime: string): PlanDocument {
  const activities = plan.activities.map((activity) => {
    if (activity.id === activityId) {
      return { ...activity, actualStart: startTime, actualEnd: undefined };
    }
    if (activity.actualStart && !activity.actualEnd) {
      return { ...activity, actualEnd: startTime };
    }
    return activity;
  });

  return touch({ ...plan, activities, terminatedAt: undefined });
}

export function terminatePlan(plan: PlanDocument, endTime: string): PlanDocument {
  const activities = plan.activities.map((activity) => {
    if (activity.actualStart && !activity.actualEnd) {
      return { ...activity, actualEnd: endTime };
    }
    return activity;
  });

  return touch({ ...plan, activities, terminatedAt: endTime });
}

export function completeCurrentActivity(plan: PlanDocument, endTime: string): PlanDocument {
  return touch({
    ...plan,
    activities: plan.activities.map((activity) =>
      activity.actualStart && !activity.actualEnd ? { ...activity, actualEnd: endTime } : activity,
    ),
  });
}

export function archiveExecution(plan: PlanDocument, endTime: string): PlanDocument {
  return {
    ...terminatePlan(plan, endTime),
    mode: "history",
    archivedAt: new Date().toISOString(),
  };
}

export function getRunningActivity(plan: PlanDocument): Activity | undefined {
  return plan.activities.find((activity) => activity.actualStart && !activity.actualEnd);
}
