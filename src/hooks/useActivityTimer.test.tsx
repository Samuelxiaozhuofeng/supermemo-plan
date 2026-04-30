import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useActivityTimer } from "./useActivityTimer";
import type { PlanDocument } from "../types";

describe("useActivityTimer", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes reminder settings and unsupported notification status", () => {
    const { result } = renderHook(() => useActivityTimer());

    expect(result.current.notificationStatus).toBe("unsupported");
    act(() => result.current.setSettings({ preAlertMinutes: 3, snoozeMinutes: 10 }));
    expect(result.current.settings).toEqual({ preAlertMinutes: 3, snoozeMinutes: 10 });
  });

  it("counts from actual begin time instead of immediately ending a past plan window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-30T21:11:00"));
    const plan: PlanDocument = {
      id: "p",
      name: "Today",
      mode: "execution",
      startTime: "08:30",
      durationMinutes: 480,
      createdAt: "",
      updatedAt: "",
      activities: [{ id: "a", title: "A", desiredMinutes: 20, actualStart: "21:11" }],
    };

    const { result } = renderHook(() => useActivityTimer(plan));

    expect(result.current.remainingSeconds).toBe(20 * 60);
    expect(result.current.alarm).toBeUndefined();
  });
});
