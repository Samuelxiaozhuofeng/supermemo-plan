import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App workflow", () => {
  beforeEach(() => {
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
});
