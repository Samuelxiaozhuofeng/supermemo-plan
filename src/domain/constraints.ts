import type { Activity } from "../types";

export interface SegmentAllocation {
  lengths: number[];
  conflict?: string;
}

export function distributeMinutes(total: number, weights: number[]): number[] {
  if (weights.length === 0) {
    return [];
  }

  const safeTotal = Math.max(0, Math.round(total));
  const effectiveWeights = weights.map((weight) => Math.max(0, weight));
  const weightTotal = effectiveWeights.reduce((sum, weight) => sum + weight, 0);
  if (weightTotal === 0) {
    return weights.map(() => 0);
  }

  const raw = effectiveWeights.map((weight) => (safeTotal * weight) / weightTotal);
  const floors = raw.map(Math.floor);
  let remaining = safeTotal - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (const item of order) {
    if (remaining <= 0) {
      break;
    }
    floors[item.index] += 1;
    remaining -= 1;
  }

  return floors;
}

export function allocateSegment(total: number, activities: Activity[]): SegmentAllocation {
  const activeActivities = activities.map((activity) => ({
    desired: Math.max(0, activity.desiredMinutes),
    fixed: Boolean(activity.fixed),
  }));
  const fixedTotal = activeActivities.reduce(
    (sum, activity) => sum + (activity.fixed ? activity.desired : 0),
    0,
  );

  if (fixedTotal > total) {
    return {
      lengths: activeActivities.map((activity) => (activity.fixed ? activity.desired : 0)),
      conflict: `Fixed activities require ${fixedTotal} minutes but only ${total} minutes are available.`,
    };
  }

  const floatingIndexes = activeActivities
    .map((activity, index) => ({ activity, index }))
    .filter(({ activity }) => !activity.fixed);
  const floatingLengths = distributeMinutes(
    total - fixedTotal,
    floatingIndexes.map(({ activity }) => activity.desired),
  );
  const lengths = activeActivities.map((activity) => (activity.fixed ? activity.desired : 0));

  floatingIndexes.forEach(({ index }, localIndex) => {
    lengths[index] = floatingLengths[localIndex] ?? 0;
  });

  return { lengths };
}
