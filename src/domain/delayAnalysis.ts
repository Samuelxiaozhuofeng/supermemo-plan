import type { DelayAnalysis, PlanDocument } from "../types";
import { computeSchedule } from "./computeSchedule";

export function analyzeDelays(plan: PlanDocument): DelayAnalysis {
  const rows = computeSchedule(plan).map((activity) => {
    const plannedMinutes = Math.max(0, activity.desiredMinutes);
    const actualMinutes = Math.max(0, activity.allocatedMinutes);
    const deltaMinutes = actualMinutes - plannedMinutes;
    const compressedMinutes = Math.max(0, activity.optLenMinutes - activity.allocatedMinutes);

    return {
      id: activity.id,
      title: activity.title,
      plannedMinutes,
      actualMinutes,
      deltaMinutes,
      compressedMinutes,
    };
  });

  return {
    rows,
    totalDelayMinutes: rows.reduce((sum, row) => sum + Math.max(0, row.deltaMinutes), 0),
    totalLostMinutes: rows.reduce((sum, row) => sum + Math.max(0, -row.deltaMinutes), 0),
    totalCompressedMinutes: rows.reduce((sum, row) => sum + row.compressedMinutes, 0),
  };
}
