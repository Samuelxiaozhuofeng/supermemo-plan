import type { AiDraftActivity, AiPlanDraft, AiSettings, PlanDocument } from "../types";

export interface FetchModelsArgs {
  apiKey: string;
  apiUrl: string;
  signal?: AbortSignal;
}

export interface GeneratePlanDraftArgs {
  input: string;
  plan: PlanDocument;
  settings: AiSettings;
}

interface ModelListResponse {
  data?: Array<{ id?: unknown }>;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
}

interface DraftPayload {
  activities?: unknown;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/u;

function endpoint(apiUrl: string, path: "models" | "chat/completions"): string {
  const trimmed = apiUrl.trim().replace(/\/+$/u, "");
  if (!trimmed) {
    throw new Error("API URL 不能为空");
  }
  if (trimmed.endsWith(`/${path}`)) {
    return trimmed;
  }
  return `${trimmed}/${path}`;
}

function requireConfigured(settings: AiSettings): { apiKey: string; apiUrl: string; model: string } {
  const apiKey = settings.apiKey.trim();
  const apiUrl = settings.apiUrl.trim();
  const model = settings.model.trim();
  if (!apiKey) {
    throw new Error("API Key 不能为空");
  }
  if (!apiUrl) {
    throw new Error("API URL 不能为空");
  }
  if (!model) {
    throw new Error("请先选择模型");
  }
  return { apiKey, apiUrl, model };
}

export function modelsEndpoint(apiUrl: string): string {
  return endpoint(apiUrl, "models");
}

export async function fetchOpenAiModels({ apiKey, apiUrl, signal }: FetchModelsArgs): Promise<string[]> {
  const token = apiKey.trim();
  if (!token) {
    throw new Error("API Key 不能为空");
  }

  const response = await fetch(modelsEndpoint(apiUrl), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `模型拉取失败：HTTP ${response.status}`);
  }

  const payload = await response.json() as ModelListResponse;
  const models = (payload.data ?? [])
    .map((item) => item.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .sort((a, b) => a.localeCompare(b));

  if (models.length === 0) {
    throw new Error("接口未返回可用模型");
  }

  return models;
}

function buildPlanPrompt(input: string, plan: PlanDocument): string {
  const currentActivities = plan.activities
    .map((activity) => `- ${activity.title}: ${activity.desiredMinutes} 分`)
    .join("\n");

  return [
    "请根据用户的自然语言需求生成一个可执行的活动列表草稿。",
    `计划名称：${plan.name}`,
    `计划开始：${plan.startTime}`,
    `计划总时长：${plan.durationMinutes} 分钟`,
    "当前活动：",
    currentActivities || "无",
    "用户需求：",
    input,
    "只返回 JSON，不要 Markdown。格式：",
    "{\"activities\":[{\"title\":\"活动名\",\"desiredMinutes\":25,\"fixedStart\":\"09:00\",\"fixed\":false}]}",
    "规则：title 必须非空；desiredMinutes 必须为 1 到 1440 的整数；fixedStart 可省略，若提供必须为 HH:mm；fixed 可省略。",
  ].join("\n");
}

function parseJsonObject(text: string): DraftPayload {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/u);
  const jsonText = fenced?.[1] ?? trimmed;
  return JSON.parse(jsonText) as DraftPayload;
}

function normalizeDraftActivity(value: unknown): AiDraftActivity | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const item = value as Partial<AiDraftActivity>;
  const title = typeof item.title === "string" ? item.title.trim() : "";
  const desiredMinutes = Math.round(Number(item.desiredMinutes));
  if (!title || !Number.isFinite(desiredMinutes) || desiredMinutes < 1 || desiredMinutes > 1440) {
    return undefined;
  }

  const fixedStart = typeof item.fixedStart === "string" && TIME_PATTERN.test(item.fixedStart)
    ? item.fixedStart
    : undefined;

  return {
    title,
    desiredMinutes,
    fixedStart,
    fixed: item.fixed === true ? true : undefined,
  };
}

function normalizeDraft(payload: DraftPayload): AiPlanDraft {
  const activities = Array.isArray(payload.activities)
    ? payload.activities.flatMap((item) => {
      const activity = normalizeDraftActivity(item);
      return activity ? [activity] : [];
    })
    : [];

  if (activities.length === 0) {
    throw new Error("AI 未返回有效活动草稿");
  }

  return { activities };
}

export async function generatePlanDraft({ input, plan, settings }: GeneratePlanDraftArgs): Promise<AiPlanDraft> {
  if (!input.trim()) {
    throw new Error("请输入计划需求");
  }
  const { apiKey, apiUrl, model } = requireConfigured(settings);
  const response = await fetch(endpoint(apiUrl, "chat/completions"), {
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个日程计划助手，只返回符合要求的 JSON。",
        },
        {
          role: "user",
          content: buildPlanPrompt(input, plan),
        },
      ],
      temperature: 0.2,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `计划生成失败：HTTP ${response.status}`);
  }

  const payload = await response.json() as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("AI 响应缺少文本内容");
  }

  return normalizeDraft(parseJsonObject(content));
}
