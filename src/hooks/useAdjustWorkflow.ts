import { useState } from "react";
import { applyAdjustRows, computeSchedule, createRangeAdjustPreview } from "../schedule";
import { normalizeIntoWindow, parseTime } from "../time";
import type { AdjustPreviewRow, PlanDocument } from "../types";

function currentStartActivityId(plan: PlanDocument): string | undefined {
  const planStart = parseTime(plan.startTime);
  const now = new Date();
  const nowMinutes = normalizeIntoWindow(
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    planStart,
  );
  return computeSchedule(plan).find((row) => row.endMinutes >= nowMinutes)?.id;
}

export function useAdjustWorkflow({
  activePlan,
  selectedId,
  updatePlan,
}: {
  activePlan: PlanDocument;
  selectedId?: string;
  updatePlan: (plan: PlanDocument) => void;
}) {
  const [rows, setRows] = useState<AdjustPreviewRow[]>();
  const [selection, setSelection] = useState<Set<string>>(new Set());

  function setPreview(nextRows: AdjustPreviewRow[]): void {
    setRows(nextRows);
    setSelection(new Set(nextRows.filter((row) => row.status === "matched").map((row) => row.activityId)));
  }

  function applyAdjust(): void {
    if (!rows) {
      return;
    }
    updatePlan(applyAdjustRows(activePlan, rows, selection));
    setRows(undefined);
  }

  return {
    applyAdjust,
    closeAdjust: () => setRows(undefined),
    openFromNowAdjust: () => setPreview(createRangeAdjustPreview(activePlan, currentStartActivityId(activePlan))),
    openFromSelectedAdjust: () => setPreview(createRangeAdjustPreview(activePlan, selectedId)),
    rows,
    selection,
    toggleSelection: (id: string) =>
      setSelection((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      }),
  };
}
