# Tasks: Parent Admin Panel

## Phase 1: Types + State

- [x] T001 Update Chore type to use status field, add parentPin to SaveData in src/models/types.ts
- [x] T002 Update useChores in src/hooks/useChores.ts — setPending, approve, reject actions
- [x] T003 Update useSaveData in src/hooks/useSaveData.ts — persist PIN, handle pending in daily reset
- [x] T004 Write tests in tests/parentMode.test.ts

---

## Phase 2: PIN Entry + Parent Panel UI

- [x] T005 Create PinEntry component in src/components/PinEntry.tsx + CSS
- [x] T006 Create ParentPanel component in src/components/ParentPanel.tsx + CSS

---

## Phase 3: Integration

- [x] T007 Update ChoreList in src/components/ChoreList.tsx — parentActive prop, pending visual
- [x] T008 Update ChorePanel in src/components/ChorePanel.tsx — pass parentActive
- [x] T009 Update Game in src/components/Game.tsx — parent mode flow, pending chore handling

---

## Phase 4: Polish

- [x] T010 Type-check and run all tests
