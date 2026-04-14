# Implementation Plan: Points Persistence Across Sessions

**Branch**: `013-fix-points-persistence` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-fix-points-persistence/spec.md`

## Summary

Points (and all profile data) earned during gameplay are not persisted to cloud storage because `Game.tsx` calls a localStorage-only utility function (`saveProfile` from `useSaveData.ts`) instead of the provider-aware `provider.saveProfile()` method. The fix routes all in-game saves through the active data provider so both local and cloud modes persist correctly.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, Firebase JS SDK v12
**Storage**: Firebase Firestore (cloud mode) + localStorage (local/guest mode)
**Testing**: Vitest 1.x
**Target Platform**: Web browser (desktop + mobile)
**Project Type**: Web application (SPA)
**Performance Goals**: Profile save completes within 200ms of chore action (constitution requirement)
**Constraints**: Must work offline (local mode); must not expose PII (Kid-Safe Always)
**Scale/Scope**: Family-scale (2–8 child profiles per family)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Fun-First Design
**PASS** — The fix removes silent data loss, which directly harms player engagement (kids lose earned points). Responsive saves are required by this principle (feedback within 200ms). The fix does not alter any game mechanic or UI.

### II. Ship & Iterate
**PASS** — The fix is a targeted, minimal change: redirect one call site in Game.tsx to use the provider interface. No new abstractions, no refactoring. Shippable in a single increment.

### III. Kid-Safe Always
**PASS** — No change to data collection, storage schema, or PII handling. Profile data (creature name, points) was already being stored; this fix ensures it actually reaches the correct store. No new network calls introduced.

**Gate decision**: All three principles pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/013-fix-points-persistence/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── Game.tsx              # Primary fix: call provider.saveProfile() instead of util
├── hooks/
│   ├── useDataProvider.ts    # Provider interface (saveProfile method)
│   └── useSaveData.ts        # localStorage utility (still used by local provider)
├── firebase/
│   └── profiles.ts           # Cloud write (updateCloudProfile)
└── models/
    └── types.ts              # ChildProfile, AppData types

tests/
└── (vitest — new unit tests for save routing)
```

**Structure Decision**: Single project (SPA). The fix touches the existing src/ tree only — no new directories needed.

## Complexity Tracking

No constitution violations. No complexity justification required.
