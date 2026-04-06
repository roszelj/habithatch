# Tasks: Time-Based Actions & Point Earning

## Phase 1: Core Type & State Changes

- [x] T001 Rewrite types in src/models/types.ts — replace 3 stats with health+points, add TimeAction type, Chore interface
- [x] T002 Rewrite useCreature hook in src/hooks/useCreature.ts — single health, points, time actions (morning/afternoon/evening), decay
- [x] T003 Update tests in tests/useCreature.test.ts for new health/points state machine

---

## Phase 2: US1 — Time-of-Day Actions + Health Bar

- [x] T004 [US1] Update ActionButton in src/components/ActionButton.tsx — add cost prop, disabled styling
- [x] T005 [US1] Rewrite Game component in src/components/Game.tsx — single health bar, point display, Morning/Afternoon/Evening buttons with costs

---

## Phase 3: US2 — Chore Checklist

- [x] T006 [P] [US2] Create useChores hook in src/hooks/useChores.ts — add/remove/check/reset logic
- [x] T007 [P] [US2] Write tests in tests/useChores.test.ts
- [x] T008 [US2] Create ChoreList component in src/components/ChoreList.tsx + CSS
- [x] T009 [US2] Integrate chore panel toggle into Game in src/components/Game.tsx

---

## Phase 4: Polish

- [x] T010 Type-check and run all tests
- [x] T011 Kid-safety review: chore text local only, no PII, age-appropriate
