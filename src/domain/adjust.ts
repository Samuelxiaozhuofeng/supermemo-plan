import type { AdjustPreviewRow, PlanDocument } from "../types";
import { computeSchedule } from "./computeSchedule";
import { touch } from "./ids";

export function createAdjustPreview(
  template: PlanDocument,
  execution: PlanDocument,
): AdjustPreviewRow[] {
  const executionRows = computeSchedule(execution);
  const usedExecutionIds = new Set<string>();

  return template.activities.map((templateActivity) => {
    const matched = executionRows.find(
      (row) => !usedExecutionIds.has(row.id) && row.title === templateActivity.title,
    );
    if (matched) {
      usedExecutionIds.add(matched.id);
      const newMinutes = Math.max(1, matched.allocatedMinutes);
      return {
        activityId: templateActivity.id,
        title: templateActivity.title,
        oldMinutes: templateActivity.desiredMinutes,
        newMinutes,
        deltaMinutes: newMinutes - templateActivity.desiredMinutes,
        executionActivityId: matched.id,
        status: "matched",
      };
    }

    return {
      activityId: templateActivity.id,
      title: templateActivity.title,
      oldMinutes: templateActivity.desiredMinutes,
      newMinutes: templateActivity.desiredMinutes,
      deltaMinutes: 0,
      status: "unmatched",
    };
  });
}

export function createRangeAdjustPreview(plan: PlanDocument, startActivityId?: string): AdjustPreviewRow[] {
  const rows = computeSchedule(plan);
  const startIndex = startActivityId ? rows.findIndex((row) => row.id === startActivityId) : 0;
  const firstAffectedIndex = Math.max(0, startIndex);

  return rows.map((row, index) => {
    const matched = index >= firstAffectedIndex;
    const newMinutes = matched ? Math.max(1, row.allocatedMinutes) : row.desiredMinutes;
    return {
      activityId: row.id,
      title: row.title,
      oldMinutes: row.desiredMinutes,
      newMinutes,
      deltaMinutes: newMinutes - row.desiredMinutes,
      executionActivityId: row.id,
      status: matched ? "matched" : "unmatched",
    };
  });
}

export function applyAdjustRows(
  template: PlanDocument,
  rows: AdjustPreviewRow[],
  selectedIds: Set<string>,
): PlanDocument {
  const minutesById = new Map(
    rows
      .filter((row) => selectedIds.has(row.activityId) && row.status === "matched")
      .map((row) => [row.activityId, row.newMinutes]),
  );

  return touch({
    ...template,
    activities: template.activities.map((activity) => {
      const nextMinutes = minutesById.get(activity.id);
      return nextMinutes ? { ...activity, desiredMinutes: nextMinutes } : activity;
    }),
  });
}
