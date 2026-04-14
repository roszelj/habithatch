# Tasks: Weekday & Weekend Chores

**Input**: Design documents from `/specs/035-weekday-weekend-chores/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in spec — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update data model and helper functions used by all user stories

- [x] T001 Replace `chores: CategoryChores` with `weekdayChores: CategoryChores` and `weekendChores: CategoryChores` on ChildProfile interface in src/models/types.ts
- [x] T002 Add `isWeekend(): boolean` helper function that returns true for Saturday (day 0 and 6) in src/models/types.ts
- [x] T003 Add `getActiveChores(profile: ChildProfile): CategoryChores` helper that returns weekendChores if isWeekend(), else weekdayChores in src/models/types.ts
- [x] T004 Update `createDefaultChores()` usage — add `createDefaultProfile` or ensure new profiles initialize both weekdayChores and weekendChores as empty CategoryChores in src/models/types.ts

**Checkpoint**: Data model updated — all downstream files will have type errors until they are updated

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migration and daily reset logic — MUST be complete before any UI work

**Warning**: No user story work can begin until this phase is complete

- [x] T005 Update migration logic in `loadAppData()` to convert old `chores` field to `weekdayChores` (copy existing) + `weekendChores` (empty) in src/hooks/useSaveData.ts
- [x] T006 Update `applyDailyReset()` to reset only the active day-type's chores (use `isWeekend()` to determine which field to reset) in src/hooks/useSaveData.ts
- [x] T007 Update `useDailyReset` hook — change `DailyResetCallbacks` interface to accept `weekdayChores` and `weekendChores` instead of single `chores`; reset only the incoming day-type's list in src/hooks/useDailyReset.ts
- [x] T008 Update `allChoresComplete` calls throughout the codebase to pass the active chore list (from getActiveChores) rather than the old `chores` field — verify in src/models/types.ts that allChoresComplete still works with CategoryChores

**Checkpoint**: Foundation ready — data loads, migrates, and resets correctly by day type

---

## Phase 3: User Story 1 - Automatic Day-Based Chore Display (Priority: P1) MVP

**Goal**: Kid mode auto-displays only the correct chore list based on current day of week

**Independent Test**: Open chores on a weekday → see weekday chores only. Open on weekend → see weekend chores only.

### Implementation for User Story 1

- [x] T009 [US1] Update Game.tsx to compute active chores via `isWeekend()` and pass active list to `useChores` hook; store both weekdayChores and weekendChores in profile state in src/components/Game.tsx
- [x] T010 [US1] Update `buildProfile()` in Game.tsx to save both `weekdayChores` and `weekendChores` (active list from useChores state, inactive list from profile) in src/components/Game.tsx
- [x] T011 [US1] Update `useDailyReset` onReset callback in Game.tsx to handle both chore lists and set the correct active list into useChores in src/components/Game.tsx
- [x] T012 [US1] Update `allChoresComplete` effect in Game.tsx to evaluate against the active chore list only in src/components/Game.tsx
- [x] T013 [US1] Add a day-type label (e.g., "Weekday Chores" or "Weekend Chores") to the chores screen header in src/components/ChorePanel.tsx or src/components/Game.tsx

**Checkpoint**: Kid sees correct chores for today. Streak evaluates against active list. Daily reset switches lists.

---

## Phase 4: User Story 2 - Parent Manages Both Lists (Priority: P2)

**Goal**: Parent Mode shows and manages both weekday and weekend chore sections for each child

**Independent Test**: Enter Parent Mode, add chores to both weekday and weekend lists, verify both visible and editable.

### Implementation for User Story 2

- [x] T014 [US2] Update ParentPanel "Manage Chores" tab to render two labeled sections: "Weekday Chores (Mon-Fri)" and "Weekend Chores (Sat-Sun)", each with morning/afternoon/evening sub-sections in src/components/ParentPanel.tsx
- [x] T015 [US2] Update ParentPanel add chore handler to specify which day-type list (weekday or weekend) the chore is being added to in src/components/ParentPanel.tsx
- [x] T016 [US2] Update ParentPanel remove chore handler to target the correct day-type list in src/components/ParentPanel.tsx
- [x] T017 [US2] Update `collectPending()` in ParentPanel to scan both `weekdayChores` and `weekendChores` for pending items in src/components/ParentPanel.tsx
- [x] T018 [US2] Update `handleCrossProfileAddChore` in Game.tsx to accept a day-type parameter and add to the correct chore list (weekdayChores or weekendChores) in src/components/Game.tsx
- [x] T019 [US2] Update `handleAddChoreAllKids` in Game.tsx to accept a day-type parameter and add to the correct list for all children in src/components/Game.tsx
- [x] T020 [US2] Update `handleCrossProfileRemoveChore` in Game.tsx to target the correct day-type list in src/components/Game.tsx
- [x] T021 [US2] Update `handleCrossProfileApprove` and `handleCrossProfileReject` in Game.tsx to operate on the correct day-type list for cross-profile chore operations in src/components/Game.tsx

**Checkpoint**: Parents can fully manage both weekday and weekend chores for all kids from Parent Mode.

---

## Phase 5: User Story 3 - Existing Chores Migrate to Weekday (Priority: P3)

**Goal**: Existing profiles seamlessly migrate — old chores become weekday chores, weekend starts empty

**Independent Test**: Load a profile with old `chores` field, verify they appear as weekday chores with weekend empty.

### Implementation for User Story 3

- [x] T022 [US3] Verify and test migration in `loadAppData()` handles profiles with old `chores` field, profiles already migrated, and brand-new profiles in src/hooks/useSaveData.ts
- [x] T023 [US3] Update Firestore profile loading (if cloud listeners pass raw data) to handle both old and new field shapes in src/firebase/listeners.ts or src/hooks/useDataProvider.ts

**Checkpoint**: All existing data loads without errors, old chores visible as weekday chores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, cleanup, and validation

- [x] T024 Remove any remaining references to the old `chores` field across the codebase (search for `profile.chores` or `.chores` that aren't weekday/weekend) in all src/ files
- [x] T025 Verify the "Reset All for New Day" button in ChorePanel only resets the active day-type's chores in src/components/ChorePanel.tsx
- [x] T026 Run TypeScript type-check (`npx tsc --noEmit`) to ensure no type errors remain
- [x] T027 Run quickstart.md validation (all 8 test scenarios)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (data model must be updated first)
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
  - US1 depends on Phase 2 (migration + reset logic)
  - US2 depends on US1 (Game.tsx chore state must be set up)
  - US3 depends on Phase 2 (migration logic)
- **Polish (Phase 6)**: Depends on US1-US3 being complete

### Within Each User Story

- Data model changes before component changes
- Game.tsx state management before UI components
- Core display before cross-profile operations

### Parallel Opportunities

- T001-T004 are sequential (all in same file: types.ts)
- T005 and T007 can run in parallel (different files: useSaveData.ts vs useDailyReset.ts)
- T022 and T023 can run in parallel (different files)
- T024-T027 can run in parallel (different concerns)

---

## Parallel Example: Foundational Phase

```bash
# These can run in parallel (different files):
Task: "Update migration logic in src/hooks/useSaveData.ts"
Task: "Update useDailyReset hook in src/hooks/useDailyReset.ts"

# Then sequentially:
Task: "Update allChoresComplete calls across codebase"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004) — update data model
2. Complete Phase 2: Foundational (T005-T008) — migration + reset
3. Complete Phase 3: User Story 1 (T009-T013) — kid sees correct chores
4. **STOP and VALIDATE**: Weekday chores display on weekdays, weekend on weekends, daily reset works
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Data model and migration ready
2. Add User Story 1 → Kids see day-appropriate chores (MVP!)
3. Add User Story 2 → Parents manage both lists
4. Add User Story 3 → Migration verified end-to-end
5. Polish → Cleanup and validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Total tasks: 27
- Setup: 4, Foundational: 4, US1: 5 tasks, US2: 8 tasks, US3: 2 tasks, Polish: 4
- US2 is the largest phase because cross-profile chore handlers all need day-type awareness
- Commit after each phase checkpoint
