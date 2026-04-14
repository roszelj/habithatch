# Implementation Plan: Fix Join Code Profile Creation

**Branch**: `015-fix-joincode-profile` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-fix-joincode-profile/spec.md`

## Summary

When a child joins a family via join code, their profile is created in localStorage instead of Firestore because the child has no authenticated session. The fix is to use Firebase anonymous authentication during the join flow, giving the child a `user` identity so `isCloudMode` evaluates to true and the cloud provider is used. This is a 2-file fix.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, Firebase JS SDK v12
**Storage**: Firebase Firestore (cloud mode) + localStorage (local/guest mode)
**Testing**: Manual testing (no automated test framework)
**Target Platform**: Web browser (desktop + mobile)
**Project Type**: Web application (single-page React app)
**Performance Goals**: Profile visible on parent device within 5 seconds of creation
**Constraints**: Must not collect PII from children; must not break existing auth flows
**Scale/Scope**: Family-sized (1 parent + up to 8 children)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Fun-First Design ✅
- Bug fix — restores expected multi-device family experience
- No gameplay changes

### II. Ship & Iterate ✅
- Minimal fix: 2 files, ~5 lines of code changed
- Uses existing Firebase capability (anonymous auth)

### III. Kid-Safe Always ✅
- Anonymous auth collects zero PII from children — no email, no password, no name
- Firebase anonymous sessions are device-local and cannot be linked to a real identity
- Improves kid safety by ensuring the child's data is managed within the parent's family (not orphaned in localStorage)

### Post-Design Re-check ✅
- No violations. Anonymous auth is the kid-safest authentication method available.

## Project Structure

### Documentation (this feature)

```text
specs/015-fix-joincode-profile/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research
├── data-model.md        # Phase 1 data model (no schema changes)
├── quickstart.md        # Phase 1 quickstart guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── firebase/
│   └── auth.ts          # MODIFY: Add signInAnonymously export
└── App.tsx              # MODIFY: Call anonymous sign-in in handleJoinFamily
```

**Structure Decision**: Single project, React SPA. Only 2 files modified.

## Implementation Steps

### Step 1: Add anonymous sign-in to auth module

**File: `src/firebase/auth.ts`**
- Import `signInAnonymously` from `firebase/auth`
- Add exported function `signInAnonymous()` that calls `signInAnonymously(auth)` and returns the `User`

### Step 2: Call anonymous sign-in in join flow

**File: `src/App.tsx`**
- In `handleJoinFamily`, after looking up the join code and getting the familyId:
  1. Call `signInAnonymous()` (await it)
  2. Then set familyId and isParent as before
- This ensures `user` is non-null before the next render, so `isCloudMode` is true

### Step 3: Manual testing

1. Parent signs up on device A, notes join code
2. Child enters join code on device B (incognito)
3. Child creates creature → verify profile appears on device A
4. Child completes chore → verify syncs to device A
5. Child closes and reopens app → verify profile loads from cloud

## Complexity Tracking

No constitution violations. No complexity justifications needed.
