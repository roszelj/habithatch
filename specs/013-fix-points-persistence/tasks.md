# Tasks: Points Persistence Across Sessions

**Input**: Design documents from `/specs/013-fix-points-persistence/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Verify working environment before making changes

- [x] T001 Confirm current branch is `013-fix-points-persistence` (run `git branch --show-current`)
- [x] T002 Run `npm run build` to establish a clean baseline (expected: existing TS errors only, no new regressions)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Understand the full call chain before modifying it

**⚠️ CRITICAL**: Read all affected files before touching any code

- [x] T003 Read `src/components/Game.tsx` in full — identify: (a) the `saveProfile` import from useSaveData, (b) the auto-save `useEffect` that calls it, (c) all props currently accepted by the Game component
- [x] T004 Read `src/App.tsx` — identify how the `provider` object is created and which props are passed to `<Game />`
- [x] T005 Read `src/hooks/useDataProvider.ts` lines 16–26 — confirm the `DataProvider` interface exposes `saveProfile: (profile: ChildProfile) => void`

**Checkpoint**: You now know exactly what to change and where. The fix requires modifying `Game.tsx` props and one call site in its auto-save effect.

---

## Phase 3: User Stories 1 & 2 — Points Survive Browser Close and Login/Logout (Priority: P1) 🎯 MVP

**Goal**: Route all in-game profile saves through the active data provider so both local and cloud modes persist correctly.

**Independent Test**: Earn points → close browser → reopen → points unchanged. Earn points → log out → log in → points unchanged.

### Implementation for User Stories 1 & 2

- [x] T006 [US1] In `src/components/Game.tsx`: add `saveProfile: (profile: ChildProfile) => void` to the Game component's props interface
- [x] T007 [US1] In `src/components/Game.tsx`: in the auto-save `useEffect`, replace the call to the imported `saveProfile(appData, updatedProfile)` utility with `props.saveProfile(updatedProfile)` (using the new prop)
- [x] T008 [US1] In `src/components/Game.tsx`: remove the `saveProfile` import from `'../hooks/useSaveData'` (no longer needed)
- [x] T009 [US1] In `src/App.tsx`: pass `saveProfile={provider.saveProfile}` to the `<Game />` component
- [x] T010 [US1] Run `npm run build` — confirm zero TypeScript errors

**Checkpoint**: User Stories 1 and 2 are now fixed. Both local and cloud saves route through the provider. Validate using the manual steps in `quickstart.md`.

---

## Phase 4: User Story 3 — Points Sync Across Devices (Priority: P2)

**Goal**: Confirm cross-device sync works now that writes reach Firestore. No code change expected — this story is satisfied by the Phase 3 fix.

**Independent Test**: Earn points on Device A → check Device B within 30 seconds → points match.

### Verification for User Story 3

- [x] T011 [US3] Review `src/firebase/listeners.ts` — confirm `onAllProfilesSnapshot` subscribes to the correct Firestore collection and updates React state on every change (no code change, read-only verification)
- [x] T012 [US3] Review `src/hooks/useDataProvider.ts` cloud provider — confirm the `onAllProfilesSnapshot` listener is set up on `familyId` change and updates `appData.profiles` in state (no code change, read-only verification)

**Checkpoint**: Cross-device sync requires no additional code. Once writes reach Firestore (Phase 3), the existing real-time listeners propagate changes to all connected devices automatically.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T013 Run `npm run lint` — fix any lint warnings introduced by the changes (pre-existing eslint config issue, not caused by this change)
- [x] T014 Run `npm run build` one final time — confirm clean build
- [ ] T015 [P] Manually test local (guest) mode per `quickstart.md`: earn points, close browser, reopen, verify points present
- [ ] T016 [P] Manually test cloud mode per `quickstart.md`: earn points, log out, log in, verify points present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user story work
- **US1+US2 (Phase 3)**: Depends on Phase 2 — core fix
- **US3 (Phase 4)**: Depends on Phase 3 completing — verification only
- **Polish (Phase 5)**: Depends on all phases complete

### Within Phase 3

- T006 (add prop to interface) → T007 (use prop in effect) → T008 (remove old import) → T009 (pass prop in App.tsx) → T010 (build verify)
- All sequential — they touch the same two files

### Parallel Opportunities

- T015 and T016 in Phase 5 can run simultaneously (different test scenarios, independent)

---

## Parallel Example: Phase 5 Polish

```bash
# These two manual tests can run simultaneously:
Task T015: "Manually test local (guest) mode"
Task T016: "Manually test cloud mode"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 — same fix)

1. Complete Phase 1: Setup (baseline build)
2. Complete Phase 2: Read all affected files
3. Complete Phase 3: 5-line fix across Game.tsx + App.tsx
4. **STOP and VALIDATE**: Test both local and cloud persistence manually
5. Ship — the primary bug is resolved

### Incremental Delivery

1. Phase 1 + 2 → Understand the codebase
2. Phase 3 → Fix US1+US2 → validate → ready to deploy
3. Phase 4 → Verify US3 at no additional cost (free with Phase 3)
4. Phase 5 → Clean up and confirm

---

## Notes

- This is a focused 5-line fix. Total code change: ~2 lines added, ~2 lines removed across 2 files.
- The entire fix is contained in `src/components/Game.tsx` and `src/App.tsx`.
- No schema changes, no new dependencies, no new files.
- US3 (cross-device sync) is solved for free — Firestore real-time listeners already exist; they just never received writes before.
