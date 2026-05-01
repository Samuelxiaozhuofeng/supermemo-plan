import type { AppState, PlanDocument } from "./types";
import { createBlankExecutionForDate, createId, toDateKey } from "./schedule";

const now = new Date().toISOString();

export function createSeedState(date = new Date()): AppState {
  const dateKey = toDateKey(date);
  const template: PlanDocument = {
    id: createId(),
    name: "学习与深度工作",
    mode: "template",
    startTime: "08:30",
    durationMinutes: 480,
    createdAt: now,
    updatedAt: now,
    activities: [
      { id: createId(), title: "启动：整理桌面与计划", desiredMinutes: 25 },
      { id: createId(), title: "SuperMemo：核心复习", desiredMinutes: 75 },
      { id: createId(), title: "深度工作：写作 / 项目", desiredMinutes: 160, fixedStart: "10:30" },
      { id: createId(), title: "午间休息", desiredMinutes: 45, fixedStart: "12:30" },
      { id: createId(), title: "阅读与摘录", desiredMinutes: 90 },
      { id: createId(), title: "邮件与杂务", desiredMinutes: 35 },
      { id: createId(), title: "复盘：延误分析", desiredMinutes: 20 },
    ],
  };

  return {
    schemaVersion: 3,
    templates: [template],
    activeTemplateId: template.id,
    dailyPlans: {
      [dateKey]: createBlankExecutionForDate(dateKey),
    },
    history: [],
  };
}
