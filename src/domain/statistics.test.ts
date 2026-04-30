import { describe, expect, it } from "vitest";
import { extractStatsKey, summarizeHistoryStats, summarizePlanStats } from "./statistics";
import type { PlanDocument } from "../types";

function plan(name: string): PlanDocument {
  return {
    id: name,
    name,
    mode: "template",
    startTime: "08:00",
    durationMinutes: 120,
    createdAt: "2026-04-30T00:00:00.000Z",
    updatedAt: "2026-04-30T00:00:00.000Z",
    activities: [
      { id: `${name}-a`, title: "SuperMemo：核心复习", desiredMinutes: 50 },
      { id: `${name}-b`, title: "Work: Creativity", desiredMinutes: 70, statsKey: "Writing" },
    ],
  };
}

describe("statistics domain", () => {
  it("extracts default keys and respects manual overrides", () => {
    expect(extractStatsKey("SuperMemo：核心复习")).toBe("SuperMemo");
    expect(summarizePlanStats(plan("p")).map((row) => row.key)).toEqual(["Writing", "SuperMemo"]);
  });

  it("summarizes recent history", () => {
    const rows = summarizeHistoryStats([plan("a"), plan("b")]);

    expect(rows.find((row) => row.key === "Writing")?.minutes).toBe(140);
    expect(rows.find((row) => row.key === "SuperMemo")?.minutes).toBe(100);
  });
});
