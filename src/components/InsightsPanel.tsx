import { DelayAnalysisPanel } from "./DelayAnalysisPanel";
import { StatisticsPanel } from "./StatisticsPanel";
import type { DelayAnalysis, PlanDocument } from "../types";

export function InsightsPanel({
  analysis,
  history,
  plan,
}: {
  analysis: DelayAnalysis;
  history: PlanDocument[];
  plan: PlanDocument;
}) {
  return (
    <section className="insights-panel">
      <DelayAnalysisPanel analysis={analysis} />
      <StatisticsPanel history={history} plan={plan} />
    </section>
  );
}
