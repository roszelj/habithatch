# Tasks: Parent Join Code Display

**Input**: Design documents from `/specs/025-parent-join-code/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Organization**: Single user story — all tasks serve US1 (show join code in parent panel).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

No new dependencies or project structure changes required.

---

## Phase 2: Foundational

No blocking prerequisites — all changes are isolated to prop threading and a display addition.

---

## Phase 3: User Story 1 — Parent Sees Join Code in Parent Mode (Priority: P1) 🎯 MVP

**Goal**: The family join code is displayed at the top of the parent panel (above the tabs) in cloud mode. In local mode, nothing is shown.

**Independent Test**: Log in as a parent in cloud mode → open Parent Mode → verify a "Family Code: XXXXXX" banner appears above the tabs on every tab → switch to local mode and verify no code is shown.

### Implementation for User Story 1

- [x] T001 [US1] Add `joinCode?: string` to `GameProps` interface and destructure it in the `Game` function signature in `src/components/Game.tsx`; pass `joinCode={joinCode}` to the `<ParentPanel />` element in the `view === 'parent'` branch
- [x] T002 [P] [US1] Add `joinCode?: string` to `ParentPanelProps` and destructure it in `src/components/ParentPanel.tsx`; render `{joinCode && <div className={styles.joinCodeBanner}>Family Code: <span className={styles.joinCode}>{joinCode}</span></div>}` immediately before the `<div className={styles.tabs}>` element
- [x] T003 [P] [US1] Add `.joinCodeBanner` (font-size 0.8rem, color rgba(255,255,255,0.5), text-align center) and `.joinCode` (font-weight 700, color #f0e68c, letter-spacing 0.15em) to `src/components/ParentPanel.module.css`
- [x] T004 [US1] In `src/App.tsx`, add `joinCode={provider.cloudContext?.joinCode}` prop to the `<Game />` element inside the `phase.step === 'play'` block

**Checkpoint**: All 4 tasks complete → join code banner visible in parent panel in cloud mode → hidden in local mode → build passes.

---

## Phase 4: Polish & Validation

- [x] T005 Run `npm run build` and confirm zero TypeScript errors

---

## Dependencies & Execution Order

### Within User Story 1

- T001 must complete before T004 (Game must accept the prop before App can pass it)
- T002 and T003 are independent of T001 (different files) — can run in parallel with T001
- T002 depends on T003 only for styles to render correctly (but T003 can be written first or last)
- T004 depends on T001 (prop must exist on Game before App passes it)

### Parallel Opportunities

- T002 (ParentPanel.tsx) and T003 (ParentPanel.module.css) can run in parallel with T001 and each other

---

## Parallel Example

```
Start T001 (Game.tsx — add prop + pass to ParentPanel)
In parallel: T002 (ParentPanel.tsx — add prop + render banner)
In parallel: T003 (ParentPanel.module.css — add styles)
After T001: T004 (App.tsx — pass joinCode to Game)
After all: T005 (build gate)
```

---

## Implementation Strategy

1. T001 + T002 + T003 (parallel where possible)
2. T004 (after T001)
3. T005 (build gate)

---

## Notes

- T001 and T004 both touch different parts of the prop chain — T001 first (receiver), T004 last (sender)
- T002 and T003 touch different files — safe to parallelize
- `provider.cloudContext` is `null` in local mode → `provider.cloudContext?.joinCode` is `undefined` → banner not rendered
- The banner position (above tabs) satisfies FR-003: always visible on every tab
