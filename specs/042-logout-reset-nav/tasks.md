# Tasks: Logout Button & Reset Button Relocation

**Input**: Design documents from `/specs/042-logout-reset-nav/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. Only 2 source files change: `native/App.tsx` and `native/src/components/ParentPanel.tsx`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm all AsyncStorage keys that must be cleared — no new packages or files needed.

- [x] T001 Audit all AsyncStorage key constants in `native/src/models/types.ts` and `native/App.tsx` (lines 38-39) and produce a complete list: `APP_DATA_KEY`, `FAMILY_ID_KEY`, `DEVICE_PROFILE_KEY`, `terragucci_installed`, `fcm_permission_denied`, `terragucci_save`, `terragucci_pin`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the `ParentPanelProps` interface with the `onLogout` callback before any user story work begins.

**⚠️ CRITICAL**: T003 (US1) and T006 (US3) both depend on this being complete first.

- [x] T002 Add `onLogout?: () => void` to the `ParentPanelProps` interface in `native/src/components/ParentPanel.tsx`

**Checkpoint**: Foundation ready — US1 and US3 implementation can now begin.

---

## Phase 3: User Story 1 — Logout Clears Session and Returns to Auth Screen (Priority: P1) 🎯 MVP

**Goal**: Tapping Logout and confirming destroys all auth session data and local app data, then navigates to the sign-in / sign-up screen. The app stays on that screen after being force-quit and reopened.

**Independent Test**: With a parent signed in, tap the Logout tab button → confirm → verify the auth screen appears. Force-quit the app, reopen it — auth screen must still show. No AsyncStorage keys for the app should remain.

### Implementation for User Story 1

- [x] T003 [US1] Implement `handleLogout` async function in `native/App.tsx` with: (1) `Alert.alert` confirmation dialog, (2) on confirm: `await AsyncStorage.multiRemove([APP_DATA_KEY, FAMILY_ID_KEY, DEVICE_PROFILE_KEY, 'terragucci_installed', 'fcm_permission_denied', 'terragucci_save', 'terragucci_pin'])`, (3) `provider.clearAll()`, (4) `await doSignOut()`, (5) `setPhase('auth')`
- [x] T004 [US1] Pass `onLogout={handleLogout}` prop to the `<ParentPanel>` component in `native/App.tsx` (same location as the existing `onReset={handleReset}` prop)

**Checkpoint**: `handleLogout` is wired up. US1 is fully functional and independently testable once T006 (tab button) is complete.

---

## Phase 4: User Story 2 — Reset Button Moved to Manage Screen Danger Zone (Priority: P2)

**Goal**: The Reset button appears in the Danger Zone section of the Parent Panel's Manage tab, co-located with "Remove Profile" and "Delete Account". Its existing behavior is unchanged.

**Independent Test**: Open the Parent Panel → Manage tab → scroll to Danger Zone → verify a Reset button is visible with red/danger styling. Tap it — existing confirmation and reset behavior must work exactly as before.

### Implementation for User Story 2

- [x] T005 [US2] Add a Reset `TouchableOpacity` to the `dangerZone` section in `native/src/components/ParentPanel.tsx` (after the "Delete Parent Account" button, only rendered when `onReset` prop is provided). Use existing `dangerBtn` and `dangerBtnText` styles. On press, call `onReset` with the existing confirmation pattern (match how `onReset` was called in the old tab button).

**Checkpoint**: Reset button is in the Danger Zone and functional. US2 is independently testable.

---

## Phase 5: User Story 3 — Logout Button Visible and Clearly Labeled in Tab Bar (Priority: P2)

**Goal**: The `🗑️ Reset` tab in the Parent Panel bottom tab bar is replaced by a `🚪 Logout` tab. Tapping it calls `onLogout`. No Reset tab remains in the tab bar.

**Independent Test**: Open the Parent Panel — the bottom tab bar must show a Logout tab (with icon and/or label) and must NOT show a Reset tab. Tapping Logout triggers the confirmation dialog implemented in US1.

### Implementation for User Story 3

- [x] T006 [US3] In `native/src/components/ParentPanel.tsx` tab bar (lines ~557-562): replace the `🗑️ Reset` `TouchableOpacity` tab item with a `🚪 Logout` tab item that calls `onLogout?.()`. Remove the `onReset` conditional that previously controlled the Reset tab visibility in the tab bar.

**Checkpoint**: Logout tab is visible in the tab bar; Reset tab is gone from the tab bar. US1 + US3 together form a complete, testable logout flow.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final validation across all user stories.

- [x] T007 Verify no unused styles remain in `native/src/components/ParentPanel.tsx` for the old Reset tab button (e.g., any tab-bar-specific style that only applied to the Reset tab and is now orphaned)
- [ ] T008 [P] Manual smoke test on iOS simulator: sign in as parent → tap Logout → confirm → verify auth screen → reopen app → verify auth screen persists
- [ ] T009 [P] Manual smoke test on Android emulator: same flow as T008
- [ ] T010 [P] Manual smoke test for Reset in Danger Zone: open Parent Panel → Manage → Danger Zone → tap Reset → verify confirmation and existing reset behavior unchanged

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks US1 (T003) and US3 (T006)
- **US1 (Phase 3)**: Depends on Phase 2 (T002) — P1, do first
- **US2 (Phase 4)**: Depends on Phase 2 complete — independent of US1, but do after since US1 is P1
- **US3 (Phase 5)**: Depends on Phase 2 (T002) and US1 (T004) prop threading — do after US1
- **Polish (Phase 6)**: Depends on US1 + US2 + US3 complete

### User Story Dependencies

- **US1 (P1)**: Requires T002 (prop interface). No dependency on US2 or US3.
- **US2 (P2)**: Requires T002. No dependency on US1 or US3.
- **US3 (P2)**: Requires T002 and T004 (onLogout prop passed from App.tsx). Effectively depends on US1 completion.

### Parallel Opportunities

- T008, T009, T010 (polish smoke tests) can all run in parallel
- US2 (T005) and US1 (T003+T004) touch different files — can run in parallel after T002

---

## Parallel Example: US2 and US1 after Foundational

```
After T002 completes:
  Agent A: T003 → T004  (App.tsx — US1 logout handler)
  Agent B: T005          (ParentPanel.tsx — US2 Danger Zone Reset button)

Then (sequentially):
  T006  (ParentPanel.tsx — US3 tab bar swap, after T004 so prop is wired)

Then (parallel):
  T008 | T009 | T010  (smoke tests)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002)
3. Complete Phase 3: US1 (T003 → T004)
4. Complete Phase 5: US3 tab bar button (T006) — needed to trigger US1
5. **STOP and VALIDATE**: Logout flow works end-to-end on device
6. Then add US2 (T005) to finish Reset relocation

### Incremental Delivery

1. T001 → T002 → T003 → T004 → T006: Logout works (MVP)
2. T005: Reset in Danger Zone (completes full feature)
3. T007 → T008 → T009 → T010: Polish and verification

---

## Notes

- T005 and T006 both modify `ParentPanel.tsx` — apply sequentially to avoid merge conflicts
- The existing `handleReset` in `App.tsx` is **not changed** — only `handleLogout` is added
- The `onReset` prop to `<ParentPanel>` is **not removed** — it threads down to the Danger Zone button
- Cloud Firestore data is NOT touched — only AsyncStorage keys are cleared on logout
- Offline logout: `doSignOut()` may fail silently; wrap in try/catch and proceed regardless
