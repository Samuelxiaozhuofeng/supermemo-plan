import type { PlanDocument } from "../types";
import { createId } from "./ids";

export function createBlankTemplate(): PlanDocument {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: "新计划模板",
    mode: "template",
    startTime: "08:00",
    durationMinutes: 240,
    createdAt: now,
    updatedAt: now,
    activities: [
      { id: createId(), title: "第一项活动", desiredMinutes: 50 },
      { id: createId(), title: "第二项活动", desiredMinutes: 50 },
      { id: createId(), title: "复盘", desiredMinutes: 20 },
    ],
  };
}

export function createExecutionFromTemplate(template: PlanDocument, date = new Date()): PlanDocument {
  const iso = date.toISOString();
  const dateLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(date);

  return {
    ...template,
    id: createId(),
    name: `${dateLabel} - ${template.name}`,
    mode: "execution",
    sourceTemplateId: template.id,
    terminatedAt: undefined,
    createdAt: iso,
    updatedAt: iso,
    activities: template.activities.map((activity) => ({
      id: createId(),
      title: activity.title,
      desiredMinutes: activity.desiredMinutes,
      fixedStart: activity.fixedStart,
      fixed: activity.fixed,
      statsKey: activity.statsKey,
      notes: activity.notes,
      interruptions: activity.interruptions,
    })),
  };
}

export function copyHistoryToToday(plan: PlanDocument): PlanDocument {
  const now = new Date().toISOString();
  return {
    ...plan,
    id: createId(),
    mode: "execution",
    name: `${plan.name}（复制）`,
    terminatedAt: undefined,
    archivedAt: undefined,
    createdAt: now,
    updatedAt: now,
    activities: plan.activities.map((activity) => ({
      ...activity,
      id: createId(),
      actualStart: undefined,
      actualEnd: undefined,
    })),
  };
}
