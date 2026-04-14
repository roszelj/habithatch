# Tasks: Cloud Parent Data Persistence

**Input**: Design documents from `/specs/014-cloud-parent-persistence/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: No automated tests — manual testing only (no test framework configured).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: No project setup needed — this feature extends existing files only.

_(No tasks — project structure already exists)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add parentPin support to Firestore interfaces and create the cloud write function. These changes are required before any user story work.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 [P] Add `parentPin?: string | null` field to `FamilyData` interface and add `updateFamilyPin(familyId, parentPin)` function in `src/firebase/families.ts`
- [x] T002 [P] Add `parentPin?: string | null` field to `FamilySnapshot` interface in `src/firebase/listeners.ts`

**Checkpoint**: Firestore interfaces and write function ready — cloud provider can now be updated.

---

## Phase 3: User Story 1 — Parent PIN Persists Across Devices (Priority: P1) MVP

**Goal**: Parent PIN is stored in Firestore and synced to all family devices in real time via the existing family snapshot listener.

**Independent Test**: Set a PIN on one device, open app on a second device/browser, verify PIN is required to access parent panel.

### Implementation for User Story 1

- [x] T003 [US1] Update `onFamilySnapshot` callback in `useCloudDataProvider` to read `parentPin` from snapshot and set it on appData in `src/hooks/useDataProvider.ts`
- [x] T004 [US1] Update `updateAppData` in `useCloudDataProvider` to detect parentPin changes and call `updateFamilyPin()` to sync to Firestore in `src/hooks/useDataProvider.ts`

**Checkpoint**: Parent PIN persists in cloud and syncs across devices. US1 is independently testable.

---

## Phase 4: User Story 2 — Rewards Persist Across Devices (Priority: P1)

**Goal**: Fix the sync gap where reward changes made via `updateAppData()` in the Game component are not written back to Firestore.

**Independent Test**: Create a reward on one device, check a second device, verify the reward appears with correct name and price.

### Implementation for User Story 2

- [x] T005 [US2] Update `updateAppData` in `useCloudDataProvider` to detect rewardPresents changes and call `updateFamilyRewards()` to sync to Firestore in `src/hooks/useDataProvider.ts`

**Checkpoint**: Rewards created/edited/deleted via the parent panel sync to Firestore in real time. US2 is independently testable.

---

## Phase 5: User Story 3 — Graceful Behavior in Local/Guest Mode (Priority: P2)

**Goal**: Ensure local-mode behavior is completely unchanged — parent PIN and rewards continue to use localStorage only.

**Independent Test**: Use app without signing in, set PIN, create rewards, refresh page, verify everything persists locally.

### Implementation for User Story 3

- [x] T006 [US3] Add parentPin migration to `migrateLocalToCloud()` — after migrating profiles and rewards, also call `updateFamilyPin(familyId, data.parentPin)` if parentPin is set, in `src/firebase/migration.ts`

**Checkpoint**: Local mode works as before. Users migrating from local to cloud retain their PIN. US3 is independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify all stories work together end-to-end.

- [ ] T007 Manual test: Local mode regression — set PIN, create rewards, refresh, verify persistence
- [ ] T008 Manual test: Cloud PIN sync — set PIN on device A, verify required on device B
- [ ] T009 Manual test: Cloud rewards sync — create/edit/delete reward on device A, verify on device B
- [ ] T010 Manual test: Migration — use app locally with PIN + rewards, sign up for cloud, verify both migrate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **US1 (Phase 3)**: Depends on Phase 2 (T001, T002)
- **US2 (Phase 4)**: Depends on Phase 2 (T001, T002). Can run in parallel with US1 since T005 extends the same `updateAppData` function as T004 — but both touch the same function, so sequential is safer.
- **US3 (Phase 5)**: Depends on Phase 2 (T001 for `updateFamilyPin` import). Independent of US1/US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Needs T001, T002 from Foundational. No dependency on other stories.
- **US2 (P1)**: Needs T001, T002 from Foundational. T005 extends the same `updateAppData` function as T004 (US1), so US1 should complete first.
- **US3 (P2)**: Needs T001 from Foundational (imports `updateFamilyPin`). Independent of US1/US2.

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T006 (US3) can run in parallel with T003/T004 (US1) since they touch different files

---

## Parallel Example: Phase 2

```text
# These two tasks can run in parallel (different files):
T001: Add parentPin to FamilyData + updateFamilyPin() in src/firebase/families.ts
T002: Add parentPin to FamilySnapshot in src/firebase/listeners.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002)
2. Complete Phase 3: User Story 1 (T003, T004)
3. **STOP and VALIDATE**: Test PIN sync across two devices
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational (T001, T002) → Interfaces ready
2. Add US1 (T003, T004) → PIN syncs across devices → Test → Deploy (MVP!)
3. Add US2 (T005) → Rewards sync gap fixed → Test → Deploy
4. Add US3 (T006) → Migration includes PIN → Test → Deploy
5. Each story adds value without breaking previous stories

---

## Notes

- Total: 10 tasks (2 foundational, 2 US1, 1 US2, 1 US3, 4 manual tests)
- All code changes are in existing files — no new files created
- T004 and T005 both modify the same function (`updateAppData` in the cloud provider) — implement sequentially or combine into a single change
- [P] tasks = different files, no dependencies
- Commit after each phase completion
