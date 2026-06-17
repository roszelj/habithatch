# Tasks: Account Deletion

**Input**: Design documents from `/specs/041-account-deletion/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Web and native tasks within each story are parallelizable — they touch different files.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project structure needed — all changes go into existing files on the existing branch.

- [X] T001 Verify branch `041-account-deletion` is checked out and `specs/041-account-deletion/` artifacts are present

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Firebase utility functions used by both user stories and both platforms. Must be complete before any UI tasks.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Web Firebase utilities

- [X] T002 Add `reauthenticateWithPassword(password: string): Promise<void>` and `deleteCurrentUser(): Promise<void>` to `src/firebase/auth.ts` — import `reauthenticateWithCredential`, `EmailAuthProvider`, `deleteUser` from `firebase/auth`
- [X] T003 Add `deleteFamily(familyId: string, joinCode: string): Promise<void>` to `src/firebase/families.ts` — enumerate and delete all `families/{fid}/notifications`, then all `families/{fid}/profiles`, then delete `families/{fid}` document, then delete `joinCodes/{joinCode}` document

### Native Firebase utilities (parallel with web)

- [X] T004 [P] Add `reauthenticateWithPassword(password: string): Promise<void>` and `deleteCurrentUser(): Promise<void>` to `native/src/firebase/auth.ts` — use `auth().currentUser.reauthenticateWithCredential(EmailAuthProvider.credential(email, password))` and `auth().currentUser.delete()` from `@react-native-firebase/auth`
- [X] T005 [P] Add `deleteFamily(familyId: string, joinCode: string): Promise<void>` to `native/src/firebase/families.ts` — mirror the web implementation using `@react-native-firebase/firestore`: enumerate and delete all notifications subcollection docs, then all profiles subcollection docs, then delete family document, then delete joinCode document

**Checkpoint**: Firebase deletion utilities exist on both platforms — ready for UI implementation.

---

## Phase 3: User Story 1 — Parent Deletes Their Account (Priority: P1) 🎯 MVP

**Goal**: Parent can permanently delete their account and all family data via a self-service flow in the Parent Panel, satisfying Apple App Store guideline 5.1.1.

**Independent Test**: Sign in as parent → enter Parent Panel → tap "Delete Account" → confirm → verify signed out, credentials no longer work, Firestore family data gone.

### Web implementation

- [X] T006 [US1] Add `onDeleteAccount?: () => Promise<void>` prop to `ParentPanelProps` interface and add a "Danger Zone" section at the bottom of `src/components/ParentPanel.tsx` with a "Delete Account" button styled in red/destructive style
- [X] T007 [US1] Add deletion confirmation modal to `src/components/ParentPanel.tsx` — show what will be deleted (credentials, all child profiles, chores, coins, history), include a password re-entry field (used only if Firebase returns `auth/requires-recent-login`), "Delete Everything" confirm button and "Cancel" button
- [X] T008 [US1] Add deletion handler in `src/components/ParentPanel.tsx` — call `deleteFamily(familyId, joinCode)` then `deleteCurrentUser()`; if `auth/requires-recent-login` error, show password field and call `reauthenticateWithPassword(password)` then retry; show loading state during deletion; on success call `onDeleteAccount()`; on other errors show inline error message
- [X] T009 [US1] Wire `onDeleteAccount` in `src/App.tsx` — handler clears localStorage keys (`terragucci_familyId`, `terragucci_deviceProfile`, `terragucci_installed`), resets familyId state to null, and sets phase to `{ step: 'auth' }`

### Native implementation (parallel with web)

- [X] T010 [P] [US1] Add `onDeleteAccount?: () => Promise<void>` prop to `ParentPanelProps` interface and add a "Danger Zone" section at the bottom of `native/src/components/ParentPanel.tsx` with a "Delete Account" TouchableOpacity styled in red/destructive colors
- [X] T011 [P] [US1] Add deletion confirmation flow to `native/src/components/ParentPanel.tsx` — use `Alert.alert` for initial confirmation (listing what will be deleted), then show an inline password input (TextInput) if re-authentication is needed; manage loading state with ActivityIndicator during deletion; call `deleteFamily` then `deleteCurrentUser`; if `auth/requires-recent-login`, surface password input and retry; on success call `onDeleteAccount()`; on error show Alert with error message
- [X] T012 [P] [US1] Wire `onDeleteAccount` in `native/App.tsx` — handler calls `AsyncStorage.multiRemove([FAMILY_ID_KEY, DEVICE_PROFILE_KEY, 'terragucci_installed'])`, resets `familyId` state to null, and sets phase to `{ step: 'auth' }`

**Checkpoint**: Full parent account deletion works on both web and native independently.

---

## Phase 4: User Story 2 — Individual Child Profile Removal (Priority: P2)

**Goal**: Parent can remove a single child profile without deleting the parent account, giving granular data control.

**Independent Test**: Sign in as parent with 2 profiles → enter Parent Panel → remove one profile → verify that profile's Firestore doc is gone, other profile and parent account remain.

### Web Firebase utility

- [X] T013 [US2] Add `removeProfile(familyId: string, profileId: string): Promise<void>` to `src/firebase/families.ts` — delete `families/{familyId}/profiles/{profileId}` document only

### Native Firebase utility (parallel with web)

- [X] T014 [P] [US2] Add `removeProfile(familyId: string, profileId: string): Promise<void>` to `native/src/firebase/families.ts` — delete `families/{familyId}/profiles/{profileId}` document using `@react-native-firebase/firestore`

### Web UI

- [X] T015 [US2] Add `onRemoveProfile?: (profileId: string) => Promise<void>` prop to `ParentPanelProps` and add a "Remove Profile" destructive button per profile in the profile management section of `src/components/ParentPanel.tsx` — show confirmation dialog listing child name and that their data will be permanently deleted before executing
- [X] T016 [US2] Wire `onRemoveProfile` in `src/App.tsx` — call `removeProfile(familyId, profileId)`, then call `provider.clearProfile(profileId)` (or equivalent) to remove from local app state; if last profile removed, transition to `{ step: 'select' }`

### Native UI (parallel with web)

- [X] T017 [P] [US2] Add `onRemoveProfile?: (profileId: string) => Promise<void>` prop to `ParentPanelProps` and add a "Remove Profile" destructive TouchableOpacity per profile in `native/src/components/ParentPanel.tsx` — use `Alert.alert` for confirmation before executing
- [X] T018 [P] [US2] Wire `onRemoveProfile` in `native/App.tsx` — call `removeProfile(familyId, profileId)`, update app state to remove profile from provider, if last profile removed transition to `{ step: 'select' }`

**Checkpoint**: Both user stories independently functional on both platforms.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and UX polish.

- [ ] T019 [P] Smoke test all 6 quickstart.md scenarios on iOS simulator — verify: account deletion with fresh session, stale session re-auth, cancel, network error, remove individual profile, remove last profile
- [ ] T020 [P] Smoke test all 6 quickstart.md scenarios on web — same scenario set
- [ ] T021 Verify "Delete Account" is reachable within 3 taps from main parent view on both platforms (SC-003 validation)
- [ ] T022 Confirm deleted credentials cannot sign in within 30 seconds of deletion (SC-005 validation) on both platforms

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — immediate
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS** all user story work
- **US1 (Phase 3)**: Depends on Phase 2 (T002–T005 complete)
- **US2 (Phase 4)**: Depends on Phase 2 (T002–T005 complete); independent of US1
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4

### User Story Dependencies

- **US1 (P1)**: Can start immediately after Foundational — no dependency on US2
- **US2 (P2)**: Can start immediately after Foundational — no dependency on US1; web and native tracks are parallel

### Within Each User Story

- Firebase utility functions (foundational) before UI tasks
- Web and native implementations are fully parallel (different files)
- `onDeleteAccount` / `onRemoveProfile` wiring in App.tsx must happen after the ParentPanel props are added

### Parallel Opportunities

- T004 ‖ T002, T005 ‖ T003 (native mirrors web in Phase 2)
- T010, T011, T012 ‖ T006, T007, T008, T009 (native US1 ‖ web US1 in Phase 3)
- T014, T017, T018 ‖ T013, T015, T016 (native US2 ‖ web US2 in Phase 4)
- T019 ‖ T020 (platform smoke tests in Phase 5)

---

## Parallel Example: User Story 1

```
# Run web and native US1 tracks simultaneously:
Web track:   T006 → T007 → T008 → T009
Native track: T010 → T011 → T012
```

---

## Implementation Strategy

### MVP First (US1 — Apple Compliance)

1. Complete Phase 2: Foundational (T002–T005)
2. Complete Phase 3: US1 web (T006–T009) + US1 native (T010–T012) in parallel
3. **STOP and VALIDATE**: Smoke test deletion on iOS + web
4. Submit to App Store — compliance requirement met

### Incremental Delivery

1. Phase 2 complete → utilities ready on both platforms
2. Phase 3 complete → parent account deletion works → App Store compliant
3. Phase 4 complete → individual profile removal works → full data control
4. Phase 5 complete → all quickstart scenarios verified

---

## Notes

- [P] tasks = different files / platforms, no blocking dependencies between them
- [US1]/[US2] labels map tasks to specific user stories for traceability
- Re-authentication logic: attempt deletion first; only show password field if Firebase returns `auth/requires-recent-login`
- Deletion order (per research.md): notifications → profiles → family doc → joinCode → Auth account → clear local storage
- No new files are created — all changes go into existing `auth.ts`, `families.ts`, `ParentPanel.tsx`, and `App.tsx` files on each platform
