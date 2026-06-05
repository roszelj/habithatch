# Tasks: Time-Based Chore List in Kid View

**Input**: Design documents from `/specs/040-time-based-chores/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Paths are relative to repo root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project initialization needed — single new component in existing RN project.

- [x] T001 Confirm branch `040-time-based-chores` is checked out and `native/` builds cleanly via `cd native && npx expo start`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Time period detection utility used by all three user stories.

**⚠️ CRITICAL**: This must be complete before any user story work begins.

- [x] T002 Add `getCurrentPeriod(): TimeActionType` helper function to `native/src/models/types.ts` — returns `'morning'` if hour < 12, `'afternoon'` if hour < 18, `'evening'` otherwise — alongside the existing `isWeekend()` utility

**Checkpoint**: `getCurrentPeriod()` is exported and callable — user story implementation can begin.

---

## Phase 3: User Story 1 — See Relevant Chores by Time of Day (Priority: P1) 🎯 MVP

**Goal**: Child opens the kid view and sees only the current time period's chores, displayed inline below the Feed button. They can tap to mark a chore done.

**Independent Test**: Run app on simulator, set device time to morning, open kid view — only morning chores appear below Feed button. Tap a chore — it moves to pending/approved state. Change device time to afternoon, re-open app — afternoon chores appear.

### Implementation for User Story 1

- [x] T003 [US1] Create `native/src/components/TimedChoreSection.tsx` with component skeleton: accepts `chores: CategoryChores`, `parentActive: boolean`, `onToggle: (category: TimeActionType, id: string) => void` as props; internally calls `getCurrentPeriod()` to derive `currentPeriod: TimeActionType` state on mount; renders a `<View>` with a section header label (emoji + period name, e.g., "🌅 Morning Chores") and the filtered chore list `chores[currentPeriod]`
- [x] T004 [US1] Implement chore row rendering inside `TimedChoreSection` — for each chore in `chores[currentPeriod]`, render a `TouchableOpacity` row containing a checkbox view, chore name `Text`, and call `onToggle(currentPeriod, chore.id)` on press when chore status is `'unchecked'`; disable press when status is `'pending'` or `'approved'`
- [x] T005 [US1] Add empty state to `TimedChoreSection`: when `chores[currentPeriod].length === 0`, render centered `Text` reading `"No {period} chores — enjoy your free time! 🎉"` using the period label from `TIME_ACTIONS`
- [x] T006 [US1] Integrate `TimedChoreSection` into `native/src/components/Game.tsx`: import the component; mount it inside the existing `ScrollView` directly after `<View style={styles.actions}>` (the Feed button row), passing `chores`, `parentActive`, and `onToggle={(category, id) => checkOffChore(category, id, parentActive)}`

**Checkpoint**: US1 is fully functional. Child sees time-filtered chores below Feed, can mark them done. Verify independently via simulator.

---

## Phase 4: User Story 2 — Chore Completion Status Visible (Priority: P2)

**Goal**: Each chore row in `TimedChoreSection` visually communicates its status — unchecked (actionable), pending (awaiting parent), approved (complete with strikethrough).

**Independent Test**: With a parent PIN set, mark a chore done → it shows "pending" badge. Have parent approve → row shows strikethrough. Without a parent PIN, mark done → row immediately shows strikethrough/approved.

### Implementation for User Story 2

- [x] T007 [P] [US2] Add status-driven visual styles to `TimedChoreSection` StyleSheet in `native/src/components/TimedChoreSection.tsx`: `done` style (opacity 0.5), `pending` style (opacity 0.7), `checkboxChecked` style (green background `#2ecc71`), `pendingBadge` style (yellow text `#f0e68c` with subtle background) — mirror the patterns from `ChoreList.tsx`
- [x] T008 [US2] Apply status styles to chore rows in `TimedChoreSection`: set `done`/`pending` style on row container based on `chore.status`; show filled green checkbox when `status !== 'unchecked'`; render a `"pending"` badge `Text` when `chore.status === 'pending'`; apply `textDecorationLine: 'line-through'` to chore name when `chore.status === 'approved'`

**Checkpoint**: US2 complete. All three status states (unchecked / pending / approved) are clearly distinct. Verify by cycling a chore through all three states on simulator.

---

## Phase 5: User Story 3 — Section Updates When Time Period Changes (Priority: P3)

**Goal**: If the app stays open across a time boundary, `TimedChoreSection` automatically shows the new period's chores — no app restart needed.

