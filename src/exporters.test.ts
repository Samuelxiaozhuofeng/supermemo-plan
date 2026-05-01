import { describe, expect, it } from "vitest";
import { exportPlanCsv, exportPlanMarkdown, exportStateJson, parseStateBackup } from "./exporters";
import type { AppState, PlanDocument } from "./types";

const plan: PlanDocument = {
  id: "p",
  name: "Export Test",
  mode: "execution",
  startTime: "08:00",
  durationMinutes: 60,
  createdAt: "2026-04-30T00:00:00.000Z",
  updatedAt: "2026-04-30T00:00:00.000Z",
  activities: [{ id: "a", title: "A", desiredMinutes: 60, notes: "note" }],
};

describe("exporters", () => {
  it("exports markdown and csv for a plan", () => {
    expect(exportPlanMarkdown(plan)).toContain("# Export Test");
    expect(exportPlanMarkdown(plan)).toContain("## 延误分析");
    expect(exportPlanCsv(plan)).toContain("title,start,end");
    expect(exportPlanCsv(plan)).toContain("A,08:00,09:00");
  });

  it("round-trips a JSON backup", () => {
    const state: AppState = {
      schemaVersion: 3,
      templates: [{ ...plan, mode: "template" }],
      activeTemplateId: "p",
      dailyPlans: { "2026-04-30": { ...plan, dateKey: "2026-04-30", hasPlanWindow: true } },
      history: [],
    };

    const parsed = parseStateBackup(exportStateJson(state));
    expect(parsed.schemaVersion).toBe(3);
    expect(parsed.templates[0].name).toBe("Export Test");
    expect(parsed.dailyPlans["2026-04-30"].name).toBe("Export Test");
  });

  it("imports a v2 backup with today into daily plans", () => {
    const parsed = parseStateBackup(JSON.stringify({
      schemaVersion: 2,
      templates: [{ ...plan, mode: "template" }],
      activeTemplateId: "p",
      today: { ...plan, createdAt: "2026-04-30T00:00:00.000Z" },
      history: [],
    }));

    expect(parsed.schemaVersion).toBe(3);
    expect(parsed.dailyPlans["2026-04-30"].name).toBe("Export Test");
  });
});
