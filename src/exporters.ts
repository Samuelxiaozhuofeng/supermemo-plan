import { analyzeDelays, computeSchedule } from "./schedule";
import type { AppState, PlanDocument } from "./types";
import { formatTime } from "./time";
import { normalizeState } from "./storage";

function csvEscape(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

export function exportPlanMarkdown(plan: PlanDocument): string {
  if (plan.hasPlanWindow === false) {
    return `# ${plan.name}\n\n尚未设置计划窗口。\n`;
  }
  const rows = computeSchedule(plan);
  const analysis = analyzeDelays(plan);
  const lines = [`# ${plan.name}`, "", `计划窗口：${plan.startTime} / ${plan.durationMinutes} 分钟`, ""];

  for (const row of rows) {
    lines.push(`- ${formatTime(row.startMinutes)} - ${row.title} (${row.allocatedMinutes} 分)`);
  }

  lines.push("", "## 延误分析", "");
  for (const row of analysis.rows) {
    const prefix = row.deltaMinutes > 0 ? "+" : "";
    lines.push(`- ${row.title}: ${prefix}${row.deltaMinutes} 分`);
  }

  return `${lines.join("\n")}\n`;
}

export function exportPlanCsv(plan: PlanDocument): string {
  const headers = [
    "title",
    "start",
    "end",
    "desiredMinutes",
    "allocatedMinutes",
    "delayMinutes",
    "percentOfOptimum",
    "notes",
  ];
  const rows = plan.hasPlanWindow === false ? [] : computeSchedule(plan).map((row) => [
    row.title,
    formatTime(row.startMinutes),
    formatTime(row.endMinutes),
    row.desiredMinutes,
    row.allocatedMinutes,
    row.delayMinutes,
    row.percentOfOptimum,
    row.notes ?? "",
  ]);

  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function parseStateBackup(text: string): AppState {
  const parsed = JSON.parse(text) as Partial<AppState>;
  if (!Array.isArray(parsed.templates) || parsed.templates.length === 0) {
    throw new Error("备份文件缺少 templates");
  }
  return normalizeState(parsed);
}
