# Tasks: Manual Chore Refresh

**Input**: Design documents from `/specs/037-manual-chore-refresh/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: Single user story feature. Tasks are ordered by dependency (hook → integration → UI → styles).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Modify the daily reset hook to expose imperative trigger

- [x] T001 [US1] Modify `useDailyReset` hook to return `{ triggerReset }` object exposing the `checkAndReset` function for imperative use in `src/hooks/useDailyReset.ts`

**Checkpoint**: Hook returns imperative trigger — callers can now invoke reset manually

---

## Phase 2: User Story 1 — Child Manually Refreshes Chores for New Day (Priority: P1) 🎯 MVP

**Goal**: A child sees a refresh banner at the top of the chore panel when the automatic daily reset hasn't fired for a new day. Tapping it triggers the daily reset (clears completions for active day type, evaluates streak, updates lastPlayedDate). The banner disappears after refresh.

**Independent Test**: Open app, complete some chores, change device clock to next day, navigate to chores view, verify refresh banner appears, tap it, verify chores reset and banner disappears.

### Implementation for User Story 1

- [x] T002 [US1] Update `Game.tsx` to capture `triggerReset` from `useDailyReset`, compute `isStale` boolean (`lastPlayedDate !== today`), and pass `isStale` + `triggerReset` as `onRefresh` to `ChorePanel` in `src/components/Game.tsx`
- [x] T003 [P] [US1] Add `isStale: boolean` and `onRefresh: () => void` props to `ChorePanel`, render refresh banner button at the top of the panel when `isStale` is true in `src/components/ChorePanel.tsx`
- [x] T004 [P] [US1] Add `.refreshBtn` styles for the refresh banner button (informational banner style, distinct from existing resetAllBtn) in `src/components/ChorePanel.module.css`

**Checkpoint**: Manual chore refresh is fully functional. Child can tap refresh to reset stale chores for the new day.

---

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: Final verification

- [x] T005 Manual playtest: open app, complete chores, simulate day change, verify refresh banner appears, tap to refresh, verify chores reset to unchecked for correct day type (weekday/weekend), verify streak evaluated correctly, verify banner disappears after refresh, verify multiple taps are idempotent

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (US1)**: T002 depends on T001 (needs triggerReset from hook). T003 and T004 can run in parallel (different files).
- **Phase 3 (Polish)**: Depends on all Phase 2 tasks complete

### Within User Story 1

- T001 first (hook modification)
- T002 next (Game.tsx integration — depends on T001)
- T003 and T004 in parallel (ChorePanel component + CSS are separate files)
- T005 last (manual verification)

### Parallel Opportunities

- T003 and T004 can run in parallel (component + CSS module)

---

## Implementation Strategy

### MVP First (Single Story)

1. Complete T001: Hook exposes triggerReset
2. Complete T002: Game.tsx passes props down
3. Complete T003 + T004 in parallel: ChorePanel UI + styles
4. Complete T005: Manual playtest
5. **DONE**: Feature complete in 5 tasks across 4 files

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps all tasks to the single user story
- No new files created — only modifications to 4 existing files
- Commit after each task or logical group
- The refresh action reuses existing `checkAndReset` logic — idempotent by design
