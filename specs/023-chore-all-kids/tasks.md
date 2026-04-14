# Tasks: Chore for All Kids

**Input**: Design documents from `/specs/023-chore-all-kids/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Single user story — all tasks serve US1 (create a chore for all kids at once).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

No setup required — feature adds to an existing component with no new dependencies.

---

## Phase 2: Foundational

No blocking prerequisites — all changes are self-contained in ParentPanel.

---

## Phase 3: User Story 1 — Create a Chore for All Kids at Once (Priority: P1) 🎯 MVP

**Goal**: In Parent Mode → Manage tab, a "Add for all kids" checkbox broadcasts the typed chore to every child profile when submitted. Single-add behaviour is unchanged when unchecked.

**Independent Test**: In Parent Mode with 2+ children, check "Add for all kids", type "Clean room" in Morning, tap + → verify every child's morning chore list now contains "Clean room" → verify a confirmation like "Added to N kids!" appears briefly → verify approving one child's chore leaves the others unchanged.

### Implementation for User Story 1

- [x] T001 [US1] Add `forAllKids` boolean state (default `false`) and `confirmMessage` string state to `src/components/ParentPanel.tsx`
- [x] T002 [US1] Update `handleAdd` in `src/components/ParentPanel.tsx` — when `forAllKids` is true, loop over all profiles calling `onAddChore(p.id, category, val)` for each, set `confirmMessage` to `"Added to N kids!"` and auto-clear after 2s; when false, keep existing single-child call
- [x] T003 [US1] In the manage tab JSX in `src/components/ParentPanel.tsx`, add `<label className={styles.allKidsRow}>` checkbox (shown only when `profiles.length > 1`) and `{confirmMessage && <div className={styles.confirmMessage}>}` after the section title and before the `TIME_ACTIONS.map` loop
- [x] T004 [P] [US1] Add `.allKidsRow` (flex row, gap 8px, 0.85rem, cursor pointer) and `.confirmMessage` (color #2ecc71, 0.85rem, font-weight 600) to `src/components/ParentPanel.module.css`

**Checkpoint**: All 4 tasks complete → checkbox appears in manage tab for multi-child families, broadcast works, confirmation shows, single-add is unchanged, build passes.

---

## Phase 4: Polish & Validation

- [x] T005 Run `npm run build` and confirm zero TypeScript errors

---

## Dependencies & Execution Order

### Within User Story 1

- T001 must complete before T002 (state must exist before logic uses it)
- T002 must complete before T003 can be meaningfully tested (handler updated before JSX wired)
- T003 depends on T001 (references `forAllKids`, `setForAllKids`, `confirmMessage`)
- T004 is independent of T001–T003 (different file) — can run in parallel with any of them
- T005 depends on all prior tasks

### Parallel Opportunities

- T004 (CSS) can run in parallel with T001, T002, or T003

---

## Parallel Example: User Story 1

```
Start T001 (ParentPanel.tsx — add state)
In parallel: T004 (ParentPanel.module.css — add styles)
After T001: T002 (ParentPanel.tsx — update handleAdd)
After T002: T003 (ParentPanel.tsx — add JSX)
After all: T005 (build check)
```

---

## Implementation Strategy

All tasks serve the single user story — full scope is the MVP.

1. T001 → T002 → T003 (ParentPanel.tsx — sequential, same file)
2. T004 in parallel with any of the above
3. T005 (build gate)

---

## Notes

- T001, T002, T003 all touch `src/components/ParentPanel.tsx` — run **sequentially**
- T004 touches `src/components/ParentPanel.module.css` only — safe to run in parallel
- Checkbox is hidden when `profiles.length <= 1` (see research Decision 4)
- The loop in T002 calls `onAddChore` once per profile — zero changes to Game.tsx or prop interfaces
- `confirmMessage` uses the same `state + setTimeout(2000)` pattern as `bonusMessage` in the bonus tab
