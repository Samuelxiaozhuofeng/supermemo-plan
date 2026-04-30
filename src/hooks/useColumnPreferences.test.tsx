import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useColumnPreferences } from "./useColumnPreferences";

describe("useColumnPreferences", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
  });

  it("toggles advanced columns", () => {
    const { result } = renderHook(() => useColumnPreferences());
    expect(result.current.visibleColumns.has("delay")).toBe(false);

    act(() => result.current.toggleColumn("delay"));

    expect(result.current.visibleColumns.has("delay")).toBe(true);
  });
});
