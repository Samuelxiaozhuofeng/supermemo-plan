import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchOpenAiModels, generatePlanDraft, modelsEndpoint } from "./openAiCompatible";
import type { AiSettings, PlanDocument } from "../types";

const settings: AiSettings = {
  apiKey: "secret",
  apiUrl: "https://api.example.test/v1",
  model: "gpt-test",
  models: ["gpt-test"],
};

const plan: PlanDocument = {
  id: "plan",
  name: "Test",
  mode: "execution",
  startTime: "09:00",
  durationMinutes: 180,
  createdAt: "",
  updatedAt: "",
  activities: [{ id: "a", title: "旧活动", desiredMinutes: 30 }],
};

describe("openAiCompatible service", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds the models endpoint from an OpenAI-compatible base URL", () => {
    expect(modelsEndpoint("https://api.openai.com/v1")).toBe("https://api.openai.com/v1/models");
    expect(modelsEndpoint("https://api.example.test/v1/models")).toBe("https://api.example.test/v1/models");
  });

  it("fetches and sorts model ids", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ data: [{ id: "z-model" }, { id: "a-model" }, { id: 1 }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchOpenAiModels({ apiKey: "secret", apiUrl: "https://api.example.test/v1" })).resolves.toEqual([
      "a-model",
      "z-model",
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/v1/models", {
      headers: { Authorization: "Bearer secret" },
      signal: undefined,
    });
  });

  it("throws visible request errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad key", { status: 401 })));

    await expect(fetchOpenAiModels({ apiKey: "secret", apiUrl: "https://api.example.test/v1" })).rejects.toThrow(
      "bad key",
    );
  });

  it("generates and validates a plan draft through chat completions", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  activities: [
                    { title: "写作", desiredMinutes: 90, fixed: true },
                    { title: "休息", desiredMinutes: 15, fixedStart: "10:30" },
                  ],
                }),
              },
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(generatePlanDraft({ input: "安排写作和休息", plan, settings })).resolves.toEqual({
      activities: [
        { title: "写作", desiredMinutes: 90, fixed: true, fixedStart: undefined },
        { title: "休息", desiredMinutes: 15, fixed: undefined, fixedStart: "10:30" },
      ],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/chat/completions",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer secret",
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
    );
  });
});
