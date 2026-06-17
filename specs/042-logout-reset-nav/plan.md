# Implementation Plan: Logout Button & Reset Button Relocation

**Branch**: `042-logout-reset-nav` | **Date**: 2026-04-28 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/042-logout-reset-nav/spec.md`

## Summary

Move the Reset button from the Parent Panel tab bar into the existing Danger Zone section, and replace it with a Logout button that clears all AsyncStorage keys, signs out of Firebase Auth, and navigates to the sign-in screen. Scope: native (React Native / Expo) parent view only. Two files change: `native/App.tsx` (add `handleLogout`) and `native/src/components/ParentPanel.tsx` (swap tab, add Reset to Danger Zone).

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: React Native 0.81.5, Expo ~54, @react-native-firebase/auth v24, @react-native-async-storage/async-storage  
**Storage**: AsyncStorage (all keys wiped on logout); Firestore cloud data preserved  
**Testing**: Manual device testing (no existing unit test suite for UI components)  
**Target Platform**: iOS + Android (native only; web out of scope)  
**Project Type**: Mobile app  
**Performance Goals**: Logout completes and auth screen appears within 3 seconds  
**Constraints**: Must succeed offline; Firestore remote sign-out is best-effort  
**Scale/Scope**: 2 files modified, ~50 lines changed total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Logout is parent-infrastructure; kids never see it. No game-feel regression. |
| II. Ship & Iterate | ✅ Pass | 2-file change, deliverable in one cycle. No speculative abstractions. |
| III. Kid-Safe Always | ✅ Pass | Parent-only action. Cloud Firestore data (kids' profiles) is not deleted. Local wipe is scoped to the logged-out device. |

**Post-design re-check**: Same result. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/042-logout-reset-nav/
├── plan.md         ← this file
├── research.md     ← Phase 0 (complete)
├── data-model.md   ← Phase 1 (complete)
└── tasks.md        ← Phase 2 (created by /speckit-tasks)
```

### Source Code — files touched

```text
native/
├── App.tsx                                  # ADD handleLogout(); pass onLogout to ParentPanel
└── src/
    └── components/
        └── ParentPanel.tsx                  # SWAP tab (Reset→Logout); ADD Reset to Danger Zone
```

**Structure Decision**: No new files or directories. This feature is a targeted modification of two existing files inside the React Native app (`native/`).

## Complexity Tracking

No constitution violations — table not required.