**Independent Test**: Open app at 11:55 AM showing morning chores; wait or mock time past noon; section switches to afternoon chores without restarting.

### Implementation for User Story 3

- [x] T009 [US3] Add a `setInterval` inside a `useEffect` in `TimedChoreSection` that re-evaluates `getCurrentPeriod()` every 60 000 ms and updates `currentPeriod` state if the period has changed; clear the interval on component unmount via the `useEffect` cleanup function
- [x] T010 [US3] Add an `AppState` change listener inside the same or a separate `useEffect` in `TimedChoreSection` that re-evaluates `getCurrentPeriod()` whenever `AppState` transitions to `'active'` (foreground), ensuring the correct period is shown immediately when the user returns to the app after a time boundary; remove the listener in cleanup

**Checkpoint**: US3 complete. Section updates within 60s of a time boundary crossing while app is open, and immediately when returning from background.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Apple HIG-aligned styling, section integration quality, and final smoke test.

- [x] T011 Apply Apple HIG-compliant styling to `TimedChoreSection` in `native/src/components/TimedChoreSection.tsx`: section header uses `fontSize: 15, fontWeight: '700'`, consistent with `ChorePanel`'s `sectionHeaderText` style; row height and touch target ≥ 44pt per HIG; section wrapped in a `View` with `marginTop: 12` to create clear visual separation from the Feed action above it
- [x] T012 [P] Add a divider or subtle card background to the `TimedChoreSection` in `native/src/components/TimedChoreSection.tsx` to visually group it from the pet stats area above — use `backgroundColor: 'rgba(255,255,255,0.04)'` and `borderRadius: 12` consistent with existing `creatureStage` card treatment
- [ ] T013 Run through the full quickstart.md test checklist manually on iOS simulator: morning chores, afternoon chores, evening chores, empty state, mark done without PIN (approved), mark done with PIN (pending), confirm Chores tab still works independently

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Start immediately
- **Phase 2 (Foundational)**: After Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: After Phase 2 — MVP deliverable
- **Phase 4 (US2)**: After Phase 3 (status styling builds on chore rows from T003–T004)
- **Phase 5 (US3)**: After Phase 3 (auto-refresh wraps the existing period state from T003)
- **Phase 6 (Polish)**: After all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (T002). No other story dependencies.
- **US2 (P2)**: Depends on US1 (T003–T004 create the rows that US2 styles).
- **US3 (P3)**: Depends on US1 (T003 creates the `currentPeriod` state that US3 refreshes).

### Parallel Opportunities

- T007 (status styles) can be written in parallel with T004 (row rendering) since both edit the same file but touch different StyleSheet keys — coordinate to avoid conflicts.
- T009 and T010 (interval + AppState) can be drafted in parallel as separate `useEffect` blocks, then merged.
- T011 and T012 (polish styling) are independent style additions and can run in parallel.

---

## Parallel Example: User Story 1

```bash
# T003 and T004 are sequential (T004 builds on T003's skeleton).
# T005 (empty state) can be drafted in parallel with T004:
Task: "Implement chore row rendering in TimedChoreSection.tsx"   # T004
Task: "Add empty state rendering in TimedChoreSection.tsx"       # T005 [P]
# Then T006 (Game.tsx integration) after both complete.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001 (confirm build)
2. Complete T002 (getCurrentPeriod helper) — **foundational gate**
3. Complete T003 → T004 → T005 → T006 (US1 component + integration)
4. **STOP and VALIDATE**: Run simulator, verify morning/afternoon/evening filtering + chore toggle
5. Ship US1 as MVP — child can see and act on their current chores

### Incremental Delivery

1. T001 → T002 → T003–T006 → validate US1 (MVP)
2. T007–T008 → validate US2 (status visuals)
3. T009–T010 → validate US3 (auto-refresh)
4. T011–T013 → polish and final smoke test

---

## Notes

- No new dependencies — all primitives (`View`, `Text`, `TouchableOpacity`, `AppState`, `StyleSheet`) are from `react-native`
- `getCurrentPeriod()` placed in `types.ts` alongside `isWeekend()` for consistency
- `TimedChoreSection` should NOT include add/remove chore controls — those remain parent-only in `ChorePanel`
- Verify tests fail before implementing (N/A here — no automated tests in this project per constitution)
- Commit after T006 (US1 complete) as a clean MVP checkpoint before adding US2/US3
