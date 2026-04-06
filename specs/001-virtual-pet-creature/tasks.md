# Tasks: Virtual Pet Creature

**Input**: Design documents from `/specs/001-virtual-pet-creature/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, quickstart.md

**Tests**: Included for game-logic correctness (creature state machine, decay timing) per constitution. No UI/snapshot tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Project initialization and tooling

- [x] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest . -- --template react-ts`
- [x] T002 Install dev dependencies: vitest in package.json
- [x] T003 [P] Configure Vite in vite.config.ts (CSS Modules enabled by default)
- [x] T004 [P] Configure Vitest in vite.config.ts (test config section)
- [x] T005 [P] Add global styles reset in src/index.css
- [x] T006 [P] Create type definitions in src/models/types.ts (Creature, Mood, ActionType, CreatureAction interfaces per data-model.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state management hook that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement useCreature hook in src/hooks/useCreature.ts — useReducer with actions: feed, play, sleep; initial state: name="Gucci", hunger=100, happiness=100, energy=100; stat clamping [0,100]; mood derivation (happy/neutral/sad/distressed per data-model.md thresholds)
- [x] T008 Write tests for useCreature in tests/useCreature.test.ts — verify: initial state, feed +25 capped at 100, play +20 capped at 100, sleep +30 capped at 100, mood derivation for all four states, stats never exceed 0-100 range

**Checkpoint**: Core state machine ready — user story implementation can begin

---

## Phase 3: User Story 1 — Meet Your New Pet (Priority: P1)

**Goal**: Player sees their creature with visible mood and stat indicators on game load

**Independent Test**: Launch the app, verify creature appears with happy mood and all three stat bars at maximum

### Implementation for User Story 1

- [x] T009 [P] [US1] Create StatBar component in src/components/StatBar.tsx — accepts label, value (0-100), color props; renders a playful animated bar (no raw numbers); include CSS in src/components/StatBar.module.css
- [x] T010 [P] [US1] Create Creature component in src/components/Creature.tsx — accepts mood prop (happy/neutral/sad/distressed); renders different visual states (emoji or CSS-based sprite); include CSS in src/components/Creature.module.css
- [x] T011 [US1] Create Game component in src/components/Game.tsx — uses useCreature hook; renders Creature with derived mood; renders three StatBar components (hunger, happiness, energy); layout with creature centered and stats below
- [x] T012 [US1] Wire Game into App in src/App.tsx — replace Vite boilerplate with Game component; add app-level styles in src/App.module.css

**Checkpoint**: App loads showing a happy creature with three full stat bars. Playable and demo-able.

---

## Phase 4: User Story 2 — Care For Your Pet (Priority: P1)

**Goal**: Player can feed, play, and put creature to sleep with immediate visual feedback

**Independent Test**: Click each action button and verify the corresponding stat increases and the creature reacts visually

### Implementation for User Story 2

- [x] T013 [P] [US2] Create ActionButton component in src/components/ActionButton.tsx — accepts label, emoji/icon, onClick, disabled props; playful styling with press animation; include CSS in src/components/ActionButton.module.css
- [x] T014 [US2] Add action buttons to Game component in src/components/Game.tsx — three ActionButton instances (Feed, Play, Sleep) wired to useCreature dispatch; creature shows brief reaction animation on action (CSS transition on mood change)
- [x] T015 [US2] Add overflow feedback in src/components/Game.tsx — when stat is already at max and player clicks action, creature reacts with a "full/satisfied" visual cue instead of no response

**Checkpoint**: All three interactions work. Stats increase, creature reacts. Combined with US1, this is the MVP.

---

## Phase 5: User Story 3 — Pet Needs Change Over Time (Priority: P2)

**Goal**: Stats gradually decrease while the game is active, creating the care loop

**Independent Test**: Leave the game idle and observe stats decreasing; creature mood shifts from happy to neutral to sad to distressed over time

### Implementation for User Story 3

- [x] T016 [US3] Implement useGameLoop hook in src/hooks/useGameLoop.ts — requestAnimationFrame loop; calls a decay callback with delta time; pauses automatically when tab hidden; cleanup on unmount
- [x] T017 [US3] Write tests for useGameLoop in tests/useGameLoop.test.ts — verify decay callback fires with correct delta, verify cleanup
- [x] T018 [US3] Integrate decay into Game component in src/components/Game.tsx — add decay action to useCreature reducer (accepts delta time); useGameLoop dispatches decay each frame; apply per-stat decay rates from data-model.md (hunger: -2/10s, happiness: -1.5/10s, energy: -1/10s)
- [x] T019 [US3] Add distressed state visual in src/components/Creature.tsx — distinct "needs help" appearance when any stat < 10; ensure it's kid-friendly (not scary)

**Checkpoint**: Full game loop is active. Stats decay, player must interact to keep creature happy. Game is engaging.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass

- [x] T020 [P] Verify quickstart.md checklist passes end-to-end against running app
- [x] T021 [P] Ensure all interactions produce visual feedback within 200ms (Constitution Principle I)
- [x] T022 [P] Kid-safety review: confirm no PII collection, no network requests, age-appropriate content (Constitution Principle III)
- [x] T023 Clean up Vite boilerplate files (remove default assets, sample CSS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T006 (types) from Setup
- **User Story 1 (Phase 3)**: Depends on Phase 2 (useCreature hook)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (Game component exists to add buttons to)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (useCreature hook); can run in parallel with US2 but integrates into Game
- **Polish (Phase 6)**: Depends on all stories complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational — no other story deps
- **User Story 2 (P1)**: After US1 (needs Game component to add buttons to)
- **User Story 3 (P2)**: After Foundational — can start in parallel with US2 (different files: hooks vs components) but T018 integrates into Game after US2

### Within Each User Story

- Components marked [P] can be built in parallel
- Integration tasks (wiring into Game) must come after component creation
- Tests before implementation where present (T008 before US phases, T017 before T018)

### Parallel Opportunities

- T003, T004, T005, T006 — all in parallel (Setup phase)
- T009, T010 — in parallel (US1 components)
- T013 parallel with T016, T017 (ActionButton vs useGameLoop — different files)
- T020, T021, T022 — all in parallel (Polish phase)

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (useCreature hook + tests)
3. Complete Phase 3: User Story 1 (see your creature)
4. Complete Phase 4: User Story 2 (interact with creature)
5. **STOP and VALIDATE**: Creature visible, all three actions work, stats respond
6. This is a playable demo — ship it

### Full Feature (Add Story 3)

7. Complete Phase 5: User Story 3 (time-based decay)
8. Complete Phase 6: Polish
9. **VALIDATE**: Full game loop — stats decay, player cares for creature, creature never dies
10. Run quickstart.md checklist end-to-end

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests included for game logic only (useCreature, useGameLoop) — no UI tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
