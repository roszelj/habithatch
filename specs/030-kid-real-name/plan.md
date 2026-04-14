# Implementation Plan: Child Real Name

**Branch**: `030-kid-real-name` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/030-kid-real-name/spec.md`

## Summary

Add a "child name" (real name) field to child profiles so parents can identify children regardless of creature name changes. The real name is entered during profile creation, editable from the parent panel, and displayed only in parent-facing contexts (profile picker, parent panel). Backward compatible — existing profiles fall back to creature name.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: Firebase JS SDK v12 (Firestore for cloud persistence)
**Storage**: Firestore `families/{fid}/profiles/{pid}` (cloud) + localStorage (local mode)
**Testing**: Manual playtesting (per constitution — tests where they add confidence)
**Target Platform**: Mobile web (PWA)
**Project Type**: Web application (kid-facing game with parent dashboard)
**Performance Goals**: N/A (simple text field addition)
**Constraints**: Must not break existing profiles with no real name set
**Scale/Scope**: ~5 files modified, 1 new field on ChildProfile

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | No impact on child's play experience. Real name is parent-facing only. |
| II. Ship & Iterate | PASS | Small, self-contained increment. Single field addition + display changes. |
| III. Kid-Safe Always | JUSTIFIED VIOLATION | Child's real name is PII. See Complexity Tracking below. |

**Principle III Justification**: The child's real name is personally identifiable information. However:
- It is entered by the **parent**, not the child
- It is visible **only** in parent-facing contexts (behind PIN)
- It is stored in the same Firestore document as existing profile data (no new transmission)
- It is never exposed to other users, third parties, or the child's game view
- Parents already manage the child's data (creature name, chores, rewards)

This is analogous to a parent labeling their child's device — the parent chooses to associate a name for their own management purposes. The risk is minimal and the feature serves parental control needs.

## Project Structure

### Documentation (this feature)

```text
specs/030-kid-real-name/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── types.ts              # Add childName to ChildProfile
├── components/
│   ├── NamingStep.tsx         # Add real name input to creation flow
│   ├── NamingStep.module.css  # Style for new input
│   ├── ProfilePicker.tsx      # Display real name on cards
│   ├── ParentPanel.tsx        # Display real name + edit capability
│   └── Game.tsx               # Pass childName through (no child-facing display)
├── hooks/
│   └── useSaveData.ts         # Migration: default childName to null for existing profiles
└── App.tsx                    # Pass childName through creation flow
```

**Structure Decision**: Single existing project. All changes are modifications to existing files. No new components or directories needed.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Storing child's real name (PII) | Parents need to identify children when kids rename creatures frequently | Without real names, parents cannot reliably manage multi-child households. The creature name alone is insufficient when kids change it. Data is parent-entered, parent-visible only, stored in existing Firestore documents with no new transmission vectors. |
