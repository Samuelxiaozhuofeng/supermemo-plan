import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAiSettings } from "./useAiSettings";

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

describe("useAiSettings", () => {
  beforeEach(() => {
    stubStorage();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("auto-fetches models after API connection fields are configured", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ data: [{ id: "gpt-test" }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useAiSettings());
    act(() => {
      result.current.updateSettings({
        apiKey: "secret",
        apiUrl: "https://api.example.test/v1",
      });
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(850);
    });

    expect(result.current.settings.models).toEqual(["gpt-test"]);
    expect(result.current.settings.model).toBe("gpt-test");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/models",
      expect.objectContaining({
        headers: { Authorization: "Bearer secret" },
      }),
    );
  });
});
