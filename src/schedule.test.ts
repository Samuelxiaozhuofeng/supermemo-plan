import { describe, expect, it } from "vitest";
import type { PlanDocument } from "./types";
import {
  analyzeDelays,
  applyAdjustRows,
  archiveExecution,
  beginActivity,
  completeCurrentActivity,
  computeSchedule,
  createAdjustPreview,
  mergeWithNext,
  splitActivity,
  terminatePlan,
} from "./schedule";

function plan(overrides: Partial<PlanDocument> = {}): PlanDocument {
  return {
    id: "plan",
    name: "Test",
    mode: "template",
    startTime: "08:00",
    durationMinutes: 120,
    createdAt: "2026-04-30T00:00:00.000Z",
    updatedAt: "2026-04-30T00:00:00.000Z",
    activities: [
      { id: "a", title: "A", desiredMinutes: 60 },
      { id: "b", title: "B", desiredMinutes: 60 },
    ],
    ...overrides,
  };
}

describe("computeSchedule", () => {
  it("allocates floating activities proportionally", () => {
    const rows = computeSchedule(
      plan({
        durationMinutes: 90,
        activities: [
          { id: "a", title: "A", desiredMinutes: 60 },
          { id: "b", title: "B", desiredMinutes: 30 },
        ],
      }),
    );

    expect(rows.map((row) => row.allocatedMinutes)).toEqual([60, 30]);
    expect(rows.map((row) => row.startMinutes)).toEqual([480, 540]);
  });

  it("compresses overfull activities by ratio", () => {
    const rows = computeSchedule(
      plan({
        durationMinutes: 120,
        activities: [
          { id: "a", title: "A", desiredMinutes: 120 },
          { id: "b", title: "B", desiredMinutes: 120 },
        ],
      }),
    );

    expect(rows.map((row) => row.allocatedMinutes)).toEqual([60, 60]);
  });

  it("respects fixed start anchors", () => {
    const rows = computeSchedule(
      plan({
        durationMinutes: 180,
        activities: [
          { id: "a", title: "A", desiredMinutes: 60 },
          { id: "b", title: "B", desiredMinutes: 60, fixedStart: "09:00" },
          { id: "c", title: "C", desiredMinutes: 60 },
        ],
      }),
    );

    expect(rows[1].startMinutes).toBe(540);
    expect(rows.map((row) => row.allocatedMinutes)).toEqual([60, 60, 60]);
  });

  it("uses actual starts and ends as execution boundaries", () => {
    const rows = computeSchedule(
      plan({
        durationMinutes: 180,
        activities: [
          { id: "a", title: "A", desiredMinutes: 60, actualStart: "08:10", actualEnd: "09:20" },
          { id: "b", title: "B", desiredMinutes: 60 },
          { id: "c", title: "C", desiredMinutes: 60 },
        ],
      }),
    );

    expect(rows[0].allocatedMinutes).toBe(70);
    expect(rows[1].startMinutes).toBe(560);
    expect(rows[1].allocatedMinutes).toBe(50);
  });
});

describe("execution helpers", () => {
  it("begins one activity and closes the previously running activity", () => {
    const started = beginActivity(
      plan({
        activities: [
          { id: "a", title: "A", desiredMinutes: 60, actualStart: "08:00" },
          { id: "b", title: "B", desiredMinutes: 60 },
        ],
      }),
      "b",
      "08:45",
    );

    expect(started.activities[0].actualEnd).toBe("08:45");
    expect(started.activities[1].actualStart).toBe("08:45");
  });

  it("terminates the running activity", () => {
    const ended = terminatePlan(
      plan({ activities: [{ id: "a", title: "A", desiredMinutes: 60, actualStart: "08:00" }] }),
      "08:45",
    );

    expect(ended.terminatedAt).toBe("08:45");
    expect(ended.activities[0].actualEnd).toBe("08:45");
  });

  it("completes the current activity without terminating the plan", () => {
    const completed = completeCurrentActivity(
      plan({ activities: [{ id: "a", title: "A", desiredMinutes: 60, actualStart: "08:00" }] }),
      "08:35",
    );

    expect(completed.terminatedAt).toBeUndefined();
    expect(completed.activities[0].actualEnd).toBe("08:35");
  });

  it("keeps fixed activity duration and reallocates remaining time", () => {
    const rows = computeSchedule(
      plan({
        activities: [
          { id: "a", title: "A", desiredMinutes: 45, fixed: true },
          { id: "b", title: "B", desiredMinutes: 60 },
        ],
      }),
    );

    expect(rows[0].allocatedMinutes).toBe(45);
    expect(rows[0].isFixedDuration).toBe(true);
    expect(rows[1].allocatedMinutes).toBe(75);
  });

  it("archives an execution as history", () => {
    const archived = archiveExecution(
      plan({ mode: "execution", activities: [{ id: "a", title: "A", desiredMinutes: 60, actualStart: "08:00" }] }),
      "08:40",
    );

    expect(archived.mode).toBe("history");
    expect(archived.archivedAt).toBeTruthy();
    expect(archived.terminatedAt).toBe("08:40");
  });

  it("splits and merges activities", () => {
    const split = splitActivity(plan(), "a");
    expect(split.activities).toHaveLength(3);
    expect(split.activities[0].desiredMinutes + split.activities[1].desiredMinutes).toBe(60);

    const merged = mergeWithNext(split, split.activities[0].id);
    expect(merged.activities).toHaveLength(2);
    expect(merged.activities[0].desiredMinutes).toBe(60);
  });
});

describe("adjust", () => {
  it("previews and applies matched execution lengths to a template", () => {
    const template = plan({
      activities: [
        { id: "a", title: "A", desiredMinutes: 60 },
        { id: "b", title: "B", desiredMinutes: 60 },
      ],
    });
    const execution = plan({
      sourceTemplateId: "plan",
      activities: [
        { id: "ea", title: "A", desiredMinutes: 60, actualStart: "08:00", actualEnd: "09:30" },
        { id: "eb", title: "B", desiredMinutes: 60 },
      ],
    });

    const preview = createAdjustPreview(template, execution);
    expect(preview[0]).toMatchObject({ activityId: "a", newMinutes: 90, status: "matched" });

    const adjusted = applyAdjustRows(template, preview, new Set(["a"]));
    expect(adjusted.activities[0].desiredMinutes).toBe(90);
    expect(adjusted.activities[1].desiredMinutes).toBe(60);
  });
});

describe("analyzeDelays", () => {
  it("reports overruns and lost time", () => {
    const analysis = analyzeDelays(
      plan({
        durationMinutes: 120,
        activities: [
          { id: "a", title: "A", desiredMinutes: 60, actualStart: "08:00", actualEnd: "09:30" },
          { id: "b", title: "B", desiredMinutes: 60 },
        ],
      }),
    );

    expect(analysis.rows[0].deltaMinutes).toBe(30);
    expect(analysis.rows[1].deltaMinutes).toBe(-30);
    expect(analysis.totalDelayMinutes).toBe(30);
    expect(analysis.totalLostMinutes).toBe(30);
  });
});
