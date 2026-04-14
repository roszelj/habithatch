# Tasks: Parent Persistent Session

**Input**: Design documents from `/specs/019-parent-persistent-auth/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- No test tasks — not requested in the spec

---

## Phase 1: Setup

*No project initialization required. Single-file change, no new dependencies. Proceed directly to Phase 2.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace the `isParent` React state with a derived value. This is required by both user stories — US1 needs it to correctly identify a restored parent session, and US2 needs it to continue working correctly after an explicit sign-out.

**⚠️ CRITICAL**: Both user stories depend on this change being in place first.

- [x] T001 In `src/App.tsx`, remove `const [isParent, setIsParent] = useState(false)` (line ~33) and replace with the derived constant `const isParent = Boolean(user && !user.isAnonymous)` immediately after the `user` destructuring from `useAuth()`
- [x] T002 In `src/App.tsx`, remove the `setIsParent(true)` call from `handleSignUp` (inside the callback body)
- [x] T003 In `src/App.tsx`, remove the `setIsParent(true)` call from `handleSignIn` (inside the callback body, appears twice — in the `if (fid)` branch and the else branch)
- [x] T004 In `src/App.tsx`, remove the `setIsParent(false)` call from `handleJoinFamily` (inside the callback body)

**Checkpoint**: `isParent` is now derived from `user.isAnonymous`. `npm run build` passes with no TypeScript errors.

---

## Phase 3: User Story 1 - Parent Returns Without Re-Authenticating (Priority: P1) 🎯 MVP

**Goal**: After a page refresh, a parent with an active session bypasses the login screen and lands on the profile picker.

**Independent Test**: Sign in as a parent → verify profile picker appears → refresh the page → verify login screen is NOT shown and profile picker appears again.

### Implementation for User Story 1

- [x] T005 [US1] In `src/App.tsx`, add a `useEffect` after the `phase` useState declaration that restores the parent's phase when Firebase auth resolves. Import `useEffect` if not already imported. The effect body:
  ```
  useEffect(() => {
    if (authLoading) return;
    if (user && !user.isAnonymous && familyId && phase.step === 'auth') {
      setPhase({ step: 'profiles' });
    }
  }, [authLoading, user, familyId]);
  ```
  The dependency array must include `authLoading`, `user`, and `familyId` (not `phase` — reading `phase.step` inside without including it avoids infinite re-runs while still reading the latest value via closure on initial render).

**Checkpoint**: User Story 1 fully testable. Refresh as a signed-in parent → profile picker appears, no login screen. `npm run build` passes.

---

## Phase 4: User Story 2 - Parent Can Sign Out (Priority: P2)

**Goal**: A parent with a persisted session can explicitly sign out. After signing out, the next page load shows the login screen.

**Independent Test**: Sign in as a parent → refresh (verify auto-restore works) → sign out → refresh → verify login screen appears.

### Implementation for User Story 2

- [ ] T006 [US2] Verify (no code change needed): The existing `handleReset` and sign-out flow in `src/App.tsx` calls `doSignOut()`, which signs out of Firebase. After sign-out, `user` becomes `null`, `isParent` derives to `false`, and `phase` is set to `{ step: 'auth' }`. The `useEffect` added in T005 will not fire (user is null). Confirm via manual test that sign-out → refresh shows the login screen.

**Checkpoint**: User Story 2 verified. Sign-out correctly ends the persistent session.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T007 Run `npm run build` to confirm TypeScript compiles without errors after all changes
- [ ] T008 [P] Follow quickstart.md test scenarios in `specs/019-parent-persistent-auth/quickstart.md` to validate all flows: session restore on refresh, sign-out clears session, first-time visit shows login, loading state visible on slow connections

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (Foundational)**: No dependencies — start immediately
- **Phase 3 (US1)**: Depends on Phase 2 (`isParent` derivation must be in place before the useEffect is added)
- **Phase 4 (US2)**: Depends on Phase 3 (session restore must work before verifying sign-out clears it)
- **Phase 5 (Polish)**: Depends on Phases 3–4

### Within Phase 2

- T001 must be done before T002–T004 (removing the useState first prevents TypeScript errors from `setIsParent` still existing)
- T002, T003, T004 can then be done in any order (all remove calls to the now-deleted setter)

### Parallel Opportunities

- T002, T003, T004 can technically run in parallel (all in the same file, but non-overlapping edits in different functions)
- T007 and T008 can run in parallel after all implementation tasks complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001–T004)
2. Complete Phase 3: US1 (T005)
3. **STOP and VALIDATE**: Refresh as a signed-in parent — verify profile picker appears
4. US2 is verification-only (zero new code) — confirm sign-out still works

### Incremental Delivery

1. Foundational (T001–T004) → `isParent` derived correctly
2. US1 (T005) → session restored on refresh (MVP — main pain point fixed)
3. US2 (T006) → verify sign-out path (no code change needed)
4. Polish (T007–T008) → build + manual validation

### Note on US2

US2 requires no new code. The existing sign-out flow already clears the Firebase session. The `useEffect` added in T005 only fires for non-anonymous users with a familyId — after sign-out, `user` is null, so it does nothing. US2 is a verification-only task.

---

## Notes

- [P] tasks = non-overlapping edits safe to run in parallel
- Commit after T004 (foundational complete) and after T005 (MVP complete)
- `npm run build` is the TypeScript gate — run after every phase
- The `phase` variable is intentionally omitted from the `useEffect` dependency array in T005 to avoid infinite re-render loops (the effect only needs to react to auth state changes, not phase changes)
