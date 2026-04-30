# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run typecheck    # tsc -b (type-check only)
npm test             # Run all tests (vitest run)
npm run test:watch   # Vitest watch mode
```

## Codebase Architecture

React 19 + TypeScript SPA (Vite 8). No router, no state library — three views managed by a `ViewMode` state.

**Plan lifecycle**: Template → Execution (today) → History (archived execution). The app always auto-creates a "today" execution from the active template on load.

**Domain logic is pure** — all business logic lives in `src/domain/` modules with zero React dependencies, re-exported via `src/schedule.ts`. This is the most important architectural invariant; keep domain functions testable without React.

### Module layout

| Path | Purpose |
|---|---|
| `src/types.ts` | All shared types: `Activity`, `PlanDocument`, `AppState`, `ComputedActivity`, etc. |
| `src/domain/computeSchedule.ts` | Core algorithm: computes start/end/allocated times for each activity, handles fixed-start boundaries, segment allocation, and termination |
| `src/domain/constraints.ts` | `distributeMinutes` (proportional with largest-remainder), `allocateSegment` (handles fixed-duration activities within a time segment) |
| `src/domain/execution.ts` | Begin/complete/terminate/archive an activity or plan |
| `src/domain/editing.ts` | Split, merge, reset activities |
| `src/domain/adjust.ts` | Template adjustment workflow: preview rows comparing execution data vs template, apply selected adjustments |
| `src/domain/delayAnalysis.ts` | Analyze per-activity delays and compression |
| `src/domain/statistics.ts` | Aggregate stats by extracted key from activity titles |
| `src/domain/factories.ts` | Create blank templates, execution copies from templates, history-to-today copies |
| `src/domain/ids.ts` | UUID generation, immutable `touch()` helper (updates `updatedAt`) |
| `src/time.ts` | `parseTime`/`formatTime`/`formatDuration`/`nowAsTime`/`normalizeIntoWindow` |
| `src/storage.ts` | `loadState`/`saveState` via localStorage, schema migration, `ensureToday` |
| `src/exporters.ts` | Export to Markdown/CSV/JSON, import JSON backup |
| `src/sampleData.ts` | Seed state with default Chinese study template |
| `src/hooks/` | 6 React hooks: `usePlanState` (state root), `usePlanActions` (all mutations), `useActivityTimer` (1s clock + alarms + notifications), `useAdjustWorkflow`, `useImportExport`, `useColumnPreferences` |
| `src/components/` | 17 presentational components, all in one flat directory |
| `src/styles.css` | Single global CSS file, no CSS modules or CSS-in-JS |

### Data flow

`App.tsx` wires everything:
1. `usePlanState` loads/saves `AppState` (to localStorage) and manages view/selection
2. `computeSchedule` + `analyzeDelays` derive computed data from the active plan
3. `useActivityTimer` drives the clock, running timer, and alarms
4. `usePlanActions` provides all mutation callbacks
5. `useAdjustWorkflow` / `useImportExport` are self-contained feature hooks

### Key conventions

- **Immutability**: Domain functions return new objects — no mutation. The `touch()` helper sets `updatedAt` on any `PlanDocument`.
- **Chinese UI** with English source code (type names, function names, variable names in English).
- **No CSS modules, no CSS-in-JS** — single `styles.css` with BEM-like class names.
- **No form library** — plain controlled inputs throughout.
- **Tests co-located** in `src/` alongside source files (e.g., `schedule.test.ts` next to `schedule.ts`). Tests use `@testing-library/react` + `vitest` with jsdom environment. localStorage is stubbed per test via `vi.stubGlobal`.
