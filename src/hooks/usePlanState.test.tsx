import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePlanState } from "./usePlanState";
import type { AppState } from "../types";

function stubStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value),
  });
  return store;
}

describe("usePlanState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 30, 9));
    stubStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("migrates a legacy today execution and switches to history plan", () => {
    const state = {
      schemaVersion: 2,
      activeTemplateId: "b",
      templates: [
        { id: "a", name: "A", mode: "template", startTime: "08:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
        { id: "b", name: "B", mode: "template", startTime: "09:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
      ],
      today: { id: "t", name: "Legacy Today", mode: "execution", startTime: "09:00", durationMinutes: 60, createdAt: "2026-04-30T01:00:00.000Z", updatedAt: "", activities: [] },
      history: [
        { id: "h", name: "H", mode: "history", startTime: "10:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
      ],
    };
    localStorage.setItem("supermemo-plan-core:v2", JSON.stringify(state));

    const { result } = renderHook(() => usePlanState());
    expect(result.current.activeTemplate.name).toBe("B");
    expect(result.current.view).toBe("execution");
    expect(result.current.activePlan.mode).toBe("execution");
    expect(result.current.activePlan.name).toBe("Legacy Today");
    expect(result.current.state.dailyPlans["2026-04-30"]).toBeDefined();

    act(() => {
      result.current.setView("history");
      result.current.setSelectedHistoryId("h");
    });

    expect(result.current.activePlan.name).toBe("H");
    expect(result.current.readOnly).toBe(true);
  });

  it("creates a blank plan when jumping to an empty date", () => {
    const state: AppState = {
      schemaVersion: 3,
      activeTemplateId: "b",
      templates: [
        { id: "b", name: "B", mode: "template", startTime: "09:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
      ],
      dailyPlans: {},
      history: [],
    };
    localStorage.setItem("supermemo-plan-core:v3", JSON.stringify(state));

    const { result } = renderHook(() => usePlanState());
    act(() => {
      result.current.jumpToDate("2026-05-01");
    });

    expect(result.current.selectedDateKey).toBe("2026-05-01");
    expect(result.current.activePlan.activities).toEqual([]);
    expect(result.current.activePlan.hasPlanWindow).toBe(false);
  });
});
