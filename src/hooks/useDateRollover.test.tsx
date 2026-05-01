import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDateRollover } from "./useDateRollover";

describe("useDateRollover", () => {
  it("jumps when the local date changes", () => {
    const jumpToDate = vi.fn();
    const { rerender } = renderHook(
      ({ clock }) => useDateRollover(clock, jumpToDate),
      { initialProps: { clock: new Date(2026, 3, 30, 23, 59, 59) } },
    );

    rerender({ clock: new Date(2026, 4, 1, 0, 0, 0) });

    expect(jumpToDate).toHaveBeenCalledWith("2026-05-01");
  });
});
