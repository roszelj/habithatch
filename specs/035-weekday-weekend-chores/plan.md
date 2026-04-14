# Implementation Plan: Weekday & Weekend Chores

**Branch**: `035-weekday-weekend-chores` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/035-weekday-weekend-chores/spec.md`

## Summary

Separate the existing single chore list into two independent lists: weekday (Mon-Fri) and weekend (Sat-Sun). The kid's chore screen auto-displays only the list for the current day type. Parent Mode shows both lists. The data model changes from `chores: CategoryChores` to `weekdayChores: CategoryChores` + `weekendChores: CategoryChores` on ChildProfile, with migration of existing data to the weekday list.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, CSS Modules
**Storage**: Firestore `families/{fid}/profiles/{pid}` (cloud) + localStorage (local mode) — existing ChildProfile document gains `weekdayChores` and `weekendChores` fields
**Testing**: Manual playtesting (existing project pattern)
**Target Platform**: Web (mobile-responsive)
**Project Type**: Web application (kids virtual pet game)
**Performance Goals**: Day detection instant, no perceptible delay switching chore lists
**Constraints**: Kid-safe content only; backward-compatible data migration required
**Scale/Scope**: Modifications to data model, daily reset, chore hooks, Game.tsx, ChorePanel, ParentPanel

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Kids see only relevant chores for today — less clutter, more focused experience. No confusing day toggles for kids. |
| II. Ship & Iterate | PASS | Minimal new UI — mostly data model refactor with existing components reused. Single development cycle. |
| III. Kid-Safe Always | PASS | No PII. No new network features. No new dependencies. Day detection uses local device time only. |

**Gate result: PASS**

## Project Structure

### Documentation (this feature)

```text
specs/035-weekday-weekend-chores/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── types.ts               # MODIFY - add weekdayChores/weekendChores to ChildProfile, helper functions
├── hooks/
│   ├── useChores.ts           # MODIFY - accept active chore list based on day type
│   ├── useSaveData.ts         # MODIFY - migration logic, daily reset day-type awareness
│   └── useDailyReset.ts       # MODIFY - reset only the incoming day-type's chore list
├── components/
│   ├── Game.tsx               # MODIFY - compute active chores from day type, update cross-profile handlers
│   ├── ChorePanel.tsx         # MODIFY - minor: receives active chores (no structural change)
│   └── ParentPanel.tsx        # MODIFY - show both weekday and weekend sections with labels
└── firebase/
    └── profiles.ts            # VERIFY - ensure weekdayChores/weekendChores fields are persisted
```

**Structure Decision**: Single project, frontend-only. No new files — all changes are modifications to existing files.
