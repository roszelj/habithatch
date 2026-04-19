# Tasks: Parent Pause Mode

**Input**: Design documents from `/specs/038-parent-pause-mode/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: Which user story this task belongs to (US1 = pause, US2 = resume, US3 = child indicator)
- All paths are relative to repo root

---

## Phase 1: Setup

**Purpose**: No new project setup needed (existing React/TypeScript app). This phase is a single data-model change that unblocks all user stories.

> No tasks — proceed directly to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Extend `ChildProfile` with the `isPaused` flag. All user story work depends on this type change.

**⚠️ CRITICAL**: Must be complete before any user story phase begins.

- [x] T001 Add `isPaused?: boolean` as an optional field to the `ChildProfile` interface in `src/models/types.ts` (after the `fcmTokens` field — absent value treated as `false` everywhere, no migration needed)

**Checkpoint**: Type compiles cleanly (`npm run build` passes) — user story implementation can begin.

---

## Phase 3: User Stories 1 & 2 — Parent Pause / Resume Toggle (Priority: P1) 🎯 MVP

**Goal**: Parent can enable and disable pause for any child from within parent mode. While paused, health decay stops and the streak is protected. On resume, health and streak are restored exactly as they were.

**Note**: US1 (pause) and US2 (resume) share a single toggle implementation — they are delivered together in this phase.

**Independent Test**:
1. Open the app as a parent (enter PIN), go to Manage tab for a child, click "Pause Pet" — button should change to "Resume Pet".
2. Return to the child's pet screen and wait 30 seconds — health bar must not move.
3. Simulate a day change (or check the daily-reset path) while paused — streak must not decrease.
4. Re-enter parent mode, click "Resume Pet" — health and streak stay at the paused values; normal decay resumes.

### Implementation for User Stories 1 & 2

- [x] T002 [US1] Add `isPaused` state (`useState(profile.isPaused ?? false)`) and `isPausedRef` (`useRef`) to `src/components/Game.tsx`, keeping the ref in sync on every render alongside the existing `onSaveProfileRef` pattern
- [x] T003 [US1] Guard health decay: wrap the `dispatch({ type: 'decay', delta })` call inside `useGameLoop` with `if (!isPausedRef.current)` in `src/components/Game.tsx` (lines 191–193 in current file)
- [x] T004 [US1] Guard streak reset: modify the `useDailyReset` `onReset` callback in `src/components/Game.tsx` to always call `setLastPlayedDate(newDate)` but return early before `setChores`/`setStreak` when `isPausedRef.current` is true, protecting streak across day boundaries while paused
- [x] T005 [US1] Include `isPaused` in `buildProfile()` return object and its dependency array, and add `isPaused` to the `prevSaveKey` JSON string in the auto-save effect — both in `src/components/Game.tsx`
- [x] T006 [US1] Add `handleTogglePause` callback in `src/components/Game.tsx`: for the active child, call `setIsPaused(paused)`; for other children, call `onUpdateAppData` updating `isPaused` and (on resume) setting `lastPlayedDate` to `getToday()` so the first active day is treated as today
- [x] T007 [P] [US1] Add `onTogglePause?: (profileId: string, paused: boolean) => void` prop to `ParentPanelProps` interface, destructure it in the component signature, and pass `onTogglePause={handleTogglePause}` in the `<ParentPanel>` JSX in `src/components/Game.tsx` — `src/components/ParentPanel.tsx`
- [x] T008 [US1] Add pause toggle UI in the Manage tab of `src/components/ParentPanel.tsx`: a status label ("💤 Pet is paused" / "▶️ Pet is active"), a "Pause Pet" / "Resume Pet" button that calls `onTogglePause(selectedProfile.id, !selectedProfile.isPaused)`, and a short helper hint below the button
- [x] T009 [P] [US1] Add a `💤 Paused` badge next to the child's health/streak row in the Dashboard tab of `src/components/ParentPanel.tsx`, visible only when `profile.isPaused === true`
- [x] T010 [P] [US1] Add CSS for `.pauseRow`, `.pauseBtn`, `.pauseHint`, and `.pausedBadge` in `src/components/ParentPanel.module.css`, following the existing button and badge style patterns already in that file

**Checkpoint**: User Stories 1 and 2 are fully functional. Parent can pause and resume any child. Health freezes on pause, streak is preserved, and both restore correctly on resume.

---

## Phase 4: User Story 3 — Child Sees Pet Is Resting (Priority: P2)

**Goal**: When a child's profile is paused, a clear visual indicator appears on the pet screen so the child knows the pet is safe and resting.

**Independent Test**:
1. Pause a child's profile from parent mode.
2. Switch to the child's pet screen.
3. A "💤 Resting" banner must be visible without any extra navigation.
4. Feed the pet or check off a chore — both still work normally (positive interactions not blocked).
5. Resume from parent mode — banner disappears.

### Implementation for User Story 3

- [x] T011 [US3] Add a pause indicator banner in the main pet-screen `return` of `src/components/Game.tsx`: `{isPaused && <div className={styles.pauseBanner}>💤 Resting — your pet is safe!</div>}` placed above the creature stage div
- [x] T012 [P] [US3] Add `.pauseBanner` CSS in `src/components/Game.module.css`: centered, soft background (light blue or similar calm color), padding, rounded corners, medium font-size — consistent with the existing `.message` style for visual coherence

**Checkpoint**: Child sees a clear resting indicator when paused. All interactions remain functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation pass and edge case verification across all stories.

- [ ] T013 [P] Manual playtest edge case: pause a profile that already has a low health value, wait for several simulated ticks, confirm health is still at the same value when resumed — `src/components/Game.tsx`
- [ ] T014 [P] Manual playtest edge case: for a cloud-mode family, pause a child on device A, open the app on device B, confirm health is also frozen on device B (Firestore snapshot propagates `isPaused: true`) — `src/firebase/profiles.ts` (read-only verification, no code change expected)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (Foundation)**: Start immediately — no dependencies
- **Phase 3 (US1 + US2)**: Depends on T001 (Phase 2) — BLOCKS until type is updated
- **Phase 4 (US3)**: Depends on T002 (isPaused state in Game.tsx from Phase 3) — can start as soon as T002 is done, does not need the full Phase 3 to be complete
- **Phase 5 (Polish)**: Depends on all phases complete

### Within Phase 3

```
T001 (type change)
  └─> T002 (state + ref)
        ├─> T003 (decay guard)      [P with T004, T005]
        ├─> T004 (streak guard)     [P with T003, T005]
        ├─> T005 (buildProfile + save key)  [P with T003, T004]
        └─> T006 (toggle handler)
              ├─> T007 (prop to ParentPanel)
              │     └─> T008 (toggle UI in Manage tab)
              │           └─> T009 (pause badge in Dashboard) [P with T010]
              └─> T010 (CSS for ParentPanel)    [P with T009]
