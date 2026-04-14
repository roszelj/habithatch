# Tasks: Fix Horizontal Scroll on iPhone 15 Pro

**Input**: Design documents from `/specs/016-fix-viewport-scroll/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: No automated tests — manual testing only (DevTools device emulation).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

_(No setup needed — CSS-only fix)_

---

## Phase 2: Implementation

- [x] T001 [P] Fix iOS Safari overflow: add `overflow-x: hidden` to `html` in `src/index.css`
- [x] T002 [P] Cap `SelectionScreen` max-width: 500px → 360px in `src/components/SelectionScreen.module.css`
- [x] T003 [P] Cap `AccessoryPicker` max-width: 450px → 360px in `src/components/AccessoryPicker.module.css`
- [x] T004 [P] Cap `OutfitPicker` max-width: 450px → 360px in `src/components/OutfitPicker.module.css`
- [x] T005 [P] Cap `ProfilePicker` max-width: 450px → 360px in `src/components/ProfilePicker.module.css`
- [x] T006 [P] Cap `Game` max-width: 420px → 360px in `src/components/Game.module.css`
- [x] T007 [P] Cap `NamingStep` max-width: 400px → 360px in `src/components/NamingStep.module.css`

---

## Phase 3: Manual Testing

- [ ] T008 Manual test: Open app in Chrome DevTools at iPhone 15 Pro preset (393×852px), verify no horizontal scroll on any screen
- [ ] T009 Manual test: Verify at iPhone SE preset (375px) — no regression
