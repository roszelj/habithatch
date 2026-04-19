# Tasks: Kid Help Guide

**Input**: Design documents from `/specs/039-kid-help-guide/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new files and prepare the static content module shell.

- [x] T001 Create `src/models/helpContent.ts` — define `HelpAudience` union (`'kid' | 'parent'`) and `HelpTopic` interface (`id`, `title`, `summary`, `detail`, `audience`) with empty `KID_HELP_TOPICS` and `PARENT_HELP_TOPICS` export arrays

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Populate the static content module with all 18 help topics. Both the kid section and parent section components depend on this data being present and correct.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Implement all 9 kid help topics in `src/models/helpContent.ts` — populate `KID_HELP_TOPICS` with entries for: Your Pet, Feeding Your Pet, Points & Coins, Your Streak, Chores, The Store, Mini-Games, Change Creature, Switch Profile (each with `id`, `title`, `summary`, and `detail` text written at a 4th-grade reading level)
- [x] T003 Implement all 9 parent help topics in `src/models/helpContent.ts` — populate `PARENT_HELP_TOPICS` with entries for: PIN Setup & Access, Managing Chores, Approving Chores, Bonus Points, Reward Presents, Pause Mode, Child Profiles, Join Code, Chore Points (each with adult-readable `detail` text accurately describing current Parent Mode behavior)

**Checkpoint**: `helpContent.ts` exports two complete arrays totalling 18 topics. Import both in a test render to confirm no TypeScript errors.

---

## Phase 3: User Story 1 - Access Help from Kid View (Priority: P1) 🎯 MVP

**Goal**: A child taps a Help button in the kid toolbar, a help screen opens showing "For Kids" and "For Parents" labeled sections as flat topic lists, and a back button returns them to the pet screen.

**Independent Test**: Tap Help button → help screen opens with both section headers and all topic rows visible → tap Back → pet screen shown, coins/health/streak unchanged.

### Implementation for User Story 1

- [x] T004 [US1] Create `src/components/HelpScreen.tsx` — accept props `{ onClose: () => void; showSwitchProfile?: boolean }`, render a scrollable screen with two labeled sections ("For Kids" / "For Parents"), each rendering a list of topic rows (title + summary visible per row) from `KID_HELP_TOPICS` and `PARENT_HELP_TOPICS`; include a Back button that calls `onClose`; filter out `kid-switch-profile` topic when `showSwitchProfile` is falsy
- [x] T005 [P] [US1] Create `src/components/HelpScreen.module.css` — styles for: screen container, section header, topic row (title + summary), back button; use the same card/rounded-corner visual language as existing screens (reference `Game.module.css` and `ChorePanel.module.css` for spacing/typography patterns)
- [x] T006 [US1] Extend view type in `src/components/Game.tsx` — add `'help'` to the `view` state union (`'pet' | 'chores' | 'store' | 'pin' | 'parent' | 'change-creature' | 'help'`), add a Help toolbar button (alongside Chores, Store, Change, Parent, Switch), and add a conditional render block: when `view === 'help'` return `<HelpScreen onClose={() => setView('pet')} showSwitchProfile={!!onSwitchProfile} />`

**Checkpoint**: Help button appears in kid toolbar. Tapping it shows the help screen with both sections. Back returns to pet view with no game state change.

---

## Phase 4: User Story 2 - Browse Help Topics Individually (Priority: P2)

**Goal**: Tapping a topic row expands to show full `detail` text; a back-to-list control returns to the topic list without closing the help screen entirely.

**Independent Test**: Open Help → tap any topic row → detail text fills the view → tap back-to-list → topic list is shown again (not the pet screen).

### Implementation for User Story 2

- [x] T007 [US2] Add `selectedTopic` state to `src/components/HelpScreen.tsx` — `useState<HelpTopic | null>(null)`; topic row `onClick` sets `selectedTopic`; when `selectedTopic` is non-null, render a detail view showing the topic `title` and `detail` text plus a "← Back" button that sets `selectedTopic` back to `null`; the outer Back button (`onClose`) remains accessible only from the list view (not the detail view)
- [x] T008 [P] [US2] Add detail view styles to `src/components/HelpScreen.module.css` — styles for: detail container, detail title, detail body text (readable line-length on 320–428px screens), back-to-list button

**Checkpoint**: Full topic drill-down navigation works. Tapping topic → detail. Tapping back-to-list → list. Tapping back (from list) → pet screen.

---

## Phase 5: User Story 3 - Parent Reads How to Manage Their Kids (Priority: P2)

**Goal**: The "For Parents" section is visually distinct from "For Kids" and every parent topic detail accurately describes the current Parent Mode behavior (verified by content review).

**Independent Test**: Open Help → scroll to "For Parents" section → tap each of the 9 parent topics in turn → verify each detail text correctly and fully explains the corresponding Parent Mode feature.

### Implementation for User Story 3

- [x] T009 [US3] Review and finalize all parent topic `detail` strings in `src/models/helpContent.ts` — cross-reference each topic against the actual Parent Mode UI (ParentPanel.tsx, Game.tsx parent view) to confirm accuracy; ensure PIN Setup explains both first-time creation and re-entry; ensure Pause Mode explains what IS paused (decay, daily reset) and what is NOT (lastPlayedDate advances); ensure Join Code explains how to find and use it
- [x] T010 [P] [US3] Add visual distinction between sections in `src/components/HelpScreen.module.css` — "For Parents" section header should be visually differentiated from "For Kids" (e.g., different accent color or icon) so a parent can quickly identify their section when handing the device back after reading

**Checkpoint**: Parent section is visually distinct. All 9 parent topics have accurate, complete detail text.

---

## Phase 6: User Story 4 - Help Is Always Current (Priority: P3)

**Goal**: The Switch Profile topic is shown only when Switch Profile is available; all other topics always render; content matches current game features.

**Independent Test**: (a) With `onSwitchProfile` provided → Help shows Switch Profile topic. (b) Without `onSwitchProfile` → Switch Profile topic is absent. (c) All other 17 topics always present.

### Implementation for User Story 4

- [x] T011 [US4] Verify conditional Switch Profile filtering in `src/components/HelpScreen.tsx` — confirm `showSwitchProfile` prop correctly gates the `kid-switch-profile` topic in `KID_HELP_TOPICS`; verify that all other 17 topics render unconditionally; add a snapshot or console assertion during development if helpful

**Checkpoint**: Switch Profile topic correctly appears/disappears based on prop. Topic count is 17 (without Switch Profile) or 18 (with).

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, layout checks, and accessibility pass.

- [x] T012 [P] Run all quickstart.md verification steps manually — open Help while paused, confirm pause banner not required inside help screen and returns cleanly; open Help and close without triggering any state changes; verify all 18 topics load with no TypeScript errors
- [x] T013 [P] Responsive layout check — open Help at 320px and 428px viewport widths (use browser dev tools) and verify no horizontal overflow, truncation, or layout breaks in topic rows, detail text, or section headers
- [x] T014 Run `npm test && npm run lint` from repo root and confirm no new errors introduced by the feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (type exists) — **BLOCKS all user story phases**
- **US1 (Phase 3)**: Depends on Phase 2 completion — MVP deliverable
- **US2 (Phase 4)**: Depends on Phase 3 (HelpScreen component exists)
- **US3 (Phase 5)**: Depends on Phase 2 (content exists) and Phase 3 (section renders); T009 and T010 can run in parallel
- **US4 (Phase 6)**: Depends on Phase 3 (prop wiring in HelpScreen)
- **Polish (Phase 7)**: Depends on all story phases complete; T012 and T013 can run in parallel

### User Story Dependencies

- **US1 (P1)**: After Foundational — delivers full MVP (visible, navigable help)
- **US2 (P2)**: After US1 — adds topic drill-down on top of existing list
- **US3 (P2)**: After US1 — content review + visual distinction (parallel with US2)
- **US4 (P3)**: After US1 — conditional prop logic already wired in T004/T006

### Parallel Opportunities

- T005 (CSS) can be written alongside T004 (component) — different files
- T008 (detail CSS) can be written alongside T007 (detail logic) — different files
- T009 (content review) and T010 (section styling) can run in parallel — different files
- T012 and T013 (Polish) can run in parallel

---

## Parallel Example: User Story 1

```
# T004 and T005 can run in parallel (different files):
Task A: "Create HelpScreen.tsx component in src/components/HelpScreen.tsx"
Task B: "Create HelpScreen.module.css in src/components/HelpScreen.module.css"

# T006 depends on both completing:
Task: "Wire 'help' view into Game.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001)
2. Complete Phase 2 (T002, T003)
3. Complete Phase 3 (T004, T005, T006)
4. **STOP and VALIDATE**: Tap Help button, see both sections, tap Back
5. Ship as-is — already delivers full help guide value even without topic drill-down

### Incremental Delivery

1. T001–T003 → Content ready
2. T004–T006 → Help screen accessible, both sections visible (MVP)
3. T007–T008 → Topics expand to show detail
4. T009–T010 → Parent section polished and accurate
5. T011 → Conditional Switch Profile correct
6. T012–T014 → Validation pass, ship

---

## Notes

- [P] tasks = different files, no incomplete-task dependencies
- [Story] label maps each task to its user story for traceability
- T004 and T006 both touch the help entry point — complete T004 before T006
- Help content (T002, T003) is the highest-risk task: writing 18 topic `detail` strings accurately takes care; cross-reference the actual UI while writing
- No new npm packages, no Firestore changes, no localStorage changes
