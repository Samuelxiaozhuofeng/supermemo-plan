import { describe, expect, it } from "vitest";
import { resetExecution } from "./editing";
import type { PlanDocument } from "../types";

const plan: PlanDocument = {
  id: "p",
  name: "Reset",
  mode: "execution",
  startTime: "08:00",
  durationMinutes: 60,
  createdAt: "2026-04-30T00:00:00.000Z",
  updatedAt: "2026-04-30T00:00:00.000Z",
  terminatedAt: "09:00",
  activities: [
    {
      id: "a",
      title: "A",
      desiredMinutes: 60,
      fixedStart: "08:15",
      actualStart: "08:15",
      actualEnd: "09:00",
    },
  ],
};

describe("editing domain", () => {
  it("resets execution fields while preserving fixed starts by default", () => {
    const reset = resetExecution(plan);

    expect(reset.terminatedAt).toBeUndefined();
    expect(reset.activities[0].fixedStart).toBe("08:15");
    expect(reset.activities[0].actualStart).toBeUndefined();
    expect(reset.activities[0].actualEnd).toBeUndefined();
  });

  it("can clear fixed starts during reset", () => {
    expect(resetExecution(plan, false).activities[0].fixedStart).toBeUndefined();
  });
});
