# Implementation Plan: Manual Chore Refresh

**Branch**: `037-manual-chore-refresh` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/037-manual-chore-refresh/spec.md`

## Summary

Add a manual "Refresh" button to the chore panel that lets a child trigger the daily chore reset when the automatic reset (visibility change + 60-second interval) hasn't fired. The button only appears when the current date differs from `lastPlayedDate`. It reuses the existing reset logic from `useDailyReset` — no new data layer or storage changes needed.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: None new — builds on existing `useDailyReset` hook and `ChorePanel` component
**Storage**: N/A — no new storage. Uses existing `lastPlayedDate` and chore save mechanism
**Testing**: Not requested
**Target Platform**: Web (mobile-responsive PWA)
**Project Type**: Web application (React SPA)
**Performance Goals**: Refresh action must complete within 200ms (Fun-First Design: responsive feedback)
**Constraints**: Must be idempotent — multiple taps on the same day produce the same result
**Scale/Scope**: Single button addition + hook refactor to expose imperative reset

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Refresh button gives kids immediate control over stale state — reduces frustration. Visual feedback within 200ms. |
| II. Ship & Iterate | PASS | Minimal scope — one new button, one hook refactor. Single deliverable increment. |
| III. Kid-Safe Always | PASS | No new data collection. No new network features. Button is a local state operation. |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/037-manual-chore-refresh/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── hooks/
│   └── useDailyReset.ts     # MODIFY: return checkAndReset function for imperative use
├── components/
│   ├── Game.tsx              # MODIFY: pass lastPlayedDate + manual reset handler to ChorePanel
│   ├── ChorePanel.tsx        # MODIFY: add refresh button (visible when stale)
│   └── ChorePanel.module.css # MODIFY: add refresh button styles
```

**Structure Decision**: Single project structure (existing). Only 4 files modified, no new files created.
