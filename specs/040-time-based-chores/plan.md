# Implementation Plan: Time-Based Chore List in Kid View

**Branch**: `040-time-based-chores` | **Date**: 2026-04-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/040-time-based-chores/spec.md`

## Summary

Add a `TimedChoreSection` React Native component that displays only the chores for the current time period (morning/afternoon/evening) inline on the main pet view screen, below the Feed action button. Children can mark chores done directly in this section using the existing `checkOffChore` interaction model. Time period is derived from device local time and auto-refreshes when the app remains open across a time boundary.

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: React Native 0.81.5, Expo ~54, React 19  
**Storage**: N/A — reads existing in-memory chore state from `useChores` hook; persists via existing `onSaveProfile` mechanism in `Game.tsx`  
**Testing**: Manual playtesting per constitution; no automated test runner configured  
**Target Platform**: iOS and Android (React Native via Expo)  
**Project Type**: Mobile app  
**Performance Goals**: Section renders within existing ScrollView paint cycle; time-check interval ≤ 60s  
**Constraints**: Follows Apple HIG for layout/spacing/interactive states; no new dependencies; offline-capable (reads local state only)  
**Scale/Scope**: Single new component (~100 LOC); two touch points in `Game.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Reduces friction for kids — right chores shown at the right time. Playful empty-state message. Visual feedback on toggle follows existing HIG-compliant pattern. |
| II. Ship & Iterate | ✅ Pass | Single new component, two-line integration in Game.tsx. No speculative scope. |
| III. Kid-Safe Always | ✅ Pass | No PII, no network calls, no new third-party dependencies. Reads only existing profile chore data. |

**Post-design re-check**: ✅ All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/040-time-based-chores/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
native/src/
├── components/
│   ├── TimedChoreSection.tsx   # NEW — time-filtered chore section
│   ├── Game.tsx                # MODIFIED — mount TimedChoreSection in pet ScrollView
│   └── ChoreList.tsx           # UNCHANGED — reused for rendering individual chores
├── hooks/
│   └── useChores.ts            # UNCHANGED — checkOffChore already supports this flow
└── models/
    └── types.ts                # UNCHANGED — CategoryChores / TimeActionType already defined
```

**Structure Decision**: Single mobile app project. All changes are in `native/src/components/` and `native/src/hooks/`. No new files outside the components directory.
