import { describe, expect, it } from "vitest";
import { createBlankExecutionForDate, ensureDatePlan, toDateKey } from "../schedule";
import type { AppState, PlanDocument } from "../types";

const template: PlanDocument = {
  id: "template",
  name: "Template",
  mode: "template",
  startTime: "08:00",
  durationMinutes: 60,
  createdAt: "",
  updatedAt: "",
  activities: [{ id: "a", title: "A", desiredMinutes: 60 }],
};

describe("date plan helpers", () => {
  it("uses the local calendar date for date keys", () => {
    expect(toDateKey(new Date(2026, 3, 30, 23, 55))).toBe("2026-04-30");
  });

  it("creates a blank execution without copying template activities", () => {
    const plan = createBlankExecutionForDate("2026-04-30");

    expect(plan.mode).toBe("execution");
    expect(plan.dateKey).toBe("2026-04-30");
    expect(plan.hasPlanWindow).toBe(false);
    expect(plan.activities).toEqual([]);
  });

  it("ensures a missing date with a blank day", () => {
    const state: AppState = {
      schemaVersion: 3,
      templates: [template],
      activeTemplateId: "template",
      dailyPlans: {},
      history: [],
    };

    const next = ensureDatePlan(state, "2026-05-01");

    expect(next.dailyPlans["2026-05-01"].activities).toEqual([]);
    expect(next.dailyPlans["2026-05-01"].name).not.toContain("Template");
  });
});
