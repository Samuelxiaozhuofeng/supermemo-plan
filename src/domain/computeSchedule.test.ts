import { describe, expect, it } from "vitest";
import { computeSchedule } from "./computeSchedule";
import type { PlanDocument } from "../types";

function plan(overrides: Partial<PlanDocument> = {}): PlanDocument {
  return {
    id: "plan",
    name: "Test",
    mode: "template",
    startTime: "08:00",
    durationMinutes: 100,
    createdAt: "2026-04-30T00:00:00.000Z",
    updatedAt: "2026-04-30T00:00:00.000Z",
    activities: [
      { id: "a", title: "A", desiredMinutes: 60 },
      { id: "b", title: "B", desiredMinutes: 60 },
    ],
    ...overrides,
  };
}

describe("computeSchedule domain", () => {
  it("keeps fixed activity length and compresses floating rows", () => {
    const rows = computeSchedule(
      plan({
        activities: [
          { id: "a", title: "A", desiredMinutes: 60, fixed: true },
          { id: "b", title: "B", desiredMinutes: 60 },
          { id: "c", title: "C", desiredMinutes: 60 },
        ],
      }),
    );

    expect(rows.map((row) => row.allocatedMinutes)).toEqual([60, 20, 20]);
    expect(rows[0].isFixedDuration).toBe(true);
  });

  it("marks an explicit conflict when fixed rows exceed the window", () => {
    const rows = computeSchedule(
      plan({
        durationMinutes: 80,
        activities: [
          { id: "a", title: "A", desiredMinutes: 60, fixed: true },
          { id: "b", title: "B", desiredMinutes: 60, fixed: true },
        ],
      }),
    );

    expect(rows.map((row) => row.allocatedMinutes)).toEqual([60, 60]);
    expect(rows.every((row) => row.scheduleConflict)).toBe(true);
  });
});
