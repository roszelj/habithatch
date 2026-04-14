# Tasks: Food Feeding Menu

**Input**: Design documents from `/specs/034-food-feeding-menu/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in spec — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new files and shared data types needed across all user stories

- [x] T001 [P] Create food items data with emojis and speech messages in src/models/foods.ts
- [x] T002 [P] Add FoodItem type, FEED_COIN_COST (2), and FEED_HEALTH_RESTORE (10) constants to src/models/types.ts
- [x] T003 Add 'feed' action variant to CreatureAction union type in src/models/types.ts (depends on T002)

**Checkpoint**: Food data model and types ready — component work can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add feed handling to the creature reducer — MUST be complete before any UI work

**Warning**: No user story work can begin until this phase is complete

- [x] T004 Handle 'feed' action in creatureReducer to restore FEED_HEALTH_RESTORE HP in src/hooks/useCreature.ts

**Checkpoint**: Foundation ready — creature can process feed actions

---

## Phase 3: User Story 1 - Feed Pet with Food Selection (Priority: P1) MVP

**Goal**: Replace 3 time-of-day feeding buttons with single Feed button + food selection popup

**Independent Test**: Tap Feed button, select a food, verify pet reacts, health increases, and coins are deducted by 2

### Implementation for User Story 1

- [x] T005 [P] [US1] Create FoodMenu popup component with food grid layout in src/components/FoodMenu.tsx
- [x] T006 [P] [US1] Create FoodMenu styles (overlay, grid, food cards) in src/components/FoodMenu.module.css
- [x] T007 [US1] Replace TIME_ACTIONS action button row with single Feed button in src/components/Game.tsx (depends on T005, T006)
- [x] T008 [US1] Add showFoodMenu state, feed handler (deduct coins, dispatch feed, show speech bubble), and disabled logic (coins < 2) in src/components/Game.tsx (depends on T007)

**Checkpoint**: Core feeding via food menu works end-to-end. Child can tap Feed, pick a food, see pet react, health goes up, coins go down.

---

## Phase 4: User Story 2 - Dismiss Food Popup Without Feeding (Priority: P2)

**Goal**: Allow dismissing the food popup without spending coins

**Independent Test**: Open popup, tap outside or close button, verify coins unchanged

### Implementation for User Story 2

- [x] T009 [US2] Add backdrop click and close button dismiss handlers to FoodMenu component in src/components/FoodMenu.tsx
- [x] T010 [US2] Add close button styling and backdrop overlay click area in src/components/FoodMenu.module.css

**Checkpoint**: Popup can be dismissed safely with no side effects

---

## Phase 5: User Story 3 - Food-Specific Pet Reactions (Priority: P3)

**Goal**: Show food-relevant speech bubble messages when feeding

**Independent Test**: Feed different foods, verify speech bubble shows messages specific to each food item

### Implementation for User Story 3

- [x] T011 [US3] Wire food-specific speech messages from foods.ts into the feed handler in src/components/Game.tsx (select random message from chosen food's messages array)

**Checkpoint**: Each food item triggers a unique, fun speech bubble reaction

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and cleanup

- [x] T012 Prevent double-feeding from rapid taps (disable food items after selection until popup closes) in src/components/FoodMenu.tsx
- [x] T013 Verify Feed button visually updates disabled state when coins drop below 2 after feeding in src/components/Game.tsx
- [x] T014 Run quickstart.md validation (all 6 test scenarios from quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T002, T003 from Setup
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
  - US1 depends on Phase 2
  - US2 depends on US1 (FoodMenu component must exist)
  - US3 depends on US1 (feed handler must exist)
- **Polish (Phase 6)**: Depends on US1-US3 being complete

### Within Each User Story

- Models/data before components
- Components before Game.tsx wiring
- Core implementation before integration

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T005 and T006 can run in parallel (component + styles)
- US2 and US3 can start in parallel once US1 is complete (different files/concerns)

---

## Parallel Example: User Story 1

```bash
# Launch component + styles in parallel:
Task: "Create FoodMenu popup component in src/components/FoodMenu.tsx"
Task: "Create FoodMenu styles in src/components/FoodMenu.module.css"

# Then sequentially wire into Game.tsx:
Task: "Replace TIME_ACTIONS buttons with Feed button in src/components/Game.tsx"
Task: "Add feed handler and state management in src/components/Game.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: User Story 1 (T005-T008)
4. **STOP and VALIDATE**: Feed button works, popup opens, food selection deducts coins and restores health
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Data and reducer ready
2. Add User Story 1 → Core feeding works (MVP!)
3. Add User Story 2 → Popup dismissible without cost
4. Add User Story 3 → Food-specific speech bubbles
5. Polish → Edge cases and validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Total tasks: 14
- US1: 4 tasks (core), US2: 2 tasks (dismiss), US3: 1 task (reactions)
- Setup: 3, Foundational: 1, Polish: 3
- Commit after each phase checkpoint
