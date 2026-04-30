import { useMemo } from "react";
import { AlarmModal } from "./components/AlarmModal";
import { AppHeader } from "./components/AppHeader";
import { ExecutionWorkspace } from "./components/ExecutionWorkspace";
import { HistoryPanel } from "./components/HistoryPanel";
import { InsightsPanel } from "./components/InsightsPanel";
import { StatusStrip } from "./components/StatusStrip";
import { useActivityTimer } from "./hooks/useActivityTimer";
import { useAdjustWorkflow } from "./hooks/useAdjustWorkflow";
import { useImportExport } from "./hooks/useImportExport";
import { usePlanActions } from "./hooks/usePlanActions";
import { usePlanState } from "./hooks/usePlanState";
import { analyzeDelays, computeSchedule } from "./schedule";

export default function App() {
  const planState = usePlanState();
  const computed = useMemo(() => computeSchedule(planState.activePlan), [planState.activePlan]);
  const analysis = useMemo(() => analyzeDelays(planState.activePlan), [planState.activePlan]);
  const selected = computed.find((activity) => activity.id === planState.selectedId) ?? computed[0];
  const timer = useActivityTimer(planState.state.today);
  const actions = usePlanActions({
    ...planState,
    selected,
    setAlarm: timer.setAlarm,
    setMutedActivityId: timer.setMutedActivityId,
  });
  const adjust = useAdjustWorkflow({
    activePlan: planState.activePlan,
    selectedId: selected?.id,
    updatePlan: actions.updatePlan,
  });
  const canRun = Boolean(planState.state.today && planState.view === "execution");
  const canUseToday = Boolean(planState.state.today);
  const importExport = useImportExport({
    activePlan: planState.activePlan,
    setSelectedHistoryId: planState.setSelectedHistoryId,
    setSelectedId: planState.setSelectedId,
    setState: planState.setState,
    setView: planState.setView,
    state: planState.state,
  });

  return (
    <main className="app-shell">
      <AppHeader
        canBegin={canRun}
        canComplete={canRun}
        canTerminate={canUseToday}
        clock={timer.clock}
        planName={planState.activePlan.name}
        remainingSeconds={timer.remainingSeconds}
        running={timer.runningComputed}
        onBegin={actions.beginSelected}
        onComplete={actions.completeCurrent}
        onTerminate={actions.terminateAndArchive}
      />
      <StatusStrip
        hasHistory={planState.state.history.length > 0}
        view={planState.view}
        onViewChange={planState.setView}
      />
      {planState.view === "execution" ? (
        <ExecutionWorkspace
          activePlan={planState.activePlan}
          actions={actions}
          adjustRows={adjust.rows}
          adjustSelection={adjust.selection}
          canRun={canRun}
          computed={computed}
          importInputRef={importExport.importInputRef}
          notificationStatus={timer.notificationStatus}
          readOnly={planState.readOnly}
          reminderSettings={timer.settings}
          selected={selected}
          selectedId={selected?.id}
          onAdjustApply={adjust.applyAdjust}
          onAdjustCancel={adjust.closeAdjust}
          onAdjustFromNow={adjust.openFromNowAdjust}
          onAdjustFromSelected={adjust.openFromSelectedAdjust}
          onAdjustToggle={adjust.toggleSelection}
          onExport={importExport.exportActive}
          onImport={(file) => void importExport.importBackup(file)}
          onMuteCurrent={timer.muteCurrent}
          onReminderChange={timer.setSettings}
          onReorderActivity={actions.reorderActivity}
          onRequestNotification={() => void timer.requestNotification()}
          onSelectActivity={planState.setSelectedId}
          onUpdateActivity={actions.updateActivity}
        />
      ) : null}
      {planState.view === "insights" ? (
        <InsightsPanel analysis={analysis} history={planState.state.history} plan={planState.activePlan} />
      ) : null}
      {planState.view === "history" ? (
        <section className="history-workspace">
          <HistoryPanel
            history={planState.state.history}
            selectedId={planState.selectedHistory?.id}
            onDelete={actions.deleteHistory}
            onRestore={actions.restoreHistoryAsToday}
            onSelect={(id) => {
              planState.setSelectedHistoryId(id);
              planState.setSelectedId(undefined);
            }}
          />
        </section>
      ) : null}
      {timer.alarm ? (
        <AlarmModal
          kind={timer.alarm.kind}
          snoozeMinutes={timer.settings.snoozeMinutes}
          title={timer.alarm.title}
          onClose={() => timer.setAlarm(undefined)}
          onSnooze={() => timer.snooze()}
        />
      ) : null}
    </main>
  );
}
