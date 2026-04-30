import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App workflow", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
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
  });

  it("opens directly on today execution without template controls", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "今日执行" })).toHaveClass("active");
    expect(screen.queryByText("模板")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /创建今日副本/ })).not.toBeInTheDocument();
    expect(screen.getByText("时间轴")).toBeInTheDocument();
    expect(screen.getByLabelText("今日活动")).toBeInTheDocument();
  });

  it("runs begin, complete, terminate, and shows insights", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Begin/ }));
    expect(await screen.findByText(/剩余/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /完成当前/ }));
    fireEvent.click(screen.getByRole("button", { name: /归档/ }));
    expect(screen.getByText("历史记录")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "洞察" }));
    expect(screen.getByText("延误分析")).toBeInTheDocument();
    expect(screen.getByText("活动统计")).toBeInTheDocument();
  });

  it("keeps execution surface compact and moves advanced fields to details", () => {
    render(<App />);

    expect(screen.getByText("活动详情")).toBeInTheDocument();
    expect(screen.getByLabelText("统计 Key")).toBeInTheDocument();
    expect(screen.queryByText("列")).not.toBeInTheDocument();
    expect(screen.queryByText("Adjust 模板")).not.toBeInTheDocument();
  });

  it("opens AI settings from the homepage settings button", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "设置" }));

    expect(screen.getByRole("dialog", { name: "设置" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "AI" })).toBeInTheDocument();
    expect(screen.getByLabelText("API URL")).toHaveValue("https://api.openai.com/v1");
    expect(screen.getByLabelText("API Key")).toBeInTheDocument();
  });

  it("generates an AI plan draft and applies it after confirmation", async () => {
    localStorage.setItem(
      "supermemo-plan-core:ai-settings:v1",
      JSON.stringify({
        apiKey: "secret",
        apiUrl: "https://api.example.test/v1",
        model: "gpt-test",
        models: ["gpt-test"],
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    activities: [
                      { title: "写作", desiredMinutes: 90, fixed: true },
                      { title: "复盘", desiredMinutes: 20 },
                    ],
                  }),
                },
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/明天上午/), {
      target: { value: "安排写作 90 分钟，再复盘 20 分钟" },
    });
    fireEvent.click(screen.getByRole("button", { name: /生成草稿/ }));

    expect(await screen.findByText("草稿")).toBeInTheDocument();
    expect(screen.getByText("写作")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "应用到当前计划" }));

    expect(screen.getByDisplayValue("写作")).toBeInTheDocument();
    expect(screen.getByDisplayValue("复盘")).toBeInTheDocument();
  });
});
