import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { exportPlanCsv, exportPlanMarkdown, exportStateJson, parseStateBackup } from "../exporters";
import type { AppState, PlanDocument, ViewMode } from "../types";

function downloadText(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function useImportExport({
  activePlan,
  setSelectedHistoryId,
  setSelectedId,
  setState,
  setView,
  state,
}: {
  activePlan: PlanDocument;
  setSelectedHistoryId: (id: string | undefined) => void;
  setSelectedId: (id: string | undefined) => void;
  setState: Dispatch<SetStateAction<AppState>>;
  setView: (view: ViewMode) => void;
  state: AppState;
}) {
  const importInputRef = useRef<HTMLInputElement>(null);

  function exportActive(format: "md" | "csv" | "json"): void {
    if (format === "json") {
      downloadText("supermemo-plan-backup.json", exportStateJson(state), "application/json");
      return;
    }

    const slug = activePlan.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "plan";
    if (format === "md") {
      downloadText(`${slug}.md`, exportPlanMarkdown(activePlan), "text/markdown");
      return;
    }
    downloadText(`${slug}.csv`, exportPlanCsv(activePlan), "text/csv");
  }

  async function importBackup(file: File): Promise<void> {
    setState(parseStateBackup(await file.text()));
    setView("execution");
    setSelectedId(undefined);
    setSelectedHistoryId(undefined);
  }

  return { exportActive, importBackup, importInputRef };
}
