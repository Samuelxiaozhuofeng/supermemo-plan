export type PlanMode = "template" | "execution" | "history";
export type ActivityQuality = "good" | "ok" | "bad";
export type ViewMode = "execution" | "insights" | "history";
export type ColumnKey =
  | "fixedStart"
  | "actualStart"
  | "actualEnd"
  | "delay"
  | "percent"
  | "notes";
export type NotificationStatus = "unsupported" | "default" | "granted" | "denied";

export interface Activity {
  id: string;
  title: string;
  desiredMinutes: number;
  fixedStart?: string;
  fixed?: boolean;
  actualStart?: string;
  actualEnd?: string;
  statsKey?: string;
  notes?: string;
  quality?: ActivityQuality;
  interruptions?: number;
}

export interface PlanDocument {
  id: string;
  name: string;
  mode: PlanMode;
  startTime: string;
  durationMinutes: number;
  activities: Activity[];
  sourceTemplateId?: string;
  terminatedAt?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComputedActivity extends Activity {
  index: number;
  optStartMinutes: number;
  optLenMinutes: number;
  startMinutes: number;
  endMinutes: number;
  allocatedMinutes: number;
  delayMinutes: number;
  percentOfOptimum: number;
  isFixed: boolean;
  isFixedDuration: boolean;
  isStarted: boolean;
  isDone: boolean;
  scheduleConflict?: string;
}

export interface DelayRow {
  id: string;
  title: string;
  plannedMinutes: number;
  actualMinutes: number;
  deltaMinutes: number;
  compressedMinutes: number;
}

export interface DelayAnalysis {
  rows: DelayRow[];
  totalDelayMinutes: number;
  totalLostMinutes: number;
  totalCompressedMinutes: number;
}

export interface AppState {
  schemaVersion: 2;
  templates: PlanDocument[];
  activeTemplateId: string;
  today?: PlanDocument;
  history: PlanDocument[];
}

export interface ReminderSettings {
  preAlertMinutes: number;
  snoozeMinutes: number;
}

export interface AiSettings {
  apiKey: string;
  apiUrl: string;
  model: string;
  models: string[];
}

export interface AiDraftActivity {
  title: string;
  desiredMinutes: number;
  fixedStart?: string;
  fixed?: boolean;
}

export interface AiPlanDraft {
  activities: AiDraftActivity[];
}

export interface AdjustPreviewRow {
  activityId: string;
  title: string;
  oldMinutes: number;
  newMinutes: number;
  deltaMinutes: number;
  executionActivityId?: string;
  status: "matched" | "unmatched";
}
