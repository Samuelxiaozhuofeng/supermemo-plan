import { ActivityInspector } from "./ActivityInspector";
import { ActivityList } from "./ActivityList";
import { AdjustPanel } from "./AdjustPanel";
import { ExecutionControls } from "./ExecutionControls";
import { ExportControls } from "./ExportControls";
import { PlanControls } from "./PlanControls";
import { PlanEditorPanel } from "./PlanEditorPanel";
import { ReminderSettings } from "./ReminderSettings";
import { Timeline } from "./Timeline";
import type { RefObject } from "react";
import type {
  Activity,
  AdjustPreviewRow,
  ComputedActivity,
  NotificationStatus,
  PlanDocument,
  ReminderSettings as Settings,
} from "../types";

export function ExecutionWorkspace({
  activePlan,
  adjustRows,
  adjustSelection,
  canRun,
  computed,
  importInputRef,
  notificationStatus,
  readOnly,
  reminderSettings,
  selected,
  selectedId,
  actions,
  onAdjustApply,
  onAdjustCancel,
  onAdjustFromNow,
  onAdjustFromSelected,
  onAdjustToggle,
  onExport,
  onImport,
  onMuteCurrent,
  onReminderChange,
  onReorderActivity,
  onRequestNotification,
  onSelectActivity,
  onUpdateActivity,
}: {
  activePlan: PlanDocument;
  adjustRows?: AdjustPreviewRow[];
  adjustSelection: Set<string>;
  canRun: boolean;
  computed: ComputedActivity[];
  importInputRef: RefObject<HTMLInputElement | null>;
  notificationStatus: NotificationStatus;
  readOnly: boolean;
  reminderSettings: Settings;
  selected?: ComputedActivity;
  selectedId?: string;
  actions: {
    addActivity: () => void;
    deleteActivity: () => void;
    mergeSelected: () => void;
    resetPlan: () => void;
    splitSelected: () => void;
    updatePlan: (plan: PlanDocument) => void;
  };
  onAdjustApply: () => void;
  onAdjustCancel: () => void;
  onAdjustFromNow: () => void;
  onAdjustFromSelected: () => void;
  onAdjustToggle: (id: string) => void;
  onExport: (format: "md" | "csv" | "json") => void;
  onImport: (file: File) => void;
  onMuteCurrent: () => void;
  onReminderChange: (settings: Settings) => void;
  onReorderActivity: (sourceId: string, targetId: string) => void;
  onRequestNotification: () => void;
  onSelectActivity: (id: string) => void;
  onUpdateActivity: (id: string, patch: Partial<Activity>) => void;
}) {
  return (
    <section className="execution-workspace">
      <section className="main-panel">
        <div className="plan-strip">
          <PlanEditorPanel plan={activePlan} readOnly={readOnly} onChange={actions.updatePlan} />
          <PlanControls
            disabled={readOnly}
            onAdd={actions.addActivity}
            onDelete={actions.deleteActivity}
            onMerge={actions.mergeSelected}
            onReset={actions.resetPlan}
            onSplit={actions.splitSelected}
          />
        </div>
        {adjustRows ? (
          <AdjustPanel
            rows={adjustRows}
            selectedIds={adjustSelection}
            onApply={onAdjustApply}
            onCancel={onAdjustCancel}
            onToggle={onAdjustToggle}
          />
        ) : null}
        <Timeline plan={activePlan} rows={computed} selectedId={selectedId} onSelect={onSelectActivity} />
        <ActivityList
          readOnly={readOnly}
          rows={computed}
          selectedId={selectedId}
          onAddActivity={actions.addActivity}
          onChange={onUpdateActivity}
          onReorder={onReorderActivity}
          onSelect={onSelectActivity}
        />
      </section>
      <aside className="inspector-panel">
        <ActivityInspector activity={selected} readOnly={readOnly} onChange={onUpdateActivity} />
        <details className="utility-panel">
          <summary>更多</summary>
          <ExecutionControls
            canTerminate={canRun}
            onAdjustFromNow={onAdjustFromNow}
            onAdjustFromSelected={onAdjustFromSelected}
            onMuteCurrent={onMuteCurrent}
            onRequestNotification={onRequestNotification}
          />
          <ReminderSettings
            notificationStatus={notificationStatus}
            settings={reminderSettings}
            onChange={onReminderChange}
          />
          <ExportControls importInputRef={importInputRef} onExport={onExport} onImport={onImport} />
        </details>
      </aside>
    </section>
  );
}
