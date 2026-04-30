import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    stubStorage();
  });

  it("creates a today execution from the active template and switches to history plan", () => {
    const state: AppState = {
      schemaVersion: 2,
      activeTemplateId: "b",
      templates: [
        { id: "a", name: "A", mode: "template", startTime: "08:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
        { id: "b", name: "B", mode: "template", startTime: "09:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
      ],
      history: [
        { id: "h", name: "H", mode: "history", startTime: "10:00", durationMinutes: 60, createdAt: "", updatedAt: "", activities: [] },
      ],
    };
    localStorage.setItem("supermemo-plan-core:v2", JSON.stringify(state));

    const { result } = renderHook(() => usePlanState());
    expect(result.current.activeTemplate.name).toBe("B");
    expect(result.current.view).toBe("execution");
    expect(result.current.activePlan.mode).toBe("execution");
    expect(result.current.activePlan.name).toContain("B");

    act(() => {
      result.current.setView("history");
      result.current.setSelectedHistoryId("h");
    });

    expect(result.current.activePlan.name).toBe("H");
    expect(result.current.readOnly).toBe(true);
  });
});
