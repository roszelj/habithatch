# Tasks: Categorized Chores + Persistence (005+006)

## Phase 1: Per-Category Types & State

- [x] T001 Update types in src/models/types.ts — CategoryPoints, CategoryChores, SaveData, per-category CreatureAction
- [x] T002 Rewrite useCreature in src/hooks/useCreature.ts — per-category points
- [x] T003 Rewrite useChores in src/hooks/useChores.ts — per-category chore lists
- [x] T004 Update tests in tests/useCreature.test.ts

---

## Phase 2: Persistence + Daily Reset

- [x] T005 Create useSaveData hook in src/hooks/useSaveData.ts — localStorage save/load, daily reset detection
- [x] T006 Write tests in tests/useSaveData.test.ts

---

## Phase 3: UI — Categorized Chore Panel

- [x] T007 Create ChorePanel component in src/components/ChorePanel.tsx + CSS — 3 sections with ChoreList per category
- [x] T008 Update Game in src/components/Game.tsx — per-category points display, ChorePanel, earn per category
- [x] T009 Update App in src/App.tsx — load saved data, skip selection, reset game option

---

## Phase 4: Polish

- [x] T010 Type-check and run all tests
- [x] T011 Kid-safety review
