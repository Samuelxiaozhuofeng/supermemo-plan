import type { PlanDocument } from "../types";

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export function touch<T extends PlanDocument>(plan: T): T {
  return { ...plan, updatedAt: new Date().toISOString() };
}
