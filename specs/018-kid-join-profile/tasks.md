# Tasks: Kid Join Profile Selection

**Input**: Design documents from `/specs/018-kid-join-profile/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- No test tasks — not requested in the spec

---

## Phase 1: Setup

*No project initialization required. No new files, no new dependencies. Proceed directly to Phase 2.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add `loaded: boolean` to the `DataProvider` interface. This field is required by all three user stories to gate the profile picker render correctly.

**⚠️ CRITICAL**: US1, US2, and US3 all depend on this phase being complete.

- [x] T001 Add `loaded: boolean` field to `DataProvider` interface in `src/hooks/useDataProvider.ts` (line ~16 in the interface declaration)
- [x] T002 Return `loaded: true` from `useLocalDataProvider` in `src/hooks/useDataProvider.ts` (local data is synchronous; always loaded)
- [x] T003 Add `const [loaded, setLoaded] = useState(false)` to `useCloudDataProvider` and call `setLoaded(true)` inside the `onAllProfilesSnapshot` callback in `src/hooks/useDataProvider.ts`; return `loaded` from the hook

**Checkpoint**: `DataProvider.loaded` is implemented in both providers. `npm run lint` passes.

---

## Phase 3: User Story 1 - Kid Selects Existing Profile After Joining (Priority: P1) 🎯 MVP

**Goal**: After a successful join code entry, a kid with an existing profile sees the "Who's playing?" profile picker instead of creature creation.

**Independent Test**: Join a family that has at least one existing child profile. Verify the profile picker appears immediately after the join code is accepted. Tap the profile and verify the game loads.

### Implementation for User Story 1

- [x] T004 [US1] In `handleJoinFamily` in `src/App.tsx` (currently line ~94), change `setPhase({ step: 'select' })` to `setPhase({ step: 'profiles' })`
- [x] T005 [US1] In `src/App.tsx`, split the `phase.step === 'profiles'` render block into two: one that shows a loading indicator when `!provider.loaded`, and one that renders `<ProfilePicker ...>` when `provider.loaded`. Use the same inline loading style as the existing `authLoading` state (line ~152: centered div with color `#f0e68c`, `fontSize: '1.5rem'`).

**Checkpoint**: User Story 1 fully testable. A kid entering a join code for a family with existing profiles sees the profile picker. Selecting a profile launches the game. `npm test && npm run lint` passes.

---

## Phase 4: User Story 2 - Kid Creates New Profile After Joining (Priority: P2)

**Goal**: A kid arriving at the profile picker after join can tap "Add Child" to create a new profile.

**Independent Test**: Join a family with fewer than the max number of profiles. Verify "Add Child" appears on the picker. Tap it, complete creature selection and naming, and confirm the new profile is saved and the game loads.

### Implementation for User Story 2

- [ ] T006 [US2] Verify (no code change needed): The existing `onAddNew={() => setPhase({ step: 'select' })}` handler in `src/App.tsx` already routes to creature creation from the profile picker. Confirm via manual test that the "Add Child" path works end-to-end from the post-join picker.

**Checkpoint**: User Story 2 fully testable. "Add Child" from the post-join picker leads to creature creation and saves the new profile.

---

## Phase 5: User Story 3 - Kid Joins Empty Family (Priority: P3)

**Goal**: When a kid joins a family with zero profiles, they see the profile picker with only "Add Child" (not a blank or broken screen), and can tap it to begin creature creation.

**Independent Test**: Join a brand-new family with zero profiles. Verify the picker shows only "Add Child" (after the loaded gate clears). Tap it and verify creature creation starts.

### Implementation for User Story 3

- [ ] T007 [US3] Verify (no code change needed): When `profiles.length === 0` and `canAdd === true`, `ProfilePicker` renders only the "Add Child" card. Confirm via manual test using a fresh family. Per research decision 3, no special re-route is added for empty families.

**Checkpoint**: User Story 3 verified. Empty-family join shows "Add Child" only, and creature creation completes successfully.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T008 Run `npm test && npm run lint` and confirm all checks pass
- [ ] T009 [P] Follow quickstart.md test scenarios in `specs/018-kid-join-profile/quickstart.md` to validate all three flows end-to-end (existing profiles, add child, empty family)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (Foundational)**: No dependencies — start immediately
- **Phase 3 (US1)**: Depends on Phase 2 (`loaded` must exist before App.tsx can reference it)
- **Phase 4 (US2)**: Depends on Phase 3 (US1 routing change must be in place to reach the picker via join)
- **Phase 5 (US3)**: Depends on Phase 3 (same reason)
- **Phase 6 (Polish)**: Depends on Phases 3–5

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational — no dependency on US2/US3
- **US2 (P2)**: Depends on US1 routing change being in place (kid must reach picker via join code)
- **US3 (P3)**: Depends on US1 routing change being in place (same reason)

### Parallel Opportunities

- T001, T002, T003 must be sequential (building the same interface)
- T004 and T005 must be sequential (T005 references `provider.loaded` added conceptually by T003)
- T006 and T007 are verification-only and can run in parallel with each other after T004/T005
- T008 and T009 can run in parallel after all prior tasks complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001–T003)
2. Complete Phase 3: US1 (T004–T005)
3. **STOP and VALIDATE**: Test with an existing-profile family
4. Ship if ready — US2 and US3 are verification-only with no extra code

### Incremental Delivery

1. Foundational (T001–T003) → foundation ready
2. US1 (T004–T005) → profile picker shown after join (MVP)
3. US2 (T006) → verify Add Child path (zero additional code)
4. US3 (T007) → verify empty family path (zero additional code)
5. Polish (T008–T009) → lint, test, end-to-end validation

### Note on US2 and US3

Both are verification-only — the required behavior is already implemented by the existing `ProfilePicker` component and App.tsx handlers. The only new code in this feature is in Phase 2 (3 tasks) and Phase 3 (2 tasks), totaling **5 implementation tasks**.

---

## Notes

- [P] tasks = different files or no shared dependencies, safe to run in parallel
- [Story] label maps task to specific user story for traceability
- Commit after T003 (foundational complete) and after T005 (MVP complete)
- `npm test && npm run lint` is the pass gate before merging
