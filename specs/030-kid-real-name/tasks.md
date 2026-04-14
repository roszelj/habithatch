# Tasks: Child Real Name

**Input**: Design documents from `/specs/030-kid-real-name/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — manual playtesting per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add `childName` field to the data model and ensure backward compatibility

- [X] T001 Add `childName: string | null` to `ChildProfile` type in src/models/types.ts
- [X] T002 Add `childName: null` default to `createDefaultProfile` helper and any profile factory code in src/models/types.ts
- [X] T003 Add `childName: p.childName ?? null` to migration logic in src/firebase/migration.ts and src/hooks/useSaveData.ts to handle existing profiles missing the field

**Checkpoint**: Data model updated. Existing profiles load without errors (childName defaults to null).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No blocking prerequisites beyond Phase 1 — user stories can begin immediately after data model changes.

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Parent Sets Child's Real Name (Priority: P1) MVP

**Goal**: Parent enters the child's real name during profile creation. Real name is displayed on the profile picker and parent panel.

**Independent Test**: Create a new child profile → enter child name and creature name → verify child name appears on profile picker and parent panel. Verify child's game view shows only creature name.

### Implementation for User Story 1

- [X] T004 [US1] Add child name input field to NamingStep component in src/components/NamingStep.tsx — show "Child's Name" input above the creature name input. Validate 1–20 characters. Pass childName back via onConfirm callback (update signature to include childName).
- [X] T005 [US1] Style the child name input in src/components/NamingStep.module.css — match existing creature name input styling with appropriate label.
- [X] T006 [US1] Update `handleCreationComplete` in src/App.tsx to accept `childName` parameter from NamingStep and include it in the new ChildProfile object.
- [X] T007 [P] [US1] Update ProfilePicker to display childName in src/components/ProfilePicker.tsx — show `childName` as primary label on profile cards (with creatureName as secondary text below). Fall back to creatureName when childName is null.
- [X] T008 [P] [US1] Style the child name display on profile cards in src/components/ProfilePicker.module.css — primary label for childName, smaller secondary text for creatureName.
- [X] T009 [US1] Update ParentPanel to display childName in src/components/ParentPanel.tsx — child selector buttons and section headers show `childName` (falling back to creatureName). Show creatureName in parenthetical or secondary text.

**Checkpoint**: New profiles have childName. Profile picker and parent panel display childName. Child's game view is unchanged. Existing profiles show creatureName as fallback.

---

## Phase 4: User Story 2 — Parent Edits Child's Real Name (Priority: P2)

**Goal**: Parent can update a child's real name from the parent panel.

**Independent Test**: Enter parent mode → find edit option for a child → change the real name → verify updated name appears on profile picker and parent panel.

### Implementation for User Story 2

- [X] T010 [US2] Add "edit child name" UI to ParentPanel in src/components/ParentPanel.tsx — add an edit button or inline-editable name field in the child selector or a settings area. Validate 1–20 characters. Save via onUpdateAppData with the updated profile.
- [X] T011 [US2] Style the edit child name controls in src/components/ParentPanel.module.css — edit button, inline input, save/cancel if needed.

**Checkpoint**: Parent can edit any child's real name from the parent panel. Changes persist and appear immediately on the profile picker.

---

## Phase 5: User Story 3 — Backward Compatibility for Existing Profiles (Priority: P3)

**Goal**: Existing profiles without childName continue to work seamlessly.

**Independent Test**: Load app with pre-existing profiles (no childName set) → verify creature name is shown everywhere with no errors. Verify parent can optionally add a childName.

### Implementation for User Story 3

- [X] T012 [US3] Verify fallback display logic across all parent-facing components — review src/components/ProfilePicker.tsx and src/components/ParentPanel.tsx to ensure `childName ?? creatureName` fallback is applied consistently everywhere a name is shown.
- [X] T013 [US3] Add subtle "Add name" prompt for profiles missing childName in src/components/ParentPanel.tsx — when a profile has no childName, show a small prompt or placeholder (e.g., "Add child's name") in the parent panel that opens the edit flow from US2.

**Checkpoint**: Existing profiles display creature name seamlessly. Parent sees option to add a real name for profiles that don't have one.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all scenarios

- [X] T014 Run all quickstart.md scenarios end-to-end (new profile, existing profile, edit name, child renames creature, child view unchanged)
- [X] T015 Verify childName persists correctly in cloud mode (Firestore) and local mode (localStorage)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **User Story 1 (Phase 3)**: Depends on Phase 1 (data model must be updated first)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (edit builds on the display logic from US1)
- **User Story 3 (Phase 5)**: Can run in parallel with US2 after US1 is complete
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 1 only — core feature
- **User Story 2 (P2)**: Depends on US1 (editing requires the display infrastructure from US1)
- **User Story 3 (P3)**: Depends on US1 for fallback logic — can proceed in parallel with US2

### Within Each User Story

- Model/type changes before UI components
- NamingStep changes before App.tsx wiring
- ProfilePicker and ParentPanel display can be done in parallel (separate files)

### Parallel Opportunities

- T007 and T008 (ProfilePicker) can run in parallel with T009 (ParentPanel) within US1
- US2 and US3 can run in parallel after US1 is complete

---

## Parallel Example: User Story 1

```bash
# After T004-T006 complete (NamingStep + App.tsx wiring):
# Launch display tasks in parallel:
Task T007: "Update ProfilePicker to display childName in src/components/ProfilePicker.tsx"
Task T009: "Update ParentPanel to display childName in src/components/ParentPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Add childName to data model (T001–T003)
2. Complete Phase 3: User Story 1 — creation + display (T004–T009)
3. **STOP and VALIDATE**: Test with new and existing profiles
4. Deploy if ready — parents can already identify children

### Incremental Delivery

1. Phase 1 → Data model ready
2. User Story 1 → Parents can set and see child names (MVP!)
3. User Story 2 → Parents can edit names
4. User Story 3 → Polish backward compatibility + prompts
5. Polish → Full validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- childName is NEVER shown in the child's game view — only in parent-facing contexts
- Fallback logic: `childName ?? creatureName` must be applied consistently
- Commit after each task or logical group
