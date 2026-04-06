# Tasks: Creature Customization

**Input**: Design documents from `/specs/002-creature-customization/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Foundational — Type System

- [x] T001 Add CreatureType union type and sprite/name mappings to src/models/types.ts
- [x] T002 Write tests for creature type sprite completeness in tests/creatureTypes.test.ts

---

## Phase 2: User Story 1 + 2 — Selection Screen with Type-Specific Visuals (P1)

- [x] T003 [P] [US1] Create SelectionScreen component in src/components/SelectionScreen.tsx with CSS
- [x] T004 [P] [US2] Update Creature component in src/components/Creature.tsx to accept creatureType and use type-specific sprites
- [x] T005 [US1] Update useCreature hook in src/hooks/useCreature.ts to accept initial name and creatureType
- [x] T006 [US1] Update Game component in src/components/Game.tsx to accept and pass creatureType
- [x] T007 [US1] Update App in src/App.tsx — add select→play state machine, render SelectionScreen or Game
- [x] T008 Update existing tests in tests/useCreature.test.ts for new hook signature

---

## Phase 3: User Story 3 — Name Your Creature (P2)

- [x] T009 [P] [US3] Create NamingStep component in src/components/NamingStep.tsx with CSS
- [x] T010 [US3] Update App in src/App.tsx — add naming step between selection and game (select→name→play)

---

## Phase 4: Polish

- [x] T011 Verify all 16 creature-type/mood combinations render correctly
- [x] T012 Kid-safety review: no PII stored/transmitted, age-appropriate visuals
