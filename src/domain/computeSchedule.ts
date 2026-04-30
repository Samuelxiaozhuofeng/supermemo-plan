import type { Activity, ComputedActivity, PlanDocument } from "../types";
import { formatTime, normalizeIntoWindow, parseTime } from "../time";
import { allocateSegment, distributeMinutes } from "./constraints";

interface Boundary {
  index: number;
  time: number;
  priority: number;
}

function setBoundary(boundaries: Map<number, Boundary>, boundary: Boundary): void {
  const existing = boundaries.get(boundary.index);
  if (!existing || boundary.priority >= existing.priority) {
    boundaries.set(boundary.index, boundary);
  }
}

function addActivityBoundaries(
  boundaries: Map<number, Boundary>,
  activity: Activity,
  index: number,
  planStart: number,
): void {
  if (activity.fixedStart) {
    setBoundary(boundaries, { index, time: normalizeIntoWindow(activity.fixedStart, planStart), priority: 1 });
  }
  if (activity.actualEnd) {
    setBoundary(boundaries, {
      index: index + 1,
      time: normalizeIntoWindow(activity.actualEnd, planStart),
      priority: 2,
    });
  }
  if (activity.actualStart) {
    setBoundary(boundaries, { index, time: normalizeIntoWindow(activity.actualStart, planStart), priority: 3 });
  }
}

function buildRow(
  activity: Activity,
  index: number,
  startMinutes: number,
  allocatedMinutes: number,
  optStarts: number[],
  optLengths: number[],
  planStart: number,
  conflict?: string,
): ComputedActivity {
  const optLenMinutes = optLengths[index] ?? 0;
  return {
    ...activity,
    index,
    optStartMinutes: optStarts[index] ?? planStart,
    optLenMinutes,
    startMinutes,
    endMinutes: startMinutes + allocatedMinutes,
    allocatedMinutes,
    delayMinutes: startMinutes - (optStarts[index] ?? planStart),
    percentOfOptimum: optLenMinutes > 0 ? Math.round((allocatedMinutes / optLenMinutes) * 100) : 100,
    isFixed: Boolean(activity.fixedStart),
    isFixedDuration: Boolean(activity.fixed),
    isStarted: Boolean(activity.actualStart),
    isDone: Boolean(activity.actualEnd),
    scheduleConflict: conflict,
  };
}

export { distributeMinutes };

export function computeSchedule(plan: PlanDocument): ComputedActivity[] {
  const planStart = parseTime(plan.startTime);
  const planEnd = planStart + Math.max(0, plan.durationMinutes);
  const activities = plan.activities;
  const optLengths = distributeMinutes(plan.durationMinutes, activities.map((activity) => activity.desiredMinutes));
  const optStarts: number[] = [];
  let optCursor = planStart;

  for (const length of optLengths) {
    optStarts.push(optCursor);
    optCursor += length;
  }

  const boundaries = new Map<number, Boundary>();
  setBoundary(boundaries, { index: 0, time: planStart, priority: 0 });
  setBoundary(boundaries, {
    index: activities.length,
    time: plan.terminatedAt ? normalizeIntoWindow(plan.terminatedAt, planStart) : planEnd,
    priority: plan.terminatedAt ? 4 : 0,
  });
  activities.forEach((activity, index) => addActivityBoundaries(boundaries, activity, index, planStart));

  const orderedBoundaries = [...boundaries.values()].sort((a, b) => a.index - b.index);
  const computed: ComputedActivity[] = [];

  for (let boundaryIndex = 0; boundaryIndex < orderedBoundaries.length - 1; boundaryIndex += 1) {
    const startBoundary = orderedBoundaries[boundaryIndex];
    const endBoundary = orderedBoundaries[boundaryIndex + 1];
    const startIndex = Math.max(0, startBoundary.index);
    const endIndex = Math.min(activities.length, endBoundary.index);
    if (startIndex >= endIndex) {
      continue;
    }

    const segmentStart = startBoundary.time;
    const segmentEnd = Math.max(segmentStart, endBoundary.time);
    const segmentActivities = activities.slice(startIndex, endIndex);
    const allocation = allocateSegment(segmentEnd - segmentStart, segmentActivities);
    let cursor = segmentStart;

    segmentActivities.forEach((activity, localIndex) => {
      const index = startIndex + localIndex;
      const allocatedMinutes = allocation.lengths[localIndex] ?? 0;
      computed[index] = buildRow(
        activity,
        index,
        cursor,
        allocatedMinutes,
        optStarts,
        optLengths,
        planStart,
        allocation.conflict,
      );
      cursor += allocatedMinutes;
    });
  }

  return activities.map((activity, index) => {
    return (
      computed[index] ??
      buildRow(activity, index, planEnd, 0, optStarts, optLengths, planStart, "Activity is outside plan boundaries.")
    );
  });
}

export function displayRange(activity: ComputedActivity): string {
  return `${formatTime(activity.startMinutes)}-${formatTime(activity.endMinutes)}`;
}
