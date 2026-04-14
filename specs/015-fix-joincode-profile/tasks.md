# Tasks: Fix Join Code Profile Creation

**Input**: Design documents from `/specs/015-fix-joincode-profile/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: No automated tests — manual testing only.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

_(No setup needed — 2-file bug fix)_

---

## Phase 2: Implementation

- [x] T001 [P] Add `signInAnonymous()` function to `src/firebase/auth.ts`
- [x] T002 Call `signInAnonymous()` in `handleJoinFamily` before setting familyId in `src/App.tsx`

---

## Phase 3: Manual Testing

- [ ] T003 Manual test: Parent signs up, child joins via code, child profile appears on parent device
- [ ] T004 Manual test: Child completes chore after joining, verify sync to parent device
- [ ] T005 Manual test: Child closes and reopens app, verify profile loads from cloud
