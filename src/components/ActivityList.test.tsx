import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityInspector } from "./ActivityInspector";
import { ActivityList } from "./ActivityList";
import type { ComputedActivity } from "../types";

function row(id: string, index: number): ComputedActivity {
  return {
    id,
    index,
    title: id.toUpperCase(),
    desiredMinutes: 30,
    optStartMinutes: 480,
    optLenMinutes: 30,
    startMinutes: 480,
    endMinutes: 510,
    allocatedMinutes: 30,
    delayMinutes: 0,
    percentOfOptimum: 100,
    isFixed: false,
    isFixedDuration: false,
    isStarted: false,
    isDone: false,
  };
}

describe("ActivityList", () => {
  it("supports selecting, editing, fixed duration, adding, and dragging activities", () => {
    const onAddActivity = vi.fn();
    const onChange = vi.fn();
    const onReorder = vi.fn();
    const onSelect = vi.fn();
    render(
      <ActivityList
        rows={[row("a", 0), row("b", 1)]}
        selectedId="a"
        onAddActivity={onAddActivity}
        onChange={onChange}
        onReorder={onReorder}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByDisplayValue("A"));
    expect(onSelect).toHaveBeenCalledWith("a");

    fireEvent.change(screen.getByLabelText("活动名 1"), { target: { value: "Review" } });
    expect(onChange).toHaveBeenCalledWith("a", { title: "Review" });

    fireEvent.change(screen.getByLabelText("理想分钟 1"), { target: { value: "45" } });
    expect(onChange).toHaveBeenCalledWith("a", { desiredMinutes: 45 });

    fireEvent.click(screen.getByLabelText("固定 A"));
    expect(onChange).toHaveBeenCalledWith("a", { fixed: true });

    fireEvent.keyDown(screen.getByRole("region", { name: "今日活动" }), { key: "Enter" });
    expect(onAddActivity).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(screen.getByLabelText("活动名 1"), { key: "Enter" });
    expect(onAddActivity).toHaveBeenCalledTimes(1);

    const source = screen.getByDisplayValue("A").closest("article");
    const target = screen.getByDisplayValue("B").closest("article");
    const dataTransfer = {
      data: "",
      getData: vi.fn(() => "a"),
      setData: vi.fn((_type: string, value: string) => {
        dataTransfer.data = value;
      }),
    };

    fireEvent.dragStart(source!, { dataTransfer });
    fireEvent.drop(target!, { dataTransfer });

    expect(onReorder).toHaveBeenCalledWith("a", "b");
  });
});

describe("ActivityInspector", () => {
  it("edits advanced activity fields", () => {
    const onChange = vi.fn();
    render(<ActivityInspector activity={row("a", 0)} readOnly={false} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("统计 Key"), { target: { value: "reading" } });
    expect(onChange).toHaveBeenCalledWith("a", { statsKey: "reading" });

    fireEvent.click(screen.getByLabelText("固定时长"));
    expect(onChange).toHaveBeenCalledWith("a", { fixed: true });

    fireEvent.change(screen.getByLabelText("备注"), { target: { value: "Need focus" } });
    expect(onChange).toHaveBeenCalledWith("a", { notes: "Need focus" });
  });
});
