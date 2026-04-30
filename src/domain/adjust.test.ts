import { describe, expect, it } from "vitest";
import { createRangeAdjustPreview } from "./adjust";
import type { PlanDocument } from "../types";

const plan: PlanDocument = {
  id: "p",
  name: "Adjust",
  mode: "execution",
  startTime: "08:00",
  durationMinutes: 90,
  createdAt: "2026-04-30T00:00:00.000Z",
  updatedAt: "2026-04-30T00:00:00.000Z",
  activities: [
    { id: "a", title: "A", desiredMinutes: 60 },
    { id: "b", title: "B", desiredMinutes: 60 },
    { id: "c", title: "C", desiredMinutes: 60 },
  ],
};

describe("adjust domain", () => {
  it("marks only selected-and-after rows for range adjust", () => {
    const preview = createRangeAdjustPreview(plan, "b");

    expect(preview.map((row) => row.status)).toEqual(["unmatched", "matched", "matched"]);
    expect(preview.map((row) => row.newMinutes)).toEqual([60, 30, 30]);
  });
});
