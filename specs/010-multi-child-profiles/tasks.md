# Tasks: Multi-Child Profiles

## Phase 1: Data Restructure

- [x] T001 Add ChildProfile + AppData types to src/models/types.ts
- [x] T002 Rewrite useSaveData in src/hooks/useSaveData.ts — multi-profile save/load, migration from old format
- [x] T003 Write migration + multi-profile tests in tests/multiProfile.test.ts

---

## Phase 2: Profile Picker UI

- [x] T004 Create ProfilePicker component in src/components/ProfilePicker.tsx + CSS

---

## Phase 3: App + Game Integration

- [x] T005 Rewrite App in src/App.tsx — profile picker, per-child game, creation flow for new profiles
- [x] T006 Update Game in src/components/Game.tsx — accept profile + appData, onSwitchProfile
- [x] T007 ParentPanel — kept as-is (works per-child since Game passes active child's data)

---

## Phase 4: Polish

- [x] T008 Type-check and run all tests