```

### Within Phase 4

```
T002 complete (isPaused in scope)
  └─> T011 (banner JSX)
        └─> T012 (banner CSS)  [P — different file from T011]
```

### Parallel Opportunities

- T003, T004, T005 can all be written in parallel (different sections of Game.tsx with no ordering dependency between them)
- T009 and T010 can be done in parallel (different sections of ParentPanel.tsx / different file)
- T011 and T012 can be done in parallel (Game.tsx JSX vs Game.module.css)
- T013 and T014 are fully independent playtest tasks

---

## Parallel Example: Phase 3 Core Logic

```
# Once T002 is complete, launch these three Game.tsx changes together:
Task T003: "Guard decay in useGameLoop in src/components/Game.tsx"
Task T004: "Guard streak reset in useDailyReset.onReset in src/components/Game.tsx"
Task T005: "Add isPaused to buildProfile + auto-save key in src/components/Game.tsx"

# Once T008 is started, these two ParentPanel tasks can run together:
Task T009: "Pause badge in Dashboard tab in src/components/ParentPanel.tsx"
Task T010: "Pause CSS in src/components/ParentPanel.module.css"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 only — Phase 3)

1. Complete T001 (type change)
2. Complete T002–T010 (pause/resume logic + parent UI)
3. **STOP and VALIDATE**: Parent can pause/resume; health freezes; streak protected
4. Ship this — it delivers the full protective value even without the child-facing indicator

### Incremental Delivery

1. T001 → Foundation ready
2. T002–T010 → US1 + US2 complete → **MVP shippable**
3. T011–T012 → US3 complete → child-facing polish
4. T013–T014 → Edge case validation

---

## Notes

- `isPaused` is optional on `ChildProfile` — read it everywhere as `profile.isPaused ?? false` to avoid type errors on existing data
- The `isPausedRef` pattern (mirrors the existing `onSaveProfileRef` and `stateRef` approach) is essential to avoid stale closures inside `useGameLoop`'s `requestAnimationFrame` loop
- The streak guard in T004 works by keeping `lastPlayedDate` current during the pause, so `evaluateStreak` sees `lastPlayedDate === today` and returns early — no streak reset fires
- On resume for a non-active child profile (T006), `lastPlayedDate` must be set to today in the same `onUpdateAppData` call, not as a separate save — otherwise the Firestore listener could fire a stale state briefly
